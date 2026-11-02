using HRMS.Application.DTOs;

namespace HRMS.Application.Interfaces
{
    public interface IDesignationService
    {
        Task<IEnumerable<DesignationDTO>> GetAllAsync();

        Task<DesignationDTO?> GetByIdAsync(int designationId);

        Task<int> CreateAsync(DesignationRequestDTO dto);

        Task<bool> UpdateAsync(int designationId,DesignationRequestDTO dto);

        Task<bool> DeleteAsync(int designationId);
    }
}
