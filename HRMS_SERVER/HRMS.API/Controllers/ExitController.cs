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
    public class ExitController : ControllerBase
    {
        private readonly IExitService _exitService;

        public ExitController(IExitService exitService)
        {
            _exitService = exitService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("EmployeeId")?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpPost("resign")]
        [SwaggerOperation(Summary = "Submit Resignation Request")]
        public async Task<IActionResult> SubmitResignation([FromBody] SubmitResignationDTO dto)
        {
            if (dto.EmployeeId <= 0)
            {
                dto.EmployeeId = GetCurrentUserId();
            }

            var id = await _exitService.SubmitResignationAsync(dto);
            return Ok(new { success = true, message = "Resignation submitted successfully", data = new { resignationId = id } });
        }

        [HttpGet("my-resignation")]
        [SwaggerOperation(Summary = "Get Current Employee Resignation Details")]
        public async Task<IActionResult> GetMyResignation()
        {
            var employeeId = GetCurrentUserId();
            var data = await _exitService.GetMyResignationsAsync(employeeId);
            return Ok(new { success = true, data });
        }

        [HttpGet("resignation-queue")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Get All Resignations for HR & Management")]
        public async Task<IActionResult> GetResignations()
        {
            var data = await _exitService.GetAllResignationsAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost("action-resignation")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Approve or Reject Resignation")]
        public async Task<IActionResult> ActionResignation([FromBody] ResignationActionDTO dto)
        {
            if (dto.ApprovedBy == null || dto.ApprovedBy <= 0)
            {
                dto.ApprovedBy = GetCurrentUserId();
            }

            var result = await _exitService.ActionResignationAsync(dto);
            return Ok(new { success = result, message = result ? $"Resignation marked as {dto.Status}" : "Operation failed" });
        }

        [HttpPost("fnf/calculate")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Calculate and Save Full & Final Settlement (F&F)")]
        public async Task<IActionResult> CalculateFnF([FromBody] CalculateFnFDTO dto)
        {
            if (dto.ProcessedBy == null || dto.ProcessedBy <= 0)
            {
                dto.ProcessedBy = GetCurrentUserId();
            }

            var id = await _exitService.CalculateFnFAsync(dto);
            return Ok(new { success = true, message = "Full & Final settlement computed and saved", data = new { settlementId = id } });
        }

        [HttpGet("fnf/list")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Get All F&F Settlements")]
        public async Task<IActionResult> GetFnFList()
        {
            var data = await _exitService.GetFnFListAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("onboarding/tasks")]
        [SwaggerOperation(Summary = "Get Standard Onboarding Task Checklist")]
        public async Task<IActionResult> GetOnboardingTasks()
        {
            var data = await _exitService.GetOnboardingTasksAsync();
            return Ok(new { success = true, data });
        }
    }
}
