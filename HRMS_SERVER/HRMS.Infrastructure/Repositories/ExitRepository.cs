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
    public class ExitRepository : IExitRepository
    {
        private readonly string _connectionString;

        public ExitRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<int> SubmitResignationAsync(SubmitResignationDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Exit_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "SUBMIT_RESIGNATION");
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@NoticePeriodDays", dto.NoticePeriodDays);
            cmd.Parameters.AddWithValue("@PreferredRelievingDate", dto.PreferredRelievingDate);
            cmd.Parameters.AddWithValue("@Reason", dto.Reason);
            cmd.Parameters.AddWithValue("@Feedback", (object?)dto.Feedback ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<IEnumerable<ResignationRequestDTO>> GetMyResignationsAsync(int employeeId)
        {
            var list = new List<ResignationRequestDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Exit_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_MY_RESIGNATION");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new ResignationRequestDTO
                {
                    ResignationId = Convert.ToInt32(reader["ResignationId"]),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    SubmissionDate = Convert.ToDateTime(reader["SubmissionDate"]),
                    NoticePeriodDays = Convert.ToInt32(reader["NoticePeriodDays"]),
                    PreferredRelievingDate = Convert.ToDateTime(reader["PreferredRelievingDate"]),
                    ApprovedRelievingDate = reader["ApprovedRelievingDate"] != DBNull.Value ? Convert.ToDateTime(reader["ApprovedRelievingDate"]) : null,
                    Reason = reader["Reason"].ToString() ?? string.Empty,
                    Feedback = reader["Feedback"] != DBNull.Value ? reader["Feedback"].ToString() : null,
                    Status = reader["Status"].ToString() ?? "Pending",
                    ApprovedBy = reader["ApprovedBy"] != DBNull.Value ? Convert.ToInt32(reader["ApprovedBy"]) : null,
                    Remarks = reader["Remarks"] != DBNull.Value ? reader["Remarks"].ToString() : null
                });
            }
            return list;
        }

        public async Task<IEnumerable<ResignationRequestDTO>> GetAllResignationsAsync()
        {
            var list = new List<ResignationRequestDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Exit_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_RESIGNATIONS");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new ResignationRequestDTO
                {
                    ResignationId = Convert.ToInt32(reader["ResignationId"]),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    EmployeeName = reader["EmployeeName"] != DBNull.Value ? reader["EmployeeName"].ToString() : null,
                    EmployeeCode = reader["EmployeeCode"] != DBNull.Value ? reader["EmployeeCode"].ToString() : null,
                    DepartmentName = reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString() : null,
                    DesignationName = reader["DesignationName"] != DBNull.Value ? reader["DesignationName"].ToString() : null,
                    SubmissionDate = Convert.ToDateTime(reader["SubmissionDate"]),
                    NoticePeriodDays = Convert.ToInt32(reader["NoticePeriodDays"]),
                    PreferredRelievingDate = Convert.ToDateTime(reader["PreferredRelievingDate"]),
                    ApprovedRelievingDate = reader["ApprovedRelievingDate"] != DBNull.Value ? Convert.ToDateTime(reader["ApprovedRelievingDate"]) : null,
                    Reason = reader["Reason"].ToString() ?? string.Empty,
                    Feedback = reader["Feedback"] != DBNull.Value ? reader["Feedback"].ToString() : null,
                    Status = reader["Status"].ToString() ?? "Pending",
                    ApprovedBy = reader["ApprovedBy"] != DBNull.Value ? Convert.ToInt32(reader["ApprovedBy"]) : null,
                    Remarks = reader["Remarks"] != DBNull.Value ? reader["Remarks"].ToString() : null
                });
            }
            return list;
        }

        public async Task<bool> ActionResignationAsync(ResignationActionDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Exit_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "ACTION_RESIGNATION");
            cmd.Parameters.AddWithValue("@ResignationId", dto.ResignationId);
            cmd.Parameters.AddWithValue("@Status", dto.Status);
            cmd.Parameters.AddWithValue("@ApprovedBy", (object?)dto.ApprovedBy ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ApprovedRelievingDate", (object?)dto.ApprovedRelievingDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Remarks", (object?)dto.Remarks ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res) > 0;
        }

        public async Task<int> CalculateFnFAsync(CalculateFnFDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Exit_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "CALCULATE_FNF");
            cmd.Parameters.AddWithValue("@ResignationId", dto.ResignationId);
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@ApprovedRelievingDate", (object?)dto.LastWorkingDay ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@EarnedSalary", dto.EarnedSalary);
            cmd.Parameters.AddWithValue("@GratuityAmount", dto.GratuityAmount);
            cmd.Parameters.AddWithValue("@LeaveEncashmentAmount", dto.LeaveEncashmentAmount);
            cmd.Parameters.AddWithValue("@NoticePayAmount", dto.NoticePayAmount);
            cmd.Parameters.AddWithValue("@Deductions", dto.Deductions);
            cmd.Parameters.AddWithValue("@ApprovedBy", (object?)dto.ProcessedBy ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Remarks", (object?)dto.Remarks ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<IEnumerable<FnFSettlementDTO>> GetFnFListAsync()
        {
            var list = new List<FnFSettlementDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Exit_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_FNF_LIST");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new FnFSettlementDTO
                {
                    SettlementId = Convert.ToInt32(reader["SettlementId"]),
                    ResignationId = Convert.ToInt32(reader["ResignationId"]),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    EmployeeName = reader["EmployeeName"] != DBNull.Value ? reader["EmployeeName"].ToString() : null,
                    EmployeeCode = reader["EmployeeCode"] != DBNull.Value ? reader["EmployeeCode"].ToString() : null,
                    SettlementDate = Convert.ToDateTime(reader["SettlementDate"]),
                    LastWorkingDay = Convert.ToDateTime(reader["LastWorkingDay"]),
                    EarnedSalary = Convert.ToDecimal(reader["EarnedSalary"]),
                    GratuityAmount = Convert.ToDecimal(reader["GratuityAmount"]),
                    LeaveEncashmentAmount = Convert.ToDecimal(reader["LeaveEncashmentAmount"]),
                    NoticePayAmount = Convert.ToDecimal(reader["NoticePayAmount"]),
                    Deductions = Convert.ToDecimal(reader["Deductions"]),
                    NetPayable = Convert.ToDecimal(reader["NetPayable"]),
                    Status = reader["Status"].ToString() ?? "Approved",
                    Remarks = reader["Remarks"] != DBNull.Value ? reader["Remarks"].ToString() : null
                });
            }
            return list;
        }

        public async Task<IEnumerable<OnboardingTaskDTO>> GetOnboardingTasksAsync()
        {
            var list = new List<OnboardingTaskDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Exit_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_ONBOARDING_TASKS");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new OnboardingTaskDTO
                {
                    TaskId = Convert.ToInt32(reader["TaskId"]),
                    Title = reader["Title"].ToString() ?? string.Empty,
                    Department = reader["Department"].ToString() ?? string.Empty,
                    AssignedRole = reader["AssignedRole"].ToString() ?? string.Empty,
                    Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null,
                    IsActive = Convert.ToBoolean(reader["IsActive"])
                });
            }
            return list;
        }
    }
}
