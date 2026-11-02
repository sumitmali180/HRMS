-- ============================================================================
-- HRMS Complete Database Schema, Stored Procedures, and Seed Data
-- Database: HRMS
-- Target: SQL Server 2019 / 2022 / Azure SQL
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HRMS')
BEGIN
    CREATE DATABASE [HRMS];
END
GO

USE [HRMS];
GO

-- ============================================================================
-- 1. CORE MASTER TABLES
-- ============================================================================

-- Role Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Role]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Role](
        [RoleId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [RoleName] [nvarchar](50) NOT NULL UNIQUE,
        [Description] [nvarchar](250) NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE())
    );
END
GO

-- Company Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Company]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Company](
        [CompanyId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CompanyName] [nvarchar](150) NOT NULL UNIQUE,
        [GSTNo] [nvarchar](20) NULL UNIQUE,
        [Address] [nvarchar](300) NULL,
        [Phone] [varchar](20) NULL,
        [Email] [nvarchar](100) NULL UNIQUE,
        [Logo] [nvarchar](300) NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        [Website] [nvarchar](200) NULL,
        [Currency] [nvarchar](20) NULL DEFAULT('USD'),
        [TimeZone] [nvarchar](100) NULL DEFAULT('UTC')
    );
END
GO

-- Branch Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Branch]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Branch](
        [BranchId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CompanyId] [int] NOT NULL,
        [BranchName] [nvarchar](150) NOT NULL,
        [BranchCode] [varchar](20) NULL,
        [Address] [nvarchar](300) NULL,
        [Phone] [varchar](20) NULL,
        [Email] [nvarchar](100) NULL,
        [ManagerId] [int] NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_Branch_Company] FOREIGN KEY([CompanyId]) REFERENCES [dbo].[Company] ([CompanyId])
    );
END
GO

-- Department Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Department]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Department](
        [DepartmentId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [BranchId] [int] NOT NULL,
        [DepartmentName] [nvarchar](150) NOT NULL,
        [Description] [nvarchar](300) NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_Department_Branch] FOREIGN KEY([BranchId]) REFERENCES [dbo].[Branch] ([BranchId])
    );
END
GO

-- Designation Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Designation]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Designation](
        [DesignationId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [DesignationName] [nvarchar](150) NOT NULL,
        [Grade] [nvarchar](50) NULL,
        [BasicSalary] [decimal](18, 2) NULL DEFAULT(0),
        [Description] [nvarchar](300) NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE())
    );
END
GO

-- Employee Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Employee]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Employee](
        [EmployeeId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeCode] [varchar](20) NOT NULL UNIQUE,
        [FirstName] [nvarchar](50) NOT NULL,
        [MiddleName] [nvarchar](50) NULL,
        [LastName] [nvarchar](50) NULL,
        [Gender] [varchar](10) NULL,
        [DOB] [date] NULL,
        [BloodGroup] [varchar](5) NULL,
        [Email] [nvarchar](100) NULL UNIQUE,
        [Phone] [varchar](20) NULL,
        [AlternatePhone] [varchar](20) NULL,
        [Address] [nvarchar](300) NULL,
        [City] [nvarchar](50) NULL,
        [State] [nvarchar](50) NULL,
        [Country] [nvarchar](50) NULL,
        [Pincode] [varchar](10) NULL,
        [DepartmentId] [int] NULL,
        [DesignationId] [int] NULL,
        [BranchId] [int] NULL,
        [ManagerId] [int] NULL,
        [JoiningDate] [date] NULL,
        [ConfirmationDate] [date] NULL,
        [PANNo] [varchar](20) NULL,
        [AadharNo] [varchar](20) NULL,
        [PassportNo] [varchar](20) NULL,
        [BankName] [nvarchar](100) NULL,
        [AccountNo] [varchar](50) NULL,
        [IFSC] [varchar](20) NULL,
        [ProfilePhoto] [nvarchar](500) NULL,
        [RoleId] [int] NULL,
        [PasswordHash] [nvarchar](max) NULL,
        [Status] [varchar](20) NULL DEFAULT('Active'),
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        [UpdatedDate] [datetime] NULL,
        [RefreshToken] [nvarchar](500) NULL,
        [RefreshTokenExpiry] [datetime] NULL,
        [LastLoginDate] [datetime] NULL,
        [FailedLoginCount] [int] NOT NULL DEFAULT(0),
        [IsLocked] [bit] NOT NULL DEFAULT(0),
        [EmergencyContactName] [nvarchar](100) NULL,
        [EmergencyContactNo] [varchar](20) NULL,
        [MaritalStatus] [varchar](20) NULL,
        [Nationality] [nvarchar](50) NULL,
        CONSTRAINT [FK_Employee_Branch] FOREIGN KEY([BranchId]) REFERENCES [dbo].[Branch] ([BranchId]),
        CONSTRAINT [FK_Employee_Department] FOREIGN KEY([DepartmentId]) REFERENCES [dbo].[Department] ([DepartmentId]),
        CONSTRAINT [FK_Employee_Designation] FOREIGN KEY([DesignationId]) REFERENCES [dbo].[Designation] ([DesignationId]),
        CONSTRAINT [FK_Employee_Manager] FOREIGN KEY([ManagerId]) REFERENCES [dbo].[Employee] ([EmployeeId]),
        CONSTRAINT [FK_Employee_Role] FOREIGN KEY([RoleId]) REFERENCES [dbo].[Role] ([RoleId])
    );
END
GO

-- ============================================================================
-- 2. ATTENDANCE & LEAVE MODULE TABLES
-- ============================================================================

-- Attendance Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Attendance]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Attendance](
        [AttendanceId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL,
        [AttendanceDate] [date] NOT NULL,
        [CheckIn] [time](7) NULL,
        [CheckOut] [time](7) NULL,
        [WorkingHours] [decimal](5, 2) NULL DEFAULT(0),
        [LateMinutes] [int] NULL DEFAULT(0),
        [Status] [varchar](20) NULL DEFAULT('Present'), -- Present, Absent, HalfDay, Late, Holiday, Leave
        [Remarks] [nvarchar](300) NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        [UpdatedDate] [datetime] NULL,
        CONSTRAINT [UQ_Attendance_Emp_Date] UNIQUE ([EmployeeId], [AttendanceDate]),
        CONSTRAINT [FK_Attendance_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId])
    );
END
GO

-- LeaveType Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[LeaveType]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[LeaveType](
        [LeaveTypeId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [LeaveName] [nvarchar](100) NOT NULL UNIQUE,
        [PaidLeave] [bit] NOT NULL DEFAULT(1),
        [MaxDays] [int] NOT NULL DEFAULT(12),
        [IsEncashable] [bit] NOT NULL DEFAULT(0),
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE())
    );
END
GO

-- LeaveAllocation Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[LeaveAllocation]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[LeaveAllocation](
        [AllocationId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL,
        [LeaveTypeId] [int] NOT NULL,
        [Year] [int] NOT NULL,
        [TotalDays] [decimal](5, 2) NOT NULL DEFAULT(0),
        [UsedDays] [decimal](5, 2) NOT NULL DEFAULT(0),
        [RemainingDays] [decimal](5, 2) NOT NULL DEFAULT(0),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [UQ_LeaveAllocation] UNIQUE ([EmployeeId], [LeaveTypeId], [Year]),
        CONSTRAINT [FK_LeaveAllocation_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId]),
        CONSTRAINT [FK_LeaveAllocation_LeaveType] FOREIGN KEY([LeaveTypeId]) REFERENCES [dbo].[LeaveType] ([LeaveTypeId])
    );
END
GO

-- LeaveApplication Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[LeaveApplication]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[LeaveApplication](
        [LeaveId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL,
        [LeaveTypeId] [int] NOT NULL,
        [FromDate] [date] NOT NULL,
        [ToDate] [date] NOT NULL,
        [TotalDays] [decimal](5, 2) NOT NULL DEFAULT(1),
        [IsHalfDay] [bit] NOT NULL DEFAULT(0),
        [Reason] [nvarchar](500) NULL,
        [ApprovedBy] [int] NULL,
        [Status] [varchar](20) NOT NULL DEFAULT('Pending'), -- Pending, Approved, Rejected, Cancelled
        [AppliedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        [ApprovedDate] [datetime] NULL,
        [RejectedReason] [nvarchar](500) NULL,
        CONSTRAINT [FK_LeaveApplication_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId]),
        CONSTRAINT [FK_LeaveApplication_LeaveType] FOREIGN KEY([LeaveTypeId]) REFERENCES [dbo].[LeaveType] ([LeaveTypeId]),
        CONSTRAINT [FK_LeaveApplication_Approver] FOREIGN KEY([ApprovedBy]) REFERENCES [dbo].[Employee] ([EmployeeId])
    );
END
GO

-- ============================================================================
-- 3. PAYROLL MODULE TABLES
-- ============================================================================

-- SalaryStructure Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SalaryStructure]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SalaryStructure](
        [SalaryId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL UNIQUE,
        [Basic] [decimal](18, 2) NOT NULL DEFAULT(0),
        [HRA] [decimal](18, 2) NOT NULL DEFAULT(0),
        [DA] [decimal](18, 2) NOT NULL DEFAULT(0),
        [TA] [decimal](18, 2) NOT NULL DEFAULT(0),
        [Medical] [decimal](18, 2) NOT NULL DEFAULT(0),
        [PF] [decimal](18, 2) NOT NULL DEFAULT(0),
        [ProfessionalTax] [decimal](18, 2) NOT NULL DEFAULT(0),
        [OtherAllowance] [decimal](18, 2) NOT NULL DEFAULT(0),
        [GrossSalary] [decimal](18, 2) NOT NULL DEFAULT(0),
        [NetSalary] [decimal](18, 2) NOT NULL DEFAULT(0),
        [EffectiveFrom] [date] NULL,
        [EffectiveTo] [date] NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1),
        CONSTRAINT [FK_SalaryStructure_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId])
    );
END
GO

-- Payroll Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Payroll]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Payroll](
        [PayrollId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL,
        [PayrollMonth] [tinyint] NOT NULL,
        [PayrollYear] [smallint] NOT NULL,
        [TotalWorkingDays] [int] NOT NULL DEFAULT(30),
        [PresentDays] [decimal](5, 2) NOT NULL DEFAULT(0),
        [AbsentDays] [decimal](5, 2) NOT NULL DEFAULT(0),
        [Leaves] [decimal](5, 2) NOT NULL DEFAULT(0),
        [GrossSalary] [decimal](18, 2) NOT NULL DEFAULT(0),
        [Deductions] [decimal](18, 2) NOT NULL DEFAULT(0),
        [NetSalary] [decimal](18, 2) NOT NULL DEFAULT(0),
        [GeneratedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        [Status] [varchar](20) NOT NULL DEFAULT('Processed'), -- Draft, Processed, Paid
        [PaymentDate] [datetime] NULL,
        [PayslipPath] [nvarchar](500) NULL,
        [GeneratedBy] [int] NULL,
        CONSTRAINT [UQ_Payroll_Emp_Month_Year] UNIQUE ([EmployeeId], [PayrollMonth], [PayrollYear]),
        CONSTRAINT [FK_Payroll_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId])
    );
END
GO

-- Holiday Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Holiday]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Holiday](
        [HolidayId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [BranchId] [int] NULL,
        [HolidayName] [nvarchar](150) NOT NULL,
        [HolidayDate] [date] NOT NULL,
        [IsRecurring] [bit] NOT NULL DEFAULT(0),
        [Year] [int] NOT NULL DEFAULT(YEAR(GETDATE())),
        CONSTRAINT [FK_Holiday_Branch] FOREIGN KEY([BranchId]) REFERENCES [dbo].[Branch] ([BranchId])
    );
END
GO

-- ============================================================================
-- 4. LOGGING & AUXILIARY TABLES
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SPErrorlog]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SPErrorlog](
        [ErrorId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [ErrorLine] [int] NULL,
        [ErrorMessage] [nvarchar](max) NULL,
        [ErrorNumber] [int] NULL,
        [ErrorProcedure] [nvarchar](128) NULL,
        [ErrorSeverity] [int] NULL,
        [ErrorState] [int] NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE())
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SPPerformanceLog]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SPPerformanceLog](
        [LogId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [ProcName] [nvarchar](128) NULL,
        [Action] [nvarchar](50) NULL,
        [Params] [nvarchar](max) NULL,
        [ExecutionTimeMS] [int] NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE())
    );
END
GO

-- ============================================================================
-- 4.X NONCLUSTERED COVERING INDEXES (PERFORMANCE OPTIMIZATION)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Attendance_Emp_Date' AND object_id = OBJECT_ID('Attendance'))
    CREATE NONCLUSTERED INDEX IX_Attendance_Emp_Date ON Attendance (EmployeeId, AttendanceDate) INCLUDE (CheckIn, CheckOut, WorkingHours, Status);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Employee_Dept_Branch' AND object_id = OBJECT_ID('Employee'))
    CREATE NONCLUSTERED INDEX IX_Employee_Dept_Branch ON Employee (DepartmentId, BranchId, IsActive) INCLUDE (FirstName, LastName, Email, DesignationId);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_LeaveApp_Emp_Status' AND object_id = OBJECT_ID('LeaveApplication'))
    CREATE NONCLUSTERED INDEX IX_LeaveApp_Emp_Status ON LeaveApplication (EmployeeId, Status, FromDate, ToDate);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Payroll_Year_Month' AND object_id = OBJECT_ID('Payroll'))
    CREATE NONCLUSTERED INDEX IX_Payroll_Year_Month ON Payroll (PayrollYear, PayrollMonth, Status) INCLUDE (EmployeeId, GrossSalary, NetSalary);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Roster_Date_Emp' AND object_id = OBJECT_ID('EmployeeRoster'))
    CREATE NONCLUSTERED INDEX IX_Roster_Date_Emp ON EmployeeRoster (RosterDate, EmployeeId, ShiftId);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Asset_Category_Status' AND object_id = OBJECT_ID('Asset'))
    CREATE NONCLUSTERED INDEX IX_Asset_Category_Status ON Asset (AssetCategoryId, Status);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_AssetAllocation_Emp_Asset' AND object_id = OBJECT_ID('AssetAllocation'))
    CREATE NONCLUSTERED INDEX IX_AssetAllocation_Emp_Asset ON AssetAllocation (EmployeeId, AssetId, Status);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Candidate_Job_Stage' AND object_id = OBJECT_ID('Candidate'))
    CREATE NONCLUSTERED INDEX IX_Candidate_Job_Stage ON Candidate (JobId, Stage);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_CandidateInterview_Cand_Round' AND object_id = OBJECT_ID('CandidateInterview'))
    CREATE NONCLUSTERED INDEX IX_CandidateInterview_Cand_Round ON CandidateInterview (CandidateId, RoundNumber);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_EmployeeGoal_Emp_Cycle' AND object_id = OBJECT_ID('EmployeeGoal'))
    CREATE NONCLUSTERED INDEX IX_EmployeeGoal_Emp_Cycle ON EmployeeGoal (EmployeeId, CycleId);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_AppraisalReview_Cycle_Emp' AND object_id = OBJECT_ID('AppraisalReview'))
    CREATE NONCLUSTERED INDEX IX_AppraisalReview_Cycle_Emp ON AppraisalReview (CycleId, EmployeeId);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ExpenseClaim_Emp_Status' AND object_id = OBJECT_ID('ExpenseClaim'))
    CREATE NONCLUSTERED INDEX IX_ExpenseClaim_Emp_Status ON ExpenseClaim (EmployeeId, Status, ClaimDate);
GO

-- ============================================================================
-- 5. STORED PROCEDURES
-- ============================================================================

-- 5.1 sp_EmployeeLogin
IF OBJECT_ID('dbo.sp_EmployeeLogin', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_EmployeeLogin];
GO
CREATE PROCEDURE [dbo].[sp_EmployeeLogin]
    @Email NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        e.EmployeeId,
        e.EmployeeCode,
        CONCAT(e.FirstName, ' ', ISNULL(e.MiddleName + ' ', ''), e.LastName) AS EmployeeName,
        e.Email,
        e.PasswordHash,
        e.RoleId,
        ISNULL(r.RoleName, 'Employee') AS RoleName,
        e.Status,
        e.ProfilePhoto,
        e.BranchId,
        e.DepartmentId,
        e.DesignationId
    FROM Employee e
    LEFT JOIN Role r ON e.RoleId = r.RoleId
    WHERE e.Email = @Email AND e.IsActive = 1;
END
GO

-- 5.2 sp_Dashboard_GetDashboard
IF OBJECT_ID('dbo.sp_Dashboard_GetDashboard', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_Dashboard_GetDashboard];
GO
CREATE PROCEDURE [dbo].[sp_Dashboard_GetDashboard]
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Today DATE = CAST(GETDATE() AS DATE);
    DECLARE @TotalEmployees INT = 0;
    DECLARE @ActiveEmployees INT = 0;
    DECLARE @InactiveEmployees INT = 0;
    DECLARE @TotalBranches INT = 0;
    DECLARE @TotalDepartments INT = 0;
    DECLARE @TodayPresent INT = 0;
    DECLARE @TodayOnLeave INT = 0;
    DECLARE @PendingLeaves INT = 0;
    DECLARE @TotalManagers INT = 0;
    DECLARE @TotalAdmins INT = 0;

    SELECT @TotalEmployees = COUNT(*) FROM Employee;
    SELECT @ActiveEmployees = COUNT(*) FROM Employee WHERE IsActive = 1 AND Status = 'Active';
    SELECT @InactiveEmployees = COUNT(*) FROM Employee WHERE IsActive = 0 OR Status = 'Inactive';
    SELECT @TotalBranches = COUNT(*) FROM Branch WHERE IsActive = 1;
    SELECT @TotalDepartments = COUNT(*) FROM Department WHERE IsActive = 1;

    SELECT @TodayPresent = COUNT(*) FROM Attendance 
    WHERE AttendanceDate = @Today AND Status IN ('Present', 'Late', 'HalfDay');

    SELECT @TodayOnLeave = COUNT(*) FROM LeaveApplication 
    WHERE @Today BETWEEN FromDate AND ToDate AND Status = 'Approved';

    SELECT @PendingLeaves = COUNT(*) FROM LeaveApplication WHERE Status = 'Pending';

    SELECT @TotalManagers = COUNT(DISTINCT ManagerId) FROM Employee WHERE ManagerId IS NOT NULL AND IsActive = 1;
    SELECT @TotalAdmins = COUNT(*) FROM Employee e 
    INNER JOIN Role r ON e.RoleId = r.RoleId 
    WHERE r.RoleName IN ('Super Admin', 'HR Admin', 'Admin') AND e.IsActive = 1;

    SELECT
        @TotalEmployees AS TotalEmployees,
        @ActiveEmployees AS ActiveEmployees,
        @InactiveEmployees AS InactiveEmployees,
        @TotalBranches AS TotalBranches,
        @TotalDepartments AS TotalDepartments,
        @TodayPresent AS TodayPresent,
        @TodayOnLeave AS TodayOnLeave,
        @PendingLeaves AS PendingLeaves,
        @TotalManagers AS TotalManagers,
        @TotalAdmins AS TotalAdmins;
