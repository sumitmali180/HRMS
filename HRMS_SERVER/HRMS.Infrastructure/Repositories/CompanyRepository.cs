using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace HRMS.Infrastructure.Repositories
{
    public class CompanyRepository: ICompanyRepository
    {
        private readonly string _connectionString;
        public CompanyRepository(IConfiguration configuration)
        {
           _connectionString =configuration.GetConnectionString("DBCS")!;
        }
        #region Create Company

        public async Task<int> CreateCompanyAsync(CreateCompanyDTO dto)
        {
            using SqlConnection connection = new SqlConnection(_connectionString);

            using SqlCommand command = new SqlCommand("sp_Company", connection);

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.Add("@Flag", SqlDbType.VarChar).Value = "INSERT";
            command.Parameters.Add("@CompanyName", SqlDbType.NVarChar).Value = dto.CompanyName;
            command.Parameters.Add("@GSTNo", SqlDbType.NVarChar).Value = (object?)dto.GSTNo ?? DBNull.Value;
            command.Parameters.Add("@Address", SqlDbType.NVarChar).Value = (object?)dto.Address ?? DBNull.Value;
            command.Parameters.Add("@Phone", SqlDbType.VarChar).Value = (object?)dto.Phone ?? DBNull.Value;
            command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = (object?)dto.Email ?? DBNull.Value;
            command.Parameters.Add("@Logo", SqlDbType.NVarChar).Value = (object?)dto.Logo ?? DBNull.Value;
            command.Parameters.Add("@Website", SqlDbType.NVarChar).Value = (object?)dto.Website ?? DBNull.Value;
            command.Parameters.Add("@Currency", SqlDbType.NVarChar).Value = (object?)dto.Currency ?? DBNull.Value;
            command.Parameters.Add("@TimeZone", SqlDbType.NVarChar).Value = (object?)dto.TimeZone ?? DBNull.Value;
            command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = dto.IsActive;

            await connection.OpenAsync();

            using SqlDataReader reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                int status = Convert.ToInt32(reader["Status"]);

                if (status == 1)
                    return Convert.ToInt32(reader["CompanyId"]);
            }

            return 0;
        }
        #endregion

        #region Update Company
        public async Task<bool> UpdateCompanyAsync(UpdateCompanyDTO dto)
        {
            using SqlConnection connection = new SqlConnection(_connectionString);

            using SqlCommand command = new SqlCommand("sp_Company", connection);

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.Add("@Flag", SqlDbType.VarChar).Value = "UPDATE";
            command.Parameters.Add("@CompanyId", SqlDbType.Int).Value = dto.CompanyId;
            command.Parameters.Add("@CompanyName", SqlDbType.NVarChar).Value = dto.CompanyName;
            command.Parameters.Add("@GSTNo", SqlDbType.NVarChar).Value = (object?)dto.GSTNo ?? DBNull.Value;
            command.Parameters.Add("@Address", SqlDbType.NVarChar).Value = (object?)dto.Address ?? DBNull.Value;
            command.Parameters.Add("@Phone", SqlDbType.VarChar).Value = (object?)dto.Phone ?? DBNull.Value;
            command.Parameters.Add("@Email", SqlDbType.NVarChar).Value = (object?)dto.Email ?? DBNull.Value;
            command.Parameters.Add("@Logo", SqlDbType.NVarChar).Value = (object?)dto.Logo ?? DBNull.Value;
            command.Parameters.Add("@Website", SqlDbType.NVarChar).Value = (object?)dto.Website ?? DBNull.Value;
            command.Parameters.Add("@Currency", SqlDbType.NVarChar).Value = (object?)dto.Currency ?? DBNull.Value;
            command.Parameters.Add("@TimeZone", SqlDbType.NVarChar).Value = (object?)dto.TimeZone ?? DBNull.Value;
            command.Parameters.Add("@IsActive", SqlDbType.Bit).Value = dto.IsActive;

            await connection.OpenAsync();

            using SqlDataReader reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return Convert.ToInt32(reader["Status"]) == 1;
            }

            return false;
        }
        #endregion

        #region Delete Company
        public async Task<bool> DeleteCompanyAsync(int companyId)
        {
            using SqlConnection connection = new SqlConnection(_connectionString);

            using SqlCommand command = new SqlCommand("sp_Company", connection);

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.Add("@Flag", SqlDbType.VarChar).Value = "DELETE";
            command.Parameters.Add("@CompanyId", SqlDbType.Int).Value = companyId;

            await connection.OpenAsync();

            using SqlDataReader reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return Convert.ToInt32(reader["Status"]) == 1;
            }

            return false;
        }
        #endregion

        #region GetAll Company
        public async Task<List<CompanyDTO>> GetAllCompaniesAsync()
        {
            List<CompanyDTO> companies = new();

            using SqlConnection connection = new SqlConnection(_connectionString);

            using SqlCommand command = new SqlCommand("sp_Company", connection);

            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Flag", SqlDbType.VarChar).Value = "GETALL";

            await connection.OpenAsync();

            using SqlDataReader reader = await command.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                companies.Add(new CompanyDTO
                {
                    CompanyId = Convert.ToInt32(reader["CompanyId"]),
                    CompanyName = reader["CompanyName"].ToString()!,
                    GSTNo = reader["GSTNo"]?.ToString(),
                    Address = reader["Address"]?.ToString(),
                    Phone = reader["Phone"]?.ToString(),
                    Email = reader["Email"]?.ToString(),
                    Logo = reader["Logo"]?.ToString(),
                    Website = reader["Website"]?.ToString(),
                    Currency = reader["Currency"]?.ToString(),
                    TimeZone = reader["TimeZone"]?.ToString(),
                    IsActive = Convert.ToBoolean(reader["IsActive"]),
                    CreatedDate = Convert.ToDateTime(reader["CreatedDate"])
                });
            }

            return companies;
        }

        #endregion

        #region GetByID Company
        public async Task<CompanyDTO?> GetCompanyByIdAsync(int companyId)
        {
            using SqlConnection connection = new SqlConnection(_connectionString);

            using SqlCommand command = new SqlCommand("sp_Company", connection);

            command.CommandType = CommandType.StoredProcedure;

            command.Parameters.Add("@Flag", SqlDbType.VarChar).Value = "GETBYID";
            command.Parameters.Add("@CompanyId", SqlDbType.Int).Value = companyId;

            await connection.OpenAsync();

            using SqlDataReader reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new CompanyDTO
                {
                    CompanyId = Convert.ToInt32(reader["CompanyId"]),
                    CompanyName = reader["CompanyName"].ToString()!,
                    GSTNo = reader["GSTNo"]?.ToString(),
                    Address = reader["Address"]?.ToString(),
                    Phone = reader["Phone"]?.ToString(),
                    Email = reader["Email"]?.ToString(),
                    Logo = reader["Logo"]?.ToString(),
                    Website = reader["Website"]?.ToString(),
                    Currency = reader["Currency"]?.ToString(),
                    TimeZone = reader["TimeZone"]?.ToString(),
                    IsActive = Convert.ToBoolean(reader["IsActive"]),
                    CreatedDate = Convert.ToDateTime(reader["CreatedDate"])
                };
            }

            return null;
        }
        #endregion
    }
}
