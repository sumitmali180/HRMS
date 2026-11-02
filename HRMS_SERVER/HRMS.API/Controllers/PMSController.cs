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
    public class PMSController : ControllerBase
    {
        private readonly IPMSService _pmsService;

        public PMSController(IPMSService pmsService)
        {
            _pmsService = pmsService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("EmployeeId")?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpGet("cycles")]
        [SwaggerOperation(Summary = "Get All Appraisal Cycles")]
        public async Task<IActionResult> GetCycles()
        {
            var data = await _pmsService.GetCyclesAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("my-goals")]
        [SwaggerOperation(Summary = "Get Current Employee OKR Goals")]
        public async Task<IActionResult> GetMyGoals([FromQuery] int? cycleId)
        {
            var employeeId = GetCurrentUserId();
            var data = await _pmsService.GetMyGoalsAsync(employeeId, cycleId);
            return Ok(new { success = true, data });
        }

        [HttpPost("goal")]
        [SwaggerOperation(Summary = "Save or Update Employee Goal")]
        public async Task<IActionResult> SaveGoal([FromBody] SaveGoalDTO dto)
        {
            if (dto.EmployeeId <= 0)
            {
                dto.EmployeeId = GetCurrentUserId();
            }

            var id = await _pmsService.SaveGoalAsync(dto);
            return Ok(new { success = true, message = "Goal saved successfully", data = new { goalId = id } });
        }

        [HttpGet("reviews")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Get All Performance Reviews")]
        public async Task<IActionResult> GetReviews()
        {
            var data = await _pmsService.GetReviewsAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("my-review/{cycleId:int}")]
        [SwaggerOperation(Summary = "Get Employee Appraisal Review for Cycle")]
        public async Task<IActionResult> GetMyReview(int cycleId)
        {
            var employeeId = GetCurrentUserId();
            var data = await _pmsService.GetMyReviewAsync(employeeId, cycleId);
            return Ok(new { success = true, data });
        }

        [HttpPost("self-review")]
        [SwaggerOperation(Summary = "Submit Employee Self Appraisal")]
        public async Task<IActionResult> SubmitSelfReview([FromBody] SubmitSelfReviewDTO dto)
        {
            if (dto.EmployeeId <= 0)
            {
                dto.EmployeeId = GetCurrentUserId();
            }

            var result = await _pmsService.SubmitSelfReviewAsync(dto);
            return Ok(new { success = result, message = result ? "Self assessment submitted for manager review" : "Submission failed" });
        }

        [HttpPost("manager-review")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Submit Manager Appraisal Review")]
        public async Task<IActionResult> SubmitManagerReview([FromBody] SubmitManagerReviewDTO dto)
        {
            var result = await _pmsService.SubmitManagerReviewAsync(dto);
            return Ok(new { success = result, message = result ? "Manager appraisal finalized and scores computed" : "Review submission failed" });
        }
    }
}
