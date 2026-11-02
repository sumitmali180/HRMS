import api from "./api";

export const getEmployeeList = async () => {
    const response = await api.get("/Employee/GetEmployeeList");
    console.log("Employee List Response:", response.data);
    return response.data.data;
};

export const getEmployeeById = async (id) => {
    const response = await api.get(`/Employee/${id}`);
    return response.data.data;
};

export const createEmployee = async (employeeData) => {
    console.log("Creating Employee with data:", employeeData);
    const response = await api.post("/Employee/CreateEmployee", employeeData);
    return response.data;
};

export const updateEmployee = async (id, employeeData) => {
    const response = await api.put(`/Employee/${id}`, employeeData);
    return response.data;
};

export const deleteEmployee = async (id) => {
    const response = await api.delete(`/Employee/${id}`);
    return response.data;
};

export const getEmployees = getEmployeeList;