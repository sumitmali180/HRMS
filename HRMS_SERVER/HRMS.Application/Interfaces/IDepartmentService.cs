using HRMS.Application.DTOs;

namespace HRMS.Application.Interfaces
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentDTO>> GetAllAsync();

        Task<DepartmentDTO?> GetByIdAsync(int departmentId);

        Task<int> CreateAsync(DepartmentRequestDTO dto);

        Task<bool> UpdateAsync(int departmentId,DepartmentRequestDTO dto);

        Task<bool> DeleteAsync(int departmentId);
    }
}