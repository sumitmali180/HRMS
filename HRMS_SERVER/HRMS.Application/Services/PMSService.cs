using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class PMSService : IPMSService
    {
        private readonly IPMSRepository _pmsRepository;

        public PMSService(IPMSRepository pmsRepository)
        {
            _pmsRepository = pmsRepository;
        }

        public async Task<IEnumerable<AppraisalCycleDTO>> GetCyclesAsync()
        {
            return await _pmsRepository.GetCyclesAsync();
        }

        public async Task<IEnumerable<EmployeeGoalDTO>> GetMyGoalsAsync(int employeeId, int? cycleId)
        {
            return await _pmsRepository.GetMyGoalsAsync(employeeId, cycleId);
        }

        public async Task<int> SaveGoalAsync(SaveGoalDTO dto)
        {
            return await _pmsRepository.SaveGoalAsync(dto);
        }

        public async Task<IEnumerable<AppraisalReviewDTO>> GetReviewsAsync()
        {
            return await _pmsRepository.GetReviewsAsync();
        }

        public async Task<AppraisalReviewDTO?> GetMyReviewAsync(int employeeId, int cycleId)
        {
            return await _pmsRepository.GetMyReviewAsync(employeeId, cycleId);
        }

        public async Task<bool> SubmitSelfReviewAsync(SubmitSelfReviewDTO dto)
        {
            return await _pmsRepository.SubmitSelfReviewAsync(dto);
        }

        public async Task<bool> SubmitManagerReviewAsync(SubmitManagerReviewDTO dto)
        {
            return await _pmsRepository.SubmitManagerReviewAsync(dto);
        }
    }
}
