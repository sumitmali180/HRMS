using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class DocumentService : IDocumentService
    {
        private readonly IDocumentRepository _documentRepository;

        public DocumentService(IDocumentRepository documentRepository)
        {
            _documentRepository = documentRepository;
        }

        public async Task<IEnumerable<DocumentTemplateDTO>> GetTemplatesAsync()
        {
            return await _documentRepository.GetTemplatesAsync();
        }

        public async Task<int> SaveTemplateAsync(SaveDocumentTemplateDTO dto)
        {
            return await _documentRepository.SaveTemplateAsync(dto);
        }

        public async Task<IEnumerable<EmployeeDocumentDTO>> GetEmployeeDocumentsAsync(int? employeeId)
        {
            return await _documentRepository.GetEmployeeDocumentsAsync(employeeId);
        }

        public async Task<int> UploadDocumentAsync(UploadDocumentDTO dto)
        {
            return await _documentRepository.UploadDocumentAsync(dto);
        }

        public async Task<long> LogAuditAsync(CreateAuditLogDTO dto)
        {
            return await _documentRepository.LogAuditAsync(dto);
        }

        public async Task<IEnumerable<SystemAuditLogDTO>> GetAuditLogsAsync()
        {
            return await _documentRepository.GetAuditLogsAsync();
        }

        public async Task<string> GenerateLetterAsync(GenerateLetterDTO dto)
        {
            var templates = await _documentRepository.GetTemplatesAsync();
            var template = templates.FirstOrDefault(t => t.TemplateCode == dto.TemplateCode)
                           ?? templates.FirstOrDefault();

            if (template == null)
            {
                return "Template not found.";
            }

            var text = template.BodyTemplate
                .Replace("{{CompanyName}}", "Enterprise HRMS Corp")
                .Replace("{{EmployeeName}}", "Employee #" + dto.EmployeeId)
                .Replace("{{Designation}}", "Senior Professional")
                .Replace("{{Department}}", "Technology")
                .Replace("{{CTC}}", "$120,000 / annum")
                .Replace("{{JoiningDate}}", System.DateTime.Today.ToString("MMMM dd, yyyy"))
                .Replace("{{RelievingDate}}", System.DateTime.Today.AddDays(30).ToString("MMMM dd, yyyy"));

            return text;
        }
    }
}
