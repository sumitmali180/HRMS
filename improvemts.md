# HRMS System Architecture & Implementation Improvements

> **Scope Note:** This document focuses exclusively on **architectural, performance, security, and code quality improvements** to the *existing* system logic and implementations. It deliberately avoids adding new product features or business scopes.

---

## 1. Database Layer: Performance, Indexing & Transaction Integrity

### 1.1 Nonclustered Indexes on Foreign Keys & High-Frequency Filters
* **Current State:** Only primary keys and a few unique constraints have indexes. Foreign key columns (`DepartmentId`, `BranchId`, `ManagerId`, `EmployeeId`, `CycleId`) lack nonclustered indexes.
* **Problem:** Every `JOIN` between `Employee`, `Attendance`, `LeaveApplication`, `Payroll`, and `AssetAllocation` results in full index scans rather than seeks, degrading performance as row counts scale.
* **Proposed Improvement:** Add targeted composite nonclustered indexes:
  ```sql
  -- Attendance lookup & reporting
  CREATE NONCLUSTERED INDEX IX_Attendance_Emp_Date 
  ON Attendance (EmployeeId, AttendanceDate) 
  INCLUDE (CheckIn, CheckOut, WorkingHours, Status);

  -- Employee directory & department filtering
  CREATE NONCLUSTERED INDEX IX_Employee_Dept_Branch 
  ON Employee (DepartmentId, BranchId, IsActive) 
  INCLUDE (FirstName, LastName, Email, DesignationId);

  -- Leave status tracking
  CREATE NONCLUSTERED INDEX IX_LeaveApp_Emp_Status 
  ON LeaveApplication (EmployeeId, Status, FromDate, ToDate);

  -- Payroll calculation & history
  CREATE NONCLUSTERED INDEX IX_Payroll_Year_Month 
  ON Payroll (PayrollYear, PayrollMonth, Status) 
  INCLUDE (EmployeeId, GrossSalary, NetSalary);

  -- Roster scheduling
  CREATE NONCLUSTERED INDEX IX_Roster_Date_Emp 
  ON EmployeeRoster (RosterDate, EmployeeId, ShiftId);
  ```

### 1.2 Atomic Transaction Boundaries & Rollback in Stored Procedures
* **Current State:** Stored procedures like `sp_Payroll_Operations` (`PROCESS_MONTHLY`) and `sp_FnFSettlement` execute multiple queries without explicit transaction blocks.
* **Problem:** If an error occurs halfway through generating payroll for 500 employees, partial records remain committed in the database, leading to inconsistent financial states.
* **Proposed Improvement:** Enforce standard `BEGIN TRY ... BEGIN TRANSACTION ... COMMIT ... END TRY ... BEGIN CATCH ... ROLLBACK` in all mutating stored procedures, automatically logging failures to `SPErrorlog`:
  ```sql
  BEGIN TRY
      BEGIN TRANSACTION;
      -- multi-table mutations here
      COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
      IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
      INSERT INTO SPErrorlog (ErrorLine, ErrorMessage, ErrorNumber, ErrorProcedure, ErrorSeverity, ErrorState, CreatedDate)
      VALUES (ERROR_LINE(), ERROR_MESSAGE(), ERROR_NUMBER(), ERROR_PROCEDURE(), ERROR_SEVERITY(), ERROR_STATE(), GETDATE());
      THROW;
  END CATCH
  ```

### 1.3 Server-Side Pagination in Lookup & Directory Queries
* **Current State:** Procedures like `sp_Employee_CRUD` (`GETALL`) return `SELECT *` for all records without pagination parameters.
* **Problem:** Transferring full result sets causes memory spikes on the .NET API server and stalls the frontend DOM when employee counts reach several thousands.
* **Proposed Improvement:** Implement `OFFSET ... FETCH NEXT` server-side pagination with optional search/filter parameters:
  ```sql
  SELECT E.*, COUNT(*) OVER() AS TotalCount
  FROM Employee E
  WHERE (@Search IS NULL OR E.FirstName LIKE '%' + @Search + '%' OR E.Email LIKE '%' + @Search + '%')
  ORDER BY E.EmployeeId DESC
  OFFSET (@PageNumber - 1) * @PageSize ROWS
  FETCH NEXT @PageSize ROWS ONLY;
  ```

