using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class ExpenseService : IExpenseService
    {
        private readonly IExpenseRepository _expenseRepository;

        public ExpenseService(IExpenseRepository expenseRepository)
        {
            _expenseRepository = expenseRepository;
        }

        public async Task<IEnumerable<ExpenseCategoryDTO>> GetCategoriesAsync()
        {
            return await _expenseRepository.GetCategoriesAsync();
        }

        public async Task<IEnumerable<ExpenseClaimDTO>> GetMyClaimsAsync(int employeeId)
        {
            return await _expenseRepository.GetMyClaimsAsync(employeeId);
        }

        public async Task<IEnumerable<ExpenseClaimDTO>> GetAllClaimsAsync()
        {
            return await _expenseRepository.GetAllClaimsAsync();
        }

        public async Task<IEnumerable<ExpenseClaimDTO>> GetPendingClaimsAsync()
        {
            return await _expenseRepository.GetPendingClaimsAsync();
        }

        public async Task<int> SubmitClaimAsync(SubmitExpenseClaimDTO dto)
        {
            return await _expenseRepository.SubmitClaimAsync(dto);
        }

        public async Task<bool> ActionClaimAsync(ExpenseActionDTO dto)
        {
            return await _expenseRepository.ActionClaimAsync(dto);
        }

        public async Task<bool> DeleteClaimAsync(int claimId)
        {
            return await _expenseRepository.DeleteClaimAsync(claimId);
        }
    }
}