END
GO

-- 5.3 sp_Company
IF OBJECT_ID('dbo.sp_Company', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_Company];
GO
CREATE PROCEDURE [dbo].[sp_Company]
(
    @Flag VARCHAR(20),
    @CompanyId INT = NULL,
    @CompanyName NVARCHAR(150) = NULL,
    @GSTNo NVARCHAR(20) = NULL,
    @Address NVARCHAR(300) = NULL,
    @Phone VARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @Logo NVARCHAR(300) = NULL,
    @Website NVARCHAR(200) = NULL,
    @Currency NVARCHAR(20) = NULL,
    @TimeZone NVARCHAR(100) = NULL,
    @IsActive BIT = 1
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Flag = 'INSERT'
    BEGIN
        INSERT INTO Company (CompanyName, GSTNo, Address, Phone, Email, Logo, Website, Currency, TimeZone, IsActive, CreatedDate)
        VALUES (@CompanyName, @GSTNo, @Address, @Phone, @Email, @Logo, @Website, ISNULL(@Currency, 'USD'), ISNULL(@TimeZone, 'UTC'), ISNULL(@IsActive, 1), GETDATE());

        SELECT CAST(SCOPE_IDENTITY() AS INT) AS CompanyId;
        RETURN;
    END

    IF @Flag = 'UPDATE'
    BEGIN
        UPDATE Company
        SET CompanyName = @CompanyName,
            GSTNo = @GSTNo,
            Address = @Address,
            Phone = @Phone,
            Email = @Email,
            Logo = ISNULL(@Logo, Logo),
            Website = @Website,
            Currency = @Currency,
            TimeZone = @TimeZone,
            IsActive = @IsActive
        WHERE CompanyId = @CompanyId;

        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END

    IF @Flag = 'DELETE'
    BEGIN
        UPDATE Company SET IsActive = 0 WHERE CompanyId = @CompanyId;
        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END

    IF @Flag = 'GETBYID'
    BEGIN
        SELECT CompanyId, CompanyName, GSTNo, Address, Phone, Email, Logo, Website, Currency, TimeZone, IsActive, CreatedDate
        FROM Company
        WHERE CompanyId = @CompanyId;
        RETURN;
    END

    IF @Flag = 'GETALL'
    BEGIN
        SELECT CompanyId, CompanyName, GSTNo, Address, Phone, Email, Logo, Website, Currency, TimeZone, IsActive, CreatedDate
        FROM Company
        ORDER BY CompanyId DESC;
        RETURN;
    END

    IF @Flag = 'GETACTIVE' OR @Flag = 'LOOKUP'
    BEGIN
        SELECT CompanyId, CompanyName
        FROM Company
        WHERE IsActive = 1
        ORDER BY CompanyName ASC;
        RETURN;
    END
END
GO

-- 5.4 SP_Branch
IF OBJECT_ID('dbo.SP_Branch', 'P') IS NOT NULL DROP PROCEDURE [dbo].[SP_Branch];
GO
CREATE PROCEDURE [dbo].[SP_Branch]
(
    @Action VARCHAR(20),
    @BranchId INT = NULL,
    @CompanyId INT = NULL,
    @BranchName NVARCHAR(150) = NULL,
    @BranchCode VARCHAR(20) = NULL,
    @Address NVARCHAR(300) = NULL,
    @Phone VARCHAR(20) = NULL,
    @Email NVARCHAR(100) = NULL,
    @ManagerId INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Action = 'GET_ALL'
    BEGIN
        SELECT
            b.BranchId,
            b.CompanyId,
            c.CompanyName,
            b.BranchName,
            b.BranchCode,
            b.Address,
            b.Phone,
            b.Email,
            b.ManagerId,
            CONCAT(m.FirstName, ' ', m.LastName) AS ManagerName,
            b.CreatedDate
        FROM Branch b
        LEFT JOIN Company c ON b.CompanyId = c.CompanyId
        LEFT JOIN Employee m ON b.ManagerId = m.EmployeeId
        ORDER BY b.BranchId DESC;
        RETURN;
    END

    IF @Action = 'GET_BY_ID'
    BEGIN
        SELECT
            b.BranchId,
            b.CompanyId,
            c.CompanyName,
            b.BranchName,
            b.BranchCode,
            b.Address,
            b.Phone,
            b.Email,
            b.ManagerId,
            CONCAT(m.FirstName, ' ', m.LastName) AS ManagerName,
            b.CreatedDate
        FROM Branch b
        LEFT JOIN Company c ON b.CompanyId = c.CompanyId
        LEFT JOIN Employee m ON b.ManagerId = m.EmployeeId
        WHERE b.BranchId = @BranchId;
        RETURN;
    END

    IF @Action = 'GET_BY_COMPANY'
    BEGIN
        SELECT b.BranchId, b.CompanyId, b.BranchName, b.BranchCode
        FROM Branch b
        WHERE (@CompanyId IS NULL OR b.CompanyId = @CompanyId) AND b.IsActive = 1
        ORDER BY b.BranchName ASC;
        RETURN;
    END

    IF @Action = 'INSERT'
    BEGIN
        INSERT INTO Branch (CompanyId, BranchName, BranchCode, Address, Phone, Email, ManagerId, IsActive, CreatedDate)
        VALUES (@CompanyId, @BranchName, @BranchCode, @Address, @Phone, @Email, @ManagerId, 1, GETDATE());

        SELECT CAST(SCOPE_IDENTITY() AS INT) AS BranchId;
        RETURN;
    END

    IF @Action = 'UPDATE'
    BEGIN
        UPDATE Branch
        SET CompanyId = @CompanyId,
            BranchName = @BranchName,
            BranchCode = @BranchCode,
            Address = @Address,
            Phone = @Phone,
            Email = @Email,
            ManagerId = @ManagerId
        WHERE BranchId = @BranchId;

        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END

    IF @Action = 'DELETE'
    BEGIN
        DELETE FROM Branch WHERE BranchId = @BranchId;
        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END
END;
GO

-- 5.5 SP_Department
IF OBJECT_ID('dbo.SP_Department', 'P') IS NOT NULL DROP PROCEDURE [dbo].[SP_Department];
GO
CREATE PROCEDURE [dbo].[SP_Department]
(
    @Action VARCHAR(20),
    @DepartmentId INT = NULL,
    @BranchId INT = NULL,
    @DepartmentName NVARCHAR(150) = NULL,
    @Description NVARCHAR(300) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Action = 'GET_ALL'
    BEGIN
        SELECT
            d.DepartmentId,
            d.BranchId,
            b.BranchName,
            d.DepartmentName,
            d.Description,
            d.CreatedDate
        FROM Department d
        LEFT JOIN Branch b ON d.BranchId = b.BranchId
        ORDER BY d.DepartmentId DESC;
        RETURN;
    END

    IF @Action = 'GET_BY_ID'
    BEGIN
        SELECT
            d.DepartmentId,
            d.BranchId,
            b.BranchName,
            d.DepartmentName,
            d.Description,
            d.CreatedDate
        FROM Department d
        LEFT JOIN Branch b ON d.BranchId = b.BranchId
        WHERE d.DepartmentId = @DepartmentId;
        RETURN;
    END

    IF @Action = 'GET_BY_BRANCH'
    BEGIN
        SELECT d.DepartmentId, d.BranchId, d.DepartmentName
        FROM Department d
        WHERE (@BranchId IS NULL OR d.BranchId = @BranchId) AND d.IsActive = 1
        ORDER BY d.DepartmentName ASC;
        RETURN;
    END

    IF @Action = 'INSERT'
    BEGIN
        INSERT INTO Department (BranchId, DepartmentName, Description, IsActive, CreatedDate)
        VALUES (@BranchId, @DepartmentName, @Description, 1, GETDATE());

        SELECT CAST(SCOPE_IDENTITY() AS INT) AS DepartmentId;
        RETURN;
    END

    IF @Action = 'UPDATE'
    BEGIN
        UPDATE Department
        SET BranchId = @BranchId,
            DepartmentName = @DepartmentName,
            Description = @Description
        WHERE DepartmentId = @DepartmentId;

        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END

    IF @Action = 'DELETE'
    BEGIN
        DELETE FROM Department WHERE DepartmentId = @DepartmentId;
        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END
END;
GO

-- 5.6 SP_Designation
IF OBJECT_ID('dbo.SP_Designation', 'P') IS NOT NULL DROP PROCEDURE [dbo].[SP_Designation];
GO
CREATE PROCEDURE [dbo].[SP_Designation]
(
    @Action VARCHAR(20),
    @DesignationId INT = NULL,
    @DesignationName NVARCHAR(150) = NULL,
    @Grade NVARCHAR(50) = NULL,
    @BasicSalary DECIMAL(18, 2) = NULL,
    @Description NVARCHAR(300) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Action = 'GET_ALL'
    BEGIN
        SELECT DesignationId, DesignationName, Grade, BasicSalary, Description, CreatedDate
        FROM Designation
        ORDER BY DesignationId DESC;
        RETURN;
    END

    IF @Action = 'GET_BY_ID'
    BEGIN
        SELECT DesignationId, DesignationName, Grade, BasicSalary, Description, CreatedDate
        FROM Designation
        WHERE DesignationId = @DesignationId;
        RETURN;
    END

    IF @Action = 'INSERT'
    BEGIN
        INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate)
        VALUES (@DesignationName, @Grade, ISNULL(@BasicSalary, 0), @Description, 1, GETDATE());

        SELECT CAST(SCOPE_IDENTITY() AS INT) AS DesignationId;
        RETURN;
    END

    IF @Action = 'UPDATE'
    BEGIN
        UPDATE Designation
        SET DesignationName = @DesignationName,
            Grade = @Grade,
            BasicSalary = @BasicSalary,
            Description = @Description
        WHERE DesignationId = @DesignationId;

        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END

    IF @Action = 'DELETE'
    BEGIN
        DELETE FROM Designation WHERE DesignationId = @DesignationId;
        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END
END;
GO

-- 5.7 sp_Employee_CRUD
IF OBJECT_ID('dbo.sp_Employee_CRUD', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_Employee_CRUD];
GO
CREATE PROCEDURE [dbo].[sp_Employee_CRUD]
(
    @Action NVARCHAR(20),
    @EmployeeId INT = NULL,
    @EmployeeCode NVARCHAR(20) = NULL,
    @FirstName NVARCHAR(100) = NULL,
    @MiddleName NVARCHAR(100) = NULL,
    @LastName NVARCHAR(100) = NULL,
    @Gender NVARCHAR(20) = NULL,
    @DOB DATE = NULL,
    @BloodGroup NVARCHAR(10) = NULL,
    @Email NVARCHAR(150) = NULL,
    @Phone NVARCHAR(20) = NULL,
    @AlternatePhone NVARCHAR(20) = NULL,
    @Address NVARCHAR(500) = NULL,
    @City NVARCHAR(100) = NULL,
    @State NVARCHAR(100) = NULL,
    @Country NVARCHAR(100) = NULL,
    @Pincode NVARCHAR(10) = NULL,
    @DepartmentId INT = NULL,
    @DesignationId INT = NULL,
    @BranchId INT = NULL,
    @ManagerId INT = NULL,
    @JoiningDate DATE = NULL,
    @ConfirmationDate DATE = NULL,
    @PANNo NVARCHAR(20) = NULL,
    @AadharNo NVARCHAR(20) = NULL,
    @PassportNo NVARCHAR(20) = NULL,
    @BankName NVARCHAR(100) = NULL,
    @AccountNo NVARCHAR(50) = NULL,
    @IFSC NVARCHAR(20) = NULL,
    @ProfilePhoto NVARCHAR(500) = NULL,
    @RoleId INT = NULL,
    @PasswordHash NVARCHAR(MAX) = NULL,
    @Status NVARCHAR(20) = 'Active',
    @IsActive BIT = 1
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Action = 'CREATE'
    BEGIN
        -- Default role to Employee (4) if not provided
        IF @RoleId IS NULL OR @RoleId <= 0
        BEGIN
            SELECT TOP 1 @RoleId = RoleId FROM Role WHERE RoleName = 'Employee';
            IF @RoleId IS NULL SET @RoleId = 4;
        END

        -- Default password hash to Password@123 if null
        IF @PasswordHash IS NULL OR LEN(@PasswordHash) = 0
        BEGIN
            SET @PasswordHash = '$2a$11$qR0qZ0XG9K3qV1w5y7eOceJ.yD0b6e9Z6xV7b3w5x2y1z0a.b3c4d';
        END

        INSERT INTO Employee
        (
            EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup,
            Email, Phone, AlternatePhone, Address, City, State, Country, Pincode,
            DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate,
            PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, ProfilePhoto,
            RoleId, PasswordHash, Status, IsActive, CreatedDate
        )
        VALUES
        (
            @EmployeeCode, @FirstName, @MiddleName, @LastName, @Gender, @DOB, @BloodGroup,
            @Email, @Phone, @AlternatePhone, @Address, @City, @State, @Country, @Pincode,
            @DepartmentId, @DesignationId, @BranchId, @ManagerId, @JoiningDate, @ConfirmationDate,
            @PANNo, @AadharNo, @PassportNo, @BankName, @AccountNo, @IFSC, @ProfilePhoto,
            @RoleId, @PasswordHash, ISNULL(@Status, 'Active'), ISNULL(@IsActive, 1), GETDATE()
        );

        SELECT CAST(SCOPE_IDENTITY() AS INT) AS EmployeeId;
        RETURN;
    END

    IF @Action = 'UPDATE'
    BEGIN
        UPDATE Employee
        SET
            EmployeeCode = ISNULL(@EmployeeCode, EmployeeCode),
            FirstName = @FirstName,
            MiddleName = @MiddleName,
            LastName = @LastName,
            Gender = @Gender,
            DOB = @DOB,
            BloodGroup = @BloodGroup,
            Email = @Email,
            Phone = @Phone,
            AlternatePhone = @AlternatePhone,
            Address = @Address,
            City = @City,
            State = @State,
            Country = @Country,
            Pincode = @Pincode,
            DepartmentId = @DepartmentId,
            DesignationId = @DesignationId,
            BranchId = @BranchId,
            ManagerId = @ManagerId,
            JoiningDate = @JoiningDate,
            ConfirmationDate = @ConfirmationDate,
            PANNo = @PANNo,
            AadharNo = @AadharNo,
            PassportNo = @PassportNo,
            BankName = @BankName,
            AccountNo = @AccountNo,
            IFSC = @IFSC,
            ProfilePhoto = ISNULL(@ProfilePhoto, ProfilePhoto),
            RoleId = ISNULL(@RoleId, RoleId),
            PasswordHash = ISNULL(@PasswordHash, PasswordHash),
            Status = ISNULL(@Status, Status),
            IsActive = ISNULL(@IsActive, IsActive),
            UpdatedDate = GETDATE()
        WHERE EmployeeId = @EmployeeId;

        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END

    IF @Action = 'DELETE'
    BEGIN
        UPDATE Employee
        SET IsActive = 0, Status = 'Inactive', UpdatedDate = GETDATE()
        WHERE EmployeeId = @EmployeeId;

        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END

    IF @Action = 'GETBYID'
    BEGIN
        SELECT
            E.*,
            D.DepartmentName,
            DG.DesignationName,
            B.BranchName,
            R.RoleName,
            CONCAT(M.FirstName, ' ', M.LastName) AS ManagerName
        FROM Employee E
        LEFT JOIN Department D ON E.DepartmentId = D.DepartmentId
        LEFT JOIN Designation DG ON E.DesignationId = DG.DesignationId
        LEFT JOIN Branch B ON E.BranchId = B.BranchId
        LEFT JOIN Role R ON E.RoleId = R.RoleId
        LEFT JOIN Employee M ON E.ManagerId = M.EmployeeId
        WHERE E.EmployeeId = @EmployeeId;
        RETURN;
    END

    IF @Action = 'GETALL'
    BEGIN
        SELECT
            E.EmployeeId, E.EmployeeCode,
            E.FirstName, E.MiddleName, E.LastName,
            E.Gender, E.DOB, E.BloodGroup,
            E.Email, E.Phone, E.AlternatePhone,
            E.Address, E.City, E.State, E.Country, E.Pincode,
            E.DepartmentId, D.DepartmentName,
            E.DesignationId, DG.DesignationName,
            E.BranchId, B.BranchName,
            E.ManagerId, CONCAT(M.FirstName, ' ', M.LastName) AS ManagerName,
            E.JoiningDate, E.ConfirmationDate,
            E.PANNo, E.AadharNo, E.PassportNo,
            E.BankName, E.AccountNo, E.IFSC,
            E.ProfilePhoto, E.RoleId, R.RoleName,
            E.Status, E.IsActive,
            E.CreatedDate, E.UpdatedDate
        FROM Employee E
        LEFT JOIN Department D ON E.DepartmentId = D.DepartmentId
        LEFT JOIN Designation DG ON E.DesignationId = DG.DesignationId
        LEFT JOIN Branch B ON E.BranchId = B.BranchId
        LEFT JOIN Role R ON E.RoleId = R.RoleId
        LEFT JOIN Employee M ON E.ManagerId = M.EmployeeId
        ORDER BY E.EmployeeId DESC;
        RETURN;
    END

    IF @Action = 'GET_MANAGERS' OR @Action = 'MANAGERS_LOOKUP'
    BEGIN
        SELECT
            E.EmployeeId,
            CONCAT(E.FirstName, ' ', E.LastName) AS EmployeeName,
            E.EmployeeCode,
            D.DepartmentName,
            DG.DesignationName
        FROM Employee E
        LEFT JOIN Department D ON E.DepartmentId = D.DepartmentId
        LEFT JOIN Designation DG ON E.DesignationId = DG.DesignationId
        WHERE E.IsActive = 1
        ORDER BY E.FirstName ASC;
        RETURN;
    END

    SELECT 0 AS Success, 'Invalid Action' AS Message;
END;
GO

-- 5.8 sp_Attendance_CRUD
CREATE OR ALTER PROCEDURE [dbo].[sp_Attendance_CRUD]
(
    @Action VARCHAR(30),
    @AttendanceId INT = NULL,
    @EmployeeId INT = NULL,
    @AttendanceDate DATE = NULL,
    @CheckIn TIME = NULL,
    @CheckOut TIME = NULL,
    @WorkingHours DECIMAL(5, 2) = NULL,
    @LateMinutes INT = NULL,
    @Status VARCHAR(20) = NULL,
    @Remarks NVARCHAR(300) = NULL,
    @BranchId INT = NULL,
    @Month INT = NULL,
    @Year INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @AttendanceDate IS NULL
        SET @AttendanceDate = CAST(GETDATE() AS DATE);

    -- 1. CLOCK IN
    IF @Action = 'CLOCK_IN'
    BEGIN
        IF @CheckIn IS NULL
            SET @CheckIn = CAST(GETDATE() AS TIME);

        -- Check late status (if check-in after 9:30 AM)
        IF @LateMinutes IS NULL
        BEGIN
            DECLARE @StandardCheckIn TIME = '09:30:00';
            IF @CheckIn > @StandardCheckIn
                SET @LateMinutes = DATEDIFF(MINUTE, @StandardCheckIn, @CheckIn);
            ELSE
                SET @LateMinutes = 0;
        END

        IF @Status IS NULL
        BEGIN
            IF @LateMinutes > 0
                SET @Status = 'Late';
            ELSE
                SET @Status = 'Present';
        END

        IF EXISTS (SELECT 1 FROM Attendance WHERE EmployeeId = @EmployeeId AND AttendanceDate = @AttendanceDate)
        BEGIN
            UPDATE Attendance
            SET CheckIn = @CheckIn,
                LateMinutes = @LateMinutes,
                Status = @Status,
                Remarks = ISNULL(@Remarks, Remarks),
                UpdatedDate = GETDATE()
            WHERE EmployeeId = @EmployeeId AND AttendanceDate = @AttendanceDate;

            SELECT AttendanceId FROM Attendance WHERE EmployeeId = @EmployeeId AND AttendanceDate = @AttendanceDate;
        END
        ELSE
        BEGIN
            INSERT INTO Attendance (EmployeeId, AttendanceDate, CheckIn, LateMinutes, Status, Remarks, CreatedDate)
            VALUES (@EmployeeId, @AttendanceDate, @CheckIn, @LateMinutes, @Status, @Remarks, GETDATE());

            SELECT CAST(SCOPE_IDENTITY() AS INT) AS AttendanceId;
        END
        RETURN;
    END

    -- 2. CLOCK OUT
    IF @Action = 'CLOCK_OUT'
    BEGIN
        IF @CheckOut IS NULL
            SET @CheckOut = CAST(GETDATE() AS TIME);

        DECLARE @InTime TIME;
        SELECT @InTime = CheckIn FROM Attendance WHERE EmployeeId = @EmployeeId AND AttendanceDate = @AttendanceDate;

        IF @InTime IS NOT NULL
        BEGIN
            SET @WorkingHours = CAST(DATEDIFF(MINUTE, @InTime, @CheckOut) / 60.0 AS DECIMAL(5, 2));
            IF @WorkingHours < 0 SET @WorkingHours = 0;
            
            IF @WorkingHours < 4.5 AND @WorkingHours > 0
                SET @Status = 'HalfDay';
        END

        UPDATE Attendance
        SET CheckOut = @CheckOut,
            WorkingHours = ISNULL(@WorkingHours, WorkingHours),
            Status = ISNULL(@Status, Status),
            Remarks = ISNULL(@Remarks, Remarks),
            UpdatedDate = GETDATE()
        WHERE EmployeeId = @EmployeeId AND AttendanceDate = @AttendanceDate;

        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END

    -- 3. GET TODAY STATUS FOR EMPLOYEE
    IF @Action = 'GET_TODAY'
    BEGIN
        SELECT
            a.AttendanceId,
            a.EmployeeId,
            a.AttendanceDate,
            a.CheckIn,
            a.CheckOut,
            a.WorkingHours,
            a.LateMinutes,
            a.Status,
            a.Remarks
        FROM Attendance a
        WHERE a.EmployeeId = @EmployeeId AND a.AttendanceDate = @AttendanceDate;
        RETURN;
    END

    -- 4. GET MONTHLY ATTENDANCE FOR EMPLOYEE
    IF @Action = 'GET_MONTHLY_EMPLOYEE'
    BEGIN
        SELECT
            a.AttendanceId,
            a.EmployeeId,
            a.AttendanceDate,
            a.CheckIn,
            a.CheckOut,
            a.WorkingHours,
            a.LateMinutes,
            a.Status,
            a.Remarks
        FROM Attendance a
        WHERE a.EmployeeId = @EmployeeId
          AND (@Month IS NULL OR MONTH(a.AttendanceDate) = @Month)
          AND (@Year IS NULL OR YEAR(a.AttendanceDate) = @Year)
        ORDER BY a.AttendanceDate ASC;
        RETURN;
    END

    -- 5. GET DAILY ATTENDANCE BY BRANCH
    IF @Action = 'GET_DAILY_BRANCH'
    BEGIN
        SELECT
            e.EmployeeId,
            e.EmployeeCode,
            CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName,
            e.BranchId,
            b.BranchName,
            e.DepartmentId,
            d.DepartmentName,
            a.AttendanceId,
            ISNULL(a.AttendanceDate, @AttendanceDate) AS AttendanceDate,
            a.CheckIn,
            a.CheckOut,
            ISNULL(a.WorkingHours, 0) AS WorkingHours,
            ISNULL(a.LateMinutes, 0) AS LateMinutes,
            ISNULL(a.Status, 'Absent') AS Status,
            a.Remarks
        FROM Employee e
        LEFT JOIN Branch b ON e.BranchId = b.BranchId
        LEFT JOIN Department d ON e.DepartmentId = d.DepartmentId
        LEFT JOIN Attendance a ON e.EmployeeId = a.EmployeeId AND a.AttendanceDate = @AttendanceDate
        WHERE e.IsActive = 1
          AND (@BranchId IS NULL OR e.BranchId = @BranchId)
        ORDER BY e.FirstName ASC;
        RETURN;
    END

    -- 6. REGULARIZE ATTENDANCE
    IF @Action = 'REGULARIZE'
    BEGIN
        IF @WorkingHours IS NULL AND @CheckIn IS NOT NULL AND @CheckOut IS NOT NULL
        BEGIN
            SET @WorkingHours = CAST(DATEDIFF(MINUTE, @CheckIn, @CheckOut) / 60.0 AS DECIMAL(5, 2));
        END

        IF EXISTS (SELECT 1 FROM Attendance WHERE EmployeeId = @EmployeeId AND AttendanceDate = @AttendanceDate)
        BEGIN
            UPDATE Attendance
            SET CheckIn = ISNULL(@CheckIn, CheckIn),
                CheckOut = ISNULL(@CheckOut, CheckOut),
                WorkingHours = ISNULL(@WorkingHours, WorkingHours),
                Status = ISNULL(@Status, Status),
                Remarks = @Remarks,
                UpdatedDate = GETDATE()
            WHERE EmployeeId = @EmployeeId AND AttendanceDate = @AttendanceDate;

            SELECT 1 AS Success;
        END
        ELSE
        BEGIN
            INSERT INTO Attendance (EmployeeId, AttendanceDate, CheckIn, CheckOut, WorkingHours, LateMinutes, Status, Remarks, CreatedDate)
            VALUES (@EmployeeId, @AttendanceDate, @CheckIn, @CheckOut, ISNULL(@WorkingHours, 8.0), 0, ISNULL(@Status, 'Present'), @Remarks, GETDATE());

            SELECT CAST(SCOPE_IDENTITY() AS INT) AS Success;
        END
        RETURN;
    END
END;
GO

-- 5.9 sp_Leave_Operations
CREATE OR ALTER PROCEDURE [dbo].[sp_Leave_Operations]
(
    @Action VARCHAR(30),
    @LeaveId INT = NULL,
    @EmployeeId INT = NULL,
    @LeaveTypeId INT = NULL,
    @FromDate DATE = NULL,
    @ToDate DATE = NULL,
    @TotalDays DECIMAL(5, 2) = NULL,
    @IsHalfDay BIT = 0,
    @Reason NVARCHAR(500) = NULL,
    @ApprovedBy INT = NULL,
    @Status VARCHAR(20) = NULL,
    @RejectedReason NVARCHAR(500) = NULL,
    @Year INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Year IS NULL
        SET @Year = YEAR(GETDATE());

    -- 1. GET ALL LEAVE TYPES
    IF @Action = 'GET_LEAVE_TYPES'
    BEGIN
        SELECT LeaveTypeId, LeaveName, PaidLeave, MaxDays, IsEncashable, IsActive
        FROM LeaveType
        WHERE IsActive = 1
        ORDER BY LeaveName ASC;
        RETURN;
    END

    -- 2. GET BALANCES FOR EMPLOYEE (Auto-allocates default quota if not yet generated)
    IF @Action = 'GET_BALANCES'
    BEGIN
        -- Auto-allocate if empty for this year
        IF NOT EXISTS (SELECT 1 FROM LeaveAllocation WHERE EmployeeId = @EmployeeId AND Year = @Year)
        BEGIN
            INSERT INTO LeaveAllocation (EmployeeId, LeaveTypeId, Year, TotalDays, UsedDays, RemainingDays, CreatedDate)
            SELECT @EmployeeId, LeaveTypeId, @Year, MaxDays, 0, MaxDays, GETDATE()
            FROM LeaveType
            WHERE IsActive = 1;
        END

        SELECT
            la.AllocationId,
            la.EmployeeId,
            la.LeaveTypeId,
            lt.LeaveName,
            lt.PaidLeave,
            la.Year,
            la.TotalDays,
            la.UsedDays,
            la.RemainingDays
        FROM LeaveAllocation la
        INNER JOIN LeaveType lt ON la.LeaveTypeId = lt.LeaveTypeId
        WHERE la.EmployeeId = @EmployeeId AND la.Year = @Year;
        RETURN;
    END

    -- 3. APPLY LEAVE
    IF @Action = 'APPLY'
    BEGIN
        IF @TotalDays IS NULL
        BEGIN
            IF @IsHalfDay = 1
                SET @TotalDays = 0.5;
            ELSE
                SET @TotalDays = DATEDIFF(DAY, @FromDate, @ToDate) + 1;
        END

        INSERT INTO LeaveApplication (EmployeeId, LeaveTypeId, FromDate, ToDate, TotalDays, IsHalfDay, Reason, Status, AppliedDate)
        VALUES (@EmployeeId, @LeaveTypeId, @FromDate, @ToDate, @TotalDays, @IsHalfDay, @Reason, 'Pending', GETDATE());

        SELECT CAST(SCOPE_IDENTITY() AS INT) AS LeaveId;
        RETURN;
    END

    -- 4. GET EMPLOYEE LEAVE HISTORY
    IF @Action = 'GET_EMPLOYEE_HISTORY'
    BEGIN
        SELECT
            l.LeaveId,
            l.EmployeeId,
            lt.LeaveName,
            l.FromDate,
            l.ToDate,
            l.TotalDays,
            l.IsHalfDay,
            l.Reason,
            l.Status,
            l.AppliedDate,
            l.ApprovedDate,
            l.RejectedReason,
            CONCAT(m.FirstName, ' ', m.LastName) AS ApprovedByName
        FROM LeaveApplication l
        INNER JOIN LeaveType lt ON l.LeaveTypeId = lt.LeaveTypeId
        LEFT JOIN Employee m ON l.ApprovedBy = m.EmployeeId
        WHERE l.EmployeeId = @EmployeeId
        ORDER BY l.LeaveId DESC;
        RETURN;
    END

    -- 5. GET PENDING APPROVALS (For Managers or HR Admin)
    IF @Action = 'GET_PENDING'
    BEGIN
        SELECT
            l.LeaveId,
            l.EmployeeId,
            e.EmployeeCode,
            CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName,
            d.DepartmentName,
            lt.LeaveName,
            l.FromDate,
            l.ToDate,
            l.TotalDays,
            l.IsHalfDay,
            l.Reason,
            l.Status,
            l.AppliedDate
        FROM LeaveApplication l
        INNER JOIN Employee e ON l.EmployeeId = e.EmployeeId
        INNER JOIN LeaveType lt ON l.LeaveTypeId = lt.LeaveTypeId
        LEFT JOIN Department d ON e.DepartmentId = d.DepartmentId
        WHERE l.Status = 'Pending'
          AND (@ApprovedBy IS NULL OR e.ManagerId = @ApprovedBy OR @ApprovedBy = 0)
        ORDER BY l.AppliedDate ASC;
        RETURN;
    END

    -- 6. APPROVE OR REJECT LEAVE
    IF @Action = 'APPROVE_REJECT'
    BEGIN
        DECLARE @EmpId INT, @LTypeId INT, @Days DECIMAL(5, 2), @LYear INT;

        SELECT
            @EmpId = EmployeeId,
            @LTypeId = LeaveTypeId,
            @Days = TotalDays,
            @LYear = YEAR(FromDate)
        FROM LeaveApplication
        WHERE LeaveId = @LeaveId;

        UPDATE LeaveApplication
        SET Status = @Status,
            ApprovedBy = @ApprovedBy,
            ApprovedDate = GETDATE(),
            RejectedReason = @RejectedReason
        WHERE LeaveId = @LeaveId;

        DECLARE @UpdatedRows INT = @@ROWCOUNT;

        -- If approved, deduct from allocation
        IF @Status = 'Approved' AND @EmpId IS NOT NULL
        BEGIN
            UPDATE LeaveAllocation
            SET UsedDays = UsedDays + @Days,
                RemainingDays = CASE WHEN RemainingDays >= @Days THEN RemainingDays - @Days ELSE 0 END
            WHERE EmployeeId = @EmpId AND LeaveTypeId = @LTypeId AND Year = @LYear;
        END

        SELECT @UpdatedRows AS RowsAffected;
        RETURN;
    END

    -- 7. CANCEL LEAVE
    IF @Action = 'CANCEL'
    BEGIN
        UPDATE LeaveApplication
        SET Status = 'Cancelled'
        WHERE LeaveId = @LeaveId AND EmployeeId = @EmployeeId AND Status = 'Pending';

        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END
END;
GO

-- 5.10 sp_Payroll_Operations
CREATE OR ALTER PROCEDURE [dbo].[sp_Payroll_Operations]
(
    @Action VARCHAR(30),
    @PayrollId INT = NULL,
    @EmployeeId INT = NULL,
    @Month TINYINT = NULL,
    @Year SMALLINT = NULL,
    @BranchId INT = NULL,
    @Basic DECIMAL(18, 2) = NULL,
    @HRA DECIMAL(18, 2) = NULL,
    @DA DECIMAL(18, 2) = NULL,
    @TA DECIMAL(18, 2) = NULL,
    @Medical DECIMAL(18, 2) = NULL,
    @PF DECIMAL(18, 2) = NULL,
    @ProfessionalTax DECIMAL(18, 2) = NULL,
    @OtherAllowance DECIMAL(18, 2) = NULL,
    @GeneratedBy INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. GET SALARY STRUCTURE FOR EMPLOYEE
    IF @Action = 'GET_STRUCTURE'
    BEGIN
        SELECT
            s.SalaryId,
            s.EmployeeId,
            CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName,
            e.EmployeeCode,
            s.Basic,
            s.HRA,
            s.DA,
            s.TA,
            s.Medical,
            s.PF,
            s.ProfessionalTax,
            s.OtherAllowance,
            s.GrossSalary,
            s.NetSalary,
            s.EffectiveFrom,
            s.EffectiveTo,
            s.IsActive
        FROM SalaryStructure s
        INNER JOIN Employee e ON s.EmployeeId = e.EmployeeId
        WHERE s.EmployeeId = @EmployeeId;
        RETURN;
    END

    -- 2. SAVE SALARY STRUCTURE
    IF @Action = 'SAVE_STRUCTURE'
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION;

            DECLARE @Gross DECIMAL(18, 2) = ISNULL(@Basic, 0) + ISNULL(@HRA, 0) + ISNULL(@DA, 0) + ISNULL(@TA, 0) + ISNULL(@Medical, 0) + ISNULL(@OtherAllowance, 0);
            DECLARE @Net DECIMAL(18, 2) = @Gross - (ISNULL(@PF, 0) + ISNULL(@ProfessionalTax, 0));

            IF EXISTS (SELECT 1 FROM SalaryStructure WHERE EmployeeId = @EmployeeId)
            BEGIN
                UPDATE SalaryStructure
                SET Basic = ISNULL(@Basic, 0),
                    HRA = ISNULL(@HRA, 0),
                    DA = ISNULL(@DA, 0),
                    TA = ISNULL(@TA, 0),
                    Medical = ISNULL(@Medical, 0),
                    PF = ISNULL(@PF, 0),
                    ProfessionalTax = ISNULL(@ProfessionalTax, 0),
                    OtherAllowance = ISNULL(@OtherAllowance, 0),
                    GrossSalary = @Gross,
                    NetSalary = @Net,
                    EffectiveFrom = GETDATE()
                WHERE EmployeeId = @EmployeeId;

                COMMIT TRANSACTION;
                SELECT SalaryId FROM SalaryStructure WHERE EmployeeId = @EmployeeId;
            END
            ELSE
            BEGIN
                INSERT INTO SalaryStructure (EmployeeId, Basic, HRA, DA, TA, Medical, PF, ProfessionalTax, OtherAllowance, GrossSalary, NetSalary, EffectiveFrom, IsActive)
                VALUES (@EmployeeId, ISNULL(@Basic, 0), ISNULL(@HRA, 0), ISNULL(@DA, 0), ISNULL(@TA, 0), ISNULL(@Medical, 0), ISNULL(@PF, 0), ISNULL(@ProfessionalTax, 0), ISNULL(@OtherAllowance, 0), @Gross, @Net, GETDATE(), 1);

                DECLARE @NewSalId INT = CAST(SCOPE_IDENTITY() AS INT);
                COMMIT TRANSACTION;
                SELECT @NewSalId AS SalaryId;
            END
            RETURN;
        END TRY
        BEGIN CATCH
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            INSERT INTO SPErrorlog (ErrorLine, ErrorMessage, ErrorNumber, ErrorProcedure, ErrorSeverity, ErrorState, CreatedDate)
            VALUES (ERROR_LINE(), ERROR_MESSAGE(), ERROR_NUMBER(), 'sp_Payroll_Operations:SAVE_STRUCTURE', ERROR_SEVERITY(), ERROR_STATE(), GETDATE());
            THROW;
        END CATCH
    END

    -- 3. PROCESS MONTHLY PAYROLL
    IF @Action = 'PROCESS_MONTHLY'
    BEGIN
        BEGIN TRY
            BEGIN TRANSACTION;

            DECLARE @TotalDaysInMonth INT = 30;
            IF @Month IN (1, 3, 5, 7, 8, 10, 12) SET @TotalDaysInMonth = 31;
            ELSE IF @Month = 2 SET @TotalDaysInMonth = 28;

            DECLARE emp_cursor CURSOR LOCAL FAST_FORWARD FOR
            SELECT e.EmployeeId, s.Basic, s.GrossSalary, s.PF, s.ProfessionalTax
            FROM Employee e
            INNER JOIN SalaryStructure s ON e.EmployeeId = s.EmployeeId
            WHERE e.IsActive = 1 AND (@BranchId IS NULL OR e.BranchId = @BranchId);

            DECLARE @CurEmpId INT, @CurBasic DECIMAL(18, 2), @CurGross DECIMAL(18, 2), @CurPF DECIMAL(18, 2), @CurPT DECIMAL(18, 2);

            OPEN emp_cursor;
            FETCH NEXT FROM emp_cursor INTO @CurEmpId, @CurBasic, @CurGross, @CurPF, @CurPT;

            WHILE @@FETCH_STATUS = 0
            BEGIN
                DECLARE @PresentCount DECIMAL(5, 2) = 0;
                DECLARE @LeaveCount DECIMAL(5, 2) = 0;

                SELECT @PresentCount = COUNT(*) 
                FROM Attendance 
                WHERE EmployeeId = @CurEmpId 
                  AND MONTH(AttendanceDate) = @Month 
                  AND YEAR(AttendanceDate) = @Year
                  AND Status IN ('Present', 'Late');

                SELECT @PresentCount = @PresentCount + (COUNT(*) * 0.5)
                FROM Attendance 
                WHERE EmployeeId = @CurEmpId 
                  AND MONTH(AttendanceDate) = @Month 
                  AND YEAR(AttendanceDate) = @Year
                  AND Status = 'HalfDay';

                SELECT @LeaveCount = ISNULL(SUM(TotalDays), 0)
                FROM LeaveApplication
                WHERE EmployeeId = @CurEmpId 
                  AND MONTH(FromDate) = @Month 
                  AND YEAR(FromDate) = @Year
                  AND Status = 'Approved';

                IF @PresentCount = 0 AND @LeaveCount = 0
                    SET @PresentCount = @TotalDaysInMonth;

                DECLARE @AbsentCount DECIMAL(5, 2) = @TotalDaysInMonth - (@PresentCount + @LeaveCount);
                IF @AbsentCount < 0 SET @AbsentCount = 0;

                DECLARE @PerDaySalary DECIMAL(18, 2) = @CurBasic / @TotalDaysInMonth;
                DECLARE @LOPDeduction DECIMAL(18, 2) = @PerDaySalary * @AbsentCount;
                DECLARE @TotalDeductions DECIMAL(18, 2) = @CurPF + @CurPT + @LOPDeduction;
                DECLARE @NetSalary DECIMAL(18, 2) = @CurGross - @TotalDeductions;
                IF @NetSalary < 0 SET @NetSalary = 0;

                IF EXISTS (SELECT 1 FROM Payroll WHERE EmployeeId = @CurEmpId AND PayrollMonth = @Month AND PayrollYear = @Year)
                BEGIN
                    UPDATE Payroll
                    SET TotalWorkingDays = @TotalDaysInMonth,
                        PresentDays = @PresentCount,
                        AbsentDays = @AbsentCount,
                        Leaves = @LeaveCount,
                        GrossSalary = @CurGross,
                        Deductions = @TotalDeductions,
                        NetSalary = @NetSalary,
                        Status = 'Processed',
                        GeneratedDate = GETDATE(),
                        GeneratedBy = @GeneratedBy
                    WHERE EmployeeId = @CurEmpId AND PayrollMonth = @Month AND PayrollYear = @Year;
                END
                ELSE
                BEGIN
                    INSERT INTO Payroll (EmployeeId, PayrollMonth, PayrollYear, TotalWorkingDays, PresentDays, AbsentDays, Leaves, GrossSalary, Deductions, NetSalary, Status, GeneratedDate, GeneratedBy)
                    VALUES (@CurEmpId, @Month, @Year, @TotalDaysInMonth, @PresentCount, @AbsentCount, @LeaveCount, @CurGross, @TotalDeductions, @NetSalary, 'Processed', GETDATE(), @GeneratedBy);
                END

                FETCH NEXT FROM emp_cursor INTO @CurEmpId, @CurBasic, @CurGross, @CurPF, @CurPT;
            END

            CLOSE emp_cursor;
            DEALLOCATE emp_cursor;

            COMMIT TRANSACTION;
            SELECT 1 AS ProcessedCount;
            RETURN;
        END TRY
        BEGIN CATCH
            IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
            IF CURSOR_STATUS('local', 'emp_cursor') >= 0
            BEGIN
                CLOSE emp_cursor;
                DEALLOCATE emp_cursor;
            END

            INSERT INTO SPErrorlog (ErrorLine, ErrorMessage, ErrorNumber, ErrorProcedure, ErrorSeverity, ErrorState, CreatedDate)
            VALUES (ERROR_LINE(), ERROR_MESSAGE(), ERROR_NUMBER(), 'sp_Payroll_Operations:PROCESS_MONTHLY', ERROR_SEVERITY(), ERROR_STATE(), GETDATE());

            THROW;
        END CATCH
    END

    -- 4. GET PAYROLL LIST FOR MONTH AND YEAR
    IF @Action = 'GET_PAYROLL_LIST'
    BEGIN
        SELECT
            p.PayrollId,
            p.EmployeeId,
            e.EmployeeCode,
            CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName,
            d.DepartmentName,
            b.BranchName,
            p.PayrollMonth,
            p.PayrollYear,
            p.TotalWorkingDays,
            p.PresentDays,
            p.AbsentDays,
            p.Leaves,
            p.GrossSalary,
            p.Deductions,
            p.NetSalary,
            p.Status,
            p.PaymentDate,
            p.GeneratedDate
        FROM Payroll p
        INNER JOIN Employee e ON p.EmployeeId = e.EmployeeId
        LEFT JOIN Department d ON e.DepartmentId = d.DepartmentId
        LEFT JOIN Branch b ON e.BranchId = b.BranchId
        WHERE p.PayrollMonth = @Month 
          AND p.PayrollYear = @Year
          AND (@BranchId IS NULL OR e.BranchId = @BranchId)
        ORDER BY e.FirstName ASC;
        RETURN;
    END

    -- 5. GET PAYSLIP DETAILS
    IF @Action = 'GET_PAYSLIP'
    BEGIN
        SELECT
            p.PayrollId,
            p.PayrollMonth,
            p.PayrollYear,
            p.TotalWorkingDays,
            p.PresentDays,
            p.AbsentDays,
            p.Leaves,
            p.GrossSalary,
            p.Deductions,
            p.NetSalary,
            p.Status,
            p.PaymentDate,
            p.GeneratedDate,
            e.EmployeeId,
            e.EmployeeCode,
            CONCAT(e.FirstName, ' ', e.LastName) AS EmployeeName,
            e.Email,
            e.Phone,
            e.JoiningDate,
            e.PANNo,
            e.BankName,
            e.AccountNo,
            e.IFSC,
            d.DepartmentName,
            dg.DesignationName,
            b.BranchName,
            c.CompanyName,
            c.Address AS CompanyAddress,
            c.Email AS CompanyEmail,
            c.Phone AS CompanyPhone,
            c.Logo AS CompanyLogo,
            s.Basic,
            s.HRA,
            s.DA,
            s.TA,
            s.Medical,
            s.OtherAllowance,
            s.PF,
            s.ProfessionalTax
        FROM Payroll p
        INNER JOIN Employee e ON p.EmployeeId = e.EmployeeId
        LEFT JOIN Department d ON e.DepartmentId = d.DepartmentId
        LEFT JOIN Designation dg ON e.DesignationId = dg.DesignationId
        LEFT JOIN Branch b ON e.BranchId = b.BranchId
        LEFT JOIN Company c ON b.CompanyId = c.CompanyId
        LEFT JOIN SalaryStructure s ON e.EmployeeId = s.EmployeeId
        WHERE p.PayrollId = @PayrollId;
        RETURN;
    END

    -- 6. MARK AS PAID
    IF @Action = 'MARK_PAID'
    BEGIN
        UPDATE Payroll
        SET Status = 'Paid',
            PaymentDate = GETDATE()
        WHERE PayrollId = @PayrollId;

        SELECT @@ROWCOUNT AS RowsAffected;
        RETURN;
    END
END;
GO

-- ============================================================================
-- 6. SEED DATA
-- ============================================================================

-- 6.1 Insert Default Roles
IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = 'Super Admin')
    INSERT INTO Role (RoleName, Description, IsActive, CreatedDate) VALUES ('Super Admin', 'Full system access and super user privileges', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = 'HR Admin')
    INSERT INTO Role (RoleName, Description, IsActive, CreatedDate) VALUES ('HR Admin', 'Human resources administrative access', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = 'Manager')
    INSERT INTO Role (RoleName, Description, IsActive, CreatedDate) VALUES ('Manager', 'Department & team management access', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Role WHERE RoleName = 'Employee')
    INSERT INTO Role (RoleName, Description, IsActive, CreatedDate) VALUES ('Employee', 'Standard employee self-service access', 1, GETDATE());
GO

-- 6.2 Insert Sample Company
IF NOT EXISTS (SELECT 1 FROM Company WHERE CompanyName = 'Acme Global Technologies')
BEGIN
    INSERT INTO Company (CompanyName, GSTNo, Address, Phone, Email, Logo, Website, Currency, TimeZone, IsActive, CreatedDate)
    VALUES ('Acme Global Technologies', '27AABCU9603R1ZM', 'Level 4, Cyber City Tech Park, Tower A', '+1-800-555-0199', 'admin@acmeglobal.com', '/uploads/company-logo.png', 'https://acmeglobal.com', 'USD', 'UTC', 1, GETDATE());
END
GO

-- 6.3 Insert Sample Branch
DECLARE @CompId INT = (SELECT TOP 1 CompanyId FROM Company WHERE CompanyName = 'Acme Global Technologies');
IF @CompId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Branch WHERE BranchCode = 'HQ-01')
BEGIN
    INSERT INTO Branch (CompanyId, BranchName, BranchCode, Address, Phone, Email, IsActive, CreatedDate)
    VALUES (@CompId, 'Global Headquarters', 'HQ-01', 'Cyber City Tower A, Suite 100', '+1-800-555-0199', 'hq@acmeglobal.com', 1, GETDATE());
END
GO

-- 6.4 Insert Sample Departments
DECLARE @BrId INT = (SELECT TOP 1 BranchId FROM Branch WHERE BranchCode = 'HQ-01');
IF @BrId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Department WHERE DepartmentName = 'Information Technology')
        INSERT INTO Department (BranchId, DepartmentName, Description, IsActive, CreatedDate) VALUES (@BrId, 'Information Technology', 'Software development and IT infrastructure', 1, GETDATE());

    IF NOT EXISTS (SELECT 1 FROM Department WHERE DepartmentName = 'Human Resources')
        INSERT INTO Department (BranchId, DepartmentName, Description, IsActive, CreatedDate) VALUES (@BrId, 'Human Resources', 'Talent acquisition, payroll, and employee relations', 1, GETDATE());

    IF NOT EXISTS (SELECT 1 FROM Department WHERE DepartmentName = 'Finance')
        INSERT INTO Department (BranchId, DepartmentName, Description, IsActive, CreatedDate) VALUES (@BrId, 'Finance', 'Financial planning, accounting, and audits', 1, GETDATE());

    IF NOT EXISTS (SELECT 1 FROM Department WHERE DepartmentName = 'Operations')
        INSERT INTO Department (BranchId, DepartmentName, Description, IsActive, CreatedDate) VALUES (@BrId, 'Operations', 'Business operations and logistics', 1, GETDATE());
END
GO

-- 6.5 Insert Sample Designations
IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'Software Architect')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate) VALUES ('Software Architect', 'L5', 120000.00, 'Enterprise solution and system architecture', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'Senior Full-Stack Developer')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate) VALUES ('Senior Full-Stack Developer', 'L4', 90000.00, 'Full stack web and API engineering', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'HR Manager')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate) VALUES ('HR Manager', 'M2', 80000.00, 'HR operations and personnel management', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'Junior Developer')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate) VALUES ('Junior Developer', 'L2', 50000.00, 'Application feature development', 1, GETDATE());
GO

