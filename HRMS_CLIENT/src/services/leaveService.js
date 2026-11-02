import api from "./api";

export const getLeaveTypes = async () => {
    const res = await api.get("Leave/types");
    return res.data?.data || [];
};

export const getLeaveBalances = async (employeeId, year = null) => {
    const url = year ? `Leave/balances/${employeeId}?year=${year}` : `Leave/balances/${employeeId}`;
    const res = await api.get(url);
    return res.data?.data || [];
};

export const applyLeave = async (data) => {
    const res = await api.post("Leave/apply", data);
    return res.data;
};

export const getMyLeaveHistory = async (employeeId) => {
    const res = await api.get(`Leave/my-history/${employeeId}`);
    return res.data?.data || [];
};

export const getPendingApprovals = async (managerId = null) => {
    const url = managerId ? `Leave/pending?managerId=${managerId}` : "Leave/pending";
    const res = await api.get(url);
    return res.data?.data || [];
};

export const approveOrRejectLeave = async (data) => {
    const res = await api.post("Leave/approve-reject", data);
    return res.data;
};

export const cancelLeave = async (leaveId) => {
    const res = await api.post(`Leave/cancel/${leaveId}`);
    return res.data;
};
