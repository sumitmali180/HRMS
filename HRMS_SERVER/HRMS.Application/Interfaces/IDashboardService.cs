using HRMS.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRMS.Application.Interfaces
{
    public interface IDashboardService
    {
        DashboardDTO GetDashboard();
    }
}