-- 6.6 Insert Default Leave Types
IF NOT EXISTS (SELECT 1 FROM LeaveType WHERE LeaveName = 'Casual Leave')
    INSERT INTO LeaveType (LeaveName, PaidLeave, MaxDays, IsEncashable, IsActive) VALUES ('Casual Leave', 1, 12, 0, 1);

IF NOT EXISTS (SELECT 1 FROM LeaveType WHERE LeaveName = 'Sick Leave')
    INSERT INTO LeaveType (LeaveName, PaidLeave, MaxDays, IsEncashable, IsActive) VALUES ('Sick Leave', 1, 10, 0, 1);

IF NOT EXISTS (SELECT 1 FROM LeaveType WHERE LeaveName = 'Privilege Leave')
    INSERT INTO LeaveType (LeaveName, PaidLeave, MaxDays, IsEncashable, IsActive) VALUES ('Privilege Leave', 1, 15, 1, 1);

IF NOT EXISTS (SELECT 1 FROM LeaveType WHERE LeaveName = 'Maternity Leave')
    INSERT INTO LeaveType (LeaveName, PaidLeave, MaxDays, IsEncashable, IsActive) VALUES ('Maternity Leave', 1, 90, 0, 1);
GO

-- 6.7 Insert Super Admin User
-- Password is Password@123 (BCrypt hash)
DECLARE @AdminRoleId INT = (SELECT RoleId FROM Role WHERE RoleName = 'Super Admin');
DECLARE @DeptId INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Information Technology');
DECLARE @DesigId INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Software Architect');
DECLARE @DefaultBranchId INT = (SELECT TOP 1 BranchId FROM Branch WHERE BranchCode = 'HQ-01');

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'admin@hrms.com')
BEGIN
    INSERT INTO Employee
    (
        EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup,
        Email, Phone, AlternatePhone, Address, City, State, Country, Pincode,
        DepartmentId, DesignationId, BranchId, JoiningDate, ConfirmationDate,
        PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, ProfilePhoto,
        RoleId, PasswordHash, Status, IsActive, CreatedDate
    )
    VALUES
    (
        'EMP001', 'System', 'Super', 'Administrator', 'Male', '1990-01-01', 'O+',
        'admin@hrms.com', '+1-555-0101', '+1-555-0102', '100 Silicon Blvd', 'San Jose', 'CA', 'USA', '95110',
        @DeptId, @DesigId, @DefaultBranchId, '2020-01-01', '2020-07-01',
        'ABCDE1234F', '123456789012', 'P1234567', 'Silicon Valley Bank', '9876543210', 'SVB0001', NULL,
        @AdminRoleId, '$2a$11$FWwB979Dw7ewF2VCZwpiUuyum67Q0F.7fqapET.REAXGzj98vlsbm', 'Active', 1, GETDATE()
    );
