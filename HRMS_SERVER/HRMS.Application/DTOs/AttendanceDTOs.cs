using System;

namespace HRMS.Application.DTOs
{
    public class ClockInDTO
    {
        public int EmployeeId { get; set; }
        public DateTime? Time { get; set; }
        public string? Notes { get; set; }
    }

    public class ClockOutDTO
    {
        public int EmployeeId { get; set; }
        public DateTime? Time { get; set; }
        public string? Notes { get; set; }
    }

    public class AttendanceLogDTO
    {
        public int AttendanceId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public int? BranchId { get; set; }
        public string? BranchName { get; set; }
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public DateTime AttendanceDate { get; set; }
        public TimeSpan? CheckIn { get; set; }
        public TimeSpan? CheckOut { get; set; }
        public decimal WorkingHours { get; set; }
        public int LateMinutes { get; set; }
        public string Status { get; set; } = "Present";
        public string? Remarks { get; set; }
    }

    public class RegularizeAttendanceDTO
    {
        public int EmployeeId { get; set; }
        public DateTime AttendanceDate { get; set; }
        public TimeSpan? CheckIn { get; set; }
        public TimeSpan? CheckOut { get; set; }
        public decimal? WorkingHours { get; set; }
        public string? Status { get; set; }
        public string? Remarks { get; set; }
    }
}
