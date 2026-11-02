import api from "./api";

export const getAppraisalCycles = async () => {
    const res = await api.get("PMS/cycles");
    return res.data?.data || [];
};

export const getMyGoals = async (cycleId = null) => {
    const url = cycleId ? `PMS/my-goals?cycleId=${cycleId}` : "PMS/my-goals";
    const res = await api.get(url);
    return res.data?.data || [];
};

export const saveGoal = async (data) => {
    const res = await api.post("PMS/goal", data);
    return res.data;
};

export const getAppraisalReviews = async () => {
    const res = await api.get("PMS/reviews");
    return res.data?.data || [];
};

export const getMyReview = async (cycleId) => {
    const res = await api.get(`PMS/my-review/${cycleId}`);
    return res.data?.data || null;
};

export const submitSelfReview = async (data) => {
    const res = await api.post("PMS/self-review", data);
    return res.data;
};

export const submitManagerReview = async (data) => {
    const res = await api.post("PMS/manager-review", data);
    return res.data;
};
