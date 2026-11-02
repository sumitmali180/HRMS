using HRMS.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IATSRepository
    {
        Task<IEnumerable<JobOpeningDTO>> GetJobsAsync();
        Task<int> SaveJobAsync(CreateJobOpeningDTO dto);
        Task<IEnumerable<CandidateDTO>> GetCandidatesAsync(int? jobId);
        Task<int> AddCandidateAsync(CreateCandidateDTO dto);
        Task<bool> UpdateStageAsync(UpdateCandidateStageDTO dto);
    }

    public interface IATSService
    {
        Task<IEnumerable<JobOpeningDTO>> GetJobsAsync();
        Task<int> SaveJobAsync(CreateJobOpeningDTO dto);
        Task<IEnumerable<CandidateDTO>> GetCandidatesAsync(int? jobId);
        Task<int> AddCandidateAsync(CreateCandidateDTO dto);
        Task<bool> UpdateStageAsync(UpdateCandidateStageDTO dto);
    }
}
