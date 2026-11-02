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
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly string _connectionString;

        public ExpenseRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<IEnumerable<ExpenseCategoryDTO>> GetCategoriesAsync()
        {
            var list = new List<ExpenseCategoryDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Expense_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_CATEGORIES");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new ExpenseCategoryDTO
                {
                    ExpenseCategoryId = Convert.ToInt32(reader["ExpenseCategoryId"]),
                    CategoryName = reader["CategoryName"].ToString() ?? string.Empty,
                    Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null,
                    MaxLimit = Convert.ToDecimal(reader["MaxLimit"]),
                    IsReceiptRequired = Convert.ToBoolean(reader["IsReceiptRequired"]),
                    IsActive = Convert.ToBoolean(reader["IsActive"])
                });
            }
            return list;
        }

        public async Task<IEnumerable<ExpenseClaimDTO>> GetMyClaimsAsync(int employeeId)
        {
            var list = new List<ExpenseClaimDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Expense_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_MY_CLAIMS");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(MapExpenseClaim(reader));
            }
            return list;
        }

        public async Task<IEnumerable<ExpenseClaimDTO>> GetAllClaimsAsync()
        {
            var list = new List<ExpenseClaimDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Expense_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_ALL_CLAIMS");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(MapExpenseClaim(reader, hasEmployeeInfo: true));
            }
            return list;
        }

        public async Task<IEnumerable<ExpenseClaimDTO>> GetPendingClaimsAsync()
        {
            var list = new List<ExpenseClaimDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Expense_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_PENDING");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(MapExpenseClaim(reader, hasEmployeeInfo: true));
            }
            return list;
        }

        public async Task<int> SubmitClaimAsync(SubmitExpenseClaimDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Expense_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "INSERT");
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@ExpenseCategoryId", dto.ExpenseCategoryId);
            cmd.Parameters.AddWithValue("@ClaimDate", dto.ClaimDate ?? DateTime.Today);
            cmd.Parameters.AddWithValue("@Amount", dto.Amount);
            cmd.Parameters.AddWithValue("@Description", dto.Description);
            cmd.Parameters.AddWithValue("@ReceiptPath", (object?)dto.ReceiptPath ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<bool> ActionClaimAsync(ExpenseActionDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Expense_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "ACTION");
            cmd.Parameters.AddWithValue("@ExpenseClaimId", dto.ExpenseClaimId);
            cmd.Parameters.AddWithValue("@Status", dto.Status);
            cmd.Parameters.AddWithValue("@ApprovedBy", (object?)dto.ApprovedBy ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Remarks", (object?)dto.Remarks ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res) > 0;
        }

        public async Task<bool> DeleteClaimAsync(int claimId)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Expense_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "DELETE");
            cmd.Parameters.AddWithValue("@ExpenseClaimId", claimId);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res) > 0;
        }

        private static ExpenseClaimDTO MapExpenseClaim(SqlDataReader reader, bool hasEmployeeInfo = false)
        {
            return new ExpenseClaimDTO
            {
                ExpenseClaimId = Convert.ToInt32(reader["ExpenseClaimId"]),
                EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                EmployeeName = hasEmployeeInfo && reader["EmployeeName"] != DBNull.Value ? reader["EmployeeName"].ToString() : null,
                EmployeeCode = hasEmployeeInfo && reader["EmployeeCode"] != DBNull.Value ? reader["EmployeeCode"].ToString() : null,
                ExpenseCategoryId = Convert.ToInt32(reader["ExpenseCategoryId"]),
                CategoryName = reader["CategoryName"].ToString() ?? string.Empty,
                ClaimDate = Convert.ToDateTime(reader["ClaimDate"]),
                Amount = Convert.ToDecimal(reader["Amount"]),
                Description = reader["Description"].ToString() ?? string.Empty,
                ReceiptPath = reader["ReceiptPath"] != DBNull.Value ? reader["ReceiptPath"].ToString() : null,
                Status = reader["Status"].ToString() ?? "Pending",
                ApprovedBy = HasColumn(reader, "ApprovedBy") && reader["ApprovedBy"] != DBNull.Value ? Convert.ToInt32(reader["ApprovedBy"]) : null,
                ApprovedDate = HasColumn(reader, "ApprovedDate") && reader["ApprovedDate"] != DBNull.Value ? Convert.ToDateTime(reader["ApprovedDate"]) : null,
                Remarks = HasColumn(reader, "Remarks") && reader["Remarks"] != DBNull.Value ? reader["Remarks"].ToString() : null,
                CreatedDate = Convert.ToDateTime(reader["CreatedDate"])
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
