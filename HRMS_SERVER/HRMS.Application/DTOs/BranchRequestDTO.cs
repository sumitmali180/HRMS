namespace HRMS.Application.DTOs
{
    public class BranchRequestDTO
    {
        public int CompanyId { get; set; }

        public string? BranchName { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }

        public int? ManagerId { get; set; }

        public string? BranchCode { get; set; }

        public string? Email { get; set; }
    }
}
