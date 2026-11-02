using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Threading.Tasks;

namespace HRMS.Infrastructure.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly IConfiguration _configuration;

        public AuthRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private SqlConnection CreateConnection()
        {
            var connectionString = _configuration.GetConnectionString("DBCS");
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException("Database connection string 'DBCS' is not configured.");
            }
            return new SqlConnection(connectionString);
        }

        public async Task<EmployeeLoginDTO?> GetEmployeeForLoginAsync(string email)
        {
            await using var connection = CreateConnection();
            await using var command = new SqlCommand("sp_EmployeeLogin", connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Email", SqlDbType.NVarChar, 200).Value = email.Trim();

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return null;
            }

            return MapEmployeeLogin(reader);
        }

        public async Task<bool> SaveRefreshTokenAsync(int employeeId, string refreshToken, DateTime expiry)
        {
            await using var connection = CreateConnection();
            var sql = @"UPDATE Employee 
                        SET RefreshToken = @RefreshToken, 
                            RefreshTokenExpiry = @Expiry, 
                            LastLoginDate = GETDATE() 
                        WHERE EmployeeId = @EmployeeId";

            await using var command = new SqlCommand(sql, connection);
            command.Parameters.Add("@RefreshToken", SqlDbType.NVarChar, 500).Value = refreshToken;
            command.Parameters.Add("@Expiry", SqlDbType.DateTime).Value = expiry;
            command.Parameters.Add("@EmployeeId", SqlDbType.Int).Value = employeeId;

            await connection.OpenAsync();
            var rows = await command.ExecuteNonQueryAsync();
            return rows > 0;
        }

        public async Task<EmployeeLoginDTO?> GetEmployeeByRefreshTokenAsync(string refreshToken)
        {
            await using var connection = CreateConnection();
            var sql = @"SELECT e.EmployeeId, e.EmployeeCode, 
                               CONCAT(e.FirstName, ' ', ISNULL(e.MiddleName + ' ', ''), e.LastName) AS EmployeeName,
                               e.Email, e.PasswordHash, e.RoleId, ISNULL(r.RoleName, 'Employee') AS RoleName, e.Status
                        FROM Employee e
                        LEFT JOIN Role r ON e.RoleId = r.RoleId
                        WHERE e.RefreshToken = @RefreshToken 
                          AND e.RefreshTokenExpiry > GETDATE() 
                          AND e.IsActive = 1";

            await using var command = new SqlCommand(sql, connection);
            command.Parameters.Add("@RefreshToken", SqlDbType.NVarChar, 500).Value = refreshToken;

            await connection.OpenAsync();
            await using var reader = await command.ExecuteReaderAsync();

            if (!await reader.ReadAsync())
            {
                return null;
            }

            return MapEmployeeLogin(reader);
        }

        private static EmployeeLoginDTO MapEmployeeLogin(SqlDataReader reader)
        {
            return new EmployeeLoginDTO
            {
                EmployeeId = reader["EmployeeId"] == DBNull.Value ? 0 : Convert.ToInt32(reader["EmployeeId"]),
                EmployeeCode = reader["EmployeeCode"] == DBNull.Value ? string.Empty : reader["EmployeeCode"].ToString()!,
                EmployeeName = reader["EmployeeName"] == DBNull.Value ? string.Empty : reader["EmployeeName"].ToString()!,
                Email = reader["Email"] == DBNull.Value ? string.Empty : reader["Email"].ToString()!,
                PasswordHash = reader["PasswordHash"] == DBNull.Value ? string.Empty : reader["PasswordHash"].ToString()!,
                RoleId = reader["RoleId"] == DBNull.Value ? 0 : Convert.ToInt32(reader["RoleId"]),
                RoleName = reader["RoleName"] == DBNull.Value ? "Employee" : reader["RoleName"].ToString()!,
                Status = reader["Status"] == DBNull.Value ? string.Empty : reader["Status"].ToString()!
            };
        }
    }
}