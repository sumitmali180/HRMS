using HRMS.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface ILeaveRepository
    {
        Task<IEnumerable<LeaveTypeDTO>> GetLeaveTypesAsync();
        Task<IEnumerable<LeaveBalanceDTO>> GetLeaveBalancesAsync(int employeeId, int year);
        Task<int> ApplyLeaveAsync(ApplyLeaveDTO dto);
        Task<IEnumerable<LeaveApplicationDTO>> GetEmployeeLeaveHistoryAsync(int employeeId);
        Task<IEnumerable<LeaveApplicationDTO>> GetPendingApprovalsAsync(int? managerId);
        Task<bool> ApproveOrRejectLeaveAsync(LeaveApprovalDTO dto);
        Task<bool> CancelLeaveAsync(int leaveId, int employeeId);
    }
}
