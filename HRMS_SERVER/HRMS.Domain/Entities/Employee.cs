using System;
using System.Collections.Generic;
using System.Text;

namespace HRMS.Domain.Entities
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string? EmployeeCode { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public bool Gender { get; set; }
        public DateTime? DOB { get; set; }
        public string? BloodGroup { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? AlternatePhone { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public int Pincode { get; set; }
        public int DepartmentId { get; set; }
        public int DesignationId { get; set; }
        public int BranchId { get; set; }
        public int ManagerId { get; set; }
        public DateTime JoiningDate { get; set; }
        public DateTime ConfirmationDate { get; set; }
        public string? PANNo { get; set; }
        public string? AadharNo { get; set; }
        public string? PassportNo { get; set; }
        public string? BankName { get; set; }
        public string? AccountNo { get; set; }
        public string? IFSC { get; set; }
        public string? ProfilePhoto { get; set; }
        public int RoleId { get; set; }
        public string? PasswordHash { get; set; }
        public string? Status { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string? RefreshToken { get; set; }
        public string? RefreshTokenExpiry { get; set; }
        public DateTime LastLoginDate { get; set; }
        public int FailedLoginCount { get; set; }
        public bool IsLocked { get; set; }
        public string? EmergencyContactName { get; set; }
        public string? EmergencyContactNo { get; set; }
        public string? MaritalStatus { get; set; }
        public string? Nationality { get; set; }
    }
}
