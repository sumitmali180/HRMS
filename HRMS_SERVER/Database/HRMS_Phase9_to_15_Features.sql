-- ============================================================================
-- Enterprise HRMS — Phases 9 to 15 Database Schema & Stored Procedures
-- Database: HRMS
-- ============================================================================

USE [HRMS];
GO

-- ============================================================================
-- PHASE 9: EXPENSE CLAIMS & REIMBURSEMENTS
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ExpenseCategory]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ExpenseCategory](
        [ExpenseCategoryId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CategoryName] [nvarchar](100) NOT NULL UNIQUE,
        [Description] [nvarchar](250) NULL,
        [MaxLimit] [decimal](18,2) NOT NULL DEFAULT(0),
        [IsReceiptRequired] [bit] NOT NULL DEFAULT(1),
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE())
    );

    INSERT INTO [dbo].[ExpenseCategory] (CategoryName, Description, MaxLimit, IsReceiptRequired)
    VALUES 
    (N'Travel & Commute', N'Flights, trains, cabs, local business travel', 25000.00, 1),
    (N'Food & Per Diem', N'Client meals, team lunches, project per diem', 5000.00, 1),
    (N'Internet & Phone', N'Remote work internet and mobile reimbursements', 3000.00, 1),
    (N'Training & Certifications', N'Professional courses and conference tickets', 40000.00, 1),
    (N'Office Supplies & Hardware', N'Monitors, stationery, computer peripherals', 15000.00, 1),
    (N'Client Entertainment', N'Dinners, partner events, gifts', 10000.00, 1);
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ExpenseClaim]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ExpenseClaim](
        [ExpenseClaimId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL,
        [ExpenseCategoryId] [int] NOT NULL,
        [ClaimDate] [date] NOT NULL,
        [Amount] [decimal](18,2) NOT NULL,
        [Description] [nvarchar](500) NOT NULL,
        [ReceiptPath] [nvarchar](500) NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT('Pending'), -- Pending, Approved, Rejected, Paid
        [ApprovedBy] [int] NULL,
        [ApprovedDate] [datetime] NULL,
        [Remarks] [nvarchar](500) NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_ExpenseClaim_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId]),
        CONSTRAINT [FK_ExpenseClaim_Category] FOREIGN KEY([ExpenseCategoryId]) REFERENCES [dbo].[ExpenseCategory] ([ExpenseCategoryId])
    );
END
GO

-- ============================================================================
-- PHASE 10: ASSET & IT INVENTORY MANAGEMENT
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AssetCategory]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AssetCategory](
        [AssetCategoryId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CategoryName] [nvarchar](100) NOT NULL UNIQUE,
        [Description] [nvarchar](250) NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1)
    );

    INSERT INTO [dbo].[AssetCategory] (CategoryName, Description)
    VALUES 
    (N'Laptop / Workstation', N'Company laptops, MacBooks, developer desktops'),
    (N'Monitors & Displays', N'External monitors 24" - 34" and TV displays'),
    (N'Mobile Devices & Tablets', N'Test phones, iPads, tablets'),
    (N'Peripherals & Accessories', N'Keyboards, mice, docks, headsets'),
    (N'Security & Access Tokens', N'YubiKeys, smart cards, security dongles');
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Asset]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Asset](
        [AssetId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [AssetCategoryId] [int] NOT NULL,
        [AssetTag] [nvarchar](50) NOT NULL UNIQUE,
        [AssetName] [nvarchar](150) NOT NULL,
        [SerialNumber] [nvarchar](100) NULL,
        [Manufacturer] [nvarchar](100) NULL,
        [Model] [nvarchar](100) NULL,
        [PurchaseDate] [date] NULL,
        [WarrantyExpiryDate] [date] NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT('Available'), -- Available, Allocated, UnderRepair, Scrapped
        [Condition] [nvarchar](50) NOT NULL DEFAULT('New'), -- New, Good, Fair, Damaged
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_Asset_Category] FOREIGN KEY([AssetCategoryId]) REFERENCES [dbo].[AssetCategory] ([AssetCategoryId])
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AssetAllocation]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AssetAllocation](
        [AllocationId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [AssetId] [int] NOT NULL,
        [EmployeeId] [int] NOT NULL,
        [AllocatedDate] [date] NOT NULL DEFAULT(CAST(GETDATE() AS DATE)),
        [ReturnedDate] [date] NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT('Active'), -- Active, Returned
        [AllocationNotes] [nvarchar](500) NULL,
        [ReturnNotes] [nvarchar](500) NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_AssetAllocation_Asset] FOREIGN KEY([AssetId]) REFERENCES [dbo].[Asset] ([AssetId]),
        CONSTRAINT [FK_AssetAllocation_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId])
    );
END
GO

-- ============================================================================
-- PHASE 11: ONBOARDING & OFFBOARDING (EXIT / F&F)
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[OnboardingTask]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[OnboardingTask](
        [TaskId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [Title] [nvarchar](200) NOT NULL,
        [Department] [nvarchar](100) NOT NULL, -- IT, HR, Finance, Admin
        [AssignedRole] [nvarchar](50) NOT NULL,
        [Description] [nvarchar](500) NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1)
    );

    INSERT INTO [dbo].[OnboardingTask] (Title, Department, AssignedRole, Description)
    VALUES
    (N'Create Email & Slack Account', N'IT', N'IT Admin', N'Provision work email and access channels'),
    (N'Issue Laptop & Peripherals', N'IT', N'IT Admin', N'Handover laptop and register asset tag in inventory'),
    (N'Collect Government IDs & Tax Forms', N'HR', N'HR Admin', N'Upload PAN/SSN, Address proof, and bank mandate'),
    (N'Benefits & Provident Fund Enrollment', N'HR', N'HR Admin', N'Register in health insurance and PF portal'),
    (N'Bank Account Setup & Payroll Registry', N'Finance', N'Finance', N'Verify IFSC/routing and link salary account'),
    (N'Manager Welcome & Team Introduction', N'Department', N'Manager', N'1-on-1 welcome session and sprint onboarding');
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EmployeeOnboarding]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[EmployeeOnboarding](
        [OnboardingId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL,
        [TaskId] [int] NOT NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT('Pending'), -- Pending, InProgress, Completed
        [CompletedDate] [datetime] NULL,
        [Notes] [nvarchar](500) NULL,
        CONSTRAINT [FK_EmployeeOnboarding_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId]),
        CONSTRAINT [FK_EmployeeOnboarding_Task] FOREIGN KEY([TaskId]) REFERENCES [dbo].[OnboardingTask] ([TaskId])
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ResignationRequest]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ResignationRequest](
        [ResignationId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL,
        [SubmissionDate] [date] NOT NULL DEFAULT(CAST(GETDATE() AS DATE)),
        [NoticePeriodDays] [int] NOT NULL DEFAULT(30),
        [PreferredRelievingDate] [date] NOT NULL,
        [ApprovedRelievingDate] [date] NULL,
        [Reason] [nvarchar](500) NOT NULL,
        [Feedback] [nvarchar](1000) NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT('Pending'), -- Pending, Approved, Rejected, Withdrawn
        [ApprovedBy] [int] NULL,
        [ActionDate] [datetime] NULL,
        [Remarks] [nvarchar](500) NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_ResignationRequest_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId])
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[FnFSettlement]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[FnFSettlement](
        [SettlementId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [ResignationId] [int] NOT NULL,
        [EmployeeId] [int] NOT NULL,
        [SettlementDate] [date] NOT NULL DEFAULT(CAST(GETDATE() AS DATE)),
        [LastWorkingDay] [date] NOT NULL,
        [EarnedSalary] [decimal](18,2) NOT NULL DEFAULT(0),
        [GratuityAmount] [decimal](18,2) NOT NULL DEFAULT(0),
        [LeaveEncashmentAmount] [decimal](18,2) NOT NULL DEFAULT(0),
        [NoticePayAmount] [decimal](18,2) NOT NULL DEFAULT(0),
        [Deductions] [decimal](18,2) NOT NULL DEFAULT(0),
        [NetPayable] [decimal](18,2) NOT NULL DEFAULT(0),
        [Status] [nvarchar](50) NOT NULL DEFAULT('Draft'), -- Draft, Approved, Settled
        [ProcessedBy] [int] NULL,
        [Remarks] [nvarchar](500) NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_FnF_Resignation] FOREIGN KEY([ResignationId]) REFERENCES [dbo].[ResignationRequest] ([ResignationId]),
        CONSTRAINT [FK_FnF_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId])
    );
