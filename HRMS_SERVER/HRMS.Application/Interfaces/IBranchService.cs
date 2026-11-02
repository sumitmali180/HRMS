using HRMS.Application.DTOs;

namespace HRMS.Application.Interfaces
{
    public interface IBranchService
    {
        Task<IEnumerable<BranchDTO>> GetAllAsync();

        Task<BranchDTO?> GetByIdAsync(int branchId);

        Task<int> CreateAsync(BranchRequestDTO dto);

        Task<bool> UpdateAsync(int branchId,BranchRequestDTO dto);

        Task<bool> DeleteAsync(int branchId);
    }
}
