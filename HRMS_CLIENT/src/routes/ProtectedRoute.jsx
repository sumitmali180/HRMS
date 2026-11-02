import {
    Navigate,
    Outlet
} from "react-router-dom";

import useAuth from "../hooks/useAuth";


const ProtectedRoute = () => {

    const {
        isAuthenticated,
        loading
    } = useAuth();


    if (loading) {

        return (
            <div className="
                d-flex
                justify-content-center
                align-items-center
                vh-100
            ">

                <div
                    className="
                        spinner-border
                        text-primary
                    "
                />

            </div>
        );
    }


    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return <Outlet />;
};


export default ProtectedRoute;