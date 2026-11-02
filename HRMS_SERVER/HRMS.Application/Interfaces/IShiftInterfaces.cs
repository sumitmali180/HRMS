using HRMS.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IShiftRepository
    {
        Task<IEnumerable<ShiftMasterDTO>> GetShiftsAsync();
        Task<int> CreateShiftAsync(CreateShiftDTO dto);
        Task<IEnumerable<EmployeeRosterDTO>> GetRosterAsync(int? month, int? year);
        Task<bool> AssignRosterAsync(AssignRosterDTO dto);
        Task<IEnumerable<EmployeeRosterDTO>> GetMyRosterAsync(int employeeId, int? month, int? year);
    }

    public interface IShiftService
    {
        Task<IEnumerable<ShiftMasterDTO>> GetShiftsAsync();
        Task<int> CreateShiftAsync(CreateShiftDTO dto);
        Task<IEnumerable<EmployeeRosterDTO>> GetRosterAsync(int? month, int? year);
        Task<bool> AssignRosterAsync(AssignRosterDTO dto);
        Task<IEnumerable<EmployeeRosterDTO>> GetMyRosterAsync(int employeeId, int? month, int? year);
    }
}
