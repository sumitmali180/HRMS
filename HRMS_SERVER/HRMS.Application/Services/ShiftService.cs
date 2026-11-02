using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class ShiftService : IShiftService
    {
        private readonly IShiftRepository _shiftRepository;

        public ShiftService(IShiftRepository shiftRepository)
        {
            _shiftRepository = shiftRepository;
        }

        public async Task<IEnumerable<ShiftMasterDTO>> GetShiftsAsync()
        {
            return await _shiftRepository.GetShiftsAsync();
        }

        public async Task<int> CreateShiftAsync(CreateShiftDTO dto)
        {
            return await _shiftRepository.CreateShiftAsync(dto);
        }

        public async Task<IEnumerable<EmployeeRosterDTO>> GetRosterAsync(int? month, int? year)
        {
            return await _shiftRepository.GetRosterAsync(month, year);
        }

        public async Task<bool> AssignRosterAsync(AssignRosterDTO dto)
        {
            return await _shiftRepository.AssignRosterAsync(dto);
        }

        public async Task<IEnumerable<EmployeeRosterDTO>> GetMyRosterAsync(int employeeId, int? month, int? year)
        {
            return await _shiftRepository.GetMyRosterAsync(employeeId, month, year);
        }
    }
}
