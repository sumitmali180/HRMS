using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class ATSService : IATSService
    {
        private readonly IATSRepository _atsRepository;

        public ATSService(IATSRepository atsRepository)
        {
            _atsRepository = atsRepository;
        }

        public async Task<IEnumerable<JobOpeningDTO>> GetJobsAsync()
        {
            return await _atsRepository.GetJobsAsync();
        }

        public async Task<int> SaveJobAsync(CreateJobOpeningDTO dto)
        {
            return await _atsRepository.SaveJobAsync(dto);
        }

        public async Task<IEnumerable<CandidateDTO>> GetCandidatesAsync(int? jobId)
        {
            return await _atsRepository.GetCandidatesAsync(jobId);
        }

        public async Task<int> AddCandidateAsync(CreateCandidateDTO dto)
        {
            return await _atsRepository.AddCandidateAsync(dto);
        }

        public async Task<bool> UpdateStageAsync(UpdateCandidateStageDTO dto)
        {
            return await _atsRepository.UpdateStageAsync(dto);
        }
    }
}
