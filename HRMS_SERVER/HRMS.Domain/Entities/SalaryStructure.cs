using System;

namespace HRMS.Domain.Entities
{
    public class SalaryStructure
    {
        public int SalaryId { get; set; }
        public int EmployeeId { get; set; }
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
}
