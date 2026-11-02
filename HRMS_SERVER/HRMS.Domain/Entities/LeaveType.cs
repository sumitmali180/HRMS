using System;

namespace HRMS.Domain.Entities
{
    public class LeaveType
    {
        public int LeaveTypeId { get; set; }
        public string LeaveName { get; set; } = string.Empty;
        public bool PaidLeave { get; set; } = true;
        public int MaxDays { get; set; } = 12;
        public bool IsEncashable { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
