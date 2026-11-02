using HRMS.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IPayrollService
    {
        Task<SalaryStructureDTO?> GetSalaryStructureByEmployeeIdAsync(int employeeId);
        Task<int> SaveSalaryStructureAsync(SalaryStructureDTO dto);
        Task<bool> ProcessMonthlyPayrollAsync(ProcessPayrollDTO dto);
        Task<IEnumerable<PayrollDTO>> GetPayrollListAsync(byte month, short year, int? branchId);
        Task<PayslipDTO?> GetPayslipAsync(int payrollId);
        Task<bool> MarkAsPaidAsync(int payrollId);
    }
}
