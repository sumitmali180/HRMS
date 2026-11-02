using HRMS.Application.DTOs;
using HRMS.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRMS.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardService(
            IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }


        public DashboardDTO GetDashboard()
        {
            return _dashboardRepository.GetDashboard();
        }
    }
}