using System;

namespace HRMS.Application.DTOs
{
    public class OnboardingTaskDTO
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string AssignedRole { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class ResignationRequestDTO
    {
        public int ResignationId { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string? EmployeeCode { get; set; }
        public string? DepartmentName { get; set; }
        public string? DesignationName { get; set; }
        public DateTime SubmissionDate { get; set; }
        public int NoticePeriodDays { get; set; }
        public DateTime PreferredRelievingDate { get; set; }
        public DateTime? ApprovedRelievingDate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string? Feedback { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Withdrawn
        public int? ApprovedBy { get; set; }
        public string? Remarks { get; set; }
    }

    public class SubmitResignationDTO
    {
        public int EmployeeId { get; set; }
        public int NoticePeriodDays { get; set; } = 30;
        public DateTime PreferredRelievingDate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string? Feedback { get; set; }
    }

    public class ResignationActionDTO
    {
        public int ResignationId { get; set; }
        public string Status { get; set; } = "Approved";
        public DateTime? ApprovedRelievingDate { get; set; }
        public int? ApprovedBy { get; set; }
        public string? Remarks { get; set; }
    }

    public class FnFSettlementDTO
    {
        public int SettlementId { get; set; }
        public int ResignationId { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string? EmployeeCode { get; set; }
        public DateTime SettlementDate { get; set; }
        public DateTime LastWorkingDay { get; set; }
        public decimal EarnedSalary { get; set; }
        public decimal GratuityAmount { get; set; }
        public decimal LeaveEncashmentAmount { get; set; }
        public decimal NoticePayAmount { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetPayable { get; set; }
        public string Status { get; set; } = "Approved";
        public string? Remarks { get; set; }
    }

    public class CalculateFnFDTO
    {
        public int ResignationId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime? LastWorkingDay { get; set; }
        public decimal EarnedSalary { get; set; }
        public decimal GratuityAmount { get; set; }
        public decimal LeaveEncashmentAmount { get; set; }
        public decimal NoticePayAmount { get; set; }
        public decimal Deductions { get; set; }
        public int? ProcessedBy { get; set; }
        public string? Remarks { get; set; }
    }
}
