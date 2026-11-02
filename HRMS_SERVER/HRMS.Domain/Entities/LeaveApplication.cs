using System;

namespace HRMS.Domain.Entities
{
    public class LeaveApplication
    {
        public int LeaveId { get; set; }
        public int EmployeeId { get; set; }
        public int LeaveTypeId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public decimal TotalDays { get; set; } = 1;
        public bool IsHalfDay { get; set; }
        public string? Reason { get; set; }
        public int? ApprovedBy { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ApprovedDate { get; set; }
        public string? RejectedReason { get; set; }
    }
}
