using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class ExitService : IExitService
    {
        private readonly IExitRepository _exitRepository;

        public ExitService(IExitRepository exitRepository)
        {
            _exitRepository = exitRepository;
        }

        public async Task<int> SubmitResignationAsync(SubmitResignationDTO dto)
        {
            return await _exitRepository.SubmitResignationAsync(dto);
        }

        public async Task<IEnumerable<ResignationRequestDTO>> GetMyResignationsAsync(int employeeId)
        {
            return await _exitRepository.GetMyResignationsAsync(employeeId);
        }

        public async Task<IEnumerable<ResignationRequestDTO>> GetAllResignationsAsync()
        {
            return await _exitRepository.GetAllResignationsAsync();
        }

        public async Task<bool> ActionResignationAsync(ResignationActionDTO dto)
        {
            return await _exitRepository.ActionResignationAsync(dto);
        }

        public async Task<int> CalculateFnFAsync(CalculateFnFDTO dto)
        {
            return await _exitRepository.CalculateFnFAsync(dto);
        }

        public async Task<IEnumerable<FnFSettlementDTO>> GetFnFListAsync()
        {
            return await _exitRepository.GetFnFListAsync();
        }

        public async Task<IEnumerable<OnboardingTaskDTO>> GetOnboardingTasksAsync()
        {
            return await _exitRepository.GetOnboardingTasksAsync();
        }
    }
}
