using System;

namespace HRMS.Application.DTOs
{
    public class ExpenseCategoryDTO
    {
        public int ExpenseCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal MaxLimit { get; set; }
        public bool IsReceiptRequired { get; set; }
        public bool IsActive { get; set; }
    }

    public class ExpenseClaimDTO
    {
        public int ExpenseClaimId { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string? EmployeeCode { get; set; }
        public int ExpenseCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DateTime ClaimDate { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? ReceiptPath { get; set; }
        public string Status { get; set; } = "Pending";
        public int? ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string? Remarks { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class SubmitExpenseClaimDTO
    {
        public int EmployeeId { get; set; }
        public int ExpenseCategoryId { get; set; }
        public DateTime? ClaimDate { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? ReceiptPath { get; set; }
    }

    public class ExpenseActionDTO
    {
        public int ExpenseClaimId { get; set; }
        public string Status { get; set; } = "Approved"; // Approved or Rejected
        public int? ApprovedBy { get; set; }
        public string? Remarks { get; set; }
    }
}
