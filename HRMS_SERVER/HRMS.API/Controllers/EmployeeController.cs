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
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        #region Create Employee

        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPost("CreateEmployee")]
        public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDTO dto)
        {
            var employeeId = await _employeeService.CreateEmployeeAsync(dto);

            if (employeeId > 0)
            {
                return Ok(new
                {
                    success = true,
                    message = "Employee created successfully.",
                    employeeId = employeeId
                });
            }

            return BadRequest(new
            {
                success = false,
                message = "Failed to create employee."
            });
        }

        #endregion

        #region Get Employee List

        [HttpGet("GetEmployeeList")]
        [SwaggerOperation(Summary = "Get Employee List")]
        public async Task<IActionResult> GetEmployeeList()
        {
            var employees = await _employeeService.GetEmployeeListAsync();

            return Ok(new
            {
                success = true,
                data = employees
            });
        }

        #endregion

        #region Lookups

        [HttpGet("managers-lookup")]
        [SwaggerOperation(Summary = "Get Managers/Employees Lookup")]
        public async Task<IActionResult> GetManagersLookup()
        {
            var list = await _employeeService.GetManagersLookupAsync();
            return Ok(new
            {
                success = true,
                data = list
            });
        }

        [HttpGet("roles-lookup")]
        [SwaggerOperation(Summary = "Get Roles Lookup")]
        public async Task<IActionResult> GetRolesLookup()
        {
            var list = await _employeeService.GetRolesLookupAsync();
            return Ok(new
            {
                success = true,
                data = list
            });
        }

        #endregion

        #region Get Employee By Id

        [HttpGet("{id:int}")]
        [SwaggerOperation(Summary = "Get Employee By Id")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);

            if (employee == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Employee not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = employee
            });
        }

        #endregion

        #region Update Employee

        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPut("{id:int}")]
        [SwaggerOperation(Summary = "Update Employee")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDTO dto)
        {
            if (id != dto.EmployeeId)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Employee ID mismatch."
                });
            }

            var result = await _employeeService.UpdateEmployeeAsync(dto);

            if (result)
            {
                return Ok(new
                {
                    success = true,
                    message = "Employee updated successfully."
                });
            }

            return BadRequest(new
            {
                success = false,
                message = "Failed to update employee."
            });
        }

        #endregion

        #region Delete Employee

        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpDelete("{id:int}")]
        [SwaggerOperation(Summary = "Delete Employee")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var result = await _employeeService.DeleteEmployeeAsync(id);

            if (result)
            {
                return Ok(new
                {
                    success = true,
                    message = "Employee deleted successfully."
                });
            }

            return NotFound(new
            {
                success = false,
                message = "Employee not found."
            });
        }

        #endregion
    }
}