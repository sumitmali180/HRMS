namespace HRMS.Application.DTOs
{
    public class BranchDTO
    {
        public int BranchId { get; set; }

        public int CompanyId { get; set; }

        public string? BranchName { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }

        public int? ManagerId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string? BranchCode { get; set; }

        public string? Email { get; set; }
    }
}