END
GO

-- 6.8 Insert Sample HR Admin and Employees if not present
DECLARE @HRRoleId INT = (SELECT RoleId FROM Role WHERE RoleName = 'HR Admin');
DECLARE @MgrRoleId INT = (SELECT RoleId FROM Role WHERE RoleName = 'Manager');
DECLARE @EmpRoleId INT = (SELECT RoleId FROM Role WHERE RoleName = 'Employee');
DECLARE @HRDept INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Human Resources');
DECLARE @ITDept INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Information Technology');
DECLARE @HRDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'HR Manager');
DECLARE @DevDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Senior Full-Stack Developer');
DECLARE @JrDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Junior Developer');
DECLARE @DefBranch INT = (SELECT TOP 1 BranchId FROM Branch WHERE BranchCode = 'HQ-01');
DECLARE @AdminEmpId INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE Email = 'admin@hrms.com');

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'hr@hrms.com')
BEGIN
    INSERT INTO Employee
    (
        EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup,
        Email, Phone, AlternatePhone, Address, City, State, Country, Pincode,
        DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate,
        PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC,
        RoleId, PasswordHash, Status, IsActive, CreatedDate
    )
    VALUES
    (
        'EMP002', 'Sarah', 'Jane', 'Connor', 'Female', '1992-05-15', 'A+',
        'hr@hrms.com', '+1-555-0103', NULL, '200 Oak Street', 'San Jose', 'CA', 'USA', '95112',
        @HRDept, @HRDesig, @DefBranch, @AdminEmpId, '2021-03-01', '2021-09-01',
        'HRABC1234F', '987654321098', 'P7654321', 'Chase Bank', '1122334455', 'CHAS0001',
        @HRRoleId, '$2a$11$FWwB979Dw7ewF2VCZwpiUuyum67Q0F.7fqapET.REAXGzj98vlsbm', 'Active', 1, GETDATE()
    );
