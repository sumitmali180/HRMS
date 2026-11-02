using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace HRMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentController(IDepartmentService departmentService)
        {
            _departmentService = departmentService;
        }

        // POST: api/Department
        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DepartmentRequestDTO dto)
        {
            var departmentId = await _departmentService.CreateAsync(dto);

            if (departmentId <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Unable to create department."
                });
            }

            return CreatedAtAction(nameof(GetById), new { id = departmentId }, new
            {
                success = true,
                message = "Department created successfully.",
                departmentId = departmentId
            });
        }

        // GET: api/Department
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var departments = await _departmentService.GetAllAsync();
            return Ok(new
            {
                success = true,
                data = departments ?? Enumerable.Empty<DepartmentDTO>()
            });
        }

        // GET: api/Department/lookup?branchId={branchId}
        [HttpGet("lookup")]
        public async Task<IActionResult> GetLookup([FromQuery] int? branchId)
        {
            var departments = await _departmentService.GetAllAsync();
            var query = departments ?? Enumerable.Empty<DepartmentDTO>();

            if (branchId.HasValue && branchId.Value > 0)
            {
                query = query.Where(d => d.BranchId == branchId.Value);
            }

            var lookup = query.Select(d => new
            {
                id = d.DepartmentId,
                name = d.DepartmentName,
                branchId = d.BranchId
            });

            return Ok(new
            {
                success = true,
                data = lookup
            });
        }

        // GET: api/Department/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var department = await _departmentService.GetByIdAsync(id);

            if (department == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Department with ID {id} not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = department
            });
        }

        // PUT: api/Department/{id}
        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] DepartmentRequestDTO dto)
        {
            var result = await _departmentService.UpdateAsync(id, dto);

            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Department with ID {id} not found or update failed."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Department updated successfully."
            });
        }

        // DELETE: api/Department/{id}
        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _departmentService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Department with ID {id} not found or delete failed."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Department deleted successfully."
            });
        }
    }
}