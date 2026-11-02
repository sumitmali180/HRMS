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
    public class AssetController : ControllerBase
    {
        private readonly IAssetService _assetService;

        public AssetController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("EmployeeId")?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpGet("categories")]
        [SwaggerOperation(Summary = "Get All Asset Categories")]
        public async Task<IActionResult> GetCategories()
        {
            var data = await _assetService.GetCategoriesAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Get All Company Hardware & IT Assets")]
        public async Task<IActionResult> GetAllAssets()
        {
            var data = await _assetService.GetAllAssetsAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("my-assets")]
        [SwaggerOperation(Summary = "Get Assets Allocated to Current Employee")]
        public async Task<IActionResult> GetMyAssets()
        {
            var employeeId = GetCurrentUserId();
            var data = await _assetService.GetMyAssetsAsync(employeeId);
            return Ok(new { success = true, data });
        }

        [HttpPost]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Add New Asset to Master Inventory")]
        public async Task<IActionResult> CreateAsset([FromBody] CreateAssetDTO dto)
        {
            var id = await _assetService.CreateAssetAsync(dto);
            return Ok(new { success = true, message = "Asset registered successfully", data = new { assetId = id } });
        }

        [HttpPut]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Update Asset Details")]
        public async Task<IActionResult> UpdateAsset([FromBody] AssetDTO dto)
        {
            var result = await _assetService.UpdateAssetAsync(dto);
            return Ok(new { success = result, message = result ? "Asset updated successfully" : "Update failed" });
        }

        [HttpPost("allocate")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Allocate Asset to Employee")]
        public async Task<IActionResult> AllocateAsset([FromBody] AllocateAssetDTO dto)
        {
            var id = await _assetService.AllocateAssetAsync(dto);
            return Ok(new { success = true, message = "Asset allocated to employee successfully", data = new { allocationId = id } });
        }

        [HttpPost("return")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Return Asset from Employee")]
        public async Task<IActionResult> ReturnAsset([FromBody] ReturnAssetDTO dto)
        {
            var result = await _assetService.ReturnAssetAsync(dto);
            return Ok(new { success = result, message = result ? "Asset marked as returned and available" : "Return failed" });
        }

        [HttpDelete("{assetId:int}")]
        [Authorize(Roles = "Super Admin,HR Admin,Admin")]
        [SwaggerOperation(Summary = "Delete Asset")]
        public async Task<IActionResult> DeleteAsset(int assetId)
        {
            var result = await _assetService.DeleteAssetAsync(assetId);
            return Ok(new { success = result, message = result ? "Asset removed" : "Failed to remove asset" });
        }
    }
}
