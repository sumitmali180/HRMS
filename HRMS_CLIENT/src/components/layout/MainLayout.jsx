import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ErrorBoundary from "../common/ErrorBoundary";


const MainLayout = () => {
    return (
        <div className="d-flex min-vh-100" style={{ backgroundColor: "var(--bg-page)", color: "var(--text-primary)" }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Area */}
            <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0, backgroundColor: "var(--bg-page)" }}>
                {/* Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="flex-grow-1 p-4" style={{ backgroundColor: "var(--bg-page)" }}>
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};


export default MainLayout;