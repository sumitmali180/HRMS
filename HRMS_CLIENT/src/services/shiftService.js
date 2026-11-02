import api from "./api";

export const getShifts = async () => {
    const res = await api.get("Shift/list");
    return res.data?.data || [];
};

export const createShift = async (data) => {
    const res = await api.post("Shift", data);
    return res.data;
};

export const getRoster = async (month = null, year = null) => {
    let url = "Shift/roster";
    if (month && year) {
        url += `?month=${month}&year=${year}`;
    }
    const res = await api.get(url);
    return res.data?.data || [];
};

export const assignRoster = async (data) => {
    const res = await api.post("Shift/assign-roster", data);
    return res.data;
};

export const getMyRoster = async (month = null, year = null) => {
    let url = "Shift/my-roster";
    if (month && year) {
        url += `?month=${month}&year=${year}`;
    }
    const res = await api.get(url);
    return res.data?.data || [];
};
