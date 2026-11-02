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
    public class DocumentRepository : IDocumentRepository
    {
        private readonly string _connectionString;

        public DocumentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<IEnumerable<DocumentTemplateDTO>> GetTemplatesAsync()
        {
            var list = new List<DocumentTemplateDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Document_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_TEMPLATES");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new DocumentTemplateDTO
                {
                    TemplateId = Convert.ToInt32(reader["TemplateId"]),
                    TemplateName = reader["TemplateName"].ToString() ?? string.Empty,
                    TemplateCode = reader["TemplateCode"].ToString() ?? string.Empty,
                    Subject = reader["Subject"].ToString() ?? string.Empty,
                    BodyTemplate = reader["BodyTemplate"].ToString() ?? string.Empty,
                    IsActive = Convert.ToBoolean(reader["IsActive"])
                });
            }
            return list;
        }

        public async Task<int> SaveTemplateAsync(SaveDocumentTemplateDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Document_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "SAVE_TEMPLATE");
            cmd.Parameters.AddWithValue("@TemplateId", (object?)dto.TemplateId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@TemplateName", dto.TemplateName);
            cmd.Parameters.AddWithValue("@TemplateCode", dto.TemplateCode);
            cmd.Parameters.AddWithValue("@Subject", dto.Subject);
            cmd.Parameters.AddWithValue("@BodyTemplate", dto.BodyTemplate);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<IEnumerable<EmployeeDocumentDTO>> GetEmployeeDocumentsAsync(int? employeeId)
        {
            var list = new List<EmployeeDocumentDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Document_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_EMPLOYEE_DOCS");
            cmd.Parameters.AddWithValue("@EmployeeId", (object?)employeeId ?? DBNull.Value);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new EmployeeDocumentDTO
                {
                    DocumentId = Convert.ToInt32(reader["DocumentId"]),
                    EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                    EmployeeName = reader["EmployeeName"].ToString(),
                    DocumentType = reader["DocumentType"].ToString() ?? "Other",
                    Title = reader["Title"].ToString() ?? string.Empty,
                    FilePath = reader["FilePath"].ToString() ?? string.Empty,
                    UploadedDate = Convert.ToDateTime(reader["UploadedDate"]),
                    IsVerified = Convert.ToBoolean(reader["IsVerified"])
                });
            }
            return list;
        }

        public async Task<int> UploadDocumentAsync(UploadDocumentDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Document_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "UPLOAD_DOC");
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@DocumentType", dto.DocumentType);
            cmd.Parameters.AddWithValue("@Title", dto.Title);
            cmd.Parameters.AddWithValue("@FilePath", dto.FilePath);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<long> LogAuditAsync(CreateAuditLogDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Document_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "LOG_AUDIT");
            cmd.Parameters.AddWithValue("@UserId", (object?)dto.UserId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Action", dto.Action);
            cmd.Parameters.AddWithValue("@EntityName", dto.EntityName);
            cmd.Parameters.AddWithValue("@EntityId", (object?)dto.EntityId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Details", (object?)dto.Details ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@IpAddress", (object?)dto.IpAddress ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt64(res);
        }

        public async Task<IEnumerable<SystemAuditLogDTO>> GetAuditLogsAsync()
        {
            var list = new List<SystemAuditLogDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Document_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_AUDIT_LOGS");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new SystemAuditLogDTO
                {
                    AuditLogId = Convert.ToInt64(reader["AuditLogId"]),
                    UserId = reader["UserId"] != DBNull.Value ? Convert.ToInt32(reader["UserId"]) : null,
                    UserName = reader["UserName"] != DBNull.Value ? reader["UserName"].ToString() : "System",
                    Action = reader["Action"].ToString() ?? string.Empty,
                    EntityName = reader["EntityName"].ToString() ?? string.Empty,
                    EntityId = reader["EntityId"] != DBNull.Value ? reader["EntityId"].ToString() : null,
                    Details = reader["Details"] != DBNull.Value ? reader["Details"].ToString() : null,
                    IpAddress = reader["IpAddress"] != DBNull.Value ? reader["IpAddress"].ToString() : null,
                    Timestamp = Convert.ToDateTime(reader["Timestamp"])
                });
            }
            return list;
        }
    }
}
