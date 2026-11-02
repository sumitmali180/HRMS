using HRMS.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IExitRepository
    {
        Task<int> SubmitResignationAsync(SubmitResignationDTO dto);
        Task<IEnumerable<ResignationRequestDTO>> GetMyResignationsAsync(int employeeId);
        Task<IEnumerable<ResignationRequestDTO>> GetAllResignationsAsync();
        Task<bool> ActionResignationAsync(ResignationActionDTO dto);
        Task<int> CalculateFnFAsync(CalculateFnFDTO dto);
        Task<IEnumerable<FnFSettlementDTO>> GetFnFListAsync();
        Task<IEnumerable<OnboardingTaskDTO>> GetOnboardingTasksAsync();
    }

    public interface IExitService
    {
        Task<int> SubmitResignationAsync(SubmitResignationDTO dto);
        Task<IEnumerable<ResignationRequestDTO>> GetMyResignationsAsync(int employeeId);
        Task<IEnumerable<ResignationRequestDTO>> GetAllResignationsAsync();
        Task<bool> ActionResignationAsync(ResignationActionDTO dto);
        Task<int> CalculateFnFAsync(CalculateFnFDTO dto);
        Task<IEnumerable<FnFSettlementDTO>> GetFnFListAsync();
        Task<IEnumerable<OnboardingTaskDTO>> GetOnboardingTasksAsync();
    }
}
