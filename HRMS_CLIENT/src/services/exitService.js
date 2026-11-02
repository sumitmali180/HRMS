import api from "./api";

export const submitResignation = async (data) => {
    const res = await api.post("Exit/resign", data);
    return res.data;
};

export const getMyResignation = async () => {
    const res = await api.get("Exit/my-resignation");
    return res.data?.data || [];
};

export const getResignationQueue = async () => {
    const res = await api.get("Exit/resignation-queue");
    return res.data?.data || [];
};

export const actionResignation = async (data) => {
    const res = await api.post("Exit/action-resignation", data);
    return res.data;
};

export const calculateFnF = async (data) => {
    const res = await api.post("Exit/fnf/calculate", data);
    return res.data;
};

export const getFnFList = async () => {
    const res = await api.get("Exit/fnf/list");
    return res.data?.data || [];
};

export const getOnboardingTasks = async () => {
    const res = await api.get("Exit/onboarding/tasks");
    return res.data?.data || [];
};
