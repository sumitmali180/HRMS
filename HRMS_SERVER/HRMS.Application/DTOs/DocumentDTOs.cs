using System;

namespace HRMS.Application.DTOs
{
    public class DocumentTemplateDTO
    {
        public int TemplateId { get; set; }
        public string TemplateName { get; set; } = string.Empty;
        public string TemplateCode { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string BodyTemplate { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class SaveDocumentTemplateDTO
    {
        public int? TemplateId { get; set; }
        public string TemplateName { get; set; } = string.Empty;
        public string TemplateCode { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string BodyTemplate { get; set; } = string.Empty;
    }

    public class GenerateLetterDTO
    {
        public int EmployeeId { get; set; }
        public string TemplateCode { get; set; } = "OFFER_LETTER";
    }

    public class EmployeeDocumentDTO
    {
        public int DocumentId { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public string DocumentType { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public DateTime UploadedDate { get; set; }
        public bool IsVerified { get; set; }
    }

    public class UploadDocumentDTO
    {
        public int EmployeeId { get; set; }
        public string DocumentType { get; set; } = "Other";
        public string Title { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
    }

    public class SystemAuditLogDTO
    {
        public long AuditLogId { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
        public string Action { get; set; } = string.Empty;
        public string EntityName { get; set; } = string.Empty;
        public string? EntityId { get; set; }
        public string? Details { get; set; }
        public string? IpAddress { get; set; }
        public DateTime Timestamp { get; set; }
    }

    public class CreateAuditLogDTO
    {
        public int? UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string EntityName { get; set; } = string.Empty;
        public string? EntityId { get; set; }
        public string? Details { get; set; }
        public string? IpAddress { get; set; }
    }
}
