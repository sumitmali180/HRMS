using System;

namespace HRMS.Application.DTOs
{
    public class ApplyLeaveDTO
    {
        public int EmployeeId { get; set; }
        public int LeaveTypeId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime StartDate { get => FromDate; set => FromDate = value; }
        public DateTime EndDate { get => ToDate; set => ToDate = value; }
        public decimal? TotalDays { get; set; }
        public bool IsHalfDay { get; set; }
        public string? Reason { get; set; }
    }

    public class LeaveApprovalDTO
    {
        public int LeaveId { get; set; }
        public int ApprovedBy { get; set; }
        public string Status { get; set; } = "Approved"; // Approved or Rejected
        public string? RejectedReason { get; set; }
    }

    public class LeaveBalanceDTO
    {
        public int AllocationId { get; set; }
        public int EmployeeId { get; set; }
        public int LeaveTypeId { get; set; }
        public string LeaveName { get; set; } = string.Empty;
        public bool PaidLeave { get; set; }
        public int Year { get; set; }
        public decimal TotalDays { get; set; }
        public decimal UsedDays { get; set; }
        public decimal RemainingDays { get; set; }
    }

    public class LeaveApplicationDTO
    {
        public int LeaveId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string? DepartmentName { get; set; }
        public int LeaveTypeId { get; set; }
        public string LeaveName { get; set; } = string.Empty;
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public decimal TotalDays { get; set; }
        public bool IsHalfDay { get; set; }
        public string? Reason { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime AppliedDate { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string? ApprovedByName { get; set; }
        public string? RejectedReason { get; set; }
    }

    public class LeaveTypeDTO
    {
        public int LeaveTypeId { get; set; }
        public string LeaveName { get; set; } = string.Empty;
        public bool PaidLeave { get; set; } = true;
        public int MaxDays { get; set; }
        public bool IsEncashable { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
