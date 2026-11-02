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
    public class PayrollController : ControllerBase
    {
        private readonly IPayrollService _payrollService;

        public PayrollController(IPayrollService payrollService)
        {
            _payrollService = payrollService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("EmployeeId")?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpGet("structure/{employeeId:int}")]
        [SwaggerOperation(Summary = "Get Salary Structure by Employee ID")]
        public async Task<IActionResult> GetSalaryStructure(int employeeId)
        {
            if (employeeId <= 0)
            {
                employeeId = GetCurrentUserId();
            }

            var structure = await _payrollService.GetSalaryStructureByEmployeeIdAsync(employeeId);
            return Ok(new
            {
                success = true,
                data = structure
            });
        }

        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPost("structure")]
        [SwaggerOperation(Summary = "Save Salary Structure for Employee")]
        public async Task<IActionResult> SaveSalaryStructure([FromBody] SalaryStructureDTO dto)
        {
            var salaryId = await _payrollService.SaveSalaryStructureAsync(dto);
            return Ok(new
            {
                success = true,
                message = "Salary structure saved successfully.",
                salaryId = salaryId
            });
        }

        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPost("process")]
        [SwaggerOperation(Summary = "Run Monthly Payroll Process")]
        public async Task<IActionResult> ProcessMonthly([FromBody] ProcessPayrollDTO dto)
        {
            if (!dto.GeneratedBy.HasValue || dto.GeneratedBy.Value <= 0)
            {
                dto.GeneratedBy = GetCurrentUserId();
            }

            var success = await _payrollService.ProcessMonthlyPayrollAsync(dto);
            return Ok(new
            {
                success = success,
                message = success ? "Payroll processed successfully for selected period." : "Failed to process payroll."
            });
        }

        [HttpGet("list")]
        [SwaggerOperation(Summary = "Get Monthly Processed Payroll List")]
        public async Task<IActionResult> GetPayrollList([FromQuery] byte? month, [FromQuery] short? year, [FromQuery] int? branchId)
        {
            var m = month ?? (byte)DateTime.Now.Month;
            var y = year ?? (short)DateTime.Now.Year;

            var list = await _payrollService.GetPayrollListAsync(m, y, branchId);
            return Ok(new
            {
                success = true,
                data = list
            });
        }

        [HttpGet("payslip/{payrollId:int}")]
        [SwaggerOperation(Summary = "Get Complete Payslip Breakdown")]
        public async Task<IActionResult> GetPayslip(int payrollId)
        {
            var payslip = await _payrollService.GetPayslipAsync(payrollId);

            if (payslip == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Payslip record not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = payslip
            });
        }

        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPost("mark-paid/{payrollId:int}")]
        [SwaggerOperation(Summary = "Mark Payroll Record as Paid")]
        public async Task<IActionResult> MarkAsPaid(int payrollId)
        {
            var success = await _payrollService.MarkAsPaidAsync(payrollId);
            return Ok(new
            {
                success = success,
                message = success ? "Payroll status marked as Paid." : "Failed to update payroll status."
            });
        }
    }
}
