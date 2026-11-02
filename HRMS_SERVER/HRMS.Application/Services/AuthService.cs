using BCrypt.Net;
using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly ITokenService _tokenService;

        public AuthService(IAuthRepository authRepository, ITokenService tokenService)
        {
            _authRepository = authRepository;
            _tokenService = tokenService;
        }

        public async Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return new LoginResponseDTO
                {
                    IsSuccess = false,
                    Message = "Email and password are required.",
                    Expiry = DateTime.MinValue
                };
            }

            var employee = await _authRepository.GetEmployeeForLoginAsync(request.Email.Trim());

            if (employee == null)
            {
                return new LoginResponseDTO
                {
                    IsSuccess = false,
                    Message = "Invalid email or password.",
                    Expiry = DateTime.MinValue
                };
            }

            if (!string.Equals(employee.Status, "Active", StringComparison.OrdinalIgnoreCase))
            {
                return new LoginResponseDTO
                {
                    IsSuccess = false,
                    Message = "Employee account is not active.",
                    Expiry = DateTime.MinValue
                };
            }

            // Verify Password using BCrypt, with plain text fallback
            bool passwordValid = false;
            try
            {
                if (!string.IsNullOrEmpty(employee.PasswordHash))
                {
                    if (employee.PasswordHash.StartsWith("$2") && BCrypt.Net.BCrypt.Verify(request.Password, employee.PasswordHash))
                    {
                        passwordValid = true;
                    }
                }
            }
            catch (Exception)
            {
                passwordValid = false;
            }

            // Fallback for initial plain text seed
            if (!passwordValid && request.Password == employee.PasswordHash)
            {
                passwordValid = true;
            }

            if (!passwordValid)
            {
                return new LoginResponseDTO
                {
                    IsSuccess = false,
                    Message = "Invalid email or password.",
                    Expiry = DateTime.MinValue
                };
            }

            // Generate JWT Token
            var response = _tokenService.GenerateToken(
                employeeId: employee.EmployeeId,
                employeeName: employee.EmployeeName,
                email: employee.Email,
                role: employee.RoleName
            );

            // Generate and save Refresh Token
            var refreshToken = GenerateRefreshTokenString();
            var refreshExpiry = DateTime.UtcNow.AddDays(7);
            await _authRepository.SaveRefreshTokenAsync(employee.EmployeeId, refreshToken, refreshExpiry);

            response.RefreshToken = refreshToken;
            response.EmployeeId = employee.EmployeeId;
            response.EmployeeName = employee.EmployeeName;
            response.Email = employee.Email;
            response.Role = employee.RoleName;

            return response;
        }

        public async Task<LoginResponseDTO> RefreshTokenAsync(RefreshTokenRequestDTO request)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                return new LoginResponseDTO
                {
                    IsSuccess = false,
                    Message = "Refresh token is required.",
                    Expiry = DateTime.MinValue
                };
            }

            var employee = await _authRepository.GetEmployeeByRefreshTokenAsync(request.RefreshToken);
            if (employee == null)
            {
                return new LoginResponseDTO
                {
                    IsSuccess = false,
                    Message = "Invalid or expired refresh token.",
                    Expiry = DateTime.MinValue
                };
            }

            var response = _tokenService.GenerateToken(
                employeeId: employee.EmployeeId,
                employeeName: employee.EmployeeName,
                email: employee.Email,
                role: employee.RoleName
            );

            var newRefreshToken = GenerateRefreshTokenString();
            var refreshExpiry = DateTime.UtcNow.AddDays(7);
            await _authRepository.SaveRefreshTokenAsync(employee.EmployeeId, newRefreshToken, refreshExpiry);

            response.RefreshToken = newRefreshToken;
            response.EmployeeId = employee.EmployeeId;
            response.EmployeeName = employee.EmployeeName;
            response.Email = employee.Email;
            response.Role = employee.RoleName;

            return response;
        }

        private static string GenerateRefreshTokenString()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
