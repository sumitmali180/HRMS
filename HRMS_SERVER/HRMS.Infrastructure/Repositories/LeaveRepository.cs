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
    public class LeaveRepository : ILeaveRepository
    {
        private readonly string _connectionString;

        public LeaveRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<IEnumerable<LeaveTypeDTO>> GetLeaveTypesAsync()
        {
            var list = new List<LeaveTypeDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Leave_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "GET_LEAVE_TYPES");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new LeaveTypeDTO
                {
                    LeaveTypeId = Convert.ToInt32(reader["LeaveTypeId"]),
                    LeaveName = reader["LeaveName"].ToString() ?? string.Empty,
                    PaidLeave = Convert.ToBoolean(reader["PaidLeave"]),
                    MaxDays = Convert.ToInt32(reader["MaxDays"]),
                    IsActive = Convert.ToBoolean(reader["IsActive"])
                });
            }

            return list;
        }

        public async Task<IEnumerable<LeaveBalanceDTO>> GetLeaveBalancesAsync(int employeeId, int year)
        {
            var list = new List<LeaveBalanceDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Leave_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "GET_BALANCES");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);
            cmd.Parameters.AddWithValue("@Year", year);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(new LeaveBalanceDTO
                {
                    AllocationId = Convert.ToInt32(reader["AllocationId"]),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    LeaveTypeId = Convert.ToInt32(reader["LeaveTypeId"]),
                    LeaveName = reader["LeaveName"].ToString() ?? string.Empty,
                    PaidLeave = Convert.ToBoolean(reader["PaidLeave"]),
                    Year = Convert.ToInt32(reader["Year"]),
                    TotalDays = Convert.ToDecimal(reader["TotalDays"]),
                    UsedDays = Convert.ToDecimal(reader["UsedDays"]),
                    RemainingDays = Convert.ToDecimal(reader["RemainingDays"])
                });
            }

            return list;
        }

        public async Task<int> ApplyLeaveAsync(ApplyLeaveDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Leave_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "APPLY");
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@LeaveTypeId", dto.LeaveTypeId);
            var from = dto.FromDate > new DateTime(1753, 1, 1) ? dto.FromDate.Date : DateTime.Today;
            var to = dto.ToDate > new DateTime(1753, 1, 1) ? dto.ToDate.Date : from;
            cmd.Parameters.AddWithValue("@FromDate", from);
            cmd.Parameters.AddWithValue("@ToDate", to);
            cmd.Parameters.AddWithValue("@TotalDays", (object?)dto.TotalDays ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@IsHalfDay", dto.IsHalfDay);
            cmd.Parameters.AddWithValue("@Reason", (object?)dto.Reason ?? DBNull.Value);

            await con.OpenAsync();
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<IEnumerable<LeaveApplicationDTO>> GetEmployeeLeaveHistoryAsync(int employeeId)
        {
            var list = new List<LeaveApplicationDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Leave_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "GET_EMPLOYEE_HISTORY");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(MapLeaveApplication(reader));
            }

            return list;
        }

        public async Task<IEnumerable<LeaveApplicationDTO>> GetPendingApprovalsAsync(int? managerId)
        {
            var list = new List<LeaveApplicationDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Leave_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "GET_PENDING");
            cmd.Parameters.AddWithValue("@ApprovedBy", (object?)managerId ?? DBNull.Value);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                list.Add(MapLeaveApplication(reader));
            }

            return list;
        }

        public async Task<bool> ApproveOrRejectLeaveAsync(LeaveApprovalDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Leave_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "APPROVE_REJECT");
            cmd.Parameters.AddWithValue("@LeaveId", dto.LeaveId);
            cmd.Parameters.AddWithValue("@ApprovedBy", dto.ApprovedBy);
            cmd.Parameters.AddWithValue("@Status", dto.Status);
            cmd.Parameters.AddWithValue("@RejectedReason", (object?)dto.RejectedReason ?? DBNull.Value);

            await con.OpenAsync();
            var rows = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(rows) > 0;
        }

        public async Task<bool> CancelLeaveAsync(int leaveId, int employeeId)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Leave_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Action", "CANCEL");
            cmd.Parameters.AddWithValue("@LeaveId", leaveId);
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);

            await con.OpenAsync();
            var rows = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(rows) > 0;
        }

        private static LeaveApplicationDTO MapLeaveApplication(SqlDataReader reader)
        {
            return new LeaveApplicationDTO
            {
                LeaveId = Convert.ToInt32(reader["LeaveId"]),
                EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                EmployeeCode = HasColumn(reader, "EmployeeCode") && reader["EmployeeCode"] != DBNull.Value ? reader["EmployeeCode"].ToString()! : string.Empty,
                EmployeeName = HasColumn(reader, "EmployeeName") && reader["EmployeeName"] != DBNull.Value ? reader["EmployeeName"].ToString()! : string.Empty,
                DepartmentName = HasColumn(reader, "DepartmentName") && reader["DepartmentName"] != DBNull.Value ? reader["DepartmentName"].ToString() : null,
                LeaveName = reader["LeaveName"].ToString() ?? string.Empty,
                FromDate = Convert.ToDateTime(reader["FromDate"]),
                ToDate = Convert.ToDateTime(reader["ToDate"]),
                TotalDays = Convert.ToDecimal(reader["TotalDays"]),
                IsHalfDay = HasColumn(reader, "IsHalfDay") && reader["IsHalfDay"] != DBNull.Value && Convert.ToBoolean(reader["IsHalfDay"]),
                Reason = reader["Reason"] != DBNull.Value ? reader["Reason"].ToString() : null,
                Status = reader["Status"].ToString() ?? "Pending",
                AppliedDate = Convert.ToDateTime(reader["AppliedDate"]),
                ApprovedDate = HasColumn(reader, "ApprovedDate") && reader["ApprovedDate"] != DBNull.Value ? Convert.ToDateTime(reader["ApprovedDate"]) : null,
                ApprovedByName = HasColumn(reader, "ApprovedByName") && reader["ApprovedByName"] != DBNull.Value ? reader["ApprovedByName"].ToString() : null,
                RejectedReason = HasColumn(reader, "RejectedReason") && reader["RejectedReason"] != DBNull.Value ? reader["RejectedReason"].ToString() : null
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
