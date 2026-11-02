using HRMS.Application.DTOs;
using HRMS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRMS.Application.Interfaces
{
    public interface ICompanyRepository
    {
        Task<int>CreateCompanyAsync(CreateCompanyDTO createCompanyDTO);
        Task<bool> UpdateCompanyAsync(UpdateCompanyDTO updateCompanyDTO);
        Task<bool> DeleteCompanyAsync(int companyId);
        Task<List<CompanyDTO>> GetAllCompaniesAsync();
        Task<CompanyDTO?> GetCompanyByIdAsync(int companyId);

    }
}
