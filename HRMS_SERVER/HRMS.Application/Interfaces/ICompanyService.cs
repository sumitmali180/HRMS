using HRMS.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRMS.Application.Interfaces
{
    public interface ICompanyService
    {
        Task<int> CreateCompanyAsync(CreateCompanyDTO createCompanyDTO);
        Task<bool> UpdateCompanyAsync(UpdateCompanyDTO updateCompanyDTO);
        Task<bool> DeleteCompanyAsync(int companyId);
        Task<List<CompanyDTO>> GetAllCompaniesAsync();
        Task<CompanyDTO?> GetCompanyByIdAsync(int companyId);

    }
}
