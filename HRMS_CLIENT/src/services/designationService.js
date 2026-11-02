import api from "./api";

export const getDesignationList = async () => {
    const res = await api.get("Designation");
    return res.data?.data || [];
};

export const getDesignationById = async (id) => {
    const res = await api.get(`Designation/${id}`);
    return res.data?.data;
};

export const createDesignation = async (data) => {
    const res = await api.post("Designation", data);
    return res.data;
};

export const updateDesignation = async (id, data) => {
    const res = await api.put(`Designation/${id}`, data);
    return res.data;
};

export const deleteDesignation = async (id) => {
    const res = await api.delete(`Designation/${id}`);
    return res.data;
};

export const getDesignations = getDesignationList;
