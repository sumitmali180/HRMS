using System;

namespace HRMS.Application.DTOs
{
    public class UpdateEmployeeDTO
    {
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime DOB { get; set; }
        public string? BloodGroup { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? AlternatePhone { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
        public int BranchId { get; set; }
        public int? ManagerId { get; set; }
        public DateTime JoiningDate { get; set; }
        public DateTime? ConfirmationDate { get; set; }
        public string? PANNo { get; set; }
        public string? AadharNo { get; set; }
        public string? PassportNo { get; set; }
        public string? BankName { get; set; }
        public string? AccountNo { get; set; }
        public string? IFSC { get; set; }
        public string? ProfilePhoto { get; set; }
        public int? RoleId { get; set; }
        public string? Password { get; set; }
        public string Status { get; set; } = "Active";
        public bool IsActive { get; set; } = true;
    }
}
