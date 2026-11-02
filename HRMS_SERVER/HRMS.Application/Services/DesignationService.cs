using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using HRMS.Domain.Entities;

namespace HRMS.Application.Services
{
    public class DesignationService : IDesignationService
    {
        private readonly IDesignationRepository _repository;

        public DesignationService(
            IDesignationRepository repository)
        {
            _repository = repository;
        }


        // GET ALL
        public async Task<IEnumerable<DesignationDTO>> GetAllAsync()
        {
            var designations =
                await _repository.GetAllAsync();

            return designations.Select(x => new DesignationDTO
            {
                DesignationId = x.DesignationId,
                DesignationName = x.DesignationName,
                Grade = x.Grade,
                BasicSalary = x.BasicSalary,
                Description = x.Description,
                CreatedDate = x.CreatedDate
            });
        }


        // GET BY ID
        public async Task<DesignationDTO?> GetByIdAsync(
            int designationId)
        {
            var designation =
                await _repository.GetByIdAsync(
                    designationId);

            if (designation == null)
                return null;

            return new DesignationDTO
            {
                DesignationId = designation.DesignationId,
                DesignationName = designation.DesignationName,
                Grade = designation.Grade,
                BasicSalary = designation.BasicSalary,
                Description = designation.Description,
                CreatedDate = designation.CreatedDate
            };
        }


        // CREATE
        public async Task<int> CreateAsync(
            DesignationRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(
                dto.DesignationName))
            {
                throw new ArgumentException(
                    "Designation name is required.");
            }

            var designation = new Designation
            {
                DesignationName =
                    dto.DesignationName,

                Grade =
                    dto.Grade,

                BasicSalary =
                    dto.BasicSalary,

                Description =
                    dto.Description,

                CreatedDate =
                    DateTime.Now
            };

            return await _repository.CreateAsync(
                designation);
        }


        // UPDATE
        public async Task<bool> UpdateAsync(
            int designationId,
            DesignationRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(
                dto.DesignationName))
            {
                throw new ArgumentException(
                    "Designation name is required.");
            }

            var existing =
                await _repository.GetByIdAsync(
                    designationId);

            if (existing == null)
                return false;

            existing.DesignationName =
                dto.DesignationName;

            existing.Grade =
                dto.Grade;

            existing.BasicSalary =
                dto.BasicSalary;

            existing.Description =
                dto.Description;

            return await _repository.UpdateAsync(
                existing);
        }


        // DELETE
        public async Task<bool> DeleteAsync(
            int designationId)
        {
            var existing =
                await _repository.GetByIdAsync(
                    designationId);

            if (existing == null)
                return false;

            return await _repository.DeleteAsync(
                designationId);
        }
    }
}
