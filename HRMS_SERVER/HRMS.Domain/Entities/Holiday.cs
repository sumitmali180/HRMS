using System;

namespace HRMS.Domain.Entities
{
    public class Holiday
    {
        public int HolidayId { get; set; }
        public int? BranchId { get; set; }
        public string HolidayName { get; set; } = string.Empty;
        public DateTime HolidayDate { get; set; }
        public bool IsRecurring { get; set; }
        public int Year { get; set; }
    }
}
