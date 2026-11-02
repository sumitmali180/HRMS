using HRMS.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IExpenseRepository
    {
        Task<IEnumerable<ExpenseCategoryDTO>> GetCategoriesAsync();
        Task<IEnumerable<ExpenseClaimDTO>> GetMyClaimsAsync(int employeeId);
        Task<IEnumerable<ExpenseClaimDTO>> GetAllClaimsAsync();
        Task<IEnumerable<ExpenseClaimDTO>> GetPendingClaimsAsync();
        Task<int> SubmitClaimAsync(SubmitExpenseClaimDTO dto);
        Task<bool> ActionClaimAsync(ExpenseActionDTO dto);
        Task<bool> DeleteClaimAsync(int claimId);
    }

    public interface IExpenseService
    {
        Task<IEnumerable<ExpenseCategoryDTO>> GetCategoriesAsync();
        Task<IEnumerable<ExpenseClaimDTO>> GetMyClaimsAsync(int employeeId);
        Task<IEnumerable<ExpenseClaimDTO>> GetAllClaimsAsync();
        Task<IEnumerable<ExpenseClaimDTO>> GetPendingClaimsAsync();
        Task<int> SubmitClaimAsync(SubmitExpenseClaimDTO dto);
        Task<bool> ActionClaimAsync(ExpenseActionDTO dto);
        Task<bool> DeleteClaimAsync(int claimId);
    }
}
