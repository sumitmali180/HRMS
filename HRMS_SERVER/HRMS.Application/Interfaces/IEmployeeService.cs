using HRMS.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IEmployeeService
    {
        Task<int> CreateEmployeeAsync(CreateEmployeeDTO dto);
        Task<bool> UpdateEmployeeAsync(UpdateEmployeeDTO dto);
        Task<bool> DeleteEmployeeAsync(int employeeId);
        Task<EmployeeDTO?> GetEmployeeByIdAsync(int employeeId);
        Task<IEnumerable<EmployeeDTO>> GetEmployeeListAsync();
        Task<IEnumerable<LookupDTO>> GetManagersLookupAsync();
        Task<IEnumerable<LookupDTO>> GetRolesLookupAsync();
    }
}
