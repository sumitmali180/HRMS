using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HRMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string[] _allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSize = 2 * 1024 * 1024; // 2MB

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("ProfilePhoto")]
        public async Task<IActionResult> UploadProfilePhoto(IFormFile file)
        {
            return await SaveUploadedFile(file, "profile-photos");
        }

        [HttpPost("CompanyLogo")]
        public async Task<IActionResult> UploadCompanyLogo(IFormFile file)
        {
            return await SaveUploadedFile(file, "company-logos");
        }

        private async Task<IActionResult> SaveUploadedFile(IFormFile? file, string subFolder)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { success = false, message = "No file was uploaded." });
            }

            if (file.Length > MaxFileSize)
            {
                return BadRequest(new { success = false, message = "File size exceeds the 2MB limit." });
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
            {
                return BadRequest(new { success = false, message = "Invalid file type. Only JPG, PNG, and WebP are allowed." });
            }

            var webRoot = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var uploadsFolder = Path.Combine(webRoot, "uploads", subFolder);

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativeUrl = $"/uploads/{subFolder}/{uniqueFileName}";

            return Ok(new
            {
                success = true,
                message = "File uploaded successfully.",
                fileUrl = relativeUrl,
                fileName = uniqueFileName
            });
        }
    }
}
