import api from "./api";

export const getDepartmentList = async () => {
    const res = await api.get("Department");
    return res.data?.data || [];
};

export const getDepartmentById = async (id) => {
    const res = await api.get(`Department/${id}`);
    return res.data?.data;
};

export const createDepartment = async (data) => {
    const res = await api.post("Department", data);
    return res.data;
};

export const updateDepartment = async (id, data) => {
    const res = await api.put(`Department/${id}`, data);
    return res.data;
};

export const deleteDepartment = async (id) => {
    const res = await api.delete(`Department/${id}`);
    return res.data;
};

export const getDepartments = getDepartmentList;
