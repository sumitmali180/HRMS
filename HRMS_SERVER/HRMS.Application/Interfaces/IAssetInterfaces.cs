using HRMS.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HRMS.Application.Interfaces
{
    public interface IAssetRepository
    {
        Task<IEnumerable<AssetCategoryDTO>> GetCategoriesAsync();
        Task<IEnumerable<AssetDTO>> GetAllAssetsAsync();
        Task<IEnumerable<MyAssetDTO>> GetMyAssetsAsync(int employeeId);
        Task<int> CreateAssetAsync(CreateAssetDTO dto);
        Task<bool> UpdateAssetAsync(AssetDTO dto);
        Task<int> AllocateAssetAsync(AllocateAssetDTO dto);
        Task<bool> ReturnAssetAsync(ReturnAssetDTO dto);
        Task<bool> DeleteAssetAsync(int assetId);
    }

    public interface IAssetService
    {
        Task<IEnumerable<AssetCategoryDTO>> GetCategoriesAsync();
        Task<IEnumerable<AssetDTO>> GetAllAssetsAsync();
        Task<IEnumerable<MyAssetDTO>> GetMyAssetsAsync(int employeeId);
        Task<int> CreateAssetAsync(CreateAssetDTO dto);
        Task<bool> UpdateAssetAsync(AssetDTO dto);
        Task<int> AllocateAssetAsync(AllocateAssetDTO dto);
        Task<bool> ReturnAssetAsync(ReturnAssetDTO dto);
        Task<bool> DeleteAssetAsync(int assetId);
    }
}
