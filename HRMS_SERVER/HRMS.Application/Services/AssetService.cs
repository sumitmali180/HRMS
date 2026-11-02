using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Services
{
    public class AssetService : IAssetService
    {
        private readonly IAssetRepository _assetRepository;

        public AssetService(IAssetRepository assetRepository)
        {
            _assetRepository = assetRepository;
        }

        public async Task<IEnumerable<AssetCategoryDTO>> GetCategoriesAsync()
        {
            return await _assetRepository.GetCategoriesAsync();
        }

        public async Task<IEnumerable<AssetDTO>> GetAllAssetsAsync()
        {
            return await _assetRepository.GetAllAssetsAsync();
        }

        public async Task<IEnumerable<MyAssetDTO>> GetMyAssetsAsync(int employeeId)
        {
            return await _assetRepository.GetMyAssetsAsync(employeeId);
        }

        public async Task<int> CreateAssetAsync(CreateAssetDTO dto)
        {
            return await _assetRepository.CreateAssetAsync(dto);
        }

        public async Task<bool> UpdateAssetAsync(AssetDTO dto)
        {
            return await _assetRepository.UpdateAssetAsync(dto);
        }

        public async Task<int> AllocateAssetAsync(AllocateAssetDTO dto)
        {
            return await _assetRepository.AllocateAssetAsync(dto);
        }

        public async Task<bool> ReturnAssetAsync(ReturnAssetDTO dto)
        {
            return await _assetRepository.ReturnAssetAsync(dto);
        }

        public async Task<bool> DeleteAssetAsync(int assetId)
        {
            return await _assetRepository.DeleteAssetAsync(assetId);
        }
    }
}
