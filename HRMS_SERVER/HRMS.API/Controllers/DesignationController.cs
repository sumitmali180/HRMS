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
    public class DesignationController : ControllerBase
    {
        private readonly IDesignationService _designationService;

        public DesignationController(IDesignationService designationService)
        {
            _designationService = designationService;
        }

        // POST: api/Designation
        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DesignationRequestDTO dto)
        {
            var designationId = await _designationService.CreateAsync(dto);

            if (designationId <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Unable to create designation."
                });
            }

            return CreatedAtAction(nameof(GetById), new { id = designationId }, new
            {
                success = true,
                message = "Designation created successfully.",
                designationId = designationId
            });
        }

        // GET: api/Designation
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var designations = await _designationService.GetAllAsync();
            return Ok(new
            {
                success = true,
                data = designations ?? Enumerable.Empty<DesignationDTO>()
            });
        }

        // GET: api/Designation/lookup
        [HttpGet("lookup")]
        public async Task<IActionResult> GetLookup()
        {
            var designations = await _designationService.GetAllAsync();
            var lookup = (designations ?? Enumerable.Empty<DesignationDTO>())
                .Select(d => new
                {
                    id = d.DesignationId,
                    name = d.DesignationName,
                    grade = d.Grade,
                    basicSalary = d.BasicSalary
                });

            return Ok(new
            {
                success = true,
                data = lookup
            });
        }

        // GET: api/Designation/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var designation = await _designationService.GetByIdAsync(id);

            if (designation == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Designation with ID {id} not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = designation
            });
        }

        // PUT: api/Designation/{id}
        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] DesignationRequestDTO dto)
        {
            var result = await _designationService.UpdateAsync(id, dto);

            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Designation with ID {id} not found or update failed."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Designation updated successfully."
            });
        }

        // DELETE: api/Designation/{id}
        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _designationService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Designation with ID {id} not found or delete failed."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Designation deleted successfully."
            });
        }
    }
}