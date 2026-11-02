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
    public class ATSRepository : IATSRepository
    {
        private readonly string _connectionString;

        public ATSRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<IEnumerable<JobOpeningDTO>> GetJobsAsync()
        {
            var list = new List<JobOpeningDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_ATS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_JOBS");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new JobOpeningDTO
                {
                    JobId = Convert.ToInt32(reader["JobId"]),
                    Title = reader["Title"].ToString() ?? string.Empty,
                    DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
                    DepartmentName = reader["DepartmentName"].ToString(),
                    DesignationId = Convert.ToInt32(reader["DesignationId"]),
                    DesignationName = reader["DesignationName"].ToString(),
                    Location = reader["Location"].ToString() ?? "Headquarters",
                    JobType = reader["JobType"].ToString() ?? "FullTime",
                    ExperienceYears = reader["ExperienceYears"].ToString() ?? "2-5 Years",
                    OpenPositions = Convert.ToInt32(reader["OpenPositions"]),
                    Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null,
                    Requirements = reader["Requirements"] != DBNull.Value ? reader["Requirements"].ToString() : null,
                    Status = reader["Status"].ToString() ?? "Open",
                    CreatedDate = Convert.ToDateTime(reader["CreatedDate"]),
                    TotalApplicants = Convert.ToInt32(reader["TotalApplicants"])
                });
            }
            return list;
        }

        public async Task<int> SaveJobAsync(CreateJobOpeningDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_ATS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "SAVE_JOB");
            cmd.Parameters.AddWithValue("@Title", dto.Title);
            cmd.Parameters.AddWithValue("@DepartmentId", dto.DepartmentId);
            cmd.Parameters.AddWithValue("@DesignationId", dto.DesignationId);
            cmd.Parameters.AddWithValue("@Location", dto.Location);
            cmd.Parameters.AddWithValue("@JobType", dto.JobType);
            cmd.Parameters.AddWithValue("@ExperienceYears", dto.ExperienceYears);
            cmd.Parameters.AddWithValue("@OpenPositions", dto.OpenPositions);
            cmd.Parameters.AddWithValue("@Description", (object?)dto.Description ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Requirements", (object?)dto.Requirements ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<IEnumerable<CandidateDTO>> GetCandidatesAsync(int? jobId)
        {
            var list = new List<CandidateDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_ATS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_CANDIDATES");
            cmd.Parameters.AddWithValue("@JobId", (object?)jobId ?? DBNull.Value);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new CandidateDTO
                {
                    CandidateId = Convert.ToInt32(reader["CandidateId"]),
                    JobId = Convert.ToInt32(reader["JobId"]),
                    JobTitle = reader["JobTitle"].ToString(),
                    FullName = reader["FullName"].ToString() ?? string.Empty,
                    Email = reader["Email"].ToString() ?? string.Empty,
                    Phone = reader["Phone"] != DBNull.Value ? reader["Phone"].ToString() : null,
                    ResumeUrl = reader["ResumeUrl"] != DBNull.Value ? reader["ResumeUrl"].ToString() : null,
                    Stage = reader["Stage"].ToString() ?? "Applied",
                    Rating = Convert.ToInt32(reader["Rating"]),
                    ExpectedSalary = reader["ExpectedSalary"] != DBNull.Value ? Convert.ToDecimal(reader["ExpectedSalary"]) : null,
                    NoticePeriodDays = reader["NoticePeriodDays"] != DBNull.Value ? Convert.ToInt32(reader["NoticePeriodDays"]) : null,
                    Notes = reader["Notes"] != DBNull.Value ? reader["Notes"].ToString() : null,
                    CreatedDate = Convert.ToDateTime(reader["CreatedDate"])
                });
            }
            return list;
        }

        public async Task<int> AddCandidateAsync(CreateCandidateDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_ATS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "ADD_CANDIDATE");
            cmd.Parameters.AddWithValue("@JobId", dto.JobId);
            cmd.Parameters.AddWithValue("@FullName", dto.FullName);
            cmd.Parameters.AddWithValue("@Email", dto.Email);
            cmd.Parameters.AddWithValue("@Phone", (object?)dto.Phone ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ResumeUrl", (object?)dto.ResumeUrl ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Stage", dto.Stage);
            cmd.Parameters.AddWithValue("@Rating", dto.Rating);
            cmd.Parameters.AddWithValue("@ExpectedSalary", (object?)dto.ExpectedSalary ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@NoticePeriodDays", (object?)dto.NoticePeriodDays ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Notes", (object?)dto.Notes ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<bool> UpdateStageAsync(UpdateCandidateStageDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_ATS_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "UPDATE_STAGE");
            cmd.Parameters.AddWithValue("@CandidateId", dto.CandidateId);
            cmd.Parameters.AddWithValue("@Stage", dto.Stage);
            cmd.Parameters.AddWithValue("@Notes", (object?)dto.Notes ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res) > 0;
        }
    }
}
