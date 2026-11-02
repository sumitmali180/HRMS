using HRMS.Application.Interfaces;
using HRMS.Domain.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace HRMS.Infrastructure.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly IConfiguration _configuration;

        public DepartmentRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private SqlConnection CreateConnection()
        {
            return new SqlConnection(_configuration.GetConnectionString("DBCS"));
        }

        // GET ALL
        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            var departments = new List<Department>();

            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Department", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Action", "GET_ALL");

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                departments.Add(new Department
                {
                    DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                    DepartmentName = reader["DepartmentName"] == DBNull.Value ? null : reader["DepartmentName"].ToString(),
                    Description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
                    BranchId = Convert.ToInt32(reader["BranchId"]),
                    CreatedDate = reader["CreatedDate"] == DBNull.Value ? null : Convert.ToDateTime(reader["CreatedDate"])
                });
            }

            return departments;
        }

        // GET BY ID
        public async Task<Department?> GetByIdAsync(int departmentId)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Department", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Action", "GET_BY_ID");
            command.Parameters.AddWithValue("@DepartmentId", departmentId);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new Department
                {
                    DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                    DepartmentName = reader["DepartmentName"] == DBNull.Value ? null : reader["DepartmentName"].ToString(),
                    Description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
                    BranchId = Convert.ToInt32(reader["BranchId"]),
                    CreatedDate = reader["CreatedDate"] == DBNull.Value ? null : Convert.ToDateTime(reader["CreatedDate"])
                };
            }

            return null;
        }

        // CREATE
        public async Task<int> CreateAsync(Department department)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Department", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Action", "INSERT");
            command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@Description", department.Description ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@BranchId", department.BranchId);

            await connection.OpenAsync();

            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        // UPDATE
        public async Task<bool> UpdateAsync(Department department)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Department", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Action", "UPDATE");
            command.Parameters.AddWithValue("@DepartmentId", department.DepartmentId);
            command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@Description", department.Description ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@BranchId", department.BranchId);

            await connection.OpenAsync();

            await command.ExecuteNonQueryAsync();
            return true;
        }

        // DELETE
        public async Task<bool> DeleteAsync(int departmentId)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Department", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Action", "DELETE");
            command.Parameters.AddWithValue("@DepartmentId", departmentId);

            await connection.OpenAsync();

            await command.ExecuteNonQueryAsync();
            return true;
        }
    }
}