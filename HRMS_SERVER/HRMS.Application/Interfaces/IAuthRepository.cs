using HRMS.Application.DTOs;
using System;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IAuthRepository
    {
        Task<EmployeeLoginDTO?> GetEmployeeForLoginAsync(string email);
        Task<bool> SaveRefreshTokenAsync(int employeeId, string refreshToken, DateTime expiry);
        Task<EmployeeLoginDTO?> GetEmployeeByRefreshTokenAsync(string refreshToken);
    }
}