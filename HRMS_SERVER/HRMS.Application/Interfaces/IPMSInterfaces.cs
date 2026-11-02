using HRMS.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IPMSRepository
    {
        Task<IEnumerable<AppraisalCycleDTO>> GetCyclesAsync();
        Task<IEnumerable<EmployeeGoalDTO>> GetMyGoalsAsync(int employeeId, int? cycleId);
        Task<int> SaveGoalAsync(SaveGoalDTO dto);
        Task<IEnumerable<AppraisalReviewDTO>> GetReviewsAsync();
        Task<AppraisalReviewDTO?> GetMyReviewAsync(int employeeId, int cycleId);
        Task<bool> SubmitSelfReviewAsync(SubmitSelfReviewDTO dto);
        Task<bool> SubmitManagerReviewAsync(SubmitManagerReviewDTO dto);
    }

    public interface IPMSService
    {
        Task<IEnumerable<AppraisalCycleDTO>> GetCyclesAsync();
        Task<IEnumerable<EmployeeGoalDTO>> GetMyGoalsAsync(int employeeId, int? cycleId);
        Task<int> SaveGoalAsync(SaveGoalDTO dto);
        Task<IEnumerable<AppraisalReviewDTO>> GetReviewsAsync();
        Task<AppraisalReviewDTO?> GetMyReviewAsync(int employeeId, int cycleId);
        Task<bool> SubmitSelfReviewAsync(SubmitSelfReviewDTO dto);
        Task<bool> SubmitManagerReviewAsync(SubmitManagerReviewDTO dto);
    }
}
