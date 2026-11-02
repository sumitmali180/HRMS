using HRMS.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IAttendanceService
    {
        Task<int> ClockInAsync(ClockInDTO dto);
        Task<bool> ClockOutAsync(ClockOutDTO dto);
        Task<AttendanceLogDTO?> GetTodayStatusAsync(int employeeId);
        Task<IEnumerable<AttendanceLogDTO>> GetMonthlyAttendanceAsync(int employeeId, int month, int year);
        Task<IEnumerable<AttendanceLogDTO>> GetDailyAttendanceByBranchAsync(int? branchId, DateTime date);
        Task<bool> RegularizeAttendanceAsync(RegularizeAttendanceDTO dto);
    }
}
