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
    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly string _connectionString;

        public AttendanceRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<int> ClockInAsync(ClockInDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Attendance_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "CLOCK_IN");
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@AttendanceDate", dto.Time?.Date ?? DateTime.Today);
            cmd.Parameters.AddWithValue("@CheckIn", dto.Time?.TimeOfDay ?? DateTime.Now.TimeOfDay);
            cmd.Parameters.AddWithValue("@Remarks", (object?)dto.Notes ?? DBNull.Value);

            await con.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> ClockOutAsync(ClockOutDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Attendance_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "CLOCK_OUT");
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@AttendanceDate", dto.Time?.Date ?? DateTime.Today);
            cmd.Parameters.AddWithValue("@CheckOut", dto.Time?.TimeOfDay ?? DateTime.Now.TimeOfDay);
            cmd.Parameters.AddWithValue("@Remarks", (object?)dto.Notes ?? DBNull.Value);

            await con.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }

        public async Task<AttendanceLogDTO?> GetTodayStatusAsync(int employeeId)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Attendance_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "GET_TODAY");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);
            cmd.Parameters.AddWithValue("@AttendanceDate", DateTime.Today);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return MapAttendanceLog(reader);
            }

            return null;
        }

        public async Task<IEnumerable<AttendanceLogDTO>> GetMonthlyAttendanceAsync(int employeeId, int month, int year)
        {
            var list = new List<AttendanceLogDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Attendance_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "GET_MONTHLY_EMPLOYEE");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);
            cmd.Parameters.AddWithValue("@Month", month);
            cmd.Parameters.AddWithValue("@Year", year);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(MapAttendanceLog(reader));
            }

            return list;
        }

        public async Task<IEnumerable<AttendanceLogDTO>> GetDailyAttendanceByBranchAsync(int? branchId, DateTime date)
        {
            var list = new List<AttendanceLogDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Attendance_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "GET_DAILY_BRANCH");
            cmd.Parameters.AddWithValue("@BranchId", (object?)branchId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@AttendanceDate", date.Date);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(MapAttendanceLog(reader));
            }

            return list;
        }

        public async Task<bool> RegularizeAttendanceAsync(RegularizeAttendanceDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Attendance_CRUD", con);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@Action", "REGULARIZE");
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@AttendanceDate", dto.AttendanceDate.Date);
            cmd.Parameters.AddWithValue("@CheckIn", (object?)dto.CheckIn ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@CheckOut", (object?)dto.CheckOut ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@WorkingHours", (object?)dto.WorkingHours ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Status", (object?)dto.Status ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Remarks", (object?)dto.Remarks ?? DBNull.Value);

            await con.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result) > 0;
        }

        private static AttendanceLogDTO MapAttendanceLog(SqlDataReader reader)
        {
            return new AttendanceLogDTO
            {
                AttendanceId = HasColumn(reader, "AttendanceId") && reader["AttendanceId"] != DBNull.Value ? Convert.ToInt32(reader["AttendanceId"]) : 0,
                EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                EmployeeCode = HasColumn(reader, "EmployeeCode") && reader["EmployeeCode"] != DBNull.Value ? reader["EmployeeCode"].ToString()! : string.Empty,
                EmployeeName = HasColumn(reader, "EmployeeName") && reader["EmployeeName"] != DBNull.Value ? reader["EmployeeName"].ToString()! : string.Empty,
                BranchId = HasColumn(reader, "BranchId") && reader["BranchId"] != DBNull.Value ? Convert.ToInt32(reader["BranchId"]) : null,
                BranchName = HasColumn(reader, "BranchName") && reader["BranchName"] != DBNull.Value ? reader["BranchName"].ToString() : null,
                DepartmentId = HasColumn(reader, "DepartmentId") && reader["DepartmentId"] != DBNull.Value ? Convert.ToInt32(reader["DepartmentId"]) : null,
                DepartmentName = HasColumn(reader, "DepartmentName") && reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString() : null,
                AttendanceDate = Convert.ToDateTime(reader["AttendanceDate"]),
                CheckIn = reader["CheckIn"] != DBNull.Value ? (TimeSpan)reader["CheckIn"] : null,
                CheckOut = reader["CheckOut"] != DBNull.Value ? (TimeSpan)reader["CheckOut"] : null,
                WorkingHours = reader["WorkingHours"] != DBNull.Value ? Convert.ToDecimal(reader["WorkingHours"]) : 0,
                LateMinutes = HasColumn(reader, "LateMinutes") && reader["LateMinutes"] != DBNull.Value ? Convert.ToInt32(reader["LateMinutes"]) : 0,
                Status = reader["Status"] != DBNull.Value ? reader["Status"].ToString()! : "Present",
                Remarks = reader["Remarks"] != DBNull.Value ? reader["Remarks"].ToString() : null
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