END

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'manager@hrms.com')
BEGIN
    INSERT INTO Employee
    (
        EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup,
        Email, Phone, AlternatePhone, Address, City, State, Country, Pincode,
        DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate,
        PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC,
        RoleId, PasswordHash, Status, IsActive, CreatedDate
    )
    VALUES
    (
        'EMP003', 'Michael', 'Scott', 'Manager', 'Male', '1985-08-20', 'B+',
        'manager@hrms.com', '+1-555-0105', NULL, '300 Pine Road', 'San Jose', 'CA', 'USA', '95113',
        @ITDept, @DevDesig, @DefBranch, @AdminEmpId, '2021-01-15', '2021-07-15',
        'MGRBC1234F', '456789123456', 'P9876543', 'Wells Fargo', '2233445566', 'WELS0001',
        @MgrRoleId, '$2a$11$FWwB979Dw7ewF2VCZwpiUuyum67Q0F.7fqapET.REAXGzj98vlsbm', 'Active', 1, GETDATE()
    );
END

DECLARE @MgrEmpId INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE Email = 'manager@hrms.com');

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'employee@hrms.com')
BEGIN
    INSERT INTO Employee
    (
        EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup,
        Email, Phone, AlternatePhone, Address, City, State, Country, Pincode,
        DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate,
        PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC,
        RoleId, PasswordHash, Status, IsActive, CreatedDate
    )
    VALUES
    (
        'EMP004', 'John', 'David', 'Doe', 'Male', '1996-11-10', 'AB+',
        'employee@hrms.com', '+1-555-0106', NULL, '400 Elm Street', 'San Jose', 'CA', 'USA', '95114',
        @ITDept, @JrDesig, @DefBranch, @MgrEmpId, '2022-06-01', '2022-12-01',
        'EMPCD1234F', '345678901234', 'P3456789', 'Bank of America', '3344556677', 'BOFA0001',
        @EmpRoleId, '$2a$11$FWwB979Dw7ewF2VCZwpiUuyum67Q0F.7fqapET.REAXGzj98vlsbm', 'Active', 1, GETDATE()
    );
END
GO

-- 6.9 Seed Salary Structure for Sample Employees
DECLARE @Emp1 INT = (SELECT EmployeeId FROM Employee WHERE Email = 'admin@hrms.com');
DECLARE @Emp2 INT = (SELECT EmployeeId FROM Employee WHERE Email = 'hr@hrms.com');
DECLARE @Emp3 INT = (SELECT EmployeeId FROM Employee WHERE Email = 'manager@hrms.com');
DECLARE @Emp4 INT = (SELECT EmployeeId FROM Employee WHERE Email = 'employee@hrms.com');

IF @Emp1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM SalaryStructure WHERE EmployeeId = @Emp1)
    INSERT INTO SalaryStructure (EmployeeId, Basic, HRA, DA, TA, Medical, PF, ProfessionalTax, OtherAllowance, GrossSalary, NetSalary, EffectiveFrom, IsActive)
    VALUES (@Emp1, 80000, 30000, 10000, 5000, 5000, 9600, 200, 5000, 135000, 125200, GETDATE(), 1);

IF @Emp2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM SalaryStructure WHERE EmployeeId = @Emp2)
    INSERT INTO SalaryStructure (EmployeeId, Basic, HRA, DA, TA, Medical, PF, ProfessionalTax, OtherAllowance, GrossSalary, NetSalary, EffectiveFrom, IsActive)
    VALUES (@Emp2, 50000, 20000, 6000, 3000, 3000, 6000, 200, 3000, 85000, 78800, GETDATE(), 1);

IF @Emp3 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM SalaryStructure WHERE EmployeeId = @Emp3)
    INSERT INTO SalaryStructure (EmployeeId, Basic, HRA, DA, TA, Medical, PF, ProfessionalTax, OtherAllowance, GrossSalary, NetSalary, EffectiveFrom, IsActive)
    VALUES (@Emp3, 60000, 24000, 8000, 4000, 4000, 7200, 200, 4000, 104000, 96600, GETDATE(), 1);

IF @Emp4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM SalaryStructure WHERE EmployeeId = @Emp4)
    INSERT INTO SalaryStructure (EmployeeId, Basic, HRA, DA, TA, Medical, PF, ProfessionalTax, OtherAllowance, GrossSalary, NetSalary, EffectiveFrom, IsActive)
    VALUES (@Emp4, 35000, 14000, 4000, 2500, 2500, 4200, 200, 2000, 60000, 55600, GETDATE(), 1);
GO

-- 6.10 Seed Sample Holidays
DECLARE @DefaultBranch INT = (SELECT TOP 1 BranchId FROM Branch WHERE BranchCode = 'HQ-01');
IF @DefaultBranch IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Holiday WHERE HolidayName = 'New Year''s Day' AND Year = 2026)
        INSERT INTO Holiday (BranchId, HolidayName, HolidayDate, IsRecurring, Year) VALUES (@DefaultBranch, 'New Year''s Day', '2026-01-01', 1, 2026);

    IF NOT EXISTS (SELECT 1 FROM Holiday WHERE HolidayName = 'Memorial Day' AND Year = 2026)
        INSERT INTO Holiday (BranchId, HolidayName, HolidayDate, IsRecurring, Year) VALUES (@DefaultBranch, 'Memorial Day', '2026-05-25', 1, 2026);

    IF NOT EXISTS (SELECT 1 FROM Holiday WHERE HolidayName = 'Independence Day' AND Year = 2026)
        INSERT INTO Holiday (BranchId, HolidayName, HolidayDate, IsRecurring, Year) VALUES (@DefaultBranch, 'Independence Day', '2026-07-04', 1, 2026);

    IF NOT EXISTS (SELECT 1 FROM Holiday WHERE HolidayName = 'Labor Day' AND Year = 2026)
        INSERT INTO Holiday (BranchId, HolidayName, HolidayDate, IsRecurring, Year) VALUES (@DefaultBranch, 'Labor Day', '2026-09-07', 1, 2026);

    IF NOT EXISTS (SELECT 1 FROM Holiday WHERE HolidayName = 'Thanksgiving Day' AND Year = 2026)
        INSERT INTO Holiday (BranchId, HolidayName, HolidayDate, IsRecurring, Year) VALUES (@DefaultBranch, 'Thanksgiving Day', '2026-11-26', 1, 2026);

    IF NOT EXISTS (SELECT 1 FROM Holiday WHERE HolidayName = 'Christmas Day' AND Year = 2026)
        INSERT INTO Holiday (BranchId, HolidayName, HolidayDate, IsRecurring, Year) VALUES (@DefaultBranch, 'Christmas Day', '2026-12-25', 1, 2026);
END
GO

PRINT '=======================================================';
PRINT 'HRMS Schema & Stored Procedures Initialized Successfully';
PRINT 'Default Login Credentials:';
PRINT '  Super Admin: admin@hrms.com / Password@123';
PRINT '  HR Admin:    hr@hrms.com / Password@123';
PRINT '  Manager:     manager@hrms.com / Password@123';
PRINT '  Employee:    employee@hrms.com / Password@123';
PRINT '=======================================================';
GO

-- ============================================================================
-- ENTERPRISE DEMO SEED DATA (ALL 36 TABLES)
-- ============================================================================
PRINT 'Starting Enterprise Demo Data Seeding...';

-- 1. COMPANIES
IF NOT EXISTS (SELECT 1 FROM Company WHERE CompanyName = 'Nexus Cloud Systems Inc')
    INSERT INTO Company (CompanyName, GSTNo, Address, Phone, Email, Logo, Website, Currency, TimeZone, IsActive, CreatedDate)
    VALUES ('Nexus Cloud Systems Inc', '27BBNCS1234Q1Z1', '500 Howard Street, Suite 800', '+1-415-555-0144', 'contact@nexuscloud.io', '/uploads/company-nexus.png', 'https://nexuscloud.io', 'USD', 'PST', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Company WHERE CompanyName = 'Vanguard Financial Group')
    INSERT INTO Company (CompanyName, GSTNo, Address, Phone, Email, Logo, Website, Currency, TimeZone, IsActive, CreatedDate)
    VALUES ('Vanguard Financial Group', '27CCVFG5678R1Z2', '75 Rockefeller Plaza, Floor 14', '+1-212-555-0188', 'info@vanguardfin.com', '/uploads/company-vanguard.png', 'https://vanguardfin.com', 'USD', 'EST', 1, GETDATE());
GO

-- 2. BRANCHES
DECLARE @AcmeCompId INT = (SELECT TOP 1 CompanyId FROM Company WHERE CompanyName = 'Acme Global Technologies');
DECLARE @NexusCompId INT = (SELECT TOP 1 CompanyId FROM Company WHERE CompanyName = 'Nexus Cloud Systems Inc');

IF @AcmeCompId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Branch WHERE BranchCode = 'SF-02')
    INSERT INTO Branch (CompanyId, BranchName, BranchCode, Address, Phone, Email, IsActive, CreatedDate)
    VALUES (@AcmeCompId, 'San Francisco R&D Center', 'SF-02', '350 Mission St, 22nd Floor, San Francisco, CA', '+1-415-555-0210', 'sf-office@acmeglobal.com', 1, GETDATE());

IF @NexusCompId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Branch WHERE BranchCode = 'NY-03')
    INSERT INTO Branch (CompanyId, BranchName, BranchCode, Address, Phone, Email, IsActive, CreatedDate)
    VALUES (@NexusCompId, 'New York Corporate Hub', 'NY-03', '75 Rockefeller Plaza, New York, NY', '+1-212-555-0320', 'ny-hub@nexuscloud.io', 1, GETDATE());

IF @AcmeCompId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM Branch WHERE BranchCode = 'TX-04')
    INSERT INTO Branch (CompanyId, BranchName, BranchCode, Address, Phone, Email, IsActive, CreatedDate)
    VALUES (@AcmeCompId, 'Austin Innovation Labs', 'TX-04', '100 Congress Ave, Suite 1200, Austin, TX', '+1-512-555-0430', 'austin-labs@acmeglobal.com', 1, GETDATE());
GO

-- 3. DEPARTMENTS
DECLARE @HQBranchId INT = (SELECT TOP 1 BranchId FROM Branch WHERE BranchCode = 'HQ-01');
DECLARE @SFBranchId INT = (SELECT TOP 1 BranchId FROM Branch WHERE BranchCode = 'SF-02');
IF @SFBranchId IS NULL SET @SFBranchId = @HQBranchId;

IF NOT EXISTS (SELECT 1 FROM Department WHERE DepartmentName = 'Product Management')
    INSERT INTO Department (BranchId, DepartmentName, Description, IsActive, CreatedDate)
    VALUES (@HQBranchId, 'Product Management', 'Product vision, strategy, UX design, and roadmap execution', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Department WHERE DepartmentName = 'Quality Assurance & Testing')
    INSERT INTO Department (BranchId, DepartmentName, Description, IsActive, CreatedDate)
    VALUES (@HQBranchId, 'Quality Assurance & Testing', 'Automated testing, load verification, and release QA', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Department WHERE DepartmentName = 'Legal & Compliance')
    INSERT INTO Department (BranchId, DepartmentName, Description, IsActive, CreatedDate)
    VALUES (@HQBranchId, 'Legal & Compliance', 'Corporate governance, contracts, GDPR/SOC2 compliance', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Department WHERE DepartmentName = 'Marketing & Growth')
    INSERT INTO Department (BranchId, DepartmentName, Description, IsActive, CreatedDate)
    VALUES (@SFBranchId, 'Marketing & Growth', 'Brand growth, demand generation, and digital marketing', 1, GETDATE());
GO

-- 4. DESIGNATIONS
IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'Product Lead')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate)
    VALUES ('Product Lead', 'L5', 115000.00, 'Direct product lifecycle and lead cross-functional sprint pods', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'QA Automation Engineer')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate)
    VALUES ('QA Automation Engineer', 'L3', 75000.00, 'Build Cypress and Playwright automated end-to-end suites', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'DevOps & SRE Specialist')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate)
    VALUES ('DevOps & SRE Specialist', 'L4', 95000.00, 'Manage Kubernetes clusters, Terraform IaC, and CI/CD pipelines', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'Financial Analyst')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate)
    VALUES ('Financial Analyst', 'L3', 78000.00, 'Financial modeling, budget forecasts, and cash flow reconciliation', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'Legal Counsel')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate)
    VALUES ('Legal Counsel', 'M1', 105000.00, 'Commercial agreement negotiation and IP rights protection', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'Talent Acquisition Specialist')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate)
    VALUES ('Talent Acquisition Specialist', 'L3', 68000.00, 'Full-cycle engineering recruitment, talent pipelining, and sourcing', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'Security Analyst')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate)
    VALUES ('Security Analyst', 'L4', 92000.00, 'Threat mitigation, SIEM monitoring, penetration testing, and audits', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Designation WHERE DesignationName = 'Operations Lead')
    INSERT INTO Designation (DesignationName, Grade, BasicSalary, Description, IsActive, CreatedDate)
    VALUES ('Operations Lead', 'M2', 88000.00, 'Physical workplace operations, vendor SLA tracking, and logistics', 1, GETDATE());
GO

-- 5. EMPLOYEES (EMP005 to EMP014)
DECLARE @AdminEmpId INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE Email = 'admin@hrms.com');
DECLARE @HREmpId INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE Email = 'hr@hrms.com');
DECLARE @MgrEmpId INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE Email = 'manager@hrms.com');

DECLARE @AdminRoleId INT = (SELECT RoleId FROM Role WHERE RoleName = 'Super Admin');
DECLARE @HRRoleId INT = (SELECT RoleId FROM Role WHERE RoleName = 'HR Admin');
DECLARE @ManagerRoleId INT = (SELECT RoleId FROM Role WHERE RoleName = 'Manager');
DECLARE @StaffRoleId INT = (SELECT RoleId FROM Role WHERE RoleName = 'Employee');

DECLARE @HQBranch INT = (SELECT TOP 1 BranchId FROM Branch WHERE BranchCode = 'HQ-01');
DECLARE @SFBranch INT = (SELECT TOP 1 BranchId FROM Branch WHERE BranchCode = 'SF-02');
DECLARE @NYBranch INT = (SELECT TOP 1 BranchId FROM Branch WHERE BranchCode = 'NY-03');
DECLARE @TXBranch INT = (SELECT TOP 1 BranchId FROM Branch WHERE BranchCode = 'TX-04');
IF @SFBranch IS NULL SET @SFBranch = @HQBranch;
IF @NYBranch IS NULL SET @NYBranch = @HQBranch;
IF @TXBranch IS NULL SET @TXBranch = @HQBranch;

DECLARE @ITDept INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Information Technology');
DECLARE @HRDept INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Human Resources');
DECLARE @FinDept INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Finance');
DECLARE @OpsDept INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Operations');
DECLARE @ProdDept INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Product Management');
DECLARE @QADept INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Quality Assurance & Testing');
DECLARE @LegalDept INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Legal & Compliance');

DECLARE @DevOpsDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'DevOps & SRE Specialist');
DECLARE @ProdLeadDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Product Lead');
DECLARE @FinDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Financial Analyst');
DECLARE @QADesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'QA Automation Engineer');
DECLARE @SrDevDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Senior Full-Stack Developer');
DECLARE @RecruiterDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Talent Acquisition Specialist');
DECLARE @SecDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Security Analyst');
DECLARE @OpsLeadDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Operations Lead');
DECLARE @LegalDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Legal Counsel');
DECLARE @JrDevDesig INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Junior Developer');