---

## 2. Backend Architecture: Data Access & Code Quality

### 2.1 Replace Brittle ADO.NET Boilerplate with Dapper Micro-ORM
* **Current State:** Repositories manually create `SqlCommand`, call `reader["Column"]`, convert types (`Convert.ToInt32`, `Convert.ToDecimal`), and implement reflection helper `HasColumn()`.
* **Problem:** Fragile column lookups, typo-prone string mapping, verbose boilerplate (~250 lines per repository), and high maintenance overhead.
* **Proposed Improvement:** Adopt **Dapper** across `HRMS.Infrastructure`:
  - Strong compile-time DTO mapping.
  - Automatic parameter binding without repetitive `cmd.Parameters.AddWithValue()`.
  - Up to 40% reduction in repository codebase size with zero ORM bloat.
  ```csharp
  public async Task<EmployeeDTO?> GetEmployeeByIdAsync(int id, CancellationToken ct = default)
  {
      using var con = _connectionFactory.CreateConnection();
      return await con.QuerySingleOrDefaultAsync<EmployeeDTO>(
          "sp_Employee_CRUD",
          new { Action = "GETBYID", EmployeeId = id },
          commandType: CommandType.StoredProcedure
      );
  }
  ```

### 2.2 Eliminate `AddWithValue` Parameter Binding Anti-Pattern
* **Current State:** All repositories use `cmd.Parameters.AddWithValue("@Param", value)`.
* **Problem:** SQL Server must infer data types at runtime. For string parameters, it often defaults to `NVARCHAR(4000)`, causing index scan degradations (implicit conversions) and plan cache bloat.
* **Proposed Improvement:** Use explicit SQL types or typed Dapper dynamic parameters:
  ```csharp
  cmd.Parameters.Add("@Email", SqlDbType.VarChar, 100).Value = dto.Email;
  ```

### 2.3 Centralize Connection Management via `IDbConnectionFactory`
* **Current State:** Each repository constructor takes `IConfiguration` and directly instantiates `new SqlConnection(_connectionString)`.
* **Problem:** Violates inversion of control, duplicates connection string parsing across 15+ repositories, and complicates unit testing with mocks.
* **Proposed Improvement:** Inject an `ISqlConnectionFactory` interface:
  ```csharp
  public interface ISqlConnectionFactory
  {
      IDbConnection CreateConnection();
  }
  ```

### 2.4 Propagate `CancellationToken` End-to-End
* **Current State:** Controller and repository async methods do not accept or pass `CancellationToken`.
* **Problem:** When an end user cancels a request, closes their browser tab, or navigates away, the server and database keep executing the long-running query needlessly.
* **Proposed Improvement:** Pass `CancellationToken ct` from `[HttpGet] async Task<IActionResult> Action(CancellationToken ct)` down into `ExecuteReaderAsync(ct)`.

---

## 3. Security, Authentication & Authorization Hardening

### 3.1 Granular Role-Based Endpoint Authorization
* **Current State:** Controllers use class-level `[Authorize]`. Any authenticated user with a valid JWT (including standard employees) can invoke administrative endpoints like `POST /api/Employee/CreateEmployee` or `DELETE /api/Employee/{id}` if they craft the HTTP request.
* **Problem:** Privilege escalation vulnerability.
* **Proposed Improvement:** Decorate administrative endpoints with specific role policies:
  ```csharp
  [Authorize(Roles = "Super Admin, HR Admin")]
  [HttpPost("CreateEmployee")]
  public async Task<IActionResult> CreateEmployee(...)
  ```

### 3.2 Implement Refresh Token Rotation (Sliding Expiration)
* **Current State:** JWT tokens have a static lifetime without refresh tokens. If a token expires, the user is abruptly signed out. If compromised, it cannot be revoked before expiry.
* **Problem:** Poor UX and security risk.
* **Proposed Improvement:**
  - Store a hashed `RefreshToken` with `ExpiryDate` and `RevokedDate` in a dedicated `UserToken` table.
  - Implement `/api/auth/refresh-token` endpoint with rotation (issuing a new token pair and revoking the old one on each refresh).
  - Check `Employee.IsActive == 1` during token verification to immediately lock out deactivated employees.

