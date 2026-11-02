import {
    useEffect,
    useState
} from "react";

import {
    login as loginService,
    logout as logoutService,
    getProfile
} from "../services/authService";

import AuthContext from "./AuthContextValue";


// =============================================
// Auth Provider
// =============================================

export const AuthProvider = ({
    children
}) => {

    const [token, setToken] =
        useState(
            localStorage.getItem("token")
        );


    const [user, setUser] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    // =============================================
    // Load User Profile
    // =============================================

    const loadUserProfile = async () => {

        try {

            const profile =
                await getProfile();


            const loggedInUser = {

                employeeId:
                    profile.employeeId,

                employeeName:
                    profile.employeeName,

                email:
                    profile.email,

                role:
                    profile.role
            };

            setUser(
                loggedInUser
            );


            localStorage.setItem(
                "user",
                JSON.stringify(
                    loggedInUser
                )
            );

        }
        catch (error) {

            console.error(
                "Profile loading error:",
                error
            );


            logoutService();

            setToken(null);

            setUser(null);

        }
    };


    // =============================================
    // Check Existing Login
    // =============================================

    useEffect(() => {

        const initializeAuth = async () => {

            const storedToken =
                localStorage.getItem(
                    "token"
                );


            if (!storedToken) {

                setLoading(false);

                return;
            }


            await loadUserProfile();


            setLoading(false);

        };


        initializeAuth();

        const handleUnauthorized = () => {
            setToken(null);
            setUser(null);
        };

        window.addEventListener("hrms:unauthorized", handleUnauthorized);
        return () => {
            window.removeEventListener("hrms:unauthorized", handleUnauthorized);
        };
    }, []);


    // =============================================
    // Login
    // =============================================

    const login = async (
        email,
        password
    ) => {

        try {

            const response =
                await loginService({
                    email,
                    password
                });


            if (!response.isSuccess) {

                return {

                    success: false,

                    message:
                        response.message ||
                        "Login failed"
                };
            }


            const newToken =
                response.token;


            setToken(
                newToken
            );


            // Load user details from API
            const profile =
                await getProfile();


            const loggedInUser = {

                employeeId:
                    profile.employeeId,

                employeeName:
                    profile.employeeName,

                email:
                    profile.email,

                role:
                    profile.role
            };


            setUser(
                loggedInUser
            );


            localStorage.setItem(
                "user",
                JSON.stringify(
                    loggedInUser
                )
            );


            return {

                success: true,

                message:
                    response.message ||
                    "Login successful"
            };

        }
        catch (error) {

            console.error(
                "Login error:",
                error
            );


            return {

                success: false,

                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Unable to login"
            };

        }

    };


    // =============================================
    // Logout
    // =============================================

    const logout = () => {

        logoutService();

        setToken(null);

        setUser(null);

    };


    // =============================================
    // Authentication Status
    // =============================================

    const isAuthenticated =
        Boolean(
            token && user
        );


    // =============================================
    // Context Value
    // =============================================

    const contextValue = {

        token,

        user,

        loading,

        isAuthenticated,

        login,

        logout

    };


    return (

        <AuthContext.Provider
            value={contextValue}
        >

            {children}

        </AuthContext.Provider>

    );

};