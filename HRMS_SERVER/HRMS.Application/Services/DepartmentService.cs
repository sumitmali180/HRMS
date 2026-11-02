using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using HRMS.Domain.Entities;

namespace HRMS.Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _repository;

        public DepartmentService(IDepartmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<DepartmentDTO>> GetAllAsync()
        {
            var departments = await _repository.GetAllAsync();

            return departments.Select(x => new DepartmentDTO
            {
                DepartmentId = x.DepartmentId,
                DepartmentName = x.DepartmentName,
                Description = x.Description,
                BranchId = x.BranchId,
                CreatedDate = x.CreatedDate
            });
        }

        public async Task<DepartmentDTO?> GetByIdAsync(int departmentId)
        {
            var department =
                await _repository.GetByIdAsync(departmentId);

            if (department == null)
                return null;

            return new DepartmentDTO
            {
                DepartmentId = department.DepartmentId,
                DepartmentName = department.DepartmentName,
                Description = department.Description,
                BranchId = department.BranchId,
                CreatedDate = department.CreatedDate
            };
        }

        public async Task<int> CreateAsync(
            DepartmentRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.DepartmentName))
                throw new ArgumentException(
                    "Department name is required.");

            var department = new Department
            {
                DepartmentName = dto.DepartmentName,
                Description = dto.Description,
                BranchId = dto.BranchId
            };

            return await _repository.CreateAsync(department);
        }

        public async Task<bool> UpdateAsync(
            int departmentId,
            DepartmentRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.DepartmentName))
                throw new ArgumentException(
                    "Department name is required.");

            var existing =
                await _repository.GetByIdAsync(departmentId);

            if (existing == null)
                return false;

            existing.DepartmentName = dto.DepartmentName;
            existing.Description = dto.Description;
            existing.BranchId = dto.BranchId;

            return await _repository.UpdateAsync(existing);
        }

        public async Task<bool> DeleteAsync(int departmentId)
        {
            var existing =
                await _repository.GetByIdAsync(departmentId);

            if (existing == null)
                return false;

            return await _repository.DeleteAsync(departmentId);
        }
    }
}