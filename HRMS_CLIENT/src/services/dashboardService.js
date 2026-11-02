import api from "./api";


// Get dashboard data
export const getDashboard = async () => {

    const response = await api.get("/Dashboard");

    return response.data.data;
};