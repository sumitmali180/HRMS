using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using HRMS.Domain.Entities;

namespace HRMS.Application.Services
{
    public class BranchService : IBranchService
    {
        private readonly IBranchRepository _repository;

        public BranchService(
            IBranchRepository repository)
        {
            _repository = repository;
        }


        // GET ALL
        public async Task<IEnumerable<BranchDTO>> GetAllAsync()
        {
            var branches =
                await _repository.GetAllAsync();

            return branches.Select(x => new BranchDTO
            {
                BranchId = x.BranchId,
                CompanyId = x.CompanyId,
                BranchName = x.BranchName,
                Address = x.Address,
                Phone = x.Phone,
                ManagerId = x.ManagerId,
                CreatedDate = x.CreatedDate,
                BranchCode = x.BranchCode,
                Email = x.Email
            });
        }


        // GET BY ID
        public async Task<BranchDTO?> GetByIdAsync(
            int branchId)
        {
            var branch =
                await _repository.GetByIdAsync(branchId);

            if (branch == null)
                return null;

            return new BranchDTO
            {
                BranchId = branch.BranchId,
                CompanyId = branch.CompanyId,
                BranchName = branch.BranchName,
                Address = branch.Address,
                Phone = branch.Phone,
                ManagerId = branch.ManagerId,
                CreatedDate = branch.CreatedDate,
                BranchCode = branch.BranchCode,
                Email = branch.Email
            };
        }


        // CREATE
        public async Task<int> CreateAsync(
            BranchRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.BranchName))
                throw new ArgumentException(
                    "Branch name is required.");

            if (dto.CompanyId <= 0)
                throw new ArgumentException(
                    "CompanyId is required.");

            var branch = new Branch
            {
                CompanyId = dto.CompanyId,
                BranchName = dto.BranchName,
                Address = dto.Address,
                Phone = dto.Phone,
                ManagerId = dto.ManagerId,
                BranchCode = dto.BranchCode,
                Email = dto.Email
            };

            return await _repository.CreateAsync(branch);
        }


        // UPDATE
        public async Task<bool> UpdateAsync(
            int branchId,
            BranchRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.BranchName))
                throw new ArgumentException(
                    "Branch name is required.");

            if (dto.CompanyId <= 0)
                throw new ArgumentException(
                    "CompanyId is required.");

            var existing =
                await _repository.GetByIdAsync(branchId);

            if (existing == null)
                return false;

            existing.CompanyId = dto.CompanyId;
            existing.BranchName = dto.BranchName;
            existing.Address = dto.Address;
            existing.Phone = dto.Phone;
            existing.ManagerId = dto.ManagerId;
            existing.BranchCode = dto.BranchCode;
            existing.Email = dto.Email;

            return await _repository.UpdateAsync(existing);
        }


        // DELETE
        public async Task<bool> DeleteAsync(
            int branchId)
        {
            var existing =
                await _repository.GetByIdAsync(branchId);

            if (existing == null)
                return false;

            return await _repository.DeleteAsync(branchId);
        }
    }
}
