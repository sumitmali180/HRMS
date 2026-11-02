using HRMS.Domain.Entities;

namespace HRMS.Application.Interfaces
{
    public interface IBranchRepository
    {
        Task<IEnumerable<Branch>> GetAllAsync();

        Task<Branch?> GetByIdAsync(int branchId);

        Task<int> CreateAsync(Branch branch);

        Task<bool> UpdateAsync(Branch branch);

        Task<bool> DeleteAsync(int branchId);
    }
}
