using System;

namespace HRMS.Application.DTOs
{
    public class DashboardDTO
    {
        public int TotalEmployees { get; set; }
        public int ActiveEmployees { get; set; }
        public int InactiveEmployees { get; set; }
        public int AdminCount { get; set; }
        public int SuperAdminCount { get; set; }
        public int HRAdminCount { get; set; }
        public int ManagerCount { get; set; }
        public int EmployeeCount { get; set; }
        public int TotalBranches { get; set; }
        public int TotalDepartments { get; set; }
        public int TodayPresent { get; set; }
        public int TodayOnLeave { get; set; }
        public int PendingLeaves { get; set; }
    }
}