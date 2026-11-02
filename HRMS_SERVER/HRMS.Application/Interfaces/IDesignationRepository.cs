using HRMS.Domain.Entities;

namespace HRMS.Application.Interfaces
{
    public interface IDesignationRepository
    {
        Task<IEnumerable<Designation>> GetAllAsync();

        Task<Designation?> GetByIdAsync(int designationId);

        Task<int> CreateAsync(Designation designation);

        Task<bool> UpdateAsync(Designation designation);

        Task<bool> DeleteAsync(int designationId);
    }
}
