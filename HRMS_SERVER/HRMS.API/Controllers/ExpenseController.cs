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
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpenseController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("EmployeeId")?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpGet("categories")]
        [SwaggerOperation(Summary = "Get All Expense Categories")]
        public async Task<IActionResult> GetCategories()
        {
            var data = await _expenseService.GetCategoriesAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("my-claims")]
        [SwaggerOperation(Summary = "Get Current Employee Expense Claims")]
        public async Task<IActionResult> GetMyClaims()
        {
            var employeeId = GetCurrentUserId();
            var data = await _expenseService.GetMyClaimsAsync(employeeId);
            return Ok(new { success = true, data });
        }

        [HttpGet("all-claims")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Get All Expense Claims (Admin/Manager)")]
        public async Task<IActionResult> GetAllClaims()
        {
            var data = await _expenseService.GetAllClaimsAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Get Pending Expense Claims for Approval")]
        public async Task<IActionResult> GetPending()
        {
            var data = await _expenseService.GetPendingClaimsAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost("claim")]
        [SwaggerOperation(Summary = "Submit an Expense Claim")]
        public async Task<IActionResult> SubmitClaim([FromBody] SubmitExpenseClaimDTO dto)
        {
            if (dto.EmployeeId <= 0)
            {
                dto.EmployeeId = GetCurrentUserId();
            }

            var id = await _expenseService.SubmitClaimAsync(dto);
            return Ok(new { success = true, message = "Expense claim submitted successfully", data = new { claimId = id } });
        }

        [HttpPost("approve-reject")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin,Manager")]
        [SwaggerOperation(Summary = "Approve or Reject an Expense Claim")]
        public async Task<IActionResult> ActionClaim([FromBody] ExpenseActionDTO dto)
        {
            if (dto.ApprovedBy == null || dto.ApprovedBy <= 0)
            {
                dto.ApprovedBy = GetCurrentUserId();
            }

            var result = await _expenseService.ActionClaimAsync(dto);
            return Ok(new { success = result, message = result ? $"Claim marked as {dto.Status}" : "Operation failed" });
        }

        [HttpDelete("claim/{claimId:int}")]
        [SwaggerOperation(Summary = "Delete Expense Claim")]
        public async Task<IActionResult> DeleteClaim(int claimId)
        {
            var result = await _expenseService.DeleteClaimAsync(claimId);
            return Ok(new { success = result, message = result ? "Claim deleted" : "Claim not found" });
        }
    }
}
