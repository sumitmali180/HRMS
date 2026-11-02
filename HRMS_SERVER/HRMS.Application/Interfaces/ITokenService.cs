using HRMS.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace HRMS.Application.Interfaces
{
    public interface ITokenService
    {
        LoginResponseDTO GenerateToken(int employeeId,string employeeName,string email,string role);
    }
}
