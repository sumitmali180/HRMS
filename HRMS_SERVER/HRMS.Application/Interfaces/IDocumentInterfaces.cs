using HRMS.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IDocumentRepository
    {
        Task<IEnumerable<DocumentTemplateDTO>> GetTemplatesAsync();
        Task<int> SaveTemplateAsync(SaveDocumentTemplateDTO dto);
        Task<IEnumerable<EmployeeDocumentDTO>> GetEmployeeDocumentsAsync(int? employeeId);
        Task<int> UploadDocumentAsync(UploadDocumentDTO dto);
        Task<long> LogAuditAsync(CreateAuditLogDTO dto);
        Task<IEnumerable<SystemAuditLogDTO>> GetAuditLogsAsync();
    }

    public interface IDocumentService
    {
        Task<IEnumerable<DocumentTemplateDTO>> GetTemplatesAsync();
        Task<int> SaveTemplateAsync(SaveDocumentTemplateDTO dto);
        Task<IEnumerable<EmployeeDocumentDTO>> GetEmployeeDocumentsAsync(int? employeeId);
        Task<int> UploadDocumentAsync(UploadDocumentDTO dto);
        Task<long> LogAuditAsync(CreateAuditLogDTO dto);
        Task<IEnumerable<SystemAuditLogDTO>> GetAuditLogsAsync();
        Task<string> GenerateLetterAsync(GenerateLetterDTO dto);
    }
}
