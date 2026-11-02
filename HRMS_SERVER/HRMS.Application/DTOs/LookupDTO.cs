namespace HRMS.Application.DTOs
{
    public class LookupDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string? Extra { get; set; }
    }
}
