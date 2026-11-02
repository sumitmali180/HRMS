using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Threading.Tasks;

namespace HRMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ShiftController : ControllerBase
    {
        private readonly IShiftService _shiftService;

        public ShiftController(IShiftService shiftService)
        {
            _shiftService = shiftService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("EmployeeId")?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpGet("list")]
        [SwaggerOperation(Summary = "Get All Defined Shifts")]
        public async Task<IActionResult> GetShifts()
        {
            var data = await _shiftService.GetShiftsAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Create New Shift Master")]
        public async Task<IActionResult> CreateShift([FromBody] CreateShiftDTO dto)
        {
            var id = await _shiftService.CreateShiftAsync(dto);
            return Ok(new { success = true, message = "Shift master created successfully", data = new { shiftId = id } });
        }

        [HttpGet("roster")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Get Department / Company Monthly Roster")]
        public async Task<IActionResult> GetRoster([FromQuery] int? month, [FromQuery] int? year)
        {
            var data = await _shiftService.GetRosterAsync(month, year);
            return Ok(new { success = true, data });
        }

        [HttpPost("assign-roster")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Assign or Update Employee Shift Roster")]
        public async Task<IActionResult> AssignRoster([FromBody] AssignRosterDTO dto)
        {
            var result = await _shiftService.AssignRosterAsync(dto);
            return Ok(new { success = result, message = result ? "Roster assigned successfully" : "Assignment failed" });
        }

        [HttpGet("my-roster")]
        [SwaggerOperation(Summary = "Get Current Employee Monthly Shift Roster")]
        public async Task<IActionResult> GetMyRoster([FromQuery] int? month, [FromQuery] int? year)
        {
            var employeeId = GetCurrentUserId();
            var data = await _shiftService.GetMyRosterAsync(employeeId, month, year);
            return Ok(new { success = true, data });
        }
    }
}
