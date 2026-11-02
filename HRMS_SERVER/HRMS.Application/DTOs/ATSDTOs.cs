using System;

namespace HRMS.Application.DTOs
{
    public class JobOpeningDTO
    {
        public int JobId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public int DesignationId { get; set; }
        public string? DesignationName { get; set; }
        public string Location { get; set; } = "Headquarters";
        public string JobType { get; set; } = "FullTime";
        public string ExperienceYears { get; set; } = "2-5 Years";
        public int OpenPositions { get; set; } = 1;
        public string? Description { get; set; }
        public string? Requirements { get; set; }
        public string Status { get; set; } = "Open";
        public DateTime CreatedDate { get; set; }
        public int TotalApplicants { get; set; }
    }

    public class CreateJobOpeningDTO
    {
        public string Title { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
        public string Location { get; set; } = "Headquarters";
        public string JobType { get; set; } = "FullTime";
        public string ExperienceYears { get; set; } = "2-5 Years";
        public int OpenPositions { get; set; } = 1;
        public string? Description { get; set; }
        public string? Requirements { get; set; }
    }

    public class CandidateDTO
    {
        public int CandidateId { get; set; }
        public int JobId { get; set; }
        public string? JobTitle { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? ResumeUrl { get; set; }
        public string Stage { get; set; } = "Applied"; // Applied, Screening, Interviewing, Offered, Hired, Rejected
        public int Rating { get; set; } = 3;
        public decimal? ExpectedSalary { get; set; }
        public int? NoticePeriodDays { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreateCandidateDTO
    {
        public int JobId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? ResumeUrl { get; set; }
        public string Stage { get; set; } = "Applied";
        public int Rating { get; set; } = 3;
        public decimal? ExpectedSalary { get; set; }
        public int? NoticePeriodDays { get; set; } = 30;
        public string? Notes { get; set; }
    }

    public class UpdateCandidateStageDTO
    {
        public int CandidateId { get; set; }
        public string Stage { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
}