-- Standard BCrypt Hash for Password@123
DECLARE @PassHash NVARCHAR(MAX) = '$2a$11$FWwB979Dw7ewF2VCZwpiUuyum67Q0F.7fqapET.REAXGzj98vlsbm';

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'david.miller@hrms.com')
    INSERT INTO Employee (EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup, Email, Phone, Address, City, State, Country, Pincode, DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate, PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, RoleId, PasswordHash, Status, IsActive, CreatedDate)
    VALUES ('EMP005', 'David', 'Arthur', 'Miller', 'Male', '1991-03-22', 'O+', 'david.miller@hrms.com', '+1-555-0205', '520 Lake St, Apt 4B', 'San Jose', 'CA', 'USA', '95116', @ITDept, @DevOpsDesig, @HQBranch, @MgrEmpId, '2021-08-01', '2022-02-01', 'DMILL1234F', '556677889901', 'P5566778', 'Citibank', '4455667788', 'CITI0001', @StaffRoleId, @PassHash, 'Active', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'emily.watson@hrms.com')
    INSERT INTO Employee (EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup, Email, Phone, Address, City, State, Country, Pincode, DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate, PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, RoleId, PasswordHash, Status, IsActive, CreatedDate)
    VALUES ('EMP006', 'Emily', 'Rose', 'Watson', 'Female', '1989-11-04', 'A-', 'emily.watson@hrms.com', '+1-555-0206', '880 Market St, Suite 12', 'San Francisco', 'CA', 'USA', '94102', @ProdDept, @ProdLeadDesig, @SFBranch, @AdminEmpId, '2020-05-15', '2020-11-15', 'EWATS1234F', '667788990012', 'P6677889', 'Wells Fargo', '5566778899', 'WELS0002', @ManagerRoleId, @PassHash, 'Active', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'james.anderson@hrms.com')
    INSERT INTO Employee (EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup, Email, Phone, Address, City, State, Country, Pincode, DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate, PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, RoleId, PasswordHash, Status, IsActive, CreatedDate)
    VALUES ('EMP007', 'James', 'William', 'Anderson', 'Male', '1993-07-19', 'B+', 'james.anderson@hrms.com', '+1-555-0207', '125 Wall Street, Floor 18', 'New York', 'NY', 'USA', '10005', @FinDept, @FinDesig, @NYBranch, @AdminEmpId, '2022-01-10', '2022-07-10', 'JANDE1234F', '778899001123', 'P7788990', 'JPMorgan Chase', '6677889900', 'CHAS0002', @StaffRoleId, @PassHash, 'Active', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'priya.sharma@hrms.com')
    INSERT INTO Employee (EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup, Email, Phone, Address, City, State, Country, Pincode, DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate, PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, RoleId, PasswordHash, Status, IsActive, CreatedDate)
    VALUES ('EMP008', 'Priya', 'Kavita', 'Sharma', 'Female', '1994-12-14', 'O-', 'priya.sharma@hrms.com', '+1-555-0208', '340 Santana Row, Unit 302', 'San Jose', 'CA', 'USA', '95128', @QADept, @QADesig, @HQBranch, @MgrEmpId, '2022-04-18', '2022-10-18', 'PSHAR1234F', '889900112234', 'P8899001', 'Bank of America', '7788990011', 'BOFA0002', @StaffRoleId, @PassHash, 'Active', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'robert.chen@hrms.com')
    INSERT INTO Employee (EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup, Email, Phone, Address, City, State, Country, Pincode, DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate, PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, RoleId, PasswordHash, Status, IsActive, CreatedDate)
    VALUES ('EMP009', 'Robert', 'Li', 'Chen', 'Male', '1990-09-08', 'AB+', 'robert.chen@hrms.com', '+1-555-0209', '1400 Mission Bay Blvd', 'San Francisco', 'CA', 'USA', '94158', @ITDept, @SrDevDesig, @SFBranch, @MgrEmpId, '2021-02-01', '2021-08-01', 'RCHEN1234F', '990011223345', 'P9900112', 'Silicon Valley Bank', '8899001122', 'SVB0002', @StaffRoleId, @PassHash, 'Active', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'jessica.taylor@hrms.com')
    INSERT INTO Employee (EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup, Email, Phone, Address, City, State, Country, Pincode, DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate, PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, RoleId, PasswordHash, Status, IsActive, CreatedDate)
    VALUES ('EMP010', 'Jessica', 'Marie', 'Taylor', 'Female', '1995-02-28', 'A+', 'jessica.taylor@hrms.com', '+1-555-0210', '210 First Street, Suite 50', 'San Jose', 'CA', 'USA', '95113', @HRDept, @RecruiterDesig, @HQBranch, @HREmpId, '2023-03-01', '2023-09-01', 'JTAYL1234F', '112233445566', 'P1122334', 'Chase Bank', '9900112233', 'CHAS0003', @StaffRoleId, @PassHash, 'Active', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'alex.martinez@hrms.com')
    INSERT INTO Employee (EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup, Email, Phone, Address, City, State, Country, Pincode, DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate, PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, RoleId, PasswordHash, Status, IsActive, CreatedDate)
    VALUES ('EMP011', 'Alex', 'Gabriel', 'Martinez', 'Male', '1992-06-30', 'O+', 'alex.martinez@hrms.com', '+1-555-0211', '405 Stevens Creek Blvd', 'San Jose', 'CA', 'USA', '95129', @ITDept, @SecDesig, @HQBranch, @AdminEmpId, '2021-11-15', '2022-05-15', 'AMART1234F', '223344556677', 'P2233445', 'Citibank', '1011121314', 'CITI0002', @StaffRoleId, @PassHash, 'Active', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'olivia.brown@hrms.com')
    INSERT INTO Employee (EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup, Email, Phone, Address, City, State, Country, Pincode, DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate, PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, RoleId, PasswordHash, Status, IsActive, CreatedDate)
    VALUES ('EMP012', 'Olivia', 'Grace', 'Brown', 'Female', '1988-10-12', 'B-', 'olivia.brown@hrms.com', '+1-555-0212', '600 Congress Ave', 'Austin', 'TX', 'USA', '78701', @OpsDept, @OpsLeadDesig, @TXBranch, @AdminEmpId, '2020-09-01', '2021-03-01', 'OBROW1234F', '334455667788', 'P3344556', 'Wells Fargo', '1213141516', 'WELS0003', @ManagerRoleId, @PassHash, 'Active', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'daniel.lee@hrms.com')
    INSERT INTO Employee (EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup, Email, Phone, Address, City, State, Country, Pincode, DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate, PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, RoleId, PasswordHash, Status, IsActive, CreatedDate)
    VALUES ('EMP013', 'Daniel', 'Sung', 'Lee', 'Male', '1987-04-16', 'A+', 'daniel.lee@hrms.com', '+1-555-0213', '55 Broadway, Suite 900', 'New York', 'NY', 'USA', '10006', @LegalDept, @LegalDesig, @NYBranch, @AdminEmpId, '2021-04-01', '2021-10-01', 'DLEE11234F', '445566778899', 'P4455667', 'JPMorgan Chase', '1314151617', 'CHAS0004', @ManagerRoleId, @PassHash, 'Active', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Employee WHERE Email = 'sophia.garcia@hrms.com')
    INSERT INTO Employee (EmployeeCode, FirstName, MiddleName, LastName, Gender, DOB, BloodGroup, Email, Phone, Address, City, State, Country, Pincode, DepartmentId, DesignationId, BranchId, ManagerId, JoiningDate, ConfirmationDate, PANNo, AadharNo, PassportNo, BankName, AccountNo, IFSC, RoleId, PasswordHash, Status, IsActive, CreatedDate)
    VALUES ('EMP014', 'Sophia', 'Elena', 'Garcia', 'Female', '1998-08-25', 'O+', 'sophia.garcia@hrms.com', '+1-555-0214', '710 N 1st St, Apt 201', 'San Jose', 'CA', 'USA', '95112', @ITDept, @JrDevDesig, @HQBranch, @MgrEmpId, '2023-07-10', '2024-01-10', 'SGARC1234F', '556677881122', 'P5566771', 'Bank of America', '1415161718', 'BOFA0003', @StaffRoleId, @PassHash, 'Active', 1, GETDATE());
GO

-- 6. SALARY STRUCTURES
DECLARE emp_sal_cursor CURSOR FOR
SELECT EmployeeId FROM Employee WHERE IsActive = 1;

DECLARE @SalEmpId INT;
OPEN emp_sal_cursor;
FETCH NEXT FROM emp_sal_cursor INTO @SalEmpId;

WHILE @@FETCH_STATUS = 0
BEGIN
    IF NOT EXISTS (SELECT 1 FROM SalaryStructure WHERE EmployeeId = @SalEmpId)
    BEGIN
        DECLARE @BasicSal DECIMAL(18,2) = 45000.00;
        IF @SalEmpId = 5 SET @BasicSal = 70000.00;
        ELSE IF @SalEmpId = 6 SET @BasicSal = 85000.00;
        ELSE IF @SalEmpId = 7 SET @BasicSal = 60000.00;
        ELSE IF @SalEmpId = 8 SET @BasicSal = 55000.00;
        ELSE IF @SalEmpId = 9 SET @BasicSal = 75000.00;
        ELSE IF @SalEmpId = 10 SET @BasicSal = 50000.00;
        ELSE IF @SalEmpId = 11 SET @BasicSal = 68000.00;
        ELSE IF @SalEmpId = 12 SET @BasicSal = 65000.00;
        ELSE IF @SalEmpId = 13 SET @BasicSal = 80000.00;
        ELSE IF @SalEmpId = 14 SET @BasicSal = 40000.00;

        DECLARE @Hra DECIMAL(18,2) = @BasicSal * 0.40;
        DECLARE @Da DECIMAL(18,2) = @BasicSal * 0.10;
        DECLARE @Ta DECIMAL(18,2) = 3000.00;
        DECLARE @Med DECIMAL(18,2) = 2500.00;
        DECLARE @Other DECIMAL(18,2) = 2500.00;
        DECLARE @Pf DECIMAL(18,2) = @BasicSal * 0.12;
        DECLARE @Pt DECIMAL(18,2) = 200.00;

        DECLARE @Gross DECIMAL(18,2) = @BasicSal + @Hra + @Da + @Ta + @Med + @Other;
        DECLARE @Net DECIMAL(18,2) = @Gross - (@Pf + @Pt);

        INSERT INTO SalaryStructure (EmployeeId, Basic, HRA, DA, TA, Medical, PF, ProfessionalTax, OtherAllowance, GrossSalary, NetSalary, EffectiveFrom, IsActive)
        VALUES (@SalEmpId, @BasicSal, @Hra, @Da, @Ta, @Med, @Pf, @Pt, @Other, @Gross, @Net, '2026-01-01', 1);
    END
    FETCH NEXT FROM emp_sal_cursor INTO @SalEmpId;
END

CLOSE emp_sal_cursor;
DEALLOCATE emp_sal_cursor;
GO

-- 7. SHIFT MASTER & EMPLOYEE ROSTERS
IF NOT EXISTS (SELECT 1 FROM ShiftMaster WHERE ShiftCode = 'SH-GEN')
    INSERT INTO ShiftMaster (ShiftName, ShiftCode, StartTime, EndTime, BreakMinutes, GraceMinutes, NightAllowance, IsActive, CreatedDate)
    VALUES ('General Shift', 'SH-GEN', '09:00:00', '18:00:00', 60, 15, 0.00, 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM ShiftMaster WHERE ShiftCode = 'SH-MORN')
    INSERT INTO ShiftMaster (ShiftName, ShiftCode, StartTime, EndTime, BreakMinutes, GraceMinutes, NightAllowance, IsActive, CreatedDate)
    VALUES ('Morning Shift', 'SH-MORN', '06:00:00', '15:00:00', 60, 10, 0.00, 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM ShiftMaster WHERE ShiftCode = 'SH-EVE')
    INSERT INTO ShiftMaster (ShiftName, ShiftCode, StartTime, EndTime, BreakMinutes, GraceMinutes, NightAllowance, IsActive, CreatedDate)
    VALUES ('Evening Shift', 'SH-EVE', '14:00:00', '23:00:00', 60, 10, 50.00, 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM ShiftMaster WHERE ShiftCode = 'SH-NGT')
    INSERT INTO ShiftMaster (ShiftName, ShiftCode, StartTime, EndTime, BreakMinutes, GraceMinutes, NightAllowance, IsActive, CreatedDate)
    VALUES ('Night Shift', 'SH-NGT', '22:00:00', '07:00:00', 60, 15, 120.00, 1, GETDATE());

-- Employee Roster Generation
DECLARE @MorningShift INT = (SELECT TOP 1 ShiftId FROM ShiftMaster WHERE ShiftName LIKE '%Morning%' OR ShiftName LIKE '%General%');
DECLARE @EveningShift INT = (SELECT TOP 1 ShiftId FROM ShiftMaster WHERE ShiftName LIKE '%Evening%');
DECLARE @NightShift INT = (SELECT TOP 1 ShiftId FROM ShiftMaster WHERE ShiftName LIKE '%Night%');
IF @MorningShift IS NULL SET @MorningShift = 1;
IF @EveningShift IS NULL SET @EveningShift = @MorningShift;
IF @NightShift IS NULL SET @NightShift = @MorningShift;

DECLARE @EmpCurId INT;
DECLARE @RosterDay DATE;
DECLARE @DayOffset INT;

DECLARE emp_cursor CURSOR FOR 
SELECT EmployeeId FROM Employee WHERE IsActive = 1;

OPEN emp_cursor;
FETCH NEXT FROM emp_cursor INTO @EmpCurId;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @DayOffset = -5;
    WHILE @DayOffset <= 7
    BEGIN
        SET @RosterDay = DATEADD(DAY, @DayOffset, CAST(GETDATE() AS DATE));
        DECLARE @IsWknd BIT = CASE WHEN DATEPART(WEEKDAY, @RosterDay) IN (1, 7) THEN 1 ELSE 0 END;
        DECLARE @AssignedShift INT = CASE 
            WHEN @EmpCurId % 3 = 0 THEN @EveningShift 
            WHEN @EmpCurId % 5 = 0 THEN @NightShift 
            ELSE @MorningShift 
        END;

        IF NOT EXISTS (SELECT 1 FROM EmployeeRoster WHERE EmployeeId = @EmpCurId AND RosterDate = @RosterDay)
        BEGIN
            INSERT INTO EmployeeRoster (EmployeeId, ShiftId, RosterDate, IsWeekend, Remarks, CreatedDate)
            VALUES (
                @EmpCurId, 
                @AssignedShift, 
                @RosterDay, 
                @IsWknd, 
                CASE WHEN @IsWknd = 1 THEN 'Scheduled Weekly Off' ELSE 'Standard Shift Assignment' END, 
                GETDATE()
            );
        END
        SET @DayOffset = @DayOffset + 1;
    END
    FETCH NEXT FROM emp_cursor INTO @EmpCurId;
END

CLOSE emp_cursor;
DEALLOCATE emp_cursor;
GO

-- 8. SHIFT SWAP REQUESTS
DECLARE @EmpDev1 INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP004');
DECLARE @EmpDev2 INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP005');
DECLARE @EmpQA1 INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP008');
DECLARE @EmpQA2 INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP009');
DECLARE @MgrId INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP003');

IF @EmpDev1 IS NOT NULL AND @EmpDev2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ShiftSwapRequest WHERE RequesterEmployeeId = @EmpDev1 AND RequestedEmployeeId = @EmpDev2)
    INSERT INTO ShiftSwapRequest (RequesterEmployeeId, RequestedEmployeeId, RosterDate, Reason, Status, ReviewedBy, CreatedDate)
    VALUES (@EmpDev1, @EmpDev2, DATEADD(DAY, 2, CAST(GETDATE() AS DATE)), 'Family medical appointment in the morning slot', 'Approved', @MgrId, GETDATE());

IF @EmpQA1 IS NOT NULL AND @EmpQA2 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ShiftSwapRequest WHERE RequesterEmployeeId = @EmpQA1 AND RequestedEmployeeId = @EmpQA2)
    INSERT INTO ShiftSwapRequest (RequesterEmployeeId, RequestedEmployeeId, RosterDate, Reason, Status, ReviewedBy, CreatedDate)
    VALUES (@EmpQA1, @EmpQA2, DATEADD(DAY, 4, CAST(GETDATE() AS DATE)), 'Attending AWS re:Invent regional workshop', 'Pending', NULL, GETDATE());

IF @EmpDev2 IS NOT NULL AND @EmpDev1 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ShiftSwapRequest WHERE RequesterEmployeeId = @EmpDev2 AND RequestedEmployeeId = @EmpDev1)
    INSERT INTO ShiftSwapRequest (RequesterEmployeeId, RequestedEmployeeId, RosterDate, Reason, Status, ReviewedBy, CreatedDate)
    VALUES (@EmpDev2, @EmpDev1, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 'Personal errand clash with evening roster', 'Rejected', @MgrId, DATEADD(DAY, -3, GETDATE()));
GO

-- 9. ATTENDANCE LOGS
DECLARE @AttDayOffset INT = 0;
WHILE @AttDayOffset < 10
BEGIN
    DECLARE @AttDate DATE = DATEADD(DAY, -@AttDayOffset, CAST(GETDATE() AS DATE));
    IF DATEPART(WEEKDAY, @AttDate) NOT IN (1, 7)
    BEGIN
        DECLARE att_emp_cursor CURSOR FOR SELECT EmployeeId FROM Employee WHERE IsActive = 1;
        DECLARE @AEmpId INT;
        OPEN att_emp_cursor;
        FETCH NEXT FROM att_emp_cursor INTO @AEmpId;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM Attendance WHERE EmployeeId = @AEmpId AND AttendanceDate = @AttDate)
            BEGIN
                DECLARE @MinVar INT = (@AEmpId * 7 + @AttDayOffset * 3) % 45;
                DECLARE @CheckInTime TIME = DATEADD(MINUTE, @MinVar, '08:50:00');
                DECLARE @CheckOutTime TIME = DATEADD(MINUTE, @MinVar + 480 + ((@AEmpId * 5) % 30), '08:50:00');
                DECLARE @Status VARCHAR(20) = CASE WHEN @MinVar > 35 THEN 'Late' ELSE 'Present' END;
                DECLARE @LateMins INT = CASE WHEN @MinVar > 35 THEN @MinVar - 30 ELSE 0 END;
                DECLARE @WorkHours DECIMAL(5,2) = 8.50 + ((@AEmpId % 3) * 0.25);

                INSERT INTO Attendance (EmployeeId, AttendanceDate, CheckIn, CheckOut, WorkingHours, LateMinutes, Status, Remarks, CreatedDate)
                VALUES (@AEmpId, @AttDate, @CheckInTime, @CheckOutTime, @WorkHours, @LateMins, @Status, 'Biometric badge reader verified', GETDATE());
            END
            FETCH NEXT FROM att_emp_cursor INTO @AEmpId;
        END

        CLOSE att_emp_cursor;
        DEALLOCATE att_emp_cursor;
    END

    SET @AttDayOffset = @AttDayOffset + 1;
END
GO

-- 10. LEAVE ALLOCATIONS & APPLICATIONS
DECLARE l_type_cursor CURSOR FOR SELECT LeaveTypeId, MaxDays FROM LeaveType WHERE IsActive = 1;
DECLARE @LtId INT, @MaxD INT;

OPEN l_type_cursor;
FETCH NEXT FROM l_type_cursor INTO @LtId, @MaxD;

WHILE @@FETCH_STATUS = 0
BEGIN
    DECLARE l_emp_cursor CURSOR FOR SELECT EmployeeId FROM Employee WHERE IsActive = 1;
    DECLARE @LeEmpId INT;
    OPEN l_emp_cursor;
    FETCH NEXT FROM l_emp_cursor INTO @LeEmpId;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM LeaveAllocation WHERE EmployeeId = @LeEmpId AND LeaveTypeId = @LtId AND Year = 2026)
        BEGIN
            DECLARE @UsedD DECIMAL(5,2) = CASE WHEN @LeEmpId IN (4, 7, 8) AND @LtId = 1 THEN 2.0 ELSE 0.0 END;
            DECLARE @RemD DECIMAL(5,2) = @MaxD - @UsedD;
            INSERT INTO LeaveAllocation (EmployeeId, LeaveTypeId, Year, TotalDays, UsedDays, RemainingDays, CreatedDate)
            VALUES (@LeEmpId, @LtId, 2026, @MaxD, @UsedD, @RemD, GETDATE());
        END
        FETCH NEXT FROM l_emp_cursor INTO @LeEmpId;
    END

    CLOSE l_emp_cursor;
    DEALLOCATE l_emp_cursor;

    FETCH NEXT FROM l_type_cursor INTO @LtId, @MaxD;
