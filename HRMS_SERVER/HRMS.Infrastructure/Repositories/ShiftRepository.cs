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
    public class ShiftRepository : IShiftRepository
    {
        private readonly string _connectionString;

        public ShiftRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<IEnumerable<ShiftMasterDTO>> GetShiftsAsync()
        {
            var list = new List<ShiftMasterDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Shift_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_SHIFTS");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new ShiftMasterDTO
                {
                    ShiftId = Convert.ToInt32(reader["ShiftId"]),
                    ShiftName = reader["ShiftName"].ToString() ?? string.Empty,
                    ShiftCode = reader["ShiftCode"].ToString() ?? string.Empty,
                    StartTime = (TimeSpan)reader["StartTime"],
                    EndTime = (TimeSpan)reader["EndTime"],
                    BreakMinutes = Convert.ToInt32(reader["BreakMinutes"]),
                    GraceMinutes = Convert.ToInt32(reader["GraceMinutes"]),
                    NightAllowance = Convert.ToDecimal(reader["NightAllowance"]),
                    IsActive = Convert.ToBoolean(reader["IsActive"])
                });
            }
            return list;
        }

        public async Task<int> CreateShiftAsync(CreateShiftDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Shift_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "INSERT_SHIFT");
            cmd.Parameters.AddWithValue("@ShiftName", dto.ShiftName);
            cmd.Parameters.AddWithValue("@ShiftCode", dto.ShiftCode);
            cmd.Parameters.AddWithValue("@StartTime", dto.StartTime);
            cmd.Parameters.AddWithValue("@EndTime", dto.EndTime);
            cmd.Parameters.AddWithValue("@BreakMinutes", dto.BreakMinutes);
            cmd.Parameters.AddWithValue("@GraceMinutes", dto.GraceMinutes);
            cmd.Parameters.AddWithValue("@NightAllowance", dto.NightAllowance);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<IEnumerable<EmployeeRosterDTO>> GetRosterAsync(int? month, int? year)
        {
            var list = new List<EmployeeRosterDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Shift_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_ROSTER");
            cmd.Parameters.AddWithValue("@Month", (object?)month ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Year", (object?)year ?? DBNull.Value);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new EmployeeRosterDTO
                {
                    RosterId = Convert.ToInt32(reader["RosterId"]),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    EmployeeName = reader["EmployeeName"] != DBNull.Value ? reader["EmployeeName"].ToString() : null,
                    EmployeeCode = reader["EmployeeCode"] != DBNull.Value ? reader["EmployeeCode"].ToString() : null,
                    DepartmentName = reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString() : null,
                    ShiftId = Convert.ToInt32(reader["ShiftId"]),
                    ShiftName = reader["ShiftName"].ToString() ?? string.Empty,
                    ShiftCode = reader["ShiftCode"].ToString() ?? string.Empty,
                    StartTime = (TimeSpan)reader["StartTime"],
                    EndTime = (TimeSpan)reader["EndTime"],
                    RosterDate = Convert.ToDateTime(reader["RosterDate"]),
                    IsWeekend = Convert.ToBoolean(reader["IsWeekend"]),
                    Remarks = reader["Remarks"] != DBNull.Value ? reader["Remarks"].ToString() : null
                });
            }
            return list;
        }

        public async Task<bool> AssignRosterAsync(AssignRosterDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Shift_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "ASSIGN_ROSTER");
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@ShiftId", dto.ShiftId);
            cmd.Parameters.AddWithValue("@RosterDate", dto.RosterDate);
            cmd.Parameters.AddWithValue("@IsWeekend", dto.IsWeekend);
            cmd.Parameters.AddWithValue("@Remarks", (object?)dto.Remarks ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res) > 0;
        }

        public async Task<IEnumerable<EmployeeRosterDTO>> GetMyRosterAsync(int employeeId, int? month, int? year)
        {
            var list = new List<EmployeeRosterDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Shift_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_MY_ROSTER");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);
            cmd.Parameters.AddWithValue("@Month", (object?)month ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Year", (object?)year ?? DBNull.Value);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new EmployeeRosterDTO
                {
                    RosterId = Convert.ToInt32(reader["RosterId"]),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    ShiftId = Convert.ToInt32(reader["ShiftId"]),
                    ShiftName = reader["ShiftName"].ToString() ?? string.Empty,
                    ShiftCode = reader["ShiftCode"].ToString() ?? string.Empty,
                    StartTime = (TimeSpan)reader["StartTime"],
                    EndTime = (TimeSpan)reader["EndTime"],
                    RosterDate = Convert.ToDateTime(reader["RosterDate"]),
                    IsWeekend = Convert.ToBoolean(reader["IsWeekend"]),
                    Remarks = reader["Remarks"] != DBNull.Value ? reader["Remarks"].ToString() : null
                });
            }
            return list;
        }
    }
}
