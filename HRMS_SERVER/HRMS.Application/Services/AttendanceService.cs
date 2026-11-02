using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;

        public AttendanceService(IAttendanceRepository attendanceRepository)
        {
            _attendanceRepository = attendanceRepository;
        }

        public async Task<int> ClockInAsync(ClockInDTO dto)
        {
            return await _attendanceRepository.ClockInAsync(dto);
        }

        public async Task<bool> ClockOutAsync(ClockOutDTO dto)
        {
            return await _attendanceRepository.ClockOutAsync(dto);
        }

        public async Task<AttendanceLogDTO?> GetTodayStatusAsync(int employeeId)
        {
            return await _attendanceRepository.GetTodayStatusAsync(employeeId);
        }

        public async Task<IEnumerable<AttendanceLogDTO>> GetMonthlyAttendanceAsync(int employeeId, int month, int year)
        {
            return await _attendanceRepository.GetMonthlyAttendanceAsync(employeeId, month, year);
        }

        public async Task<IEnumerable<AttendanceLogDTO>> GetDailyAttendanceByBranchAsync(int? branchId, DateTime date)
        {
            return await _attendanceRepository.GetDailyAttendanceByBranchAsync(branchId, date);
        }

        public async Task<bool> RegularizeAttendanceAsync(RegularizeAttendanceDTO dto)
        {
            return await _attendanceRepository.RegularizeAttendanceAsync(dto);
        }
    }
}
