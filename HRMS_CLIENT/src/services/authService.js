import api from "./api";


export const login = async (loginData) => {

    const response = await api.post(
        "/Auth/Login",
        loginData
    );

    const data = response.data;


    if (data.isSuccess && data.token) {

        localStorage.setItem(
            "token",
            data.token
        );
    }


    return data;
};


// =============================================
// Get Logged-In User Profile
// =============================================

export const getProfile = async () => {

    const response = await api.get(
        "/Auth/Profile"
    );

    return response.data;
};


// =============================================
// Logout
// =============================================

export const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");
};