END
GO

-- ============================================================================
-- PHASE 12: SHIFT SCHEDULING & MULTI-SHIFT ROSTER MANAGEMENT
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ShiftMaster]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ShiftMaster](
        [ShiftId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [ShiftName] [nvarchar](100) NOT NULL UNIQUE,
        [ShiftCode] [nvarchar](20) NOT NULL UNIQUE,
        [StartTime] [time](7) NOT NULL,
        [EndTime] [time](7) NOT NULL,
        [BreakMinutes] [int] NOT NULL DEFAULT(60),
        [GraceMinutes] [int] NOT NULL DEFAULT(15),
        [NightAllowance] [decimal](18,2) NOT NULL DEFAULT(0),
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE())
    );

    INSERT INTO [dbo].[ShiftMaster] (ShiftName, ShiftCode, StartTime, EndTime, BreakMinutes, GraceMinutes, NightAllowance)
    VALUES
    (N'General Regular Shift', N'GEN', '09:00:00', '18:00:00', 60, 15, 0.00),
    (N'Morning Operations Shift', N'MOR', '06:00:00', '15:00:00', 45, 10, 200.00),
    (N'Evening Support Shift', N'EVE', '14:00:00', '23:00:00', 45, 10, 350.00),
    (N'Night Overdrive Shift', N'NIG', '22:00:00', '07:00:00', 60, 10, 750.00);
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EmployeeRoster]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[EmployeeRoster](
        [RosterId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL,
        [ShiftId] [int] NOT NULL,
        [RosterDate] [date] NOT NULL,
        [IsWeekend] [bit] NOT NULL DEFAULT(0),
        [Remarks] [nvarchar](250) NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [UQ_EmployeeRoster_EmpDate] UNIQUE ([EmployeeId], [RosterDate]),
        CONSTRAINT [FK_EmployeeRoster_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId]),
        CONSTRAINT [FK_EmployeeRoster_Shift] FOREIGN KEY([ShiftId]) REFERENCES [dbo].[ShiftMaster] ([ShiftId])
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ShiftSwapRequest]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[ShiftSwapRequest](
        [SwapId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [RequesterEmployeeId] [int] NOT NULL,
        [RequestedEmployeeId] [int] NOT NULL,
        [RosterDate] [date] NOT NULL,
        [Reason] [nvarchar](300) NOT NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT('Pending'), -- Pending, Approved, Rejected
        [ReviewedBy] [int] NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_ShiftSwap_Requester] FOREIGN KEY([RequesterEmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId]),
        CONSTRAINT [FK_ShiftSwap_Requested] FOREIGN KEY([RequestedEmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId])
    );
END
GO

-- ============================================================================
-- PHASE 13: PERFORMANCE APPRAISALS & OKR TRACKING (PMS)
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AppraisalCycle]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AppraisalCycle](
        [CycleId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CycleName] [nvarchar](150) NOT NULL UNIQUE,
        [StartDate] [date] NOT NULL,
        [EndDate] [date] NOT NULL,
        [ReviewDeadline] [date] NOT NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT('Active'), -- Upcoming, Active, Closed
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE())
    );

    INSERT INTO [dbo].[AppraisalCycle] (CycleName, StartDate, EndDate, ReviewDeadline, Status)
    VALUES
    (N'FY2026 Annual Performance Review', '2026-01-01', '2026-12-31', '2026-12-15', 'Active'),
    (N'Q4 FY2026 OKR Evaluation', '2026-10-01', '2026-12-31', '2026-11-30', 'Active');
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EmployeeGoal]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[EmployeeGoal](
        [GoalId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL,
        [CycleId] [int] NOT NULL,
        [Title] [nvarchar](250) NOT NULL,
        [Description] [nvarchar](500) NULL,
        [TargetMetric] [nvarchar](150) NULL,
        [ProgressPercent] [int] NOT NULL DEFAULT(0),
        [Weightage] [int] NOT NULL DEFAULT(25),
        [Status] [nvarchar](50) NOT NULL DEFAULT('InProgress'), -- Pending, InProgress, Achieved
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_EmployeeGoal_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId]),
        CONSTRAINT [FK_EmployeeGoal_Cycle] FOREIGN KEY([CycleId]) REFERENCES [dbo].[AppraisalCycle] ([CycleId])
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AppraisalReview]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AppraisalReview](
        [ReviewId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CycleId] [int] NOT NULL,
        [EmployeeId] [int] NOT NULL,
        [ManagerId] [int] NULL,
        [SelfRating] [decimal](3,1) NULL, -- e.g. 4.5 out of 5
        [SelfComments] [nvarchar](1000) NULL,
        [ManagerRating] [decimal](3,1) NULL,
        [ManagerComments] [nvarchar](1000) NULL,
        [FinalScore] [decimal](3,1) NULL,
        [PromotionRecommendation] [nvarchar](100) NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT('SelfReviewPending'), -- SelfReviewPending, ManagerReviewPending, Completed
        [SubmittedDate] [datetime] NULL,
        [CompletedDate] [datetime] NULL,
        CONSTRAINT [UQ_AppraisalReview_CycleEmp] UNIQUE ([CycleId], [EmployeeId]),
        CONSTRAINT [FK_AppraisalReview_Cycle] FOREIGN KEY([CycleId]) REFERENCES [dbo].[AppraisalCycle] ([CycleId]),
        CONSTRAINT [FK_AppraisalReview_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId])
    );
