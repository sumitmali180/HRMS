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
    public class DocumentController : ControllerBase
    {
        private readonly IDocumentService _documentService;

        public DocumentController(IDocumentService documentService)
        {
            _documentService = documentService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("EmployeeId")?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpGet("templates")]
        [SwaggerOperation(Summary = "Get All Letter & Contract Templates")]
        public async Task<IActionResult> GetTemplates()
        {
            var data = await _documentService.GetTemplatesAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost("templates")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Create or Update Letter Template")]
        public async Task<IActionResult> SaveTemplate([FromBody] SaveDocumentTemplateDTO dto)
        {
            var id = await _documentService.SaveTemplateAsync(dto);
            return Ok(new { success = true, message = "Template saved successfully", data = new { templateId = id } });
        }

        [HttpPost("generate-letter")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Generate Populated E-Letter for Employee")]
        public async Task<IActionResult> GenerateLetter([FromBody] GenerateLetterDTO dto)
        {
            if (dto.EmployeeId <= 0)
            {
                dto.EmployeeId = GetCurrentUserId();
            }

            var letterContent = await _documentService.GenerateLetterAsync(dto);
            return Ok(new { success = true, data = new { content = letterContent } });
        }

        [HttpGet("my-documents")]
        [SwaggerOperation(Summary = "Get Current Employee Digital Vault Documents")]
        public async Task<IActionResult> GetMyDocuments()
        {
            var employeeId = GetCurrentUserId();
            var data = await _documentService.GetEmployeeDocumentsAsync(employeeId);
            return Ok(new { success = true, data });
        }

        [HttpGet("employee/{employeeId:int}")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Get All Documents for an Employee")]
        public async Task<IActionResult> GetEmployeeDocuments(int employeeId)
        {
            var data = await _documentService.GetEmployeeDocumentsAsync(employeeId);
            return Ok(new { success = true, data });
        }

        [HttpPost("upload")]
        [SwaggerOperation(Summary = "Register Uploaded Document in Employee Vault")]
        public async Task<IActionResult> UploadDocument([FromBody] UploadDocumentDTO dto)
        {
            if (dto.EmployeeId <= 0)
            {
                dto.EmployeeId = GetCurrentUserId();
            }

            var id = await _documentService.UploadDocumentAsync(dto);
            return Ok(new { success = true, message = "Document saved to employee vault", data = new { documentId = id } });
        }

        [HttpGet("audit-logs")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Get System Security and Activity Audit Logs")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var data = await _documentService.GetAuditLogsAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost("audit-log")]
        [SwaggerOperation(Summary = "Write System Audit Trail Event")]
        public async Task<IActionResult> LogAudit([FromBody] CreateAuditLogDTO dto)
        {
            if (dto.UserId == null || dto.UserId <= 0)
            {
                dto.UserId = GetCurrentUserId();
            }

            var id = await _documentService.LogAuditAsync(dto);
            return Ok(new { success = true, message = "Audit event recorded", data = new { auditLogId = id } });
        }
    }
}
