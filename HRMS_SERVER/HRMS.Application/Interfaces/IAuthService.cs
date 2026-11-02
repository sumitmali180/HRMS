using HRMS.Application.DTOs;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO request);
        Task<LoginResponseDTO> RefreshTokenAsync(RefreshTokenRequestDTO request);
    }
}