END
GO

-- ============================================================================
-- PHASE 14: APPLICANT TRACKING SYSTEM (ATS / RECRUITMENT)
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[JobOpening]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[JobOpening](
        [JobId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [Title] [nvarchar](200) NOT NULL,
        [DepartmentId] [int] NOT NULL,
        [DesignationId] [int] NOT NULL,
        [Location] [nvarchar](150) NOT NULL DEFAULT('Headquarters'),
        [JobType] [nvarchar](50) NOT NULL DEFAULT('FullTime'), -- FullTime, PartTime, Contract, Remote
        [ExperienceYears] [nvarchar](50) NOT NULL DEFAULT('2-5 Years'),
        [OpenPositions] [int] NOT NULL DEFAULT(1),
        [Description] [nvarchar](MAX) NULL,
        [Requirements] [nvarchar](MAX) NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT('Open'), -- Open, Closed, OnHold
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_JobOpening_Department] FOREIGN KEY([DepartmentId]) REFERENCES [dbo].[Department] ([DepartmentId]),
        CONSTRAINT [FK_JobOpening_Designation] FOREIGN KEY([DesignationId]) REFERENCES [dbo].[Designation] ([DesignationId])
    );

    INSERT INTO [dbo].[JobOpening] (Title, DepartmentId, DesignationId, Location, JobType, ExperienceYears, OpenPositions, Description, Requirements)
    VALUES
    (N'Senior Full Stack .NET Engineer', 1, 1, N'New York / Remote', N'FullTime', N'5+ Years', 2, N'Drive enterprise microservices and React architecture.', N'C#, .NET 10, SQL Server, React 19, Clean Architecture.'),
    (N'Lead Product Designer', 1, 1, N'San Francisco', N'FullTime', N'4+ Years', 1, N'Design state-of-the-art enterprise interfaces and UX journeys.', N'Figma, Design Systems, Mobile Responsive UI/UX.');
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Candidate]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Candidate](
        [CandidateId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [JobId] [int] NOT NULL,
        [FullName] [nvarchar](150) NOT NULL,
        [Email] [nvarchar](100) NOT NULL,
        [Phone] [varchar](30) NULL,
        [ResumeUrl] [nvarchar](500) NULL,
        [Stage] [nvarchar](50) NOT NULL DEFAULT('Applied'), -- Applied, Screening, Interviewing, Offered, Hired, Rejected
        [Rating] [int] NOT NULL DEFAULT(3),
        [ExpectedSalary] [decimal](18,2) NULL,
        [NoticePeriodDays] [int] NULL DEFAULT(30),
        [Notes] [nvarchar](1000) NULL,
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_Candidate_Job] FOREIGN KEY([JobId]) REFERENCES [dbo].[JobOpening] ([JobId])
    );

    INSERT INTO [dbo].[Candidate] (JobId, FullName, Email, Phone, Stage, Rating, ExpectedSalary, NoticePeriodDays, Notes)
    VALUES
    (1, N'Alex Chen', N'alex.chen@example.com', N'+1 555-0199', N'Interviewing', 5, 125000.00, 30, N'Exceptional system architecture and algorithm problem solving skills.'),
    (1, N'Sophia Williams', N'sophia.w@example.com', N'+1 555-0244', N'Screening', 4, 110000.00, 15, N'Strong background in React 19 and .NET backend APIs.'),
    (2, N'Marcus Brody', N'marcus.b@example.com', N'+1 555-0377', N'Offered', 5, 115000.00, 30, N'Portfolio showcases brilliant enterprise SaaS dashboards.');
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CandidateInterview]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[CandidateInterview](
        [InterviewId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CandidateId] [int] NOT NULL,
        [InterviewerId] [int] NULL,
        [RoundNumber] [int] NOT NULL DEFAULT(1),
        [InterviewDate] [datetime] NOT NULL,
        [Feedback] [nvarchar](1000) NULL,
        [Rating] [int] NULL,
        [Status] [nvarchar](50) NOT NULL DEFAULT('Scheduled'), -- Scheduled, Completed, Cancelled
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT [FK_Interview_Candidate] FOREIGN KEY([CandidateId]) REFERENCES [dbo].[Candidate] ([CandidateId])
    );
END
GO

