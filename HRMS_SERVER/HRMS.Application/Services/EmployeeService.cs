using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeeService(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<int> CreateEmployeeAsync(CreateEmployeeDTO dto)
        {
            return await _employeeRepository.CreateEmployeeAsync(dto);
        }

        public async Task<bool> UpdateEmployeeAsync(UpdateEmployeeDTO dto)
        {
            return await _employeeRepository.UpdateEmployeeAsync(dto);
        }

        public async Task<bool> DeleteEmployeeAsync(int employeeId)
        {
            return await _employeeRepository.DeleteEmployeeAsync(employeeId);
        }

        public async Task<EmployeeDTO?> GetEmployeeByIdAsync(int employeeId)
        {
            return await _employeeRepository.GetEmployeeByIdAsync(employeeId);
        }

        public async Task<IEnumerable<EmployeeDTO>> GetEmployeeListAsync()
        {
            return await _employeeRepository.GetEmployeeListAsync();
        }

        public async Task<IEnumerable<LookupDTO>> GetManagersLookupAsync()
        {
            return await _employeeRepository.GetManagersLookupAsync();
        }

        public async Task<IEnumerable<LookupDTO>> GetRolesLookupAsync()
        {
            return await _employeeRepository.GetRolesLookupAsync();
        }
    }
}