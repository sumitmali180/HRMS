import api from "./api";

export const clockIn = async (employeeId = null, notes = "") => {
    const res = await api.post("Attendance/clock-in", { employeeId, notes });
    return res.data;
};

export const clockOut = async (employeeId = null, notes = "") => {
    const res = await api.post("Attendance/clock-out", { employeeId, notes });
    return res.data;
};

export const getTodayStatus = async (employeeId = 0) => {
    const res = await api.get(`Attendance/today/${employeeId}`);
    return res.data?.data;
};

export const getMonthlyAttendance = async (employeeId, month, year) => {
    const res = await api.get(`Attendance/monthly?employeeId=${employeeId}&month=${month}&year=${year}`);
    return res.data?.data || [];
};

export const getDailyAttendance = async (branchId = null, date = null) => {
    let url = "Attendance/daily?";
    if (branchId) url += `branchId=${branchId}&`;
    if (date) url += `date=${date}&`;
    const res = await api.get(url);
    return res.data?.data || [];
};

export const regularizeAttendance = async (data) => {
    const res = await api.post("Attendance/regularize", data);
    return res.data;
};
