using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace HRMS.Application.DTOs
{
    public class UpdateCompanyDTO
    {
        [Required]
        public int CompanyId { get; set; }

        [Required]
        [StringLength(150)]
        public string CompanyName { get; set; } = string.Empty;

        [StringLength(20)]
        public string? GSTNo { get; set; }

        [StringLength(300)]
        public string? Address { get; set; }

        [Phone]
        public string? Phone { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        public string? Logo { get; set; }

        public bool IsActive { get; set; }

        [Url]
        public string? Website { get; set; }

        [StringLength(20)]
        public string? Currency { get; set; }

        [StringLength(100)]
        public string? TimeZone { get; set; }
    }
}
