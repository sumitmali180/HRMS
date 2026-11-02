using System;

namespace HRMS.Application.DTOs
{
    public class LoginResponseDTO
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime Expiry { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
    }
}
