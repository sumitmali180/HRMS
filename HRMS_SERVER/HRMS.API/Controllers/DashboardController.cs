
using HRMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }


        // GET: api/Dashboard
        [HttpGet]
        public IActionResult GetDashboard()
        {
            try
            {
                var dashboard = _dashboardService.GetDashboard();


                if (dashboard == null)
                {
                    return NotFound(new
                    {
                        isSuccess = false,
                        message = "Dashboard data not found"
                    });
                }


                return Ok(new
                {
                    isSuccess = true,
                    message = "Dashboard data retrieved successfully",
                    data = dashboard
                });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        isSuccess = false,
                        message = "An error occurred while loading dashboard",
                        error = ex.Message
                    }
                );
            }
        }
    }
}