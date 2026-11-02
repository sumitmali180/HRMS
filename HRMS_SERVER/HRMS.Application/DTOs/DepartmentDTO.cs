namespace HRMS.Application.DTOs
{
    public class DepartmentDTO
    {
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public string? Description { get; set; }
        public int BranchId { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}