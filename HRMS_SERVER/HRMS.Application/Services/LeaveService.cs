using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class LeaveService : ILeaveService
    {
        private readonly ILeaveRepository _leaveRepository;

        public LeaveService(ILeaveRepository leaveRepository)
        {
            _leaveRepository = leaveRepository;
        }

        public async Task<IEnumerable<LeaveTypeDTO>> GetLeaveTypesAsync()
        {
            return await _leaveRepository.GetLeaveTypesAsync();
        }

        public async Task<IEnumerable<LeaveBalanceDTO>> GetLeaveBalancesAsync(int employeeId, int year)
        {
            return await _leaveRepository.GetLeaveBalancesAsync(employeeId, year);
        }

        public async Task<int> ApplyLeaveAsync(ApplyLeaveDTO dto)
        {
            return await _leaveRepository.ApplyLeaveAsync(dto);
        }

        public async Task<IEnumerable<LeaveApplicationDTO>> GetEmployeeLeaveHistoryAsync(int employeeId)
        {
            return await _leaveRepository.GetEmployeeLeaveHistoryAsync(employeeId);
        }

        public async Task<IEnumerable<LeaveApplicationDTO>> GetPendingApprovalsAsync(int? managerId)
        {
            return await _leaveRepository.GetPendingApprovalsAsync(managerId);
        }

        public async Task<bool> ApproveOrRejectLeaveAsync(LeaveApprovalDTO dto)
        {
            return await _leaveRepository.ApproveOrRejectLeaveAsync(dto);
        }

        public async Task<bool> CancelLeaveAsync(int leaveId, int employeeId)
        {
            return await _leaveRepository.CancelLeaveAsync(leaveId, employeeId);
        }
    }
}
