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
    public class PMSRepository : IPMSRepository
    {
        private readonly string _connectionString;

        public PMSRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<IEnumerable<AppraisalCycleDTO>> GetCyclesAsync()
        {
            var list = new List<AppraisalCycleDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_PMS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_CYCLES");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new AppraisalCycleDTO
                {
                    CycleId = Convert.ToInt32(reader["CycleId"]),
                    CycleName = reader["CycleName"].ToString() ?? string.Empty,
                    StartDate = Convert.ToDateTime(reader["StartDate"]),
                    EndDate = Convert.ToDateTime(reader["EndDate"]),
                    ReviewDeadline = Convert.ToDateTime(reader["ReviewDeadline"]),
                    Status = reader["Status"].ToString() ?? "Active"
                });
            }
            return list;
        }

        public async Task<IEnumerable<EmployeeGoalDTO>> GetMyGoalsAsync(int employeeId, int? cycleId)
        {
            var list = new List<EmployeeGoalDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_PMS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_MY_GOALS");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);
            cmd.Parameters.AddWithValue("@CycleId", (object?)cycleId ?? DBNull.Value);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new EmployeeGoalDTO
                {
                    GoalId = Convert.ToInt32(reader["GoalId"]),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    CycleId = Convert.ToInt32(reader["CycleId"]),
                    Title = reader["Title"].ToString() ?? string.Empty,
                    Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null,
                    TargetMetric = reader["TargetMetric"] != DBNull.Value ? reader["TargetMetric"].ToString() : null,
                    ProgressPercent = Convert.ToInt32(reader["ProgressPercent"]),
                    Weightage = Convert.ToInt32(reader["Weightage"]),
                    Status = reader["Status"].ToString() ?? "InProgress",
                    CreatedDate = Convert.ToDateTime(reader["CreatedDate"])
                });
            }
            return list;
        }

        public async Task<int> SaveGoalAsync(SaveGoalDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_PMS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "SAVE_GOAL");
            cmd.Parameters.AddWithValue("@GoalId", (object?)dto.GoalId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@CycleId", dto.CycleId);
            cmd.Parameters.AddWithValue("@Title", dto.Title);
            cmd.Parameters.AddWithValue("@Description", (object?)dto.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@TargetMetric", (object?)dto.TargetMetric ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ProgressPercent", dto.ProgressPercent);
            cmd.Parameters.AddWithValue("@Weightage", dto.Weightage);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<IEnumerable<AppraisalReviewDTO>> GetReviewsAsync()
        {
            var list = new List<AppraisalReviewDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_PMS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_REVIEWS");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new AppraisalReviewDTO
                {
                    ReviewId = Convert.ToInt32(reader["ReviewId"]),
                    CycleId = Convert.ToInt32(reader["CycleId"]),
                    CycleName = reader["CycleName"].ToString(),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    EmployeeName = reader["EmployeeName"] != DBNull.Value ? reader["EmployeeName"].ToString() : null,
                    EmployeeCode = reader["EmployeeCode"] != DBNull.Value ? reader["EmployeeCode"].ToString() : null,
                    DepartmentName = reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString() : null,
                    SelfRating = reader["SelfRating"] != DBNull.Value ? Convert.ToDecimal(reader["SelfRating"]) : null,
                    SelfComments = reader["SelfComments"] != DBNull.Value ? reader["SelfComments"].ToString() : null,
                    ManagerRating = reader["ManagerRating"] != DBNull.Value ? Convert.ToDecimal(reader["ManagerRating"]) : null,
                    ManagerComments = reader["ManagerComments"] != DBNull.Value ? reader["ManagerComments"].ToString() : null,
                    FinalScore = reader["FinalScore"] != DBNull.Value ? Convert.ToDecimal(reader["FinalScore"]) : null,
                    PromotionRecommendation = reader["PromotionRecommendation"] != DBNull.Value ? reader["PromotionRecommendation"].ToString() : null,
                    Status = reader["Status"].ToString() ?? "SelfReviewPending",
                    SubmittedDate = reader["SubmittedDate"] != DBNull.Value ? Convert.ToDateTime(reader["SubmittedDate"]) : null,
                    CompletedDate = reader["CompletedDate"] != DBNull.Value ? Convert.ToDateTime(reader["CompletedDate"]) : null
                });
            }
            return list;
        }

        public async Task<AppraisalReviewDTO?> GetMyReviewAsync(int employeeId, int cycleId)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_PMS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_MY_REVIEW");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);
            cmd.Parameters.AddWithValue("@CycleId", cycleId);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new AppraisalReviewDTO
                {
                    ReviewId = Convert.ToInt32(reader["ReviewId"]),
                    CycleId = Convert.ToInt32(reader["CycleId"]),
                    CycleName = reader["CycleName"].ToString(),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    SelfRating = reader["SelfRating"] != DBNull.Value ? Convert.ToDecimal(reader["SelfRating"]) : null,
                    SelfComments = reader["SelfComments"] != DBNull.Value ? reader["SelfComments"].ToString() : null,
                    ManagerRating = reader["ManagerRating"] != DBNull.Value ? Convert.ToDecimal(reader["ManagerRating"]) : null,
                    ManagerComments = reader["ManagerComments"] != DBNull.Value ? reader["ManagerComments"].ToString() : null,
                    FinalScore = reader["FinalScore"] != DBNull.Value ? Convert.ToDecimal(reader["FinalScore"]) : null,
                    PromotionRecommendation = reader["PromotionRecommendation"] != DBNull.Value ? reader["PromotionRecommendation"].ToString() : null,
                    Status = reader["Status"].ToString() ?? "SelfReviewPending"
                };
            }
            return null;
        }

        public async Task<bool> SubmitSelfReviewAsync(SubmitSelfReviewDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_PMS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "SUBMIT_SELF_REVIEW");
            cmd.Parameters.AddWithValue("@CycleId", dto.CycleId);
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@SelfRating", dto.SelfRating);
            cmd.Parameters.AddWithValue("@SelfComments", (object?)dto.SelfComments ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res) > 0;
        }

        public async Task<bool> SubmitManagerReviewAsync(SubmitManagerReviewDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_PMS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "SUBMIT_MANAGER_REVIEW");
            cmd.Parameters.AddWithValue("@CycleId", dto.CycleId);
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@SelfRating", dto.SelfRating);
            cmd.Parameters.AddWithValue("@ManagerRating", dto.ManagerRating);
            cmd.Parameters.AddWithValue("@ManagerComments", (object?)dto.ManagerComments ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PromotionRecommendation", (object?)dto.PromotionRecommendation ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res) > 0;
        }
    }
}
