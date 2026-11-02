using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace HRMS.Infrastructure.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly string _connectionString;

        public EmployeeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<int> CreateEmployeeAsync(CreateEmployeeDTO dto)
        {
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("sp_Employee_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "CREATE");
            cmd.Parameters.AddWithValue("@EmployeeCode", dto.EmployeeCode);
            cmd.Parameters.AddWithValue("@FirstName", dto.FirstName);
            cmd.Parameters.AddWithValue("@MiddleName", (object?)dto.MiddleName ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@LastName", dto.LastName);
            cmd.Parameters.AddWithValue("@Gender", dto.Gender);
            cmd.Parameters.AddWithValue("@DOB", dto.DOB);
            cmd.Parameters.AddWithValue("@BloodGroup", (object?)dto.BloodGroup ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", dto.Email);
            cmd.Parameters.AddWithValue("@Phone", dto.Phone);
            cmd.Parameters.AddWithValue("@AlternatePhone", (object?)dto.AlternatePhone ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Address", dto.Address);
            cmd.Parameters.AddWithValue("@City", dto.City);
            cmd.Parameters.AddWithValue("@State", dto.State);
            cmd.Parameters.AddWithValue("@Country", dto.Country);
            cmd.Parameters.AddWithValue("@Pincode", dto.Pincode);
            cmd.Parameters.AddWithValue("@DepartmentId", dto.DepartmentId);
            cmd.Parameters.AddWithValue("@DesignationId", dto.DesignationId);
            cmd.Parameters.AddWithValue("@BranchId", dto.BranchId);
            cmd.Parameters.AddWithValue("@ManagerId", (object?)dto.ManagerId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@JoiningDate", dto.JoiningDate);
            cmd.Parameters.AddWithValue("@ConfirmationDate", (object?)dto.ConfirmationDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PANNo", (object?)dto.PANNo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@AadharNo", (object?)dto.AadharNo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PassportNo", (object?)dto.PassportNo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@BankName", (object?)dto.BankName ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@AccountNo", (object?)dto.AccountNo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@IFSC", (object?)dto.IFSC ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ProfilePhoto", (object?)dto.ProfilePhoto ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@RoleId", (object?)dto.RoleId ?? DBNull.Value);
            
            // Password hash if passed in DTO
            var passwordHash = !string.IsNullOrWhiteSpace(dto.Password) 
                ? (dto.Password.StartsWith("$2") ? dto.Password : BCrypt.Net.BCrypt.HashPassword(dto.Password, 11))
                : BCrypt.Net.BCrypt.HashPassword("Password@123", 11);
            cmd.Parameters.AddWithValue("@PasswordHash", passwordHash);

            cmd.Parameters.AddWithValue("@Status", dto.Status);
            cmd.Parameters.AddWithValue("@IsActive", dto.IsActive);

            await con.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateEmployeeAsync(UpdateEmployeeDTO dto)
        {
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("sp_Employee_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "UPDATE");
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@EmployeeCode", dto.EmployeeCode);
            cmd.Parameters.AddWithValue("@FirstName", dto.FirstName);
            cmd.Parameters.AddWithValue("@MiddleName", (object?)dto.MiddleName ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@LastName", dto.LastName);
            cmd.Parameters.AddWithValue("@Gender", dto.Gender);
            cmd.Parameters.AddWithValue("@DOB", dto.DOB);
            cmd.Parameters.AddWithValue("@BloodGroup", (object?)dto.BloodGroup ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Email", dto.Email);
            cmd.Parameters.AddWithValue("@Phone", dto.Phone);
            cmd.Parameters.AddWithValue("@AlternatePhone", (object?)dto.AlternatePhone ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Address", dto.Address);
            cmd.Parameters.AddWithValue("@City", dto.City);
            cmd.Parameters.AddWithValue("@State", dto.State);
            cmd.Parameters.AddWithValue("@Country", dto.Country);
            cmd.Parameters.AddWithValue("@Pincode", dto.Pincode);
            cmd.Parameters.AddWithValue("@DepartmentId", dto.DepartmentId);
            cmd.Parameters.AddWithValue("@DesignationId", dto.DesignationId);
            cmd.Parameters.AddWithValue("@BranchId", dto.BranchId);
            cmd.Parameters.AddWithValue("@ManagerId", (object?)dto.ManagerId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@JoiningDate", dto.JoiningDate);
            cmd.Parameters.AddWithValue("@ConfirmationDate", (object?)dto.ConfirmationDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PANNo", (object?)dto.PANNo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@AadharNo", (object?)dto.AadharNo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PassportNo", (object?)dto.PassportNo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@BankName", (object?)dto.BankName ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@AccountNo", (object?)dto.AccountNo ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@IFSC", (object?)dto.IFSC ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ProfilePhoto", (object?)dto.ProfilePhoto ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@RoleId", (object?)dto.RoleId ?? DBNull.Value);

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                var hash = dto.Password.StartsWith("$2") ? dto.Password : BCrypt.Net.BCrypt.HashPassword(dto.Password, 11);
                cmd.Parameters.AddWithValue("@PasswordHash", hash);
            }
            else
            {
                cmd.Parameters.AddWithValue("@PasswordHash", DBNull.Value);
            }

            cmd.Parameters.AddWithValue("@Status", dto.Status);
            cmd.Parameters.AddWithValue("@IsActive", dto.IsActive);

            await con.OpenAsync();
            var result = await cmd.ExecuteNonQueryAsync();
            return result > 0;
        }

        public async Task<bool> DeleteEmployeeAsync(int employeeId)
        {
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("sp_Employee_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "DELETE");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);

            await con.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }

        public async Task<EmployeeDTO?> GetEmployeeByIdAsync(int employeeId)
        {
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("sp_Employee_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "GETBYID");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);

            await con.OpenAsync();
            using SqlDataReader reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapEmployeeDTO(reader);
            }

            return null;
        }

        public async Task<IEnumerable<EmployeeDTO>> GetEmployeeListAsync()
        {
            List<EmployeeDTO> employees = new();
            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("sp_Employee_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "GETALL");

            await con.OpenAsync();
            using SqlDataReader reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                employees.Add(MapEmployeeDTO(reader));
            }

            return employees;
        }

        public async Task<IEnumerable<LookupDTO>> GetManagersLookupAsync()
        {
            List<LookupDTO> list = new();
            using SqlConnection con = new SqlConnection(_connectionString);
            var sql = @"SELECT EmployeeId AS Id, 
                               CONCAT(FirstName, ' ', LastName) AS Name, 
                               EmployeeCode AS Code,
                               Email AS Extra
                        FROM Employee
                        WHERE IsActive = 1
                        ORDER BY FirstName ASC";

            using SqlCommand cmd = new SqlCommand(sql, con);
            await con.OpenAsync();
            using SqlDataReader reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new LookupDTO
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Name = reader["Name"].ToString() ?? string.Empty,
                    Code = reader["Code"]?.ToString(),
                    Extra = reader["Extra"]?.ToString()
                });
            }

            return list;
        }

        public async Task<IEnumerable<LookupDTO>> GetRolesLookupAsync()
        {
            List<LookupDTO> list = new();
            using SqlConnection con = new SqlConnection(_connectionString);
            var sql = "SELECT RoleId AS Id, RoleName AS Name, Description AS Extra FROM Role WHERE IsActive = 1 ORDER BY RoleId ASC";

            using SqlCommand cmd = new SqlCommand(sql, con);
            await con.OpenAsync();
            using SqlDataReader reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new LookupDTO
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Name = reader["Name"].ToString() ?? string.Empty,
                    Extra = reader["Extra"]?.ToString()
                });
            }

            return list;
        }

        private static EmployeeDTO MapEmployeeDTO(SqlDataReader reader)
        {
            return new EmployeeDTO
            {
                EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                EmployeeCode = reader["EmployeeCode"].ToString() ?? string.Empty,
                FirstName = reader["FirstName"].ToString() ?? string.Empty,
                MiddleName = reader["MiddleName"] as string,
                LastName = reader["LastName"].ToString() ?? string.Empty,
                Gender = reader["Gender"].ToString() ?? string.Empty,
                DOB = Convert.ToDateTime(reader["DOB"]),
                BloodGroup = reader["BloodGroup"] as string,
                Email = reader["Email"].ToString() ?? string.Empty,
                Phone = reader["Phone"].ToString() ?? string.Empty,
                AlternatePhone = reader["AlternatePhone"] as string,
                Address = reader["Address"].ToString() ?? string.Empty,
                City = reader["City"].ToString() ?? string.Empty,
                State = reader["State"].ToString() ?? string.Empty,
                Country = reader["Country"].ToString() ?? string.Empty,
                Pincode = reader["Pincode"].ToString() ?? string.Empty,
                DepartmentId = reader["DepartmentId"] != DBNull.Value ? Convert.ToInt32(reader["DepartmentId"]) : 0,
                DepartmentName = HasColumn(reader, "DepartmentName") && reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString()! : string.Empty,
                DesignationId = reader["DesignationId"] != DBNull.Value ? Convert.ToInt32(reader["DesignationId"]) : 0,
                DesignationName = HasColumn(reader, "DesignationName") && reader["DesignationName"] != DBNull.Value ? reader["DesignationName"].ToString()! : string.Empty,
                BranchId = reader["BranchId"] != DBNull.Value ? Convert.ToInt32(reader["BranchId"]) : 0,
                BranchName = HasColumn(reader, "BranchName") && reader["BranchName"] != DBNull.Value ? reader["BranchName"].ToString()! : string.Empty,
                ManagerId = reader["ManagerId"] != DBNull.Value ? Convert.ToInt32(reader["ManagerId"]) : null,
                ManagerName = HasColumn(reader, "ManagerName") && reader["ManagerName"] != DBNull.Value ? reader["ManagerName"].ToString() : null,
                RoleId = HasColumn(reader, "RoleId") && reader["RoleId"] != DBNull.Value ? Convert.ToInt32(reader["RoleId"]) : null,
                RoleName = HasColumn(reader, "RoleName") && reader["RoleName"] != DBNull.Value ? reader["RoleName"].ToString() : null,
                JoiningDate = Convert.ToDateTime(reader["JoiningDate"]),
                ConfirmationDate = reader["ConfirmationDate"] != DBNull.Value ? Convert.ToDateTime(reader["ConfirmationDate"]) : null,
                PANNo = reader["PANNo"] as string,
                AadharNo = reader["AadharNo"] as string,
                PassportNo = reader["PassportNo"] as string,
                BankName = reader["BankName"] as string,
                AccountNo = reader["AccountNo"] as string,
                IFSC = reader["IFSC"] as string,
                ProfilePhoto = reader["ProfilePhoto"] as string,
                Status = reader["Status"].ToString() ?? string.Empty,
                IsActive = Convert.ToBoolean(reader["IsActive"]),
                CreatedDate = Convert.ToDateTime(reader["CreatedDate"]),
                UpdatedDate = reader["UpdatedDate"] != DBNull.Value ? Convert.ToDateTime(reader["UpdatedDate"]) : null
            };
        }

        private static bool HasColumn(SqlDataReader reader, string columnName)
        {
            for (int i = 0; i < reader.FieldCount; i++)
            {
                if (reader.GetName(i).Equals(columnName, StringComparison.OrdinalIgnoreCase))
                    return true;
            }
            return false;
        }
    }
}
