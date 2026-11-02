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
    public class ATSController : ControllerBase
    {
        private readonly IATSService _atsService;

        public ATSController(IATSService atsService)
        {
            _atsService = atsService;
        }

        [HttpGet("jobs")]
        [SwaggerOperation(Summary = "Get All Job Openings")]
        public async Task<IActionResult> GetJobs()
        {
            var data = await _atsService.GetJobsAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost("jobs")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Create New Job Opening")]
        public async Task<IActionResult> SaveJob([FromBody] CreateJobOpeningDTO dto)
        {
            var id = await _atsService.SaveJobAsync(dto);
            return Ok(new { success = true, message = "Job opening published successfully", data = new { jobId = id } });
        }

        [HttpGet("candidates")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Get Candidates (Filter by Job Opening)")]
        public async Task<IActionResult> GetCandidates([FromQuery] int? jobId)
        {
            var data = await _atsService.GetCandidatesAsync(jobId);
            return Ok(new { success = true, data });
        }

        [HttpPost("candidates")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Add Candidate to Recruitment Pipeline")]
        public async Task<IActionResult> AddCandidate([FromBody] CreateCandidateDTO dto)
        {
            var id = await _atsService.AddCandidateAsync(dto);
            return Ok(new { success = true, message = "Candidate enrolled into pipeline", data = new { candidateId = id } });
        }

        [HttpPut("stage")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Update Candidate Pipeline Stage (Kanban Drag & Drop)")]
        public async Task<IActionResult> UpdateStage([FromBody] UpdateCandidateStageDTO dto)
        {
            var result = await _atsService.UpdateStageAsync(dto);
            return Ok(new { success = result, message = result ? $"Candidate moved to {dto.Stage}" : "Update failed" });
        }
    }
}
