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

            SELECT SalaryId FROM SalaryStructure WHERE EmployeeId = @EmployeeId;
        END
        ELSE
        BEGIN
            INSERT INTO SalaryStructure (EmployeeId, Basic, HRA, DA, TA, Medical, PF, ProfessionalTax, OtherAllowance, GrossSalary, NetSalary, EffectiveFrom, IsActive)
            VALUES (@EmployeeId, ISNULL(@Basic, 0), ISNULL(@HRA, 0), ISNULL(@DA, 0), ISNULL(@TA, 0), ISNULL(@Medical, 0), ISNULL(@PF, 0), ISNULL(@ProfessionalTax, 0), ISNULL(@OtherAllowance, 0), @Gross, @Net, GETDATE(), 1);

            SELECT CAST(SCOPE_IDENTITY() AS INT) AS SalaryId;
        END
        RETURN;
    END

    -- 3. PROCESS MONTHLY PAYROLL
    IF @Action = 'PROCESS_MONTHLY'
    BEGIN
        DECLARE @TotalDaysInMonth INT = 30;
        IF @Month IN (1, 3, 5, 7, 8, 10, 12) SET @TotalDaysInMonth = 31;
        ELSE IF @Month = 2 SET @TotalDaysInMonth = 28;

        -- Iterate over all active employees with salary structures
        DECLARE emp_cursor CURSOR FOR
        SELECT e.EmployeeId, s.Basic, s.GrossSalary, s.PF, s.ProfessionalTax
        FROM Employee e
        INNER JOIN SalaryStructure s ON e.EmployeeId = s.EmployeeId
        WHERE e.IsActive = 1 AND (@BranchId IS NULL OR e.BranchId = @BranchId);

        DECLARE @CurEmpId INT, @CurBasic DECIMAL(18, 2), @CurGross DECIMAL(18, 2), @CurPF DECIMAL(18, 2), @CurPT DECIMAL(18, 2);

        OPEN emp_cursor;
        FETCH NEXT FROM emp_cursor INTO @CurEmpId, @CurBasic, @CurGross, @CurPF, @CurPT;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Calculate Attendance
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

            -- If employee has 0 recorded attendance, default to reasonable present days
            IF @PresentCount = 0 AND @LeaveCount = 0
                SET @PresentCount = @TotalDaysInMonth;

            DECLARE @AbsentCount DECIMAL(5, 2) = @TotalDaysInMonth - (@PresentCount + @LeaveCount);
            IF @AbsentCount < 0 SET @AbsentCount = 0;

            -- Loss of Pay (LOP) Deduction
            DECLARE @PerDaySalary DECIMAL(18, 2) = @CurBasic / @TotalDaysInMonth;
            DECLARE @LOPDeduction DECIMAL(18, 2) = @PerDaySalary * @AbsentCount;
            DECLARE @TotalDeductions DECIMAL(18, 2) = @CurPF + @CurPT + @LOPDeduction;
            DECLARE @NetSalary DECIMAL(18, 2) = @CurGross - @TotalDeductions;
            IF @NetSalary < 0 SET @NetSalary = 0;

            -- Upsert into Payroll
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

        SELECT 1 AS ProcessedCount;
        RETURN;
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
