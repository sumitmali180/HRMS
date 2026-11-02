using System;

namespace HRMS.Application.DTOs
{
    public class AssetCategoryDTO
    {
        public int AssetCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class AssetDTO
    {
        public int AssetId { get; set; }
        public int AssetCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string AssetTag { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string? SerialNumber { get; set; }
        public string? Manufacturer { get; set; }
        public string? Model { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public DateTime? WarrantyExpiryDate { get; set; }
        public string Status { get; set; } = "Available"; // Available, Allocated, UnderRepair, Scrapped
        public string Condition { get; set; } = "New"; // New, Good, Fair, Damaged
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? AssignedEmployeeId { get; set; }
        public string? AssignedEmployeeName { get; set; }
        public string? AssignedEmployeeCode { get; set; }
        public DateTime? AllocatedDate { get; set; }
    }

    public class CreateAssetDTO
    {
        public int AssetCategoryId { get; set; }
        public string AssetTag { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string? SerialNumber { get; set; }
        public string? Manufacturer { get; set; }
        public string? Model { get; set; }
        public DateTime? PurchaseDate { get; set; }
        public DateTime? WarrantyExpiryDate { get; set; }
        public string Status { get; set; } = "Available";
        public string Condition { get; set; } = "New";
    }

    public class AllocateAssetDTO
    {
        public int AssetId { get; set; }
        public int EmployeeId { get; set; }
        public string? AllocationNotes { get; set; }
    }

    public class ReturnAssetDTO
    {
        public int AssetId { get; set; }
        public string? Condition { get; set; } = "Good";
        public string? ReturnNotes { get; set; }
    }

    public class MyAssetDTO
    {
        public int AssetId { get; set; }
        public string AssetTag { get; set; } = string.Empty;
        public string AssetName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public string? Manufacturer { get; set; }
        public string? Model { get; set; }
        public string? SerialNumber { get; set; }
        public DateTime AllocatedDate { get; set; }
        public string? AllocationNotes { get; set; }
    }
}
