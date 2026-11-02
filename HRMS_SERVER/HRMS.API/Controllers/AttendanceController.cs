using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace HRMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;

        public AttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("EmployeeId")?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpPost("clock-in")]
        [SwaggerOperation(Summary = "Employee Clock In")]
        public async Task<IActionResult> ClockIn([FromBody] ClockInDTO dto)
        {
            if (dto.EmployeeId <= 0)
            {
                dto.EmployeeId = GetCurrentUserId();
            }

            if (!dto.Time.HasValue)
            {
                dto.Time = DateTime.Now;
            }

            var attendanceId = await _attendanceService.ClockInAsync(dto);
            return Ok(new
            {
                success = true,
                message = "Clocked in successfully.",
                attendanceId = attendanceId
            });
        }

        [HttpPost("clock-out")]
        [SwaggerOperation(Summary = "Employee Clock Out")]
        public async Task<IActionResult> ClockOut([FromBody] ClockOutDTO dto)
        {
            if (dto.EmployeeId <= 0)
            {
                dto.EmployeeId = GetCurrentUserId();
            }

            if (!dto.Time.HasValue)
            {
                dto.Time = DateTime.Now;
            }

            var success = await _attendanceService.ClockOutAsync(dto);
            return Ok(new
            {
                success = success,
                message = success ? "Clocked out successfully." : "Unable to clock out."
            });
        }

        [HttpGet("today/{employeeId:int}")]
        [SwaggerOperation(Summary = "Get Today Attendance Status")]
        public async Task<IActionResult> GetTodayStatus(int employeeId)
        {
            if (employeeId <= 0)
            {
                employeeId = GetCurrentUserId();
            }

            var status = await _attendanceService.GetTodayStatusAsync(employeeId);
            return Ok(new
            {
                success = true,
                data = status
            });
        }

        [HttpGet("monthly")]
        [SwaggerOperation(Summary = "Get Monthly Attendance Calendar for Employee")]
        public async Task<IActionResult> GetMonthlyAttendance([FromQuery] int employeeId, [FromQuery] int? month, [FromQuery] int? year)
        {
            if (employeeId <= 0)
            {
                employeeId = GetCurrentUserId();
            }

            var m = month ?? DateTime.Now.Month;
            var y = year ?? DateTime.Now.Year;

            var list = await _attendanceService.GetMonthlyAttendanceAsync(employeeId, m, y);
            return Ok(new
            {
                success = true,
                data = list
            });
        }

        [HttpGet("daily")]
        [SwaggerOperation(Summary = "Get Daily Attendance by Branch / Date")]
        public async Task<IActionResult> GetDailyAttendance([FromQuery] int? branchId, [FromQuery] DateTime? date)
        {
            var d = date ?? DateTime.Today;
            var list = await _attendanceService.GetDailyAttendanceByBranchAsync(branchId, d);
            return Ok(new
            {
                success = true,
                data = list
            });
        }

        [HttpPost("regularize")]
        [SwaggerOperation(Summary = "Regularize Attendance Punch")]
        public async Task<IActionResult> RegularizeAttendance([FromBody] RegularizeAttendanceDTO dto)
        {
            if (dto.EmployeeId <= 0)
            {
                dto.EmployeeId = GetCurrentUserId();
            }

            var success = await _attendanceService.RegularizeAttendanceAsync(dto);
            return Ok(new
            {
                success = success,
                message = success ? "Attendance regularized successfully." : "Failed to regularize attendance."
            });
        }
    }
}