### 3.3 Rate Limiting on Authentication Endpoints
* **Current State:** `/api/Auth/Login` has no request throttling.
* **Problem:** Vulnerable to brute-force credential stuffing.
* **Proposed Improvement:** Enable ASP.NET Core built-in fixed-window rate limiter:
  ```csharp
  builder.Services.AddRateLimiter(options => {
      options.AddFixedWindowLimiter("LoginPolicy", opt => {
          opt.PermitLimit = 5;
          opt.Window = TimeSpan.FromMinutes(1);
          opt.QueueLimit = 0;
      });
  });
  ```

### 3.4 Password Complexity & Old Password Verification
* **Current State:** Password updates do not check current password validity or enforce minimum complexity rules.
* **Proposed Improvement:** Implement a dedicated `ChangePasswordDTO` requiring `CurrentPassword`, `NewPassword`, and `ConfirmPassword`, validated against BCrypt and standard complexity constraints (8+ characters, mixed case, numbers, special characters).

---

## 4. Input Validation, Error Handling & API Contract Standardization

### 4.1 Introduce FluentValidation Pipeline
* **Current State:** Validation is handled informally via null checks inside repositories or stored procedures.
* **Problem:** Invalid data (negative salaries, end dates prior to start dates, invalid email syntax) only gets caught inside SQL errors.
* **Proposed Improvement:** Integrate `FluentValidation.AspNetCore` with automated pipeline filters:
  ```csharp
  public class CreateEmployeeDTOValidator : AbstractValidator<CreateEmployeeDTO>
  {
      public CreateEmployeeDTOValidator()
      {
          RuleFor(x => x.Email).NotEmpty().EmailAddress();
          RuleFor(x => x.FirstName).NotEmpty().MaximumLength(50);
          RuleFor(x => x.JoiningDate).LessThanOrEqualTo(DateTime.Today);
          RuleFor(x => x.DOB).LessThan(DateTime.Today.AddYears(-18)).WithMessage("Employee must be at least 18 years old.");
      }
  }
  ```

### 4.2 Standardize Unified API Response Envelope (`ApiResponse<T>`)
* **Current State:** Inconsistent controller responses:
  - Some return `{ success = true, data = ... }`
  - Some return `{ success = true, message = ... }`
  - Some return raw integers or DTOs directly
* **Problem:** Frontend client code must handle 3 different response shapes across modules.
* **Proposed Improvement:** Unify all responses using a generic wrapper:
  ```csharp
  public class ApiResponse<T>
  {
      public bool Success { get; set; }
      public string? Message { get; set; }
      public T? Data { get; set; }
      public List<string>? Errors { get; set; }
      public DateTime Timestamp { get; set; } = DateTime.UtcNow;
  }
  ```

### 4.3 Structured ProblemDetails in Global Exception Middleware
* **Current State:** `ExceptionMiddleware` returns custom anonymous JSON objects.
* **Proposed Improvement:** Adhere to **RFC 7807 (ProblemDetails)** standard, returning standardized error types, trace identifiers, and status codes for enterprise API compliance.

---

## 5. Frontend Architecture: State, Caching & Network Resilience

### 5.1 Query Caching & Server State Management (React Query / TanStack Query)
* **Current State:** Every page component independently invokes `useEffect` and maintains duplicated `loading`, `error`, and `data` states. Navigating between tabs triggers full duplicate network requests for the same lookup lists (branches, departments, designations).
* **Problem:** Unnecessary backend load, slower page transitions, and excessive boilerplate across 25+ view components.
* **Proposed Improvement:**
  - Wrap server requests in **TanStack React Query** with a default `staleTime` of 5 minutes for reference masters (Companies, Branches, Departments).
  - Gain automated query deduplication, background re-fetching, and cache invalidation on mutations (`useMutation`).

### 5.2 Graceful Global React Error Boundary
* **Current State:** Uncaught runtime exceptions (e.g., trying to read `.length` of an unexpected `null` field in a table row) crash the entire React root, leaving the user with a blank white/dark screen.
* **Proposed Improvement:** Add a top-level `<ErrorBoundary>` component inside `App.jsx` that catches render-time errors, presents a polite recovery screen ("Something went wrong with this view"), and offers a "Reload Module" button while keeping navigation accessible.

