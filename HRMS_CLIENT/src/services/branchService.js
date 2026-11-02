import api from "./api";

export const getBranchList = async () => {
    const res = await api.get("Branch");
    return res.data?.data || [];
};

export const getBranchById = async (id) => {
    const res = await api.get(`Branch/${id}`);
    return res.data?.data;
};

export const createBranch = async (data) => {
    const res = await api.post("Branch", data);
    return res.data;
};

export const updateBranch = async (id, data) => {
    const res = await api.put(`Branch/${id}`, data);
    return res.data;
};

export const deleteBranch = async (id) => {
    const res = await api.delete(`Branch/${id}`);
    return res.data;
};
