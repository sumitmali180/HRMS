using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;
        public CompanyService(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }
        public async Task<int> CreateCompanyAsync(CreateCompanyDTO createCompanyDTO)
        {
            return await _companyRepository.CreateCompanyAsync(createCompanyDTO);
        }
        public async Task<bool> UpdateCompanyAsync(UpdateCompanyDTO updateCompanyDTO)
        {
            return await _companyRepository.UpdateCompanyAsync(updateCompanyDTO);
        }
        public async Task<bool> DeleteCompanyAsync(int companyId)
        {
            return await _companyRepository.DeleteCompanyAsync(companyId);
        }

        public async Task<List<CompanyDTO>> GetAllCompaniesAsync()
        {
            return await _companyRepository.GetAllCompaniesAsync();
        }
        public async Task<CompanyDTO?> GetCompanyByIdAsync(int companyId)
        {
            return await _companyRepository.GetCompanyByIdAsync(companyId);
        }
    }
}