using System;

namespace HRMS.Application.DTOs
{
    public class ShiftMasterDTO
    {
        public int ShiftId { get; set; }
        public string ShiftName { get; set; } = string.Empty;
        public string ShiftCode { get; set; } = string.Empty;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int BreakMinutes { get; set; }
        public int GraceMinutes { get; set; }
        public decimal NightAllowance { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreateShiftDTO
    {
        public string ShiftName { get; set; } = string.Empty;
        public string ShiftCode { get; set; } = string.Empty;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int BreakMinutes { get; set; } = 60;
        public int GraceMinutes { get; set; } = 15;
        public decimal NightAllowance { get; set; } = 0;
    }

    public class EmployeeRosterDTO
    {
        public int RosterId { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string? EmployeeCode { get; set; }
        public string? DepartmentName { get; set; }
        public int ShiftId { get; set; }
        public string ShiftName { get; set; } = string.Empty;
        public string ShiftCode { get; set; } = string.Empty;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public DateTime RosterDate { get; set; }
        public bool IsWeekend { get; set; }
        public string? Remarks { get; set; }
    }

    public class AssignRosterDTO
    {
        public int EmployeeId { get; set; }
        public int ShiftId { get; set; }
        public DateTime RosterDate { get; set; }
        public bool IsWeekend { get; set; }
        public string? Remarks { get; set; }
    }
}
