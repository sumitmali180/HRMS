import api from "./api";

export const getCompanyList = async () => {
    const res = await api.get("Company");
    return res.data?.data || [];
};

export const getCompanyById = async (id) => {
    const res = await api.get(`Company/${id}`);
    return res.data?.data;
};

export const createCompany = async (data) => {
    const res = await api.post("Company", data);
    return res.data;
};

export const updateCompany = async (id, data) => {
    const res = await api.put(`Company/${id}`, data);
    return res.data;
};

export const deleteCompany = async (id) => {
    const res = await api.delete(`Company/${id}`);
    return res.data;
};
