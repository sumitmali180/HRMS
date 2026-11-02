using HRMS.Application.Interfaces;
using HRMS.Domain.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace HRMS.Infrastructure.Repositories
{
    public class DesignationRepository : IDesignationRepository
    {
        private readonly IConfiguration _configuration;

        public DesignationRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private SqlConnection CreateConnection()
        {
            return new SqlConnection(_configuration.GetConnectionString("DBCS"));
        }

        // GET ALL
        public async Task<IEnumerable<Designation>> GetAllAsync()
        {
            var designations = new List<Designation>();

            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Designation", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Action", SqlDbType.VarChar, 20).Value = "GET_ALL";

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                designations.Add(new Designation
                {
                    DesignationId = Convert.ToInt32(reader["DesignationId"]),
                    DesignationName = reader["DesignationName"] == DBNull.Value ? null : reader["DesignationName"].ToString(),
                    Grade = reader["Grade"] == DBNull.Value ? null : reader["Grade"].ToString(),
                    BasicSalary = reader["BasicSalary"] == DBNull.Value ? null : Convert.ToDecimal(reader["BasicSalary"]),
                    Description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
                    CreatedDate = Convert.ToDateTime(reader["CreatedDate"])
                });
            }

            return designations;
        }

        // GET BY ID
        public async Task<Designation?> GetByIdAsync(int designationId)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Designation", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Action", SqlDbType.VarChar, 20).Value = "GET_BY_ID";
            command.Parameters.Add("@DesignationId", SqlDbType.Int).Value = designationId;

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new Designation
                {
                    DesignationId = Convert.ToInt32(reader["DesignationId"]),
                    DesignationName = reader["DesignationName"] == DBNull.Value ? null : reader["DesignationName"].ToString(),
                    Grade = reader["Grade"] == DBNull.Value ? null : reader["Grade"].ToString(),
                    BasicSalary = reader["BasicSalary"] == DBNull.Value ? null : Convert.ToDecimal(reader["BasicSalary"]),
                    Description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
                    CreatedDate = Convert.ToDateTime(reader["CreatedDate"])
                };
            }

            return null;
        }

        // CREATE
        public async Task<int> CreateAsync(Designation designation)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Designation", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Action", SqlDbType.VarChar, 20).Value = "INSERT";
            command.Parameters.Add("@DesignationName", SqlDbType.NVarChar, 100).Value = (object?)designation.DesignationName ?? DBNull.Value;
            command.Parameters.Add("@Grade", SqlDbType.NVarChar, 50).Value = (object?)designation.Grade ?? DBNull.Value;
            command.Parameters.Add("@BasicSalary", SqlDbType.Decimal).Value = (object?)designation.BasicSalary ?? DBNull.Value;
            command.Parameters.Add("@Description", SqlDbType.NVarChar, 500).Value = (object?)designation.Description ?? DBNull.Value;

            await connection.OpenAsync();

            var result = await command.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        // UPDATE
        public async Task<bool> UpdateAsync(Designation designation)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Designation", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Action", SqlDbType.VarChar, 20).Value = "UPDATE";
            command.Parameters.Add("@DesignationId", SqlDbType.Int).Value = designation.DesignationId;
            command.Parameters.Add("@DesignationName", SqlDbType.NVarChar, 100).Value = (object?)designation.DesignationName ?? DBNull.Value;
            command.Parameters.Add("@Grade", SqlDbType.NVarChar, 50).Value = (object?)designation.Grade ?? DBNull.Value;
            command.Parameters.Add("@BasicSalary", SqlDbType.Decimal).Value = (object?)designation.BasicSalary ?? DBNull.Value;
            command.Parameters.Add("@Description", SqlDbType.NVarChar, 500).Value = (object?)designation.Description ?? DBNull.Value;

            await connection.OpenAsync();

            await command.ExecuteNonQueryAsync();
            return true;
        }

        // DELETE
        public async Task<bool> DeleteAsync(int designationId)
        {
            using var connection = CreateConnection();
            using var command = new SqlCommand("SP_Designation", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Action", SqlDbType.VarChar, 20).Value = "DELETE";
            command.Parameters.Add("@DesignationId", SqlDbType.Int).Value = designationId;

            await connection.OpenAsync();

            await command.ExecuteNonQueryAsync();
            return true;
        }
    }
}