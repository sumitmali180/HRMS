using System;

namespace HRMS.Application.DTOs
{
    public class SalaryStructureDTO
    {
        public int SalaryId { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeCode { get; set; }
        public string? EmployeeName { get; set; }
        public decimal Basic { get; set; }
        public decimal HRA { get; set; }
        public decimal DA { get; set; }
        public decimal TA { get; set; }
        public decimal Medical { get; set; }
        public decimal PF { get; set; }
        public decimal ProfessionalTax { get; set; }
        public decimal OtherAllowance { get; set; }
        public decimal GrossSalary { get; set; }
        public decimal NetSalary { get; set; }
        public DateTime? EffectiveFrom { get; set; }
        public DateTime? EffectiveTo { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class ProcessPayrollDTO
    {
        public byte Month { get; set; }
        public short Year { get; set; }
        public int? BranchId { get; set; }
        public int? GeneratedBy { get; set; }
    }

    public class PayrollDTO
    {
        public int PayrollId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string? DepartmentName { get; set; }
        public string? BranchName { get; set; }
        public byte PayrollMonth { get; set; }
        public short PayrollYear { get; set; }
        public int TotalWorkingDays { get; set; }
        public decimal PresentDays { get; set; }
        public decimal AbsentDays { get; set; }
        public decimal Leaves { get; set; }
        public decimal GrossSalary { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetSalary { get; set; }
        public string Status { get; set; } = "Processed";
        public DateTime? PaymentDate { get; set; }
        public DateTime GeneratedDate { get; set; }
    }

    public class PayslipDTO
    {
        public int PayrollId { get; set; }
        public byte PayrollMonth { get; set; }
        public short PayrollYear { get; set; }
        public int TotalWorkingDays { get; set; }
        public decimal PresentDays { get; set; }
        public decimal AbsentDays { get; set; }
        public decimal Leaves { get; set; }
        public decimal GrossSalary { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetSalary { get; set; }
        public string Status { get; set; } = "Processed";
        public DateTime? PaymentDate { get; set; }
        public DateTime GeneratedDate { get; set; }
        
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public DateTime? JoiningDate { get; set; }
        public string? PANNo { get; set; }
        public string? BankName { get; set; }
        public string? AccountNo { get; set; }
        public string? IFSC { get; set; }
        public string? DepartmentName { get; set; }
        public string? DesignationName { get; set; }
        public string? BranchName { get; set; }

        public string? CompanyName { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyEmail { get; set; }
        public string? CompanyPhone { get; set; }
        public string? CompanyLogo { get; set; }

        public decimal Basic { get; set; }
        public decimal HRA { get; set; }
        public decimal DA { get; set; }
        public decimal TA { get; set; }
        public decimal Medical { get; set; }
        public decimal OtherAllowance { get; set; }
        public decimal PF { get; set; }
        public decimal ProfessionalTax { get; set; }
    }
}
