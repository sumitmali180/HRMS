using System;

namespace HRMS.Domain.Entities
{
    public class Payroll
    {
        public int PayrollId { get; set; }
        public int EmployeeId { get; set; }
        public byte PayrollMonth { get; set; }
        public short PayrollYear { get; set; }
        public int TotalWorkingDays { get; set; } = 30;
        public decimal PresentDays { get; set; }
        public decimal AbsentDays { get; set; }
        public decimal Leaves { get; set; }
        public decimal GrossSalary { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetSalary { get; set; }
        public DateTime GeneratedDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Processed";
        public DateTime? PaymentDate { get; set; }
        public string? PayslipPath { get; set; }
        public int? GeneratedBy { get; set; }
    }
}
