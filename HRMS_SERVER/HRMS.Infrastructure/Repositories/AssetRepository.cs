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
    public class AssetRepository : IAssetRepository
    {
        private readonly string _connectionString;

        public AssetRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBCS")!;
        }

        public async Task<IEnumerable<AssetCategoryDTO>> GetCategoriesAsync()
        {
            var list = new List<AssetCategoryDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Asset_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_CATEGORIES");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new AssetCategoryDTO
                {
                    AssetCategoryId = Convert.ToInt32(reader["AssetCategoryId"]),
                    CategoryName = reader["CategoryName"].ToString() ?? string.Empty,
                    Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null,
                    IsActive = Convert.ToBoolean(reader["IsActive"])
                });
            }
            return list;
        }

        public async Task<IEnumerable<AssetDTO>> GetAllAssetsAsync()
        {
            var list = new List<AssetDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Asset_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_ALL_ASSETS");

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new AssetDTO
                {
                    AssetId = Convert.ToInt32(reader["AssetId"]),
                    AssetCategoryId = Convert.ToInt32(reader["AssetCategoryId"]),
                    CategoryName = reader["CategoryName"].ToString() ?? string.Empty,
                    AssetTag = reader["AssetTag"].ToString() ?? string.Empty,
                    AssetName = reader["AssetName"].ToString() ?? string.Empty,
                    SerialNumber = reader["SerialNumber"] != DBNull.Value ? reader["SerialNumber"].ToString() : null,
                    Manufacturer = reader["Manufacturer"] != DBNull.Value ? reader["Manufacturer"].ToString() : null,
                    Model = reader["Model"] != DBNull.Value ? reader["Model"].ToString() : null,
                    PurchaseDate = reader["PurchaseDate"] != DBNull.Value ? Convert.ToDateTime(reader["PurchaseDate"]) : null,
                    WarrantyExpiryDate = reader["WarrantyExpiryDate"] != DBNull.Value ? Convert.ToDateTime(reader["WarrantyExpiryDate"]) : null,
                    Status = reader["Status"].ToString() ?? "Available",
                    Condition = reader["Condition"].ToString() ?? "New",
                    IsActive = Convert.ToBoolean(reader["IsActive"]),
                    CreatedDate = Convert.ToDateTime(reader["CreatedDate"]),
                    AssignedEmployeeId = reader["AssignedEmployeeId"] != DBNull.Value ? Convert.ToInt32(reader["AssignedEmployeeId"]) : null,
                    AssignedEmployeeName = reader["AssignedEmployeeName"] != DBNull.Value ? reader["AssignedEmployeeName"].ToString() : null,
                    AssignedEmployeeCode = reader["AssignedEmployeeCode"] != DBNull.Value ? reader["AssignedEmployeeCode"].ToString() : null,
                    AllocatedDate = reader["AllocatedDate"] != DBNull.Value ? Convert.ToDateTime(reader["AllocatedDate"]) : null
                });
            }
            return list;
        }

        public async Task<IEnumerable<MyAssetDTO>> GetMyAssetsAsync(int employeeId)
        {
            var list = new List<MyAssetDTO>();
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Asset_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "GET_MY_ASSETS");
            cmd.Parameters.AddWithValue("@EmployeeId", employeeId);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new MyAssetDTO
                {
                    AssetId = Convert.ToInt32(reader["AssetId"]),
                    AssetTag = reader["AssetTag"].ToString() ?? string.Empty,
                    AssetName = reader["AssetName"].ToString() ?? string.Empty,
                    CategoryName = reader["CategoryName"].ToString() ?? string.Empty,
                    Manufacturer = reader["Manufacturer"] != DBNull.Value ? reader["Manufacturer"].ToString() : null,
                    Model = reader["Model"] != DBNull.Value ? reader["Model"].ToString() : null,
                    SerialNumber = reader["SerialNumber"] != DBNull.Value ? reader["SerialNumber"].ToString() : null,
                    AllocatedDate = Convert.ToDateTime(reader["AllocatedDate"]),
                    AllocationNotes = reader["AllocationNotes"] != DBNull.Value ? reader["AllocationNotes"].ToString() : null
                });
            }
            return list;
        }

        public async Task<int> CreateAssetAsync(CreateAssetDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Asset_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "INSERT_ASSET");
            cmd.Parameters.AddWithValue("@AssetCategoryId", dto.AssetCategoryId);
            cmd.Parameters.AddWithValue("@AssetTag", dto.AssetTag);
            cmd.Parameters.AddWithValue("@AssetName", dto.AssetName);
            cmd.Parameters.AddWithValue("@SerialNumber", (object?)dto.SerialNumber ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Manufacturer", (object?)dto.Manufacturer ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Model", (object?)dto.Model ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PurchaseDate", (object?)dto.PurchaseDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@WarrantyExpiryDate", (object?)dto.WarrantyExpiryDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Status", dto.Status);
            cmd.Parameters.AddWithValue("@Condition", dto.Condition);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<bool> UpdateAssetAsync(AssetDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Asset_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "UPDATE_ASSET");
            cmd.Parameters.AddWithValue("@AssetId", dto.AssetId);
            cmd.Parameters.AddWithValue("@AssetCategoryId", dto.AssetCategoryId);
            cmd.Parameters.AddWithValue("@AssetName", dto.AssetName);
            cmd.Parameters.AddWithValue("@SerialNumber", (object?)dto.SerialNumber ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Manufacturer", (object?)dto.Manufacturer ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Model", (object?)dto.Model ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@PurchaseDate", (object?)dto.PurchaseDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@WarrantyExpiryDate", (object?)dto.WarrantyExpiryDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Status", dto.Status);
            cmd.Parameters.AddWithValue("@Condition", dto.Condition);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res) > 0;
        }

        public async Task<int> AllocateAssetAsync(AllocateAssetDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Asset_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "ALLOCATE");
            cmd.Parameters.AddWithValue("@AssetId", dto.AssetId);
            cmd.Parameters.AddWithValue("@EmployeeId", dto.EmployeeId);
            cmd.Parameters.AddWithValue("@AllocationNotes", (object?)dto.AllocationNotes ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res);
        }

        public async Task<bool> ReturnAssetAsync(ReturnAssetDTO dto)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Asset_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "RETURN");
            cmd.Parameters.AddWithValue("@AssetId", dto.AssetId);
            cmd.Parameters.AddWithValue("@Condition", (object?)dto.Condition ?? "Good");
            cmd.Parameters.AddWithValue("@ReturnNotes", (object?)dto.ReturnNotes ?? DBNull.Value);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res) > 0;
        }

        public async Task<bool> DeleteAssetAsync(int assetId)
        {
            using var con = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand("sp_Asset_Operations", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@Flag", "DELETE");
            cmd.Parameters.AddWithValue("@AssetId", assetId);

            await con.OpenAsync();
            var res = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(res) > 0;
        }
    }
}
