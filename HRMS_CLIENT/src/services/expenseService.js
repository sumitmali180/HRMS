import api from "./api";

export const getExpenseCategories = async () => {
    const res = await api.get("Expense/categories");
    return res.data?.data || [];
};

export const getMyClaims = async () => {
    const res = await api.get("Expense/my-claims");
    return res.data?.data || [];
};

export const getAllClaims = async () => {
    const res = await api.get("Expense/all-claims");
    return res.data?.data || [];
};

export const getPendingClaims = async () => {
    const res = await api.get("Expense/pending");
    return res.data?.data || [];
};

export const submitExpenseClaim = async (data) => {
    const res = await api.post("Expense/claim", data);
    return res.data;
};

export const actionExpenseClaim = async (data) => {
    const res = await api.post("Expense/approve-reject", data);
    return res.data;
};

export const deleteExpenseClaim = async (claimId) => {
    const res = await api.delete(`Expense/claim/${claimId}`);
    return res.data;
};
