using System;
using System.Collections.Generic;
using System.Text;

namespace HRMS.Domain.Entities
{
    public class Designation
    {
        public int DesignationId { get; set; }

        public string? DesignationName { get; set; }

        public string? Grade { get; set; }

        public decimal? BasicSalary { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedDate { get; set; }

    }
}
