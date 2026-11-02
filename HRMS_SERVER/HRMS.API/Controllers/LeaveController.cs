using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Threading.Tasks;

namespace HRMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LeaveController : ControllerBase
    {
        private readonly ILeaveService _leaveService;

        public LeaveController(ILeaveService leaveService)
        {
            _leaveService = leaveService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("EmployeeId")?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpGet("types")]
        [SwaggerOperation(Summary = "Get All Leave Types")]
        public async Task<IActionResult> GetLeaveTypes()
        {
            var list = await _leaveService.GetLeaveTypesAsync();
            return Ok(new
            {
                success = true,
                data = list
            });
        }

        [HttpGet("balances/{employeeId:int}")]
        [SwaggerOperation(Summary = "Get Leave Balances for Employee")]
        public async Task<IActionResult> GetBalances(int employeeId, [FromQuery] int? year)
        {
            if (employeeId <= 0)
            {
                employeeId = GetCurrentUserId();
            }

            var y = year ?? DateTime.Now.Year;
            var list = await _leaveService.GetLeaveBalancesAsync(employeeId, y);
            return Ok(new
            {
                success = true,
                data = list
            });
        }

        [HttpPost("apply")]
        [SwaggerOperation(Summary = "Apply for Leave")]
        public async Task<IActionResult> Apply([FromBody] ApplyLeaveDTO dto)
        {
            if (dto.EmployeeId <= 0)
            {
                dto.EmployeeId = GetCurrentUserId();
            }

            var leaveId = await _leaveService.ApplyLeaveAsync(dto);
            return Ok(new
            {
                success = true,
                message = "Leave application submitted successfully.",
                leaveId = leaveId
            });
        }

        [HttpGet("my-history/{employeeId:int}")]
        [SwaggerOperation(Summary = "Get Employee Leave Application History")]
        public async Task<IActionResult> GetMyHistory(int employeeId)
        {
            if (employeeId <= 0)
            {
                employeeId = GetCurrentUserId();
            }

            var list = await _leaveService.GetEmployeeLeaveHistoryAsync(employeeId);
            return Ok(new
            {
                success = true,
                data = list
            });
        }

        [HttpGet("pending")]
        [SwaggerOperation(Summary = "Get Pending Leave Approvals")]
        public async Task<IActionResult> GetPendingApprovals([FromQuery] int? managerId)
        {
            // If managerId is not passed, and current user is Manager, default to their ID
            var role = User.FindFirst("role")?.Value;
            if (!managerId.HasValue && role == "Manager")
            {
                managerId = GetCurrentUserId();
            }

            var list = await _leaveService.GetPendingApprovalsAsync(managerId);
            return Ok(new
            {
                success = true,
                data = list
            });
        }

        [HttpPost("approve-reject")]
        [SwaggerOperation(Summary = "Approve or Reject Leave Application")]
        public async Task<IActionResult> ApproveOrReject([FromBody] LeaveApprovalDTO dto)
        {
            if (dto.ApprovedBy <= 0)
            {
                dto.ApprovedBy = GetCurrentUserId();
            }

            var success = await _leaveService.ApproveOrRejectLeaveAsync(dto);
            return Ok(new
            {
                success = success,
                message = success ? $"Leave application status updated to '{dto.Status}'." : "Failed to update leave status."
            });
        }

        [HttpPost("cancel/{leaveId:int}")]
        [SwaggerOperation(Summary = "Cancel Pending Leave Application")]
        public async Task<IActionResult> Cancel(int leaveId)
        {
            var empId = GetCurrentUserId();
            var success = await _leaveService.CancelLeaveAsync(leaveId, empId);
            return Ok(new
            {
                success = success,
                message = success ? "Leave application cancelled successfully." : "Unable to cancel leave application."
            });
        }
    }
}
