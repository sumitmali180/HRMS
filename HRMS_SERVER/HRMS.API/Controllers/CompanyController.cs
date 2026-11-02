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
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        // POST: api/Company
        [Authorize(Roles = "Super Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCompanyDTO createCompanyDTO)
        {
            var companyId = await _companyService.CreateCompanyAsync(createCompanyDTO);

            if (companyId <= 0)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Unable to create company."
                });
            }

            return CreatedAtAction(nameof(GetCompanyById), new { id = companyId }, new
            {
                success = true,
                message = "Company created successfully.",
                companyId = companyId
            });
        }

        // GET: api/Company
        [HttpGet]
        public async Task<IActionResult> GetAllCompanies()
        {
            var companies = await _companyService.GetAllCompaniesAsync();
            return Ok(new
            {
                success = true,
                data = companies ?? Enumerable.Empty<CompanyDTO>()
            });
        }

        // GET: api/Company/lookup
        [HttpGet("lookup")]
        public async Task<IActionResult> GetLookup()
        {
            var list = await _companyService.GetAllCompaniesAsync();
            var lookup = (list ?? Enumerable.Empty<CompanyDTO>())
                .Select(c => new { id = c.CompanyId, name = c.CompanyName });

            return Ok(new
            {
                success = true,
                data = lookup
            });
        }

        // GET: api/Company/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCompanyById(int id)
        {
            var company = await _companyService.GetCompanyByIdAsync(id);

            if (company == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Company with ID {id} not found."
                });
            }

            return Ok(new
            {
                success = true,
                data = company
            });
        }

        // PUT: api/Company/{id}
        [Authorize(Roles = "Super Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCompanyDTO updateCompanyDTO)
        {
            if (id != updateCompanyDTO.CompanyId)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "ID mismatch."
                });
            }

            var result = await _companyService.UpdateCompanyAsync(updateCompanyDTO);

            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Company with ID {id} not found or update failed."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Company updated successfully."
            });
        }

        // DELETE: api/Company/{id}
        [Authorize(Roles = "Super Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _companyService.DeleteCompanyAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = $"Company with ID {id} not found or delete failed."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Company deleted successfully."
            });
        }
    }
}