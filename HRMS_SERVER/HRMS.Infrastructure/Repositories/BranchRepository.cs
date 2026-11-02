using HRMS.Application.Interfaces;
using HRMS.Domain.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace HRMS.Infrastructure.Repositories
{
    public class BranchRepository : IBranchRepository
    {
        private readonly IConfiguration _configuration;

        public BranchRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private SqlConnection CreateConnection()
        {
            return new SqlConnection(_configuration.GetConnectionString("DBCS"));
        }

        // GET ALL
        public async Task<IEnumerable<Branch>> GetAllAsync()
        {
            var branches = new List<Branch>();

            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Branch", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Action", SqlDbType.VarChar, 20).Value = "GET_ALL";

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                branches.Add(new Branch
                {
                    BranchId = Convert.ToInt32(reader["BranchId"]),
                    CompanyId = Convert.ToInt32(reader["CompanyId"]),
                    BranchName = reader["BranchName"] == DBNull.Value ? null : reader["BranchName"].ToString(),
                    Address = reader["Address"] == DBNull.Value ? null : reader["Address"].ToString(),
                    Phone = reader["Phone"] == DBNull.Value ? null : reader["Phone"].ToString(),
                    ManagerId = reader["ManagerId"] == DBNull.Value ? null : Convert.ToInt32(reader["ManagerId"]),
                    CreatedDate = reader["CreatedDate"] == DBNull.Value ? null : Convert.ToDateTime(reader["CreatedDate"]),
                    BranchCode = reader["BranchCode"] == DBNull.Value ? null : reader["BranchCode"].ToString(),
                    Email = reader["Email"] == DBNull.Value ? null : reader["Email"].ToString()
                });
            }

            return branches;
        }

        // GET BY ID
        public async Task<Branch?> GetByIdAsync(int branchId)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Branch", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Action", SqlDbType.VarChar, 20).Value = "GET_BY_ID";
            command.Parameters.Add("@BranchId", SqlDbType.Int).Value = branchId;

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new Branch
                {
                    BranchId = Convert.ToInt32(reader["BranchId"]),
                    CompanyId = Convert.ToInt32(reader["CompanyId"]),
                    BranchName = reader["BranchName"] == DBNull.Value ? null : reader["BranchName"].ToString(),
                    Address = reader["Address"] == DBNull.Value ? null : reader["Address"].ToString(),
                    Phone = reader["Phone"] == DBNull.Value ? null : reader["Phone"].ToString(),
                    ManagerId = reader["ManagerId"] == DBNull.Value ? null : Convert.ToInt32(reader["ManagerId"]),
                    CreatedDate = reader["CreatedDate"] == DBNull.Value ? null : Convert.ToDateTime(reader["CreatedDate"]),
                    BranchCode = reader["BranchCode"] == DBNull.Value ? null : reader["BranchCode"].ToString(),
                    Email = reader["Email"] == DBNull.Value ? null : reader["Email"].ToString()
                };
            }

            return null;
        }

        // CREATE
        public async Task<int> CreateAsync(Branch branch)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Branch", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Action", SqlDbType.VarChar, 20).Value = "INSERT";
            command.Parameters.Add("@CompanyId", SqlDbType.Int).Value = branch.CompanyId;
            command.Parameters.Add("@BranchName", SqlDbType.NVarChar, 100).Value = (object?)branch.BranchName ?? DBNull.Value;
            command.Parameters.Add("@Address", SqlDbType.NVarChar, 500).Value = (object?)branch.Address ?? DBNull.Value;
            command.Parameters.Add("@Phone", SqlDbType.NVarChar, 20).Value = (object?)branch.Phone ?? DBNull.Value;
            command.Parameters.Add("@ManagerId", SqlDbType.Int).Value = (object?)branch.ManagerId ?? DBNull.Value;
            command.Parameters.Add("@BranchCode", SqlDbType.NVarChar, 50).Value = (object?)branch.BranchCode ?? DBNull.Value;
            command.Parameters.Add("@Email", SqlDbType.NVarChar, 150).Value = (object?)branch.Email ?? DBNull.Value;

            await connection.OpenAsync();

            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        // UPDATE
        public async Task<bool> UpdateAsync(Branch branch)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Branch", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Action", SqlDbType.VarChar, 20).Value = "UPDATE";
            command.Parameters.Add("@BranchId", SqlDbType.Int).Value = branch.BranchId;
            command.Parameters.Add("@CompanyId", SqlDbType.Int).Value = branch.CompanyId;
            command.Parameters.Add("@BranchName", SqlDbType.NVarChar, 100).Value = (object?)branch.BranchName ?? DBNull.Value;
            command.Parameters.Add("@Address", SqlDbType.NVarChar, 500).Value = (object?)branch.Address ?? DBNull.Value;
            command.Parameters.Add("@Phone", SqlDbType.NVarChar, 20).Value = (object?)branch.Phone ?? DBNull.Value;
            command.Parameters.Add("@ManagerId", SqlDbType.Int).Value = (object?)branch.ManagerId ?? DBNull.Value;
            command.Parameters.Add("@BranchCode", SqlDbType.NVarChar, 50).Value = (object?)branch.BranchCode ?? DBNull.Value;
            command.Parameters.Add("@Email", SqlDbType.NVarChar, 150).Value = (object?)branch.Email ?? DBNull.Value;

            await connection.OpenAsync();

            await command.ExecuteNonQueryAsync();
            return true;
        }

        // DELETE
        public async Task<bool> DeleteAsync(int branchId)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Branch", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Action", SqlDbType.VarChar, 20).Value = "DELETE";
            command.Parameters.Add("@BranchId", SqlDbType.Int).Value = branchId;

            await connection.OpenAsync();

            await command.ExecuteNonQueryAsync();
            return true;
        }
    }
}