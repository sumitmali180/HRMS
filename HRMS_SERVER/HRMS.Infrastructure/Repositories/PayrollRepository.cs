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
    public class PayrollRepository : IPayrollRepository
    {
        private readonly string _connectionString;

        public PayrollRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<SalaryStructureDTO?> GetSalaryStructureByEmployeeIdAsync(int employeeId)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Payroll_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "GET_STRUCTURE");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new SalaryStructureDTO
                {
                    SalaryId = Convert.ToInt32(reader["SalaryId"]),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    EmployeeName = HasColumn(reader, "EmployeeName") ? reader["EmployeeName"].ToString() : null,
                    EmployeeCode = HasColumn(reader, "EmployeeCode") ? reader["EmployeeCode"].ToString() : null,
                    Basic = Convert.ToDecimal(reader["Basic"]),
                    HRA = Convert.ToDecimal(reader["HRA"]),
                    DA = Convert.ToDecimal(reader["DA"]),
                    TA = Convert.ToDecimal(reader["TA"]),
                    Medical = Convert.ToDecimal(reader["Medical"]),
                    PF = Convert.ToDecimal(reader["PF"]),
                    ProfessionalTax = Convert.ToDecimal(reader["ProfessionalTax"]),
                    OtherAllowance = Convert.ToDecimal(reader["OtherAllowance"]),
                    GrossSalary = Convert.ToDecimal(reader["GrossSalary"]),
                    NetSalary = Convert.ToDecimal(reader["NetSalary"]),
                    EffectiveFrom = reader["EffectiveFrom"] != DBNull.Value ? Convert.ToDateTime(reader["EffectiveFrom"]) : null,
                    EffectiveTo = reader["EffectiveTo"] != DBNull.Value ? Convert.ToDateTime(reader["EffectiveTo"]) : null
                };
            }

            return null;
        }

        public async Task<int> SaveSalaryStructureAsync(SalaryStructureDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Payroll_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "SAVE_STRUCTURE");
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@Basic", dto.Basic);
            cmd.Parameters.AddWithValue("@HRA", dto.HRA);
            cmd.Parameters.AddWithValue("@DA", dto.DA);
            cmd.Parameters.AddWithValue("@TA", dto.TA);
            cmd.Parameters.AddWithValue("@Medical", dto.Medical);
            cmd.Parameters.AddWithValue("@PF", dto.PF);
            cmd.Parameters.AddWithValue("@ProfessionalTax", dto.ProfessionalTax);
            cmd.Parameters.AddWithValue("@OtherAllowance", dto.OtherAllowance);

            await con.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> ProcessMonthlyPayrollAsync(ProcessPayrollDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Payroll_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "PROCESS_MONTHLY");
            cmd.Parameters.AddWithValue("@Month", dto.Month);
            cmd.Parameters.AddWithValue("@Year", dto.Year);
            cmd.Parameters.AddWithValue("@BranchId", (object?)dto.BranchId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@GeneratedBy", (object?)dto.GeneratedBy ?? DBNull.Value);

            await con.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }

        public async Task<IEnumerable<PayrollDTO>> GetPayrollListAsync(byte month, short year, int? branchId)
        {
            var list = new List<PayrollDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Payroll_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "GET_PAYROLL_LIST");
            cmd.Parameters.AddWithValue("@Month", month);
            cmd.Parameters.AddWithValue("@Year", year);
            cmd.Parameters.AddWithValue("@BranchId", (object?)branchId ?? DBNull.Value);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new PayrollDTO
                {
                    PayrollId = Convert.ToInt32(reader["PayrollId"]),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    EmployeeCode = reader["EmployeeCode"].ToString() ?? string.Empty,
                    EmployeeName = reader["EmployeeName"].ToString() ?? string.Empty,
                    DepartmentName = reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString() : null,
                    BranchName = reader["BranchName"] != DBNull.Value ? reader["BranchName"].ToString() : null,
                    PayrollMonth = Convert.ToByte(reader["PayrollMonth"]),
                    PayrollYear = Convert.ToInt16(reader["PayrollYear"]),
                    TotalWorkingDays = Convert.ToInt32(reader["TotalWorkingDays"]),
                    PresentDays = Convert.ToDecimal(reader["PresentDays"]),
                    AbsentDays = Convert.ToDecimal(reader["AbsentDays"]),
                    Leaves = Convert.ToDecimal(reader["Leaves"]),
                    GrossSalary = Convert.ToDecimal(reader["GrossSalary"]),
                    Deductions = Convert.ToDecimal(reader["Deductions"]),
                    NetSalary = Convert.ToDecimal(reader["NetSalary"]),
                    Status = reader["Status"].ToString() ?? "Processed",
                    PaymentDate = reader["PaymentDate"] != DBNull.Value ? Convert.ToDateTime(reader["PaymentDate"]) : null,
                    GeneratedDate = Convert.ToDateTime(reader["GeneratedDate"])
                });
            }

            return list;
        }

        public async Task<PayslipDTO?> GetPayslipAsync(int payrollId)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Payroll_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "GET_PAYSLIP");
            cmd.Parameters.AddWithValue("@PayrollId", payrollId);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new PayslipDTO
                {
                    PayrollId = Convert.ToInt32(reader["PayrollId"]),
                    PayrollMonth = Convert.ToByte(reader["PayrollMonth"]),
                    PayrollYear = Convert.ToInt16(reader["PayrollYear"]),
                    TotalWorkingDays = Convert.ToInt32(reader["TotalWorkingDays"]),
                    PresentDays = Convert.ToDecimal(reader["PresentDays"]),
                    AbsentDays = Convert.ToDecimal(reader["AbsentDays"]),
                    Leaves = Convert.ToDecimal(reader["Leaves"]),
                    GrossSalary = Convert.ToDecimal(reader["GrossSalary"]),
                    Deductions = Convert.ToDecimal(reader["Deductions"]),
                    NetSalary = Convert.ToDecimal(reader["NetSalary"]),
                    Status = reader["Status"].ToString() ?? "Processed",
                    PaymentDate = reader["PaymentDate"] != DBNull.Value ? Convert.ToDateTime(reader["PaymentDate"]) : null,
                    GeneratedDate = Convert.ToDateTime(reader["GeneratedDate"]),

                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    EmployeeCode = reader["EmployeeCode"].ToString() ?? string.Empty,
                    EmployeeName = reader["EmployeeName"].ToString() ?? string.Empty,
                    Email = reader["Email"] != DBNull.Value ? reader["Email"].ToString() : null,
                    Phone = reader["Phone"] != DBNull.Value ? reader["Phone"].ToString() : null,
                    JoiningDate = reader["JoiningDate"] != DBNull.Value ? Convert.ToDateTime(reader["JoiningDate"]) : null,
                    PANNo = reader["PANNo"] != DBNull.Value ? reader["PANNo"].ToString() : null,
                    BankName = reader["BankName"] != DBNull.Value ? reader["BankName"].ToString() : null,
                    AccountNo = reader["AccountNo"] != DBNull.Value ? reader["AccountNo"].ToString() : null,
                    IFSC = reader["IFSC"] != DBNull.Value ? reader["IFSC"].ToString() : null,
                    DepartmentName = reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString() : null,
                    DesignationName = reader["DesignationName"] != DBNull.Value ? reader["DesignationName"].ToString() : null,
                    BranchName = reader["BranchName"] != DBNull.Value ? reader["BranchName"].ToString() : null,

                    CompanyName = reader["CompanyName"] != DBNull.Value ? reader["CompanyName"].ToString() : "HRMS Corp",
                    CompanyAddress = reader["CompanyAddress"] != DBNull.Value ? reader["CompanyAddress"].ToString() : null,
                    CompanyEmail = reader["CompanyEmail"] != DBNull.Value ? reader["CompanyEmail"].ToString() : null,
                    CompanyPhone = reader["CompanyPhone"] != DBNull.Value ? reader["CompanyPhone"].ToString() : null,
                    CompanyLogo = reader["CompanyLogo"] != DBNull.Value ? reader["CompanyLogo"].ToString() : null,

                    Basic = reader["Basic"] != DBNull.Value ? Convert.ToDecimal(reader["Basic"]) : 0,
                    HRA = reader["HRA"] != DBNull.Value ? Convert.ToDecimal(reader["HRA"]) : 0,
                    DA = reader["DA"] != DBNull.Value ? Convert.ToDecimal(reader["DA"]) : 0,
                    TA = reader["TA"] != DBNull.Value ? Convert.ToDecimal(reader["TA"]) : 0,
                    Medical = reader["Medical"] != DBNull.Value ? Convert.ToDecimal(reader["Medical"]) : 0,
                    OtherAllowance = reader["OtherAllowance"] != DBNull.Value ? Convert.ToDecimal(reader["OtherAllowance"]) : 0,
                    PF = reader["PF"] != DBNull.Value ? Convert.ToDecimal(reader["PF"]) : 0,
                    ProfessionalTax = reader["ProfessionalTax"] != DBNull.Value ? Convert.ToDecimal(reader["ProfessionalTax"]) : 0
                };
            }

            return null;
        }

        public async Task<bool> MarkAsPaidAsync(int payrollId)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Payroll_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "MARK_PAID");
            cmd.Parameters.AddWithValue("@PayrollId", payrollId);

            await con.OpenAsync();
            var rows = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(rows) > 0;
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
