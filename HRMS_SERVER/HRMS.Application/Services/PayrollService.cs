using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class PayrollService : IPayrollService
    {
        private readonly IPayrollRepository _payrollRepository;

        public PayrollService(IPayrollRepository payrollRepository)
        {
            _payrollRepository = payrollRepository;
        }

        public async Task<SalaryStructureDTO?> GetSalaryStructureByEmployeeIdAsync(int employeeId)
        {
            return await _payrollRepository.GetSalaryStructureByEmployeeIdAsync(employeeId);
        }

        public async Task<int> SaveSalaryStructureAsync(SalaryStructureDTO dto)
        {
            return await _payrollRepository.SaveSalaryStructureAsync(dto);
        }

        public async Task<bool> ProcessMonthlyPayrollAsync(ProcessPayrollDTO dto)
        {
            return await _payrollRepository.ProcessMonthlyPayrollAsync(dto);
        }

        public async Task<IEnumerable<PayrollDTO>> GetPayrollListAsync(byte month, short year, int? branchId)
        {
            return await _payrollRepository.GetPayrollListAsync(month, year, branchId);
        }

        public async Task<PayslipDTO?> GetPayslipAsync(int payrollId)
        {
            return await _payrollRepository.GetPayslipAsync(payrollId);
        }

        public async Task<bool> MarkAsPaidAsync(int payrollId)
        {
            return await _payrollRepository.MarkAsPaidAsync(payrollId);
        }
    }
}
