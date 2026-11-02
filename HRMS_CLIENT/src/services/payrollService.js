import api from "./api";

export const getSalaryStructure = async (employeeId) => {
    const res = await api.get(`Payroll/structure/${employeeId}`);
    return res.data?.data;
};

export const saveSalaryStructure = async (data) => {
    const res = await api.post("Payroll/structure", data);
    return res.data;
};

export const processMonthlyPayroll = async (month, year, branchId = null) => {
    const res = await api.post("Payroll/process", { month, year, branchId });
    return res.data;
};

export const getPayrollList = async (month, year, branchId = null) => {
    let url = `Payroll/list?month=${month}&year=${year}`;
    if (branchId) url += `&branchId=${branchId}`;
    const res = await api.get(url);
    return res.data?.data || [];
};

export const getPayslip = async (payrollId) => {
    const res = await api.get(`Payroll/payslip/${payrollId}`);
    return res.data?.data;
};

export const markAsPaid = async (payrollId) => {
    const res = await api.post(`Payroll/mark-paid/${payrollId}`);
    return res.data;
};
