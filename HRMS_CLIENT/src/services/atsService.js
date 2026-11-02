import api from "./api";

export const getJobs = async () => {
    const res = await api.get("ATS/jobs");
    return res.data?.data || [];
};

export const saveJob = async (data) => {
    const res = await api.post("ATS/jobs", data);
    return res.data;
};

export const getCandidates = async (jobId = null) => {
    const url = jobId ? `ATS/candidates?jobId=${jobId}` : "ATS/candidates";
    const res = await api.get(url);
    return res.data?.data || [];
};

export const addCandidate = async (data) => {
    const res = await api.post("ATS/candidates", data);
    return res.data;
};

export const updateCandidateStage = async (data) => {
    const res = await api.put("ATS/stage", data);
    return res.data;
};