### 5.3 Resilient Axios Interceptors (No Full Page Reloads)
* **Current State:** On `401 Unauthorized`, `api.js` executes `window.location.href = "/login"`.
* **Problem:** Wipes out all client memory, cancels ongoing actions, and breaks single-page application continuity.
* **Proposed Improvement:**
  - Dispatch a custom auth event or use React Router's programmatic `navigate("/login")`.
  - Queue failed requests during token refresh and retry them transparently without user disruption.

### 5.4 Form State & Validation Consolidation (`react-hook-form` + `zod`)
* **Current State:** Large forms (e.g. Employee creation with 30 fields) use monolithic `useState` objects. Every keystroke triggers a full-component re-render.
* **Proposed Improvement:** Adopt uncontrolled forms with `react-hook-form` and schema validation using `zod`. Eliminates re-render lag and centralizes client-side validation rules.

---

## 6. Observability, Logging & Testing

### 6.1 Structured Logging with Serilog
* **Current State:** Basic console logging via default Microsoft `ILogger`.
* **Problem:** No correlation ID, no structured JSON fields, and no log persistence for production debugging.
* **Proposed Improvement:**
  - Configure **Serilog** with file/Seq/Application Insights sinks.
  - Automatically attach `CorrelationId`, `UserId`, `HttpMethod`, and `ElapsedMilliseconds` to all incoming HTTP requests via middleware.

### 6.2 Health Check Endpoints
* **Current State:** No health check endpoint exists to verify whether the SQL Server database is reachable.
* **Proposed Improvement:** Add standard ASP.NET Core Health Checks:
  ```csharp
  builder.Services.AddHealthChecks()
      .AddSqlServer(builder.Configuration.GetConnectionString("DBCS")!);
  app.MapHealthChecks("/health");
  ```

### 6.3 Automated Unit & Integration Testing Baseline
* **Current State:** No test projects in the solution.
* **Proposed Improvement:**
  - Add `HRMS.Tests.Unit` using `xUnit`, `Moq`, and `FluentAssertions` to test business logic in services (Payroll calculations, Leave remaining calculations, Tax deductions).
  - Add `HRMS.Tests.Integration` using `WebApplicationFactory` and `Testcontainers` (or an in-memory SQL stub) to verify critical API workflows end-to-end.

---

## 7. Prioritized Implementation Roadmap

| Priority | Category | Task | Impact | Complexity | Status |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **P1** | **Security** | Add role checks (`[Authorize(Roles = "...")]`) to administrative endpoints | High | Low | **Completed** |
| **P1** | **Database** | Add composite nonclustered indexes on foreign keys & high-volume filters | High | Low | **Completed** (12 nonclustered indexes) |
| **P1** | **Frontend** | Add React `<ErrorBoundary>` component to prevent blank screen crashes | High | Low | **Completed** (`App.jsx` + `MainLayout.jsx`) |
| **P2** | **Resilience** | Soft 401 Axios interceptor with custom event to prevent hard page wipes | High | Low | **Completed** (`api.js` + `AuthContext.jsx`) |
| **P2** | **Database** | Wrap payroll operations in explicit atomic transactions with rollback | High | Medium | **Completed** (`sp_Payroll_Operations`) |
| **P2** | **Backend** | Safe reader column access with `HasColumn` to prevent index exceptions | High | Low | **Completed** (`ExpenseRepository.cs`) |
| **P2** | **Validation** | Integrate `FluentValidation` pipeline for DTO models | High | Medium | *Next Iteration* |
| **P3** | **Architecture** | Migrate repositories from manual ADO reader loops to Dapper | Medium | Medium | *Next Iteration* |
| **P3** | **Frontend** | Implement TanStack Query caching for lookup endpoints (Departments, Branches) | Medium | Medium | *Next Iteration* |
| **P4** | **Observability**| Add ASP.NET Core `/health` database and server probe | Medium | Low | **Completed** (`/health` live) |
| **P4** | **Security** | Implement Refresh Token rotation & login rate limiter | High | Medium | *Next Iteration* |
