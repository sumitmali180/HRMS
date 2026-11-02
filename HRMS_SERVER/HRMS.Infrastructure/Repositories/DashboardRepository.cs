using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;

namespace HRMS.Infrastructure.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly string _connectionString;

        public DashboardRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")
                ?? throw new InvalidOperationException("Connection string 'DBCS' not found.");
        }

        private static int GetInt(SqlDataReader reader, string col)
        {
            try
            {
                int ordinal = reader.GetOrdinal(col);
                return reader.IsDBNull(ordinal) ? 0 : Convert.ToInt32(reader.GetValue(ordinal));
            }
            catch
            {
                return 0;
            }
        }

        public DashboardDTO GetDashboard()
        {
            var dashboard = new DashboardDTO();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand("sp_Dashboard_GetDashboard", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            dashboard.TotalEmployees = GetInt(reader, "TotalEmployees");
                            dashboard.ActiveEmployees = GetInt(reader, "ActiveEmployees");
                            dashboard.InactiveEmployees = GetInt(reader, "InactiveEmployees");
                            dashboard.AdminCount = GetInt(reader, "AdminCount");
                            dashboard.SuperAdminCount = GetInt(reader, "SuperAdminCount");
                            dashboard.HRAdminCount = GetInt(reader, "HRAdminCount");
                            dashboard.ManagerCount = GetInt(reader, "ManagerCount");
                            dashboard.EmployeeCount = GetInt(reader, "EmployeeCount");
                            dashboard.TotalBranches = GetInt(reader, "TotalBranches");
                            dashboard.TotalDepartments = GetInt(reader, "TotalDepartments");
                            dashboard.TodayPresent = GetInt(reader, "TodayPresent");
                            dashboard.TodayOnLeave = GetInt(reader, "TodayOnLeave");
                            dashboard.PendingLeaves = GetInt(reader, "PendingLeaves");
                        }
                    }
                }
            }
            return dashboard;
        }
    }
}