END

CLOSE l_type_cursor;
DEALLOCATE l_type_cursor;

-- Leave Applications
DECLARE @CasualLt INT = (SELECT TOP 1 LeaveTypeId FROM LeaveType WHERE LeaveName = 'Casual Leave');
DECLARE @SickLt INT = (SELECT TOP 1 LeaveTypeId FROM LeaveType WHERE LeaveName = 'Sick Leave');
DECLARE @PrivLt INT = (SELECT TOP 1 LeaveTypeId FROM LeaveType WHERE LeaveName = 'Privilege Leave');

IF NOT EXISTS (SELECT 1 FROM LeaveApplication WHERE EmployeeId = 4 AND FromDate = '2026-10-12')
    INSERT INTO LeaveApplication (EmployeeId, LeaveTypeId, FromDate, ToDate, TotalDays, IsHalfDay, Reason, ApprovedBy, Status, AppliedDate, ApprovedDate)
    VALUES (4, @SickLt, '2026-10-12', '2026-10-13', 2.0, 0, 'Severe viral fever and clinical medical rest prescribed', 3, 'Approved', '2026-10-11', '2026-10-11');

IF NOT EXISTS (SELECT 1 FROM LeaveApplication WHERE EmployeeId = 5 AND FromDate = '2026-11-15')
    INSERT INTO LeaveApplication (EmployeeId, LeaveTypeId, FromDate, ToDate, TotalDays, IsHalfDay, Reason, ApprovedBy, Status, AppliedDate)
    VALUES (5, @CasualLt, '2026-11-15', '2026-11-16', 2.0, 0, 'Attending brother wedding reception out of town', NULL, 'Pending', '2026-11-01');

IF NOT EXISTS (SELECT 1 FROM LeaveApplication WHERE EmployeeId = 8 AND FromDate = '2026-12-22')
    INSERT INTO LeaveApplication (EmployeeId, LeaveTypeId, FromDate, ToDate, TotalDays, IsHalfDay, Reason, ApprovedBy, Status, AppliedDate, ApprovedDate)
    VALUES (8, @PrivLt, '2026-12-22', '2026-12-29', 6.0, 0, 'Annual holiday vacation planned with family', 3, 'Approved', '2026-10-20', '2026-10-22');
GO

-- 11. PAYROLL
DECLARE @PayMonth INT = 9;
WHILE @PayMonth <= 10
BEGIN
    DECLARE pay_cursor CURSOR FOR 
    SELECT e.EmployeeId, s.GrossSalary, s.NetSalary, (s.PF + s.ProfessionalTax) AS Deductions
    FROM Employee e
    INNER JOIN SalaryStructure s ON e.EmployeeId = s.EmployeeId
    WHERE e.IsActive = 1;

    DECLARE @PEmpId INT, @PGross DECIMAL(18,2), @PNet DECIMAL(18,2), @PDeduc DECIMAL(18,2);
    OPEN pay_cursor;
    FETCH NEXT FROM pay_cursor INTO @PEmpId, @PGross, @PNet, @PDeduc;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM Payroll WHERE EmployeeId = @PEmpId AND PayrollMonth = @PayMonth AND PayrollYear = 2026)
        BEGIN
            INSERT INTO Payroll (EmployeeId, PayrollMonth, PayrollYear, TotalWorkingDays, PresentDays, AbsentDays, Leaves, GrossSalary, Deductions, NetSalary, GeneratedDate, Status, PaymentDate, GeneratedBy)
            VALUES (@PEmpId, @PayMonth, 2026, 30, 28.0, 0.0, 2.0, @PGross, @PDeduc, @PNet, '2026-10-01', 'Paid', '2026-10-05', 2);
        END
        FETCH NEXT FROM pay_cursor INTO @PEmpId, @PGross, @PNet, @PDeduc;
    END

    CLOSE pay_cursor;
    DEALLOCATE pay_cursor;

    SET @PayMonth = @PayMonth + 1;
END
GO

-- 12. EXPENSE CATEGORIES & CLAIMS
IF NOT EXISTS (SELECT 1 FROM ExpenseCategory WHERE CategoryName = 'Travel & Airfare')
    INSERT INTO ExpenseCategory (CategoryName, Description, MaxLimit, IsReceiptRequired, IsActive)
    VALUES ('Travel & Airfare', 'Flight, train, and regional intercity travel tickets', 1500.00, 1, 1);

IF NOT EXISTS (SELECT 1 FROM ExpenseCategory WHERE CategoryName = 'Food & Meals')
    INSERT INTO ExpenseCategory (CategoryName, Description, MaxLimit, IsReceiptRequired, IsActive)
    VALUES ('Food & Meals', 'Client dinners and late evening project meals', 200.00, 1, 1);

IF NOT EXISTS (SELECT 1 FROM ExpenseCategory WHERE CategoryName = 'Certifications & Training')
    INSERT INTO ExpenseCategory (CategoryName, Description, MaxLimit, IsReceiptRequired, IsActive)
    VALUES ('Certifications & Training', 'Professional exam fees, online learning courses, books', 600.00, 1, 1);

IF NOT EXISTS (SELECT 1 FROM ExpenseCategory WHERE CategoryName = 'Hardware & Peripherals')
    INSERT INTO ExpenseCategory (CategoryName, Description, MaxLimit, IsReceiptRequired, IsActive)
    VALUES ('Hardware & Peripherals', 'Keyboards, ergonomic mice, monitors, headsets', 350.00, 1, 1);

DECLARE @CatTravel INT = (SELECT TOP 1 ExpenseCategoryId FROM ExpenseCategory WHERE CategoryName LIKE '%Travel%');
DECLARE @CatMeals INT = (SELECT TOP 1 ExpenseCategoryId FROM ExpenseCategory WHERE CategoryName LIKE '%Food%' OR CategoryName LIKE '%Meal%');
DECLARE @CatNet INT = (SELECT TOP 1 ExpenseCategoryId FROM ExpenseCategory WHERE CategoryName LIKE '%Internet%' OR CategoryName LIKE '%Utility%');
DECLARE @CatTrain INT = (SELECT TOP 1 ExpenseCategoryId FROM ExpenseCategory WHERE CategoryName LIKE '%Certification%' OR CategoryName LIKE '%Training%');
DECLARE @CatOffice INT = (SELECT TOP 1 ExpenseCategoryId FROM ExpenseCategory WHERE CategoryName LIKE '%Stationery%' OR CategoryName LIKE '%Office%');

DECLARE @E1 INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP004');
DECLARE @E2 INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP005');
DECLARE @E3 INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP007');
DECLARE @E4 INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP008');
DECLARE @ApprMgr INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP003');

IF @E1 IS NOT NULL AND @CatTravel IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ExpenseClaim WHERE EmployeeId = @E1 AND Amount = 340.50)
    INSERT INTO ExpenseClaim (EmployeeId, ExpenseCategoryId, ClaimDate, Amount, Description, ReceiptPath, Status, ApprovedBy, ApprovedDate, Remarks, CreatedDate)
    VALUES (@E1, @CatTravel, DATEADD(DAY, -15, CAST(GETDATE() AS DATE)), 340.50, 'Flight taxi & client onsite transport for NYC release kickoff', '/uploads/receipts/taxi_nyc_01.pdf', 'Approved', @ApprMgr, DATEADD(DAY, -13, GETDATE()), 'Receipt verified against Uber business logs', DATEADD(DAY, -15, GETDATE()));

IF @E2 IS NOT NULL AND @CatNet IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ExpenseClaim WHERE EmployeeId = @E2 AND Amount = 75.00)
    INSERT INTO ExpenseClaim (EmployeeId, ExpenseCategoryId, ClaimDate, Amount, Description, ReceiptPath, Status, ApprovedBy, ApprovedDate, Remarks, CreatedDate)
    VALUES (@E2, @CatNet, DATEADD(DAY, -10, CAST(GETDATE() AS DATE)), 75.00, 'Monthly 1Gbps Fiber home office internet reimbursement', '/uploads/receipts/fiber_bill_oct.pdf', 'Approved', @ApprMgr, DATEADD(DAY, -8, GETDATE()), 'Standard WFH monthly bandwidth allowance', DATEADD(DAY, -10, GETDATE()));

IF @E3 IS NOT NULL AND @CatTrain IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ExpenseClaim WHERE EmployeeId = @E3 AND Amount = 375.00)
    INSERT INTO ExpenseClaim (EmployeeId, ExpenseCategoryId, ClaimDate, Amount, Description, ReceiptPath, Status, ApprovedBy, ApprovedDate, Remarks, CreatedDate)
    VALUES (@E3, @CatTrain, DATEADD(DAY, -5, CAST(GETDATE() AS DATE)), 375.00, 'Certified Kubernetes Administrator (CKA) exam voucher', '/uploads/receipts/linux_foundation_cka.pdf', 'Approved', @ApprMgr, DATEADD(DAY, -3, GETDATE()), 'Approved per annual upskilling budget policy', DATEADD(DAY, -5, GETDATE()));

IF @E4 IS NOT NULL AND @CatMeals IS NOT NULL AND NOT EXISTS (SELECT 1 FROM ExpenseClaim WHERE EmployeeId = @E4 AND Amount = 128.40)
    INSERT INTO ExpenseClaim (EmployeeId, ExpenseCategoryId, ClaimDate, Amount, Description, ReceiptPath, Status, ApprovedBy, ApprovedDate, Remarks, CreatedDate)
    VALUES (@E4, @CatMeals, DATEADD(DAY, -2, CAST(GETDATE() AS DATE)), 128.40, 'Working team lunch during Production Release Deployment', '/uploads/receipts/team_lunch_q3.pdf', 'Pending', NULL, NULL, 'Pending manager review', DATEADD(DAY, -2, GETDATE()));
GO

-- 13. ASSETS & ASSET ALLOCATIONS
DECLARE @CatLaptop INT = (SELECT TOP 1 AssetCategoryId FROM AssetCategory WHERE CategoryName LIKE '%Laptop%');
DECLARE @CatMonitor INT = (SELECT TOP 1 AssetCategoryId FROM AssetCategory WHERE CategoryName LIKE '%Monitor%' OR CategoryName LIKE '%Display%');
DECLARE @CatAudio INT = (SELECT TOP 1 AssetCategoryId FROM AssetCategory WHERE CategoryName LIKE '%Headphone%' OR CategoryName LIKE '%Audio%' OR CategoryName LIKE '%Peripheral%');

IF @CatLaptop IS NULL SET @CatLaptop = (SELECT TOP 1 AssetCategoryId FROM AssetCategory);
IF @CatMonitor IS NULL SET @CatMonitor = @CatLaptop;
IF @CatAudio IS NULL SET @CatAudio = @CatLaptop;

IF NOT EXISTS (SELECT 1 FROM Asset WHERE AssetTag = 'AST-LPT-001')
    INSERT INTO Asset (AssetCategoryId, AssetTag, AssetName, SerialNumber, Manufacturer, Model, PurchaseDate, WarrantyExpiryDate, Status, Condition, IsActive, CreatedDate)
    VALUES (@CatLaptop, 'AST-LPT-001', 'MacBook Pro 16" M3 Max 64GB', 'C02G90XXMD6R', 'Apple', 'MacBook Pro 16 (2024)', '2024-03-15', '2027-03-15', 'Allocated', 'Excellent', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Asset WHERE AssetTag = 'AST-LPT-002')
    INSERT INTO Asset (AssetCategoryId, AssetTag, AssetName, SerialNumber, Manufacturer, Model, PurchaseDate, WarrantyExpiryDate, Status, Condition, IsActive, CreatedDate)
    VALUES (@CatLaptop, 'AST-LPT-002', 'Dell XPS 15 9530 Core i9 32GB', 'DLXPS-88741-K', 'Dell', 'XPS 15 (2023)', '2023-11-10', '2026-11-10', 'Allocated', 'Good', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Asset WHERE AssetTag = 'AST-LPT-003')
    INSERT INTO Asset (AssetCategoryId, AssetTag, AssetName, SerialNumber, Manufacturer, Model, PurchaseDate, WarrantyExpiryDate, Status, Condition, IsActive, CreatedDate)
    VALUES (@CatLaptop, 'AST-LPT-003', 'Lenovo ThinkPad X1 Carbon Gen 11', 'LNV-TP-99214', 'Lenovo', 'ThinkPad X1 Gen 11', '2024-01-20', '2027-01-20', 'Allocated', 'Excellent', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Asset WHERE AssetTag = 'AST-MON-001')
    INSERT INTO Asset (AssetCategoryId, AssetTag, AssetName, SerialNumber, Manufacturer, Model, PurchaseDate, WarrantyExpiryDate, Status, Condition, IsActive, CreatedDate)
    VALUES (@CatMonitor, 'AST-MON-001', 'LG UltraFine 27" 4K UHD USB-C', 'LG27-991204', 'LG Electronics', '27UK850-W', '2024-02-01', '2027-02-01', 'Allocated', 'Excellent', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Asset WHERE AssetTag = 'AST-AUD-001')
    INSERT INTO Asset (AssetCategoryId, AssetTag, AssetName, SerialNumber, Manufacturer, Model, PurchaseDate, WarrantyExpiryDate, Status, Condition, IsActive, CreatedDate)
    VALUES (@CatAudio, 'AST-AUD-001', 'Jabra Evolve2 75 Wireless ANC Headset', 'JBR-EV2-55321', 'Jabra', 'Evolve2 75', '2024-04-12', '2026-04-12', 'Allocated', 'Good', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM Asset WHERE AssetTag = 'AST-LPT-004')
    INSERT INTO Asset (AssetCategoryId, AssetTag, AssetName, SerialNumber, Manufacturer, Model, PurchaseDate, WarrantyExpiryDate, Status, Condition, IsActive, CreatedDate)
    VALUES (@CatLaptop, 'AST-LPT-004', 'MacBook Air 15" M3 16GB', 'C02H11KKLM90', 'Apple', 'MacBook Air 15 (2024)', '2024-06-01', '2027-06-01', 'Available', 'New', 1, GETDATE());

-- Asset Allocations
DECLARE @Ast1 INT = (SELECT TOP 1 AssetId FROM Asset WHERE AssetTag = 'AST-LPT-001');
DECLARE @Ast2 INT = (SELECT TOP 1 AssetId FROM Asset WHERE AssetTag = 'AST-LPT-002');
DECLARE @Ast3 INT = (SELECT TOP 1 AssetId FROM Asset WHERE AssetTag = 'AST-LPT-003');
DECLARE @Ast4 INT = (SELECT TOP 1 AssetId FROM Asset WHERE AssetTag = 'AST-MON-001');
DECLARE @Ast5 INT = (SELECT TOP 1 AssetId FROM Asset WHERE AssetTag = 'AST-AUD-001');

DECLARE @EmpDevSenior INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP004');
DECLARE @EmpDevLead INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP005');
DECLARE @EmpQAStaff INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP008');

IF @Ast1 IS NOT NULL AND @EmpDevSenior IS NOT NULL AND NOT EXISTS (SELECT 1 FROM AssetAllocation WHERE AssetId = @Ast1)
    INSERT INTO AssetAllocation (AssetId, EmployeeId, AllocatedDate, ReturnedDate, Status, AllocationNotes, ReturnNotes, CreatedDate)
    VALUES (@Ast1, @EmpDevSenior, '2024-03-20', NULL, 'Allocated', 'Primary engineering workstation assigned during onboarding', NULL, GETDATE());

IF @Ast2 IS NOT NULL AND @EmpDevLead IS NOT NULL AND NOT EXISTS (SELECT 1 FROM AssetAllocation WHERE AssetId = @Ast2)
    INSERT INTO AssetAllocation (AssetId, EmployeeId, AllocatedDate, ReturnedDate, Status, AllocationNotes, ReturnNotes, CreatedDate)
    VALUES (@Ast2, @EmpDevLead, '2023-11-15', NULL, 'Allocated', 'Standard developer setup with docking peripherals', NULL, GETDATE());

IF @Ast3 IS NOT NULL AND @EmpQAStaff IS NOT NULL AND NOT EXISTS (SELECT 1 FROM AssetAllocation WHERE AssetId = @Ast3)
    INSERT INTO AssetAllocation (AssetId, EmployeeId, AllocatedDate, ReturnedDate, Status, AllocationNotes, ReturnNotes, CreatedDate)
    VALUES (@Ast3, @EmpQAStaff, '2024-01-25', NULL, 'Allocated', 'Assigned for test automation orchestration and CI runners', NULL, GETDATE());

IF @Ast4 IS NOT NULL AND @EmpDevSenior IS NOT NULL AND NOT EXISTS (SELECT 1 FROM AssetAllocation WHERE AssetId = @Ast4)
    INSERT INTO AssetAllocation (AssetId, EmployeeId, AllocatedDate, ReturnedDate, Status, AllocationNotes, ReturnNotes, CreatedDate)
    VALUES (@Ast4, @EmpDevSenior, '2024-03-20', NULL, 'Allocated', 'Dual-monitor setup for IDE workspace', NULL, GETDATE());

IF @Ast5 IS NOT NULL AND @EmpQAStaff IS NOT NULL AND NOT EXISTS (SELECT 1 FROM AssetAllocation WHERE AssetId = @Ast5)
    INSERT INTO AssetAllocation (AssetId, EmployeeId, AllocatedDate, ReturnedDate, Status, AllocationNotes, ReturnNotes, CreatedDate)
    VALUES (@Ast5, @EmpQAStaff, '2024-04-15', NULL, 'Allocated', 'Noise-canceling headset for client demos and daily standups', NULL, GETDATE());
GO

-- 14. ATS: JOB OPENINGS, CANDIDATES & INTERVIEWS
DECLARE @DeptIT INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Information Technology');
DECLARE @DeptQA INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Quality Assurance & Testing');
DECLARE @DeptFin INT = (SELECT TOP 1 DepartmentId FROM Department WHERE DepartmentName = 'Finance');