-- ============================================================================
-- PHASE 15: DIGITAL DOCUMENT VAULT, E-LETTERS & AUDIT LOGS
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[DocumentTemplate]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[DocumentTemplate](
        [TemplateId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [TemplateName] [nvarchar](150) NOT NULL UNIQUE,
        [TemplateCode] [nvarchar](50) NOT NULL UNIQUE, -- OFFER_LETTER, APPOINTMENT_LETTER, INCREMENT_LETTER, RELIEVING_LETTER
        [Subject] [nvarchar](250) NOT NULL,
        [BodyTemplate] [nvarchar](MAX) NOT NULL,
        [IsActive] [bit] NOT NULL DEFAULT(1),
        [CreatedDate] [datetime] NOT NULL DEFAULT(GETDATE())
    );

    INSERT INTO [dbo].[DocumentTemplate] (TemplateName, TemplateCode, Subject, BodyTemplate)
    VALUES
    (N'Formal Offer Letter', N'OFFER_LETTER', N'Offer of Employment with {{CompanyName}}', 
     N'Dear {{EmployeeName}},\n\nWe are pleased to extend an offer for the position of {{Designation}} with {{CompanyName}} in {{Department}} department.\n\nYour annual compensation package (CTC) will be {{CTC}} payable monthly. Your expected date of joining will be {{JoiningDate}}.\n\nWe look forward to welcoming you to our team.\n\nWarm regards,\nHR Department\n{{CompanyName}}'),
    (N'Relieving & Experience Certificate', N'RELIEVING_LETTER', N'Relieving and Service Certificate - {{EmployeeName}}',
     N'TO WHOMSOEVER IT MAY CONCERN\n\nThis is to certify that {{EmployeeName}} was employed with {{CompanyName}} from {{JoiningDate}} to {{RelievingDate}} as {{Designation}}.\n\nDuring their tenure, they demonstrated sincere dedication and professionalism. All company dues and clearances have been finalized.\n\nWe wish them all the best in their future endeavors.\n\nSincerely,\nHuman Resources Director\n{{CompanyName}}');
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[EmployeeDocument]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[EmployeeDocument](
        [DocumentId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [EmployeeId] [int] NOT NULL,
        [DocumentType] [nvarchar](50) NOT NULL, -- OfferLetter, Passport, Degree, GovtID, Contract, Payslip
        [Title] [nvarchar](200) NOT NULL,
        [FilePath] [nvarchar](500) NOT NULL,
        [UploadedDate] [datetime] NOT NULL DEFAULT(GETDATE()),
        [IsVerified] [bit] NOT NULL DEFAULT(0),
        [VerifiedBy] [int] NULL,
        CONSTRAINT [FK_EmployeeDocument_Employee] FOREIGN KEY([EmployeeId]) REFERENCES [dbo].[Employee] ([EmployeeId])
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SystemAuditLog]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[SystemAuditLog](
        [AuditLogId] [bigint] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [UserId] [int] NULL,
        [Action] [nvarchar](100) NOT NULL,
        [EntityName] [nvarchar](100) NOT NULL,
        [EntityId] [nvarchar](100) NULL,
        [Details] [nvarchar](MAX) NULL,
        [IpAddress] [nvarchar](50) NULL,
        [Timestamp] [datetime] NOT NULL DEFAULT(GETDATE())
    );

    INSERT INTO [dbo].[SystemAuditLog] (UserId, Action, EntityName, EntityId, Details)
    VALUES 
    (1, N'SYSTEM_INIT', N'Database', N'HRMS', N'Phase 9 through 15 Enterprise modules initialized successfully.');
END
GO

-- ============================================================================
-- STORED PROCEDURES FOR PHASES 9 - 15
-- ============================================================================

-- 1. sp_Expense_Operations
IF OBJECT_ID('dbo.sp_Expense_Operations', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_Expense_Operations];
GO
CREATE PROCEDURE [dbo].[sp_Expense_Operations]
(
    @Flag VARCHAR(30),
    @ExpenseClaimId INT = NULL,
    @EmployeeId INT = NULL,
    @ExpenseCategoryId INT = NULL,
    @ClaimDate DATE = NULL,
    @Amount DECIMAL(18,2) = NULL,
    @Description NVARCHAR(500) = NULL,
    @ReceiptPath NVARCHAR(500) = NULL,
    @Status NVARCHAR(50) = NULL,
    @ApprovedBy INT = NULL,
    @Remarks NVARCHAR(500) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Flag = 'GET_CATEGORIES'
    BEGIN
        SELECT ExpenseCategoryId, CategoryName, Description, MaxLimit, IsReceiptRequired, IsActive
        FROM ExpenseCategory WHERE IsActive = 1
        ORDER BY CategoryName;
    END

    ELSE IF @Flag = 'GET_MY_CLAIMS'
    BEGIN
        SELECT c.ExpenseClaimId, c.EmployeeId, c.ExpenseCategoryId, cat.CategoryName,
               c.ClaimDate, c.Amount, c.Description, c.ReceiptPath, c.Status,
               c.ApprovedBy, c.ApprovedDate, c.Remarks, c.CreatedDate
        FROM ExpenseClaim c
        INNER JOIN ExpenseCategory cat ON c.ExpenseCategoryId = cat.ExpenseCategoryId
        WHERE c.EmployeeId = @EmployeeId
        ORDER BY c.ClaimDate DESC;
    END

    ELSE IF @Flag = 'GET_ALL_CLAIMS'
    BEGIN
        SELECT c.ExpenseClaimId, c.EmployeeId, e.FirstName + ' ' + e.LastName AS EmployeeName,
               e.EmployeeCode, c.ExpenseCategoryId, cat.CategoryName,
               c.ClaimDate, c.Amount, c.Description, c.ReceiptPath, c.Status,
               c.ApprovedBy, c.ApprovedDate, c.Remarks, c.CreatedDate
        FROM ExpenseClaim c
        INNER JOIN Employee e ON c.EmployeeId = e.EmployeeId
        INNER JOIN ExpenseCategory cat ON c.ExpenseCategoryId = cat.ExpenseCategoryId
        ORDER BY c.ClaimDate DESC;
    END

    ELSE IF @Flag = 'GET_PENDING'
    BEGIN
        SELECT c.ExpenseClaimId, c.EmployeeId, e.FirstName + ' ' + e.LastName AS EmployeeName,
               e.EmployeeCode, c.ExpenseCategoryId, cat.CategoryName,
               c.ClaimDate, c.Amount, c.Description, c.ReceiptPath, c.Status,
               c.ApprovedBy, c.ApprovedDate, c.Remarks, c.CreatedDate
        FROM ExpenseClaim c
        INNER JOIN Employee e ON c.EmployeeId = e.EmployeeId
        INNER JOIN ExpenseCategory cat ON c.ExpenseCategoryId = cat.ExpenseCategoryId
        WHERE c.Status = 'Pending'
        ORDER BY c.ClaimDate ASC;
    END

    ELSE IF @Flag = 'INSERT'
    BEGIN
        INSERT INTO ExpenseClaim (EmployeeId, ExpenseCategoryId, ClaimDate, Amount, Description, ReceiptPath, Status)
        VALUES (@EmployeeId, @ExpenseCategoryId, ISNULL(@ClaimDate, CAST(GETDATE() AS DATE)), @Amount, @Description, @ReceiptPath, 'Pending');

        SELECT SCOPE_IDENTITY() AS Id;
    END

    ELSE IF @Flag = 'ACTION'
    BEGIN
        UPDATE ExpenseClaim
        SET Status = @Status,
            ApprovedBy = @ApprovedBy,
            ApprovedDate = GETDATE(),
            Remarks = @Remarks
        WHERE ExpenseClaimId = @ExpenseClaimId;

        SELECT @@ROWCOUNT AS RowsAffected;
    END

    ELSE IF @Flag = 'DELETE'
    BEGIN
        DELETE FROM ExpenseClaim WHERE ExpenseClaimId = @ExpenseClaimId;
        SELECT @@ROWCOUNT AS RowsAffected;
    END
END
GO

-- 2. sp_Asset_Operations
IF OBJECT_ID('dbo.sp_Asset_Operations', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_Asset_Operations];
GO
CREATE PROCEDURE [dbo].[sp_Asset_Operations]
(
    @Flag VARCHAR(30),
    @AssetId INT = NULL,
    @AssetCategoryId INT = NULL,
    @AssetTag NVARCHAR(50) = NULL,
    @AssetName NVARCHAR(150) = NULL,
    @SerialNumber NVARCHAR(100) = NULL,
    @Manufacturer NVARCHAR(100) = NULL,
    @Model NVARCHAR(100) = NULL,
    @PurchaseDate DATE = NULL,
    @WarrantyExpiryDate DATE = NULL,
    @Status NVARCHAR(50) = NULL,
    @Condition NVARCHAR(50) = NULL,
    @EmployeeId INT = NULL,
    @AllocationNotes NVARCHAR(500) = NULL,
    @ReturnNotes NVARCHAR(500) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Flag = 'GET_CATEGORIES'
    BEGIN
        SELECT AssetCategoryId, CategoryName, Description, IsActive
        FROM AssetCategory WHERE IsActive = 1
        ORDER BY CategoryName;
    END

    ELSE IF @Flag = 'GET_ALL_ASSETS'
    BEGIN
        SELECT a.AssetId, a.AssetCategoryId, c.CategoryName, a.AssetTag, a.AssetName,
               a.SerialNumber, a.Manufacturer, a.Model, a.PurchaseDate, a.WarrantyExpiryDate,
               a.Status, a.Condition, a.IsActive, a.CreatedDate,
               alloc.EmployeeId AS AssignedEmployeeId,
               e.FirstName + ' ' + e.LastName AS AssignedEmployeeName,
               e.EmployeeCode AS AssignedEmployeeCode,
               alloc.AllocatedDate
        FROM Asset a
        INNER JOIN AssetCategory c ON a.AssetCategoryId = c.AssetCategoryId
        LEFT JOIN AssetAllocation alloc ON a.AssetId = alloc.AssetId AND alloc.Status = 'Active'
        LEFT JOIN Employee e ON alloc.EmployeeId = e.EmployeeId
        ORDER BY a.AssetTag ASC;
    END

    ELSE IF @Flag = 'GET_MY_ASSETS'
    BEGIN
        SELECT a.AssetId, a.AssetTag, a.AssetName, c.CategoryName, a.Manufacturer, a.Model,
               a.SerialNumber, alloc.AllocatedDate, alloc.AllocationNotes
        FROM AssetAllocation alloc
        INNER JOIN Asset a ON alloc.AssetId = a.AssetId
        INNER JOIN AssetCategory c ON a.AssetCategoryId = c.AssetCategoryId
        WHERE alloc.EmployeeId = @EmployeeId AND alloc.Status = 'Active'
        ORDER BY alloc.AllocatedDate DESC;
    END

    ELSE IF @Flag = 'INSERT_ASSET'
    BEGIN
        INSERT INTO Asset (AssetCategoryId, AssetTag, AssetName, SerialNumber, Manufacturer, Model, PurchaseDate, WarrantyExpiryDate, Status, Condition)
        VALUES (@AssetCategoryId, @AssetTag, @AssetName, @SerialNumber, @Manufacturer, @Model, @PurchaseDate, @WarrantyExpiryDate, ISNULL(@Status, 'Available'), ISNULL(@Condition, 'New'));

        SELECT SCOPE_IDENTITY() AS Id;
    END

    ELSE IF @Flag = 'UPDATE_ASSET'
    BEGIN
        UPDATE Asset
        SET AssetCategoryId = ISNULL(@AssetCategoryId, AssetCategoryId),
            AssetName = ISNULL(@AssetName, AssetName),
            SerialNumber = ISNULL(@SerialNumber, SerialNumber),
            Manufacturer = ISNULL(@Manufacturer, Manufacturer),
            Model = ISNULL(@Model, Model),
            PurchaseDate = ISNULL(@PurchaseDate, PurchaseDate),
            WarrantyExpiryDate = ISNULL(@WarrantyExpiryDate, WarrantyExpiryDate),
            Status = ISNULL(@Status, Status),
            Condition = ISNULL(@Condition, Condition)
        WHERE AssetId = @AssetId;

        SELECT @@ROWCOUNT AS RowsAffected;
    END

    ELSE IF @Flag = 'ALLOCATE'
    BEGIN
        -- Close any previous active allocation for this asset
        UPDATE AssetAllocation SET Status = 'Returned', ReturnedDate = CAST(GETDATE() AS DATE)
        WHERE AssetId = @AssetId AND Status = 'Active';

        -- Create new allocation
        INSERT INTO AssetAllocation (AssetId, EmployeeId, AllocatedDate, Status, AllocationNotes)
        VALUES (@AssetId, @EmployeeId, CAST(GETDATE() AS DATE), 'Active', @AllocationNotes);

        -- Update Asset status
        UPDATE Asset SET Status = 'Allocated' WHERE AssetId = @AssetId;

        SELECT SCOPE_IDENTITY() AS Id;
    END

    ELSE IF @Flag = 'RETURN'
    BEGIN
        UPDATE AssetAllocation
        SET Status = 'Returned',
            ReturnedDate = CAST(GETDATE() AS DATE),
            ReturnNotes = @ReturnNotes
        WHERE AssetId = @AssetId AND Status = 'Active';

        UPDATE Asset SET Status = 'Available', Condition = ISNULL(@Condition, Condition) WHERE AssetId = @AssetId;

        SELECT @@ROWCOUNT AS RowsAffected;
    END

    ELSE IF @Flag = 'DELETE'
    BEGIN
        DELETE FROM AssetAllocation WHERE AssetId = @AssetId;
        DELETE FROM Asset WHERE AssetId = @AssetId;
        SELECT @@ROWCOUNT AS RowsAffected;
    END
END
GO

-- 3. sp_Exit_Operations
IF OBJECT_ID('dbo.sp_Exit_Operations', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_Exit_Operations];
GO
CREATE PROCEDURE [dbo].[sp_Exit_Operations]
(
    @Flag VARCHAR(30),
    @ResignationId INT = NULL,
    @EmployeeId INT = NULL,
    @NoticePeriodDays INT = NULL,
    @PreferredRelievingDate DATE = NULL,
    @ApprovedRelievingDate DATE = NULL,
    @Reason NVARCHAR(500) = NULL,
    @Feedback NVARCHAR(1000) = NULL,
    @Status NVARCHAR(50) = NULL,
    @ApprovedBy INT = NULL,
    @Remarks NVARCHAR(500) = NULL,
    @EarnedSalary DECIMAL(18,2) = NULL,
    @GratuityAmount DECIMAL(18,2) = NULL,
    @LeaveEncashmentAmount DECIMAL(18,2) = NULL,
    @NoticePayAmount DECIMAL(18,2) = NULL,
    @Deductions DECIMAL(18,2) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Flag = 'SUBMIT_RESIGNATION'
    BEGIN
        INSERT INTO ResignationRequest (EmployeeId, NoticePeriodDays, PreferredRelievingDate, Reason, Feedback, Status)
        VALUES (@EmployeeId, ISNULL(@NoticePeriodDays, 30), @PreferredRelievingDate, @Reason, @Feedback, 'Pending');

        SELECT SCOPE_IDENTITY() AS Id;
    END

    ELSE IF @Flag = 'GET_MY_RESIGNATION'
    BEGIN
        SELECT r.ResignationId, r.EmployeeId, r.SubmissionDate, r.NoticePeriodDays,
               r.PreferredRelievingDate, r.ApprovedRelievingDate, r.Reason, r.Feedback,
               r.Status, r.ApprovedBy, r.ActionDate, r.Remarks
        FROM ResignationRequest r
        WHERE r.EmployeeId = @EmployeeId
        ORDER BY r.SubmissionDate DESC;
    END

    ELSE IF @Flag = 'GET_RESIGNATIONS'
    BEGIN
        SELECT r.ResignationId, r.EmployeeId, e.FirstName + ' ' + e.LastName AS EmployeeName,
               e.EmployeeCode, d.DepartmentName, desig.DesignationName,
               r.SubmissionDate, r.NoticePeriodDays, r.PreferredRelievingDate,
               r.ApprovedRelievingDate, r.Reason, r.Feedback, r.Status, r.ApprovedBy, r.Remarks
        FROM ResignationRequest r
        INNER JOIN Employee e ON r.EmployeeId = e.EmployeeId
        LEFT JOIN Department d ON e.DepartmentId = d.DepartmentId
        LEFT JOIN Designation desig ON e.DesignationId = desig.DesignationId
        ORDER BY r.SubmissionDate DESC;
    END

    ELSE IF @Flag = 'ACTION_RESIGNATION'
    BEGIN
        UPDATE ResignationRequest
        SET Status = @Status,
            ApprovedBy = @ApprovedBy,
            ApprovedRelievingDate = ISNULL(@ApprovedRelievingDate, PreferredRelievingDate),
            ActionDate = GETDATE(),
            Remarks = @Remarks
        WHERE ResignationId = @ResignationId;

        SELECT @@ROWCOUNT AS RowsAffected;
    END

    ELSE IF @Flag = 'CALCULATE_FNF'
    BEGIN
        DECLARE @Net DECIMAL(18,2) = (ISNULL(@EarnedSalary, 0) + ISNULL(@GratuityAmount, 0) + ISNULL(@LeaveEncashmentAmount, 0) + ISNULL(@NoticePayAmount, 0)) - ISNULL(@Deductions, 0);

        INSERT INTO FnFSettlement (ResignationId, EmployeeId, SettlementDate, LastWorkingDay, EarnedSalary, GratuityAmount, LeaveEncashmentAmount, NoticePayAmount, Deductions, NetPayable, Status, ProcessedBy, Remarks)
        VALUES (@ResignationId, @EmployeeId, CAST(GETDATE() AS DATE), ISNULL(@ApprovedRelievingDate, CAST(GETDATE() AS DATE)), ISNULL(@EarnedSalary, 0), ISNULL(@GratuityAmount, 0), ISNULL(@LeaveEncashmentAmount, 0), ISNULL(@NoticePayAmount, 0), ISNULL(@Deductions, 0), @Net, 'Approved', @ApprovedBy, @Remarks);

        SELECT SCOPE_IDENTITY() AS Id;
    END

    ELSE IF @Flag = 'GET_FNF_LIST'
    BEGIN
        SELECT f.SettlementId, f.ResignationId, f.EmployeeId, e.FirstName + ' ' + e.LastName AS EmployeeName,
               e.EmployeeCode, f.SettlementDate, f.LastWorkingDay, f.EarnedSalary, f.GratuityAmount,
               f.LeaveEncashmentAmount, f.NoticePayAmount, f.Deductions, f.NetPayable, f.Status, f.Remarks
        FROM FnFSettlement f
        INNER JOIN Employee e ON f.EmployeeId = e.EmployeeId
        ORDER BY f.SettlementDate DESC;
    END

    ELSE IF @Flag = 'GET_ONBOARDING_TASKS'
    BEGIN
        SELECT TaskId, Title, Department, AssignedRole, Description, IsActive
        FROM OnboardingTask WHERE IsActive = 1;
    END
END
GO

-- 4. sp_Shift_Operations
IF OBJECT_ID('dbo.sp_Shift_Operations', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_Shift_Operations];
GO
CREATE PROCEDURE [dbo].[sp_Shift_Operations]
(
    @Flag VARCHAR(30),
    @ShiftId INT = NULL,
    @ShiftName NVARCHAR(100) = NULL,
    @ShiftCode NVARCHAR(20) = NULL,
    @StartTime TIME = NULL,
    @EndTime TIME = NULL,
    @BreakMinutes INT = NULL,
    @GraceMinutes INT = NULL,
    @NightAllowance DECIMAL(18,2) = NULL,
    @EmployeeId INT = NULL,
    @RosterDate DATE = NULL,
    @IsWeekend BIT = NULL,
    @Remarks NVARCHAR(250) = NULL,
    @Month INT = NULL,
    @Year INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Flag = 'GET_SHIFTS'
    BEGIN
        SELECT ShiftId, ShiftName, ShiftCode, StartTime, EndTime, BreakMinutes, GraceMinutes, NightAllowance, IsActive
        FROM ShiftMaster WHERE IsActive = 1
        ORDER BY StartTime ASC;
    END

    ELSE IF @Flag = 'INSERT_SHIFT'
    BEGIN
        INSERT INTO ShiftMaster (ShiftName, ShiftCode, StartTime, EndTime, BreakMinutes, GraceMinutes, NightAllowance)
        VALUES (@ShiftName, @ShiftCode, @StartTime, @EndTime, ISNULL(@BreakMinutes, 60), ISNULL(@GraceMinutes, 15), ISNULL(@NightAllowance, 0));

        SELECT SCOPE_IDENTITY() AS Id;
    END

    ELSE IF @Flag = 'GET_ROSTER'
    BEGIN
        SELECT r.RosterId, r.EmployeeId, e.FirstName + ' ' + e.LastName AS EmployeeName,
               e.EmployeeCode, d.DepartmentName, r.ShiftId, s.ShiftName, s.ShiftCode,
               s.StartTime, s.EndTime, r.RosterDate, r.IsWeekend, r.Remarks
        FROM EmployeeRoster r
        INNER JOIN Employee e ON r.EmployeeId = e.EmployeeId
        LEFT JOIN Department d ON e.DepartmentId = d.DepartmentId
        INNER JOIN ShiftMaster s ON r.ShiftId = s.ShiftId
        WHERE (@Month IS NULL OR MONTH(r.RosterDate) = @Month)
          AND (@Year IS NULL OR YEAR(r.RosterDate) = @Year)
        ORDER BY r.RosterDate ASC, e.FirstName ASC;
    END

    ELSE IF @Flag = 'ASSIGN_ROSTER'
    BEGIN
        MERGE INTO EmployeeRoster AS Target
        USING (SELECT @EmployeeId AS EmployeeId, @RosterDate AS RosterDate) AS Source
        ON (Target.EmployeeId = Source.EmployeeId AND Target.RosterDate = Source.RosterDate)
        WHEN MATCHED THEN
            UPDATE SET Target.ShiftId = @ShiftId, Target.IsWeekend = ISNULL(@IsWeekend, 0), Target.Remarks = @Remarks
        WHEN NOT MATCHED THEN
            INSERT (EmployeeId, ShiftId, RosterDate, IsWeekend, Remarks)
            VALUES (@EmployeeId, @ShiftId, @RosterDate, ISNULL(@IsWeekend, 0), @Remarks);

        SELECT @@ROWCOUNT AS RowsAffected;
    END

    ELSE IF @Flag = 'GET_MY_ROSTER'
    BEGIN
        SELECT r.RosterId, r.EmployeeId, r.ShiftId, s.ShiftName, s.ShiftCode,
               s.StartTime, s.EndTime, r.RosterDate, r.IsWeekend, r.Remarks
        FROM EmployeeRoster r
        INNER JOIN ShiftMaster s ON r.ShiftId = s.ShiftId
        WHERE r.EmployeeId = @EmployeeId
          AND (@Month IS NULL OR MONTH(r.RosterDate) = @Month)
          AND (@Year IS NULL OR YEAR(r.RosterDate) = @Year)
        ORDER BY r.RosterDate ASC;
    END
END
GO

-- 5. sp_PMS_Operations
IF OBJECT_ID('dbo.sp_PMS_Operations', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_PMS_Operations];
GO
CREATE PROCEDURE [dbo].[sp_PMS_Operations]
(
    @Flag VARCHAR(30),
    @CycleId INT = NULL,
    @CycleName NVARCHAR(150) = NULL,
    @StartDate DATE = NULL,
    @EndDate DATE = NULL,
    @ReviewDeadline DATE = NULL,
    @GoalId INT = NULL,
    @EmployeeId INT = NULL,
    @Title NVARCHAR(250) = NULL,
    @Description NVARCHAR(500) = NULL,
    @TargetMetric NVARCHAR(150) = NULL,
    @ProgressPercent INT = NULL,
    @Weightage INT = NULL,
    @SelfRating DECIMAL(3,1) = NULL,
    @SelfComments NVARCHAR(1000) = NULL,
    @ManagerId INT = NULL,
    @ManagerRating DECIMAL(3,1) = NULL,
    @ManagerComments NVARCHAR(1000) = NULL,
    @PromotionRecommendation NVARCHAR(100) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Flag = 'GET_CYCLES'
    BEGIN
        SELECT CycleId, CycleName, StartDate, EndDate, ReviewDeadline, Status
        FROM AppraisalCycle
        ORDER BY StartDate DESC;
    END

    ELSE IF @Flag = 'GET_MY_GOALS'
    BEGIN
        SELECT GoalId, EmployeeId, CycleId, Title, Description, TargetMetric, ProgressPercent, Weightage, Status, CreatedDate
        FROM EmployeeGoal
        WHERE EmployeeId = @EmployeeId AND (@CycleId IS NULL OR CycleId = @CycleId)
        ORDER BY CreatedDate DESC;
    END

    ELSE IF @Flag = 'SAVE_GOAL'
    BEGIN
        IF @GoalId IS NULL OR @GoalId = 0
        BEGIN
            INSERT INTO EmployeeGoal (EmployeeId, CycleId, Title, Description, TargetMetric, ProgressPercent, Weightage, Status)
            VALUES (@EmployeeId, @CycleId, @Title, @Description, @TargetMetric, ISNULL(@ProgressPercent, 0), ISNULL(@Weightage, 25), 'InProgress');
            SELECT SCOPE_IDENTITY() AS Id;
        END
        ELSE
        BEGIN
            UPDATE EmployeeGoal
            SET Title = ISNULL(@Title, Title),
                Description = ISNULL(@Description, Description),
                TargetMetric = ISNULL(@TargetMetric, TargetMetric),
                ProgressPercent = ISNULL(@ProgressPercent, ProgressPercent),
                Weightage = ISNULL(@Weightage, Weightage),
                Status = CASE WHEN @ProgressPercent >= 100 THEN 'Achieved' ELSE 'InProgress' END
            WHERE GoalId = @GoalId;
            SELECT @@ROWCOUNT AS RowsAffected;
        END
    END

    ELSE IF @Flag = 'GET_REVIEWS'
    BEGIN
        SELECT r.ReviewId, r.CycleId, c.CycleName, r.EmployeeId, e.FirstName + ' ' + e.LastName AS EmployeeName,
               e.EmployeeCode, d.DepartmentName, r.SelfRating, r.SelfComments, r.ManagerRating,
               r.ManagerComments, r.FinalScore, r.PromotionRecommendation, r.Status, r.SubmittedDate, r.CompletedDate
        FROM AppraisalReview r
        INNER JOIN AppraisalCycle c ON r.CycleId = c.CycleId
        INNER JOIN Employee e ON r.EmployeeId = e.EmployeeId
        LEFT JOIN Department d ON e.DepartmentId = d.DepartmentId
        ORDER BY r.SubmittedDate DESC;
    END

    ELSE IF @Flag = 'GET_MY_REVIEW'
    BEGIN
        SELECT r.ReviewId, r.CycleId, c.CycleName, r.EmployeeId, r.SelfRating, r.SelfComments,
               r.ManagerRating, r.ManagerComments, r.FinalScore, r.PromotionRecommendation, r.Status
        FROM AppraisalReview r
        INNER JOIN AppraisalCycle c ON r.CycleId = c.CycleId
        WHERE r.EmployeeId = @EmployeeId AND r.CycleId = @CycleId;
    END

    ELSE IF @Flag = 'SUBMIT_SELF_REVIEW'
    BEGIN
        MERGE INTO AppraisalReview AS Target
        USING (SELECT @CycleId AS CycleId, @EmployeeId AS EmployeeId) AS Source
        ON (Target.CycleId = Source.CycleId AND Target.EmployeeId = Source.EmployeeId)
        WHEN MATCHED THEN
            UPDATE SET Target.SelfRating = @SelfRating, Target.SelfComments = @SelfComments, Target.Status = 'ManagerReviewPending', Target.SubmittedDate = GETDATE()
        WHEN NOT MATCHED THEN
            INSERT (CycleId, EmployeeId, SelfRating, SelfComments, Status, SubmittedDate)
            VALUES (@CycleId, @EmployeeId, @SelfRating, @SelfComments, 'ManagerReviewPending', GETDATE());

        SELECT @@ROWCOUNT AS RowsAffected;
    END

    ELSE IF @Flag = 'SUBMIT_MANAGER_REVIEW'
    BEGIN
        DECLARE @CalcFinal DECIMAL(3,1) = (@SelfRating + @ManagerRating) / 2.0;

        UPDATE AppraisalReview
        SET ManagerRating = @ManagerRating,
            ManagerComments = @ManagerComments,
            FinalScore = @CalcFinal,
            PromotionRecommendation = @PromotionRecommendation,
            Status = 'Completed',
            CompletedDate = GETDATE()
        WHERE CycleId = @CycleId AND EmployeeId = @EmployeeId;

        SELECT @@ROWCOUNT AS RowsAffected;
    END
END
GO

-- 6. sp_ATS_Operations
IF OBJECT_ID('dbo.sp_ATS_Operations', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_ATS_Operations];
GO
CREATE PROCEDURE [dbo].[sp_ATS_Operations]
(
    @Flag VARCHAR(30),
    @JobId INT = NULL,
    @Title NVARCHAR(200) = NULL,
    @DepartmentId INT = NULL,
    @DesignationId INT = NULL,
    @Location NVARCHAR(150) = NULL,
    @JobType NVARCHAR(50) = NULL,
    @ExperienceYears NVARCHAR(50) = NULL,
    @OpenPositions INT = NULL,
    @Description NVARCHAR(MAX) = NULL,
    @Requirements NVARCHAR(MAX) = NULL,
    @CandidateId INT = NULL,
    @FullName NVARCHAR(150) = NULL,
    @Email NVARCHAR(100) = NULL,
    @Phone VARCHAR(30) = NULL,
    @ResumeUrl NVARCHAR(500) = NULL,
    @Stage NVARCHAR(50) = NULL,
    @Rating INT = NULL,
    @ExpectedSalary DECIMAL(18,2) = NULL,
    @NoticePeriodDays INT = NULL,
    @Notes NVARCHAR(1000) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Flag = 'GET_JOBS'
    BEGIN
        SELECT j.JobId, j.Title, j.DepartmentId, d.DepartmentName, j.DesignationId, desig.DesignationName,
               j.Location, j.JobType, j.ExperienceYears, j.OpenPositions, j.Description, j.Requirements,
               j.Status, j.CreatedDate,
               (SELECT COUNT(*) FROM Candidate c WHERE c.JobId = j.JobId) AS TotalApplicants
        FROM JobOpening j
        INNER JOIN Department d ON j.DepartmentId = d.DepartmentId
        INNER JOIN Designation desig ON j.DesignationId = desig.DesignationId
        ORDER BY j.CreatedDate DESC;
    END

    ELSE IF @Flag = 'SAVE_JOB'
    BEGIN
        INSERT INTO JobOpening (Title, DepartmentId, DesignationId, Location, JobType, ExperienceYears, OpenPositions, Description, Requirements, Status)
        VALUES (@Title, @DepartmentId, @DesignationId, ISNULL(@Location, 'Headquarters'), ISNULL(@JobType, 'FullTime'), @ExperienceYears, ISNULL(@OpenPositions, 1), @Description, @Requirements, 'Open');

        SELECT SCOPE_IDENTITY() AS Id;
    END

    ELSE IF @Flag = 'GET_CANDIDATES'
    BEGIN
        SELECT c.CandidateId, c.JobId, j.Title AS JobTitle, c.FullName, c.Email, c.Phone,
               c.ResumeUrl, c.Stage, c.Rating, c.ExpectedSalary, c.NoticePeriodDays, c.Notes, c.CreatedDate
        FROM Candidate c
        INNER JOIN JobOpening j ON c.JobId = j.JobId
        WHERE (@JobId IS NULL OR c.JobId = @JobId)
        ORDER BY c.CreatedDate DESC;
    END

    ELSE IF @Flag = 'ADD_CANDIDATE'
    BEGIN
        INSERT INTO Candidate (JobId, FullName, Email, Phone, ResumeUrl, Stage, Rating, ExpectedSalary, NoticePeriodDays, Notes)
        VALUES (@JobId, @FullName, @Email, @Phone, @ResumeUrl, ISNULL(@Stage, 'Applied'), ISNULL(@Rating, 3), @ExpectedSalary, @NoticePeriodDays, @Notes);

        SELECT SCOPE_IDENTITY() AS Id;
    END

    ELSE IF @Flag = 'UPDATE_STAGE'
    BEGIN
        UPDATE Candidate
        SET Stage = @Stage,
            Notes = ISNULL(@Notes, Notes)
        WHERE CandidateId = @CandidateId;

        SELECT @@ROWCOUNT AS RowsAffected;
    END
END
GO

-- 7. sp_Document_Operations
IF OBJECT_ID('dbo.sp_Document_Operations', 'P') IS NOT NULL DROP PROCEDURE [dbo].[sp_Document_Operations];
GO
CREATE PROCEDURE [dbo].[sp_Document_Operations]
(
    @Flag VARCHAR(30),
    @TemplateId INT = NULL,
    @TemplateName NVARCHAR(150) = NULL,
    @TemplateCode NVARCHAR(50) = NULL,
    @Subject NVARCHAR(250) = NULL,
    @BodyTemplate NVARCHAR(MAX) = NULL,
    @EmployeeId INT = NULL,
    @DocumentType NVARCHAR(50) = NULL,
    @Title NVARCHAR(200) = NULL,
    @FilePath NVARCHAR(500) = NULL,
    @UserId INT = NULL,
    @Action NVARCHAR(100) = NULL,
    @EntityName NVARCHAR(100) = NULL,
    @EntityId NVARCHAR(100) = NULL,
    @Details NVARCHAR(MAX) = NULL,
    @IpAddress NVARCHAR(50) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Flag = 'GET_TEMPLATES'
    BEGIN
        SELECT TemplateId, TemplateName, TemplateCode, Subject, BodyTemplate, IsActive
        FROM DocumentTemplate WHERE IsActive = 1;
    END

    ELSE IF @Flag = 'SAVE_TEMPLATE'
    BEGIN
        IF @TemplateId IS NULL OR @TemplateId = 0
        BEGIN
            INSERT INTO DocumentTemplate (TemplateName, TemplateCode, Subject, BodyTemplate)
            VALUES (@TemplateName, @TemplateCode, @Subject, @BodyTemplate);
            SELECT SCOPE_IDENTITY() AS Id;
        END
        ELSE
        BEGIN
            UPDATE DocumentTemplate
            SET TemplateName = @TemplateName, Subject = @Subject, BodyTemplate = @BodyTemplate
            WHERE TemplateId = @TemplateId;
            SELECT @@ROWCOUNT AS RowsAffected;
        END
    END

    ELSE IF @Flag = 'GET_EMPLOYEE_DOCS'
    BEGIN
        SELECT d.DocumentId, d.EmployeeId, e.FirstName + ' ' + e.LastName AS EmployeeName,
               d.DocumentType, d.Title, d.FilePath, d.UploadedDate, d.IsVerified
        FROM EmployeeDocument d
        INNER JOIN Employee e ON d.EmployeeId = e.EmployeeId
        WHERE (@EmployeeId IS NULL OR d.EmployeeId = @EmployeeId)
        ORDER BY d.UploadedDate DESC;
    END

    ELSE IF @Flag = 'UPLOAD_DOC'
    BEGIN
        INSERT INTO EmployeeDocument (EmployeeId, DocumentType, Title, FilePath, IsVerified)
        VALUES (@EmployeeId, @DocumentType, @Title, @FilePath, 0);

        SELECT SCOPE_IDENTITY() AS Id;
    END

    ELSE IF @Flag = 'LOG_AUDIT'
    BEGIN
        INSERT INTO SystemAuditLog (UserId, Action, EntityName, EntityId, Details, IpAddress, Timestamp)
        VALUES (@UserId, @Action, @EntityName, @EntityId, @Details, @IpAddress, GETDATE());

        SELECT SCOPE_IDENTITY() AS Id;
    END

    ELSE IF @Flag = 'GET_AUDIT_LOGS'
    BEGIN
        SELECT TOP 100 a.AuditLogId, a.UserId, ISNULL(e.FirstName + ' ' + e.LastName, 'System Admin') AS UserName,
               a.Action, a.EntityName, a.EntityId, a.Details, a.IpAddress, a.Timestamp
        FROM SystemAuditLog a
        LEFT JOIN Employee e ON a.UserId = e.EmployeeId
        ORDER BY a.Timestamp DESC;
    END
END
GO
