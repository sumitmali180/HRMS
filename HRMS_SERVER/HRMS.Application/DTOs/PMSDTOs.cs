using System;

namespace HRMS.Application.DTOs
{
    public class AppraisalCycleDTO
    {
        public int CycleId { get; set; }
        public string CycleName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime ReviewDeadline { get; set; }
        public string Status { get; set; } = "Active";
    }

    public class EmployeeGoalDTO
    {
        public int GoalId { get; set; }
        public int EmployeeId { get; set; }
        public int CycleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? TargetMetric { get; set; }
        public int ProgressPercent { get; set; }
        public int Weightage { get; set; }
        public string Status { get; set; } = "InProgress";
        public DateTime CreatedDate { get; set; }
    }

    public class SaveGoalDTO
    {
        public int? GoalId { get; set; }
        public int EmployeeId { get; set; }
        public int CycleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? TargetMetric { get; set; }
        public int ProgressPercent { get; set; } = 0;
        public int Weightage { get; set; } = 25;
    }

    public class AppraisalReviewDTO
    {
        public int ReviewId { get; set; }
        public int CycleId { get; set; }
        public string? CycleName { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string? EmployeeCode { get; set; }
        public string? DepartmentName { get; set; }
        public decimal? SelfRating { get; set; }
        public string? SelfComments { get; set; }
        public decimal? ManagerRating { get; set; }
        public string? ManagerComments { get; set; }
        public decimal? FinalScore { get; set; }
        public string? PromotionRecommendation { get; set; }
        public string Status { get; set; } = "SelfReviewPending";
        public DateTime? SubmittedDate { get; set; }
        public DateTime? CompletedDate { get; set; }
    }

    public class SubmitSelfReviewDTO
    {
        public int CycleId { get; set; }
        public int EmployeeId { get; set; }
        public decimal SelfRating { get; set; }
        public string? SelfComments { get; set; }
    }

    public class SubmitManagerReviewDTO
    {
        public int CycleId { get; set; }
        public int EmployeeId { get; set; }
        public decimal SelfRating { get; set; }
        public decimal ManagerRating { get; set; }
        public string? ManagerComments { get; set; }
        public string? PromotionRecommendation { get; set; }
    }
}
