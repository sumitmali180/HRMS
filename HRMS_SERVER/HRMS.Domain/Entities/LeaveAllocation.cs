using System;

namespace HRMS.Domain.Entities
{
    public class LeaveAllocation
    {
        public int AllocationId { get; set; }
        public int EmployeeId { get; set; }
        public int LeaveTypeId { get; set; }
        public int Year { get; set; }
        public decimal TotalDays { get; set; }
        public decimal UsedDays { get; set; }
        public decimal RemainingDays { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