DECLARE @DesigDevOps INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'DevOps & SRE Specialist');
DECLARE @DesigQA INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'QA Automation Engineer');
DECLARE @DesigFin INT = (SELECT TOP 1 DesignationId FROM Designation WHERE DesignationName = 'Financial Analyst');

IF NOT EXISTS (SELECT 1 FROM JobOpening WHERE Title = 'QA Automation Lead')
    INSERT INTO JobOpening (Title, DepartmentId, DesignationId, Location, JobType, ExperienceYears, OpenPositions, Description, Requirements, Status, CreatedDate)
    VALUES ('QA Automation Lead', @DeptQA, @DesigQA, 'San Francisco / Hybrid', 'FullTime', '4-7 Years', 2, 'Lead end-to-end testing across web and microservice platforms', 'Playwright, Cypress, CI/CD pipelines, k6 load testing', 'Open', GETDATE());

IF NOT EXISTS (SELECT 1 FROM JobOpening WHERE Title = 'Senior DevOps & Platform Engineer')
    INSERT INTO JobOpening (Title, DepartmentId, DesignationId, Location, JobType, ExperienceYears, OpenPositions, Description, Requirements, Status, CreatedDate)
    VALUES ('Senior DevOps & Platform Engineer', @DeptIT, @DesigDevOps, 'Austin / Remote', 'FullTime', '5-8 Years', 1, 'Scale Kubernetes, Terraform IaC, and zero-trust networking', 'AWS/Azure, Terraform, Docker, ArgoCD, Prometheus', 'Open', GETDATE());

IF NOT EXISTS (SELECT 1 FROM JobOpening WHERE Title = 'Corporate Financial Analyst')
    INSERT INTO JobOpening (Title, DepartmentId, DesignationId, Location, JobType, ExperienceYears, OpenPositions, Description, Requirements, Status, CreatedDate)
    VALUES ('Corporate Financial Analyst', @DeptFin, @DesigFin, 'New York Hub', 'FullTime', '3-5 Years', 1, 'Manage corporate financial planning, budget variance, and investor reporting', 'Financial modeling, Excel, NetSuite, SQL reporting', 'Open', GETDATE());

-- Candidates
DECLARE @JobDev INT = (SELECT TOP 1 JobId FROM JobOpening WHERE Title LIKE '%Full-Stack%' OR Title LIKE '%Developer%' OR Title LIKE '%Engineer%');
DECLARE @JobQA INT = (SELECT TOP 1 JobId FROM JobOpening WHERE Title LIKE '%QA%' OR Title LIKE '%Analyst%');
IF @JobDev IS NULL SET @JobDev = 1;
IF @JobQA IS NULL SET @JobQA = @JobDev;

IF NOT EXISTS (SELECT 1 FROM Candidate WHERE Email = 'elena.rostova@techmail.com')
    INSERT INTO Candidate (JobId, FullName, Email, Phone, ResumeUrl, Stage, Rating, ExpectedSalary, NoticePeriodDays, Notes, CreatedDate)
    VALUES (@JobDev, 'Elena Rostova', 'elena.rostova@techmail.com', '+1-415-555-8812', '/uploads/resumes/elena_rostova_cv.pdf', 'Interview', 5, 125000.00, 30, 'Strong React 19, TypeScript, .NET 10, and distributed system design skills', GETDATE());

IF NOT EXISTS (SELECT 1 FROM Candidate WHERE Email = 'marcus.vance@inbox.io')
    INSERT INTO Candidate (JobId, FullName, Email, Phone, ResumeUrl, Stage, Rating, ExpectedSalary, NoticePeriodDays, Notes, CreatedDate)
    VALUES (@JobDev, 'Marcus Vance', 'marcus.vance@inbox.io', '+1-212-555-4421', '/uploads/resumes/marcus_vance_cv.pdf', 'Offered', 5, 130000.00, 15, 'Ex-Stripe engineer. Offer letter dispatched with stock grant', GETDATE());

IF NOT EXISTS (SELECT 1 FROM Candidate WHERE Email = 'priya.patel@devportal.net')
    INSERT INTO Candidate (JobId, FullName, Email, Phone, ResumeUrl, Stage, Rating, ExpectedSalary, NoticePeriodDays, Notes, CreatedDate)
    VALUES (@JobQA, 'Priya Patel', 'priya.patel@devportal.net', '+1-512-555-9033', '/uploads/resumes/priya_patel_cv.pdf', 'Interview', 4, 85000.00, 30, 'Extensive Playwright test automation experience and CI integration', GETDATE());

-- Candidate Interviews
DECLARE @CandElena INT = (SELECT TOP 1 CandidateId FROM Candidate WHERE Email = 'elena.rostova@techmail.com');
DECLARE @CandMarcus INT = (SELECT TOP 1 CandidateId FROM Candidate WHERE Email = 'marcus.vance@inbox.io');

DECLARE @InterviewerTech INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP004');
DECLARE @InterviewerMgr INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP003');

IF @CandElena IS NOT NULL AND @InterviewerTech IS NOT NULL AND NOT EXISTS (SELECT 1 FROM CandidateInterview WHERE CandidateId = @CandElena AND RoundNumber = 1)
    INSERT INTO CandidateInterview (CandidateId, InterviewerId, RoundNumber, InterviewDate, Feedback, Rating, Status, CreatedDate)
    VALUES (@CandElena, @InterviewerTech, 1, DATEADD(DAY, -4, GETDATE()), 'Exceptional coding score (100%). Solved complex async streaming and caching challenges cleanly.', 5, 'Completed', DATEADD(DAY, -5, GETDATE()));

IF @CandElena IS NOT NULL AND @InterviewerMgr IS NOT NULL AND NOT EXISTS (SELECT 1 FROM CandidateInterview WHERE CandidateId = @CandElena AND RoundNumber = 2)
    INSERT INTO CandidateInterview (CandidateId, InterviewerId, RoundNumber, InterviewDate, Feedback, Rating, Status, CreatedDate)
    VALUES (@CandElena, @InterviewerMgr, 2, DATEADD(DAY, -1, GETDATE()), 'Great architectural depth, high ownership, demonstrated strong communication with product managers.', 5, 'Completed', DATEADD(DAY, -2, GETDATE()));

IF @CandMarcus IS NOT NULL AND @InterviewerTech IS NOT NULL AND NOT EXISTS (SELECT 1 FROM CandidateInterview WHERE CandidateId = @CandMarcus AND RoundNumber = 1)
    INSERT INTO CandidateInterview (CandidateId, InterviewerId, RoundNumber, InterviewDate, Feedback, Rating, Status, CreatedDate)
    VALUES (@CandMarcus, @InterviewerTech, 1, DATEADD(DAY, -10, GETDATE()), 'Mastery in high-throughput message brokers and resilient microservices. Top candidate.', 5, 'Completed', DATEADD(DAY, -12, GETDATE()));
GO

-- 15. DOCUMENT TEMPLATES & EMPLOYEE DOCUMENTS
IF NOT EXISTS (SELECT 1 FROM DocumentTemplate WHERE TemplateCode = 'OFFER_LTR')
    INSERT INTO DocumentTemplate (TemplateName, TemplateCode, Subject, BodyTemplate, IsActive, CreatedDate)
    VALUES ('Employment Offer Letter', 'OFFER_LTR', 'Formal Employment Offer - {{CompanyName}}', 
    'Dear {{CandidateName}},\n\nWe are delighted to extend an offer of employment for the position of {{Designation}} at {{CompanyName}}.\n\nYour starting annual compensation will be {{Salary}}, reporting to {{ManagerName}}.\n\nWelcome aboard!\nHR Department', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM DocumentTemplate WHERE TemplateCode = 'NDA_AGMT')
    INSERT INTO DocumentTemplate (TemplateName, TemplateCode, Subject, BodyTemplate, IsActive, CreatedDate)
    VALUES ('Proprietary Information & NDA', 'NDA_AGMT', 'Employee Non-Disclosure Agreement - {{EmployeeName}}',
    'This Agreement confirms that {{EmployeeName}} agrees to safeguard all confidential intellectual property, codebases, and customer records of {{CompanyName}} during and after employment tenure.', 1, GETDATE());

IF NOT EXISTS (SELECT 1 FROM DocumentTemplate WHERE TemplateCode = 'RELIEVE_LTR')
    INSERT INTO DocumentTemplate (TemplateName, TemplateCode, Subject, BodyTemplate, IsActive, CreatedDate)
    VALUES ('Service Relieving & Experience Certificate', 'RELIEVE_LTR', 'Relieving Letter and Service Certificate - {{EmployeeName}}',
    'To Whom It May Concern,\n\nThis is to certify that {{EmployeeName}} was employed with {{CompanyName}} from {{JoiningDate}} to {{RelievingDate}} as {{Designation}}.\n\nWe wish them all the best in future endeavors.', 1, GETDATE());

-- Employee Documents
DECLARE @Emp4 INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP004');
DECLARE @Emp5 INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP005');
DECLARE @HRVerifier INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP002');

IF @Emp4 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM EmployeeDocument WHERE EmployeeId = @Emp4 AND DocumentType = 'Passport')
    INSERT INTO EmployeeDocument (EmployeeId, DocumentType, Title, FilePath, UploadedDate, IsVerified, VerifiedBy)
    VALUES (@Emp4, 'Passport', 'Government Passport Identity Verification', '/uploads/docs/emp004_passport.pdf', '2023-01-20', 1, @HRVerifier);

IF @Emp5 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM EmployeeDocument WHERE EmployeeId = @Emp5 AND DocumentType = 'OfferLetter')
    INSERT INTO EmployeeDocument (EmployeeId, DocumentType, Title, FilePath, UploadedDate, IsVerified, VerifiedBy)
    VALUES (@Emp5, 'OfferLetter', 'Signed Employment Offer & Acceptance', '/uploads/docs/emp005_signed_offer.pdf', '2023-05-10', 1, @HRVerifier);
GO

-- 16. PERFORMANCE MANAGEMENT (CYCLES, GOALS, APPRAISAL REVIEWS)
IF NOT EXISTS (SELECT 1 FROM AppraisalCycle WHERE CycleName = 'FY 2026 Annual Performance Review')
    INSERT INTO AppraisalCycle (CycleName, StartDate, EndDate, ReviewDeadline, Status, CreatedDate)
    VALUES ('FY 2026 Annual Performance Review', '2026-01-01', '2026-12-31', '2026-12-15', 'Active', GETDATE());

DECLARE @Cycle2026 INT = (SELECT TOP 1 CycleId FROM AppraisalCycle WHERE CycleName LIKE '%2026%' OR Status = 'Active');
IF @Cycle2026 IS NULL SET @Cycle2026 = 1;

DECLARE @DevSenior INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP004');
DECLARE @ManagerRole INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP003');

IF @DevSenior IS NOT NULL AND NOT EXISTS (SELECT 1 FROM EmployeeGoal WHERE EmployeeId = @DevSenior AND Title LIKE '%Microservices%')
    INSERT INTO EmployeeGoal (EmployeeId, CycleId, Title, Description, TargetMetric, ProgressPercent, Weightage, Status, CreatedDate)
    VALUES (@DevSenior, @Cycle2026, 'Migrate Core Services to .NET 10', 'Refactor backend APIs and upgrade ORM mappings with zero downtime', '100% services upgraded & benchmarked', 90, 35, 'In Progress', GETDATE());

IF @DevSenior IS NOT NULL AND NOT EXISTS (SELECT 1 FROM EmployeeGoal WHERE EmployeeId = @DevSenior AND Title LIKE '%Latency%')
    INSERT INTO EmployeeGoal (EmployeeId, CycleId, Title, Description, TargetMetric, ProgressPercent, Weightage, Status, CreatedDate)
    VALUES (@DevSenior, @Cycle2026, 'Optimize API Latency & Query Caching', 'Implement Redis distributed caching and tune SQL stored procedure indexes', 'p99 latency < 65ms across all endpoints', 100, 25, 'Completed', GETDATE());

IF @DevSenior IS NOT NULL AND @ManagerRole IS NOT NULL AND NOT EXISTS (SELECT 1 FROM AppraisalReview WHERE EmployeeId = @DevSenior AND CycleId = @Cycle2026)
    INSERT INTO AppraisalReview (CycleId, EmployeeId, ManagerId, SelfRating, SelfComments, ManagerRating, ManagerComments, FinalScore, PromotionRecommendation, Status, SubmittedDate, CompletedDate)
    VALUES (
        @Cycle2026, 
        @DevSenior, 
        @ManagerRole, 
        4.8, 
        'Spearheaded database optimization and reduced API latency by 45%. Led migration to modern React UI stack.',
        4.9, 
        'Exceptional engineering execution, proactive leadership, and stellar code craftsmanship.',
        4.85, 
        'Promote to Principal Software Architect', 
        'Completed', 
        DATEADD(DAY, -14, GETDATE()), 
        DATEADD(DAY, -7, GETDATE())
    );
GO

-- 17. ONBOARDING & RESIGNATIONS
DECLARE @NewEmp INT = (SELECT TOP 1 EmployeeId FROM Employee WHERE EmployeeCode = 'EMP010');
IF @NewEmp IS NOT NULL AND NOT EXISTS (SELECT 1 FROM EmployeeOnboarding WHERE EmployeeId = @NewEmp AND TaskId = 1)
BEGIN
    INSERT INTO EmployeeOnboarding (EmployeeId, TaskId, Status, CompletedDate, Notes)
    VALUES 
    (@NewEmp, 1, 'Completed', DATEADD(DAY, -19, GETDATE()), 'Google Workspace & GitHub SSO provisioned'),
    (@NewEmp, 2, 'Completed', DATEADD(DAY, -18, GETDATE()), 'Configured with BitLocker and enterprise MDM');
END

IF NOT EXISTS (SELECT 1 FROM ResignationRequest WHERE EmployeeId = 14)
BEGIN
    INSERT INTO ResignationRequest (EmployeeId, SubmissionDate, NoticePeriodDays, PreferredRelievingDate, ApprovedRelievingDate, Reason, Feedback, Status, ApprovedBy, ActionDate, Remarks, CreatedDate)
    VALUES (14, '2026-10-15', 30, '2026-11-15', '2026-11-15', 'Relocating to Europe to pursue Master of Science in Data Engineering', 'Grateful for the wonderful mentorship and engineering culture at the organization.', 'Approved', 3, '2026-10-17', 'Approved notice period. Knowledge transfer handover assigned to EMP009.', GETDATE());
END

DECLARE @Resign14 INT = (SELECT TOP 1 ResignationId FROM ResignationRequest WHERE EmployeeId = 14);
IF @Resign14 IS NOT NULL AND NOT EXISTS (SELECT 1 FROM FnFSettlement WHERE ResignationId = @Resign14)
BEGIN
    INSERT INTO FnFSettlement (ResignationId, EmployeeId, SettlementDate, LastWorkingDay, EarnedSalary, GratuityAmount, LeaveEncashmentAmount, NoticePayAmount, Deductions, NetPayable, Status, ProcessedBy, Remarks, CreatedDate)
    VALUES (@Resign14, 14, '2026-11-16', '2026-11-15', 26666.67, 0.00, 14200.00, 0.00, 1200.00, 39666.67, 'Processed', 2, 'All IT assets and security badges cleared. Clean handover verified.', GETDATE());
END
GO

-- 18. AUDIT & PERFORMANCE LOGS
IF NOT EXISTS (SELECT 1 FROM SystemAuditLog WHERE Action = 'SYSTEM_INIT_SEED')
BEGIN
    INSERT INTO SystemAuditLog (UserId, Action, EntityName, EntityId, Details, IpAddress, Timestamp)
    VALUES 
    (1, 'SYSTEM_INIT_SEED', 'DatabaseSeed', 'GLOBAL', 'Full real & dummy dataset seeded across 36 database tables successfully', '127.0.0.1', GETDATE()),
    (1, 'USER_LOGIN', 'Employee', '1', 'Super Admin logged in successfully to Enterprise HRMS portal', '192.168.1.100', DATEADD(MINUTE, -120, GETDATE())),
    (2, 'PAYROLL_PROCESSED', 'Payroll', '2026-10', 'Processed monthly payroll cycle for 14 active company employees', '192.168.1.105', DATEADD(HOUR, -24, GETDATE())),
    (3, 'LEAVE_APPROVED', 'LeaveApplication', '1', 'Approved Sick Leave application for John Doe (EMP004)', '192.168.1.112', DATEADD(HOUR, -48, GETDATE()));
END

IF NOT EXISTS (SELECT 1 FROM SPPerformanceLog)
BEGIN
    INSERT INTO SPPerformanceLog (ProcName, Action, Params, ExecutionTimeMS, CreatedDate)
    VALUES 
    ('sp_GetEmployeeDirectory', 'SELECT', 'BranchId=1, DepartmentId=NULL, Page=1', 14, DATEADD(MINUTE, -120, GETDATE())),
    ('sp_ProcessMonthlyPayroll', 'EXEC', 'Year=2026, Month=10, CompanyId=1', 142, DATEADD(MINUTE, -85, GETDATE())),
    ('sp_GetAttendanceSummary', 'SELECT', 'EmployeeId=4, Month=10, Year=2026', 8, DATEADD(MINUTE, -40, GETDATE())),
    ('sp_GetLeaveBalance', 'SELECT', 'EmployeeId=5, Year=2026', 6, DATEADD(MINUTE, -15, GETDATE()));
END

IF NOT EXISTS (SELECT 1 FROM SPErrorlog)
BEGIN
    INSERT INTO SPErrorlog (ErrorLine, ErrorMessage, ErrorNumber, ErrorProcedure, ErrorSeverity, ErrorState, CreatedDate)
    VALUES 
    (142, 'Violation of UNIQUE KEY constraint on Employee email verification duplicate catch', 2627, 'sp_RegisterCandidate', 14, 1, DATEADD(DAY, -3, GETDATE())),
    (88, 'Foreign key lookup timeout on external branch sync batch', 547, 'sp_SyncBranchOffices', 16, 1, DATEADD(DAY, -7, GETDATE()));
END
GO

PRINT '=======================================================';
PRINT 'HRMS All 36 Tables Demo Seed Completed Successfully!';
PRINT '=======================================================';
GO

