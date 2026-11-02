import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";


const RoleRoute = ({ allowedRoles }) => {

    const {
        user,
        isAuthenticated
    } = useAuth();


    // Not logged in
    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    const userRole = user?.role;


    // Check role
    const hasAccess =
        allowedRoles.includes(userRole);


    // User doesn't have permission
    if (!hasAccess) {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }


    // User has permission
    return <Outlet />;
};


export default RoleRoute;