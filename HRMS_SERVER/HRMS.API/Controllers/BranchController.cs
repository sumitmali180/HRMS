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
    public class BranchController : ControllerBase
    {
        private readonly IBranchService _branchService;

        public BranchController(IBranchService branchService)
        {
            _branchService = branchService;
        }

        // POST: api/Branch
        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BranchRequestDTO dto)
        {
            var branchId = await _branchService.CreateAsync(dto);

            if (branchId <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Unable to create branch."
                });
            }

            return CreatedAtAction(nameof(GetById), new { id = branchId }, new
            {
                success = true,
                message = "Branch created successfully.",
                branchId = branchId
            });
        }

        // GET: api/Branch
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var branches = await _branchService.GetAllAsync();
            return Ok(new
            {
                success = true,
                data = branches ?? Enumerable.Empty<BranchDTO>()
            });
        }

        // GET: api/Branch/lookup?companyId={companyId}
        [HttpGet("lookup")]
        public async Task<IActionResult> GetLookup([FromQuery] int? companyId)
        {
            var branches = await _branchService.GetAllAsync();
            var query = branches ?? Enumerable.Empty<BranchDTO>();

            if (companyId.HasValue && companyId.Value > 0)
            {
                query = query.Where(b => b.CompanyId == companyId.Value);
            }

            var lookup = query.Select(b => new
            {
                id = b.BranchId,
                name = b.BranchName,
                code = b.BranchCode,
                companyId = b.CompanyId
            });

            return Ok(new
            {
                success = true,
                data = lookup
            });
        }

        // GET: api/Branch/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var branch = await _branchService.GetByIdAsync(id);

            if (branch == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Branch with ID {id} not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = branch
            });
        }

        // PUT: api/Branch/{id}
        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] BranchRequestDTO dto)
        {
            var result = await _branchService.UpdateAsync(id, dto);

            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Branch with ID {id} not found or update failed."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Branch updated successfully."
            });
        }

        // DELETE: api/Branch/{id}
        [Authorize(Roles = "Super Admin, HR Admin, Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _branchService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Branch with ID {id} not found or delete failed."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Branch deleted successfully."
            });
        }
    }
}