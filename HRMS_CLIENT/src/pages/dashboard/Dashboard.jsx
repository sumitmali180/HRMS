import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getDashboard } from "../../services/dashboardService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatCard from "../../components/common/StatCard";
import ManagerDashboard from "./ManagerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const role = user?.role || "Employee";
    const isAdmin = role === "Admin" || role === "Super Admin" || role === "HR Admin";

    useEffect(() => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }

        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const data = await getDashboard();
                setDashboard(data);
            } catch (err) {
                console.error("Dashboard API Error:", err);
                setError(err.response?.data?.message || "Unable to load dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [isAdmin]);

    if (loading || authLoading) {
        return <LoadingSpinner text="Loading dashboard..." />;
    }

    if (role === "Manager") {
        return <ManagerDashboard />;
    }

    if (role === "Employee") {
        return <EmployeeDashboard />;
    }

    return (
        <div className="container-fluid py-4">
            {/* Clean Calm Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                    <h3 className="page-title">Executive Overview</h3>
                    <p className="page-subtitle">Workforce headcount, attendance status, and active operations</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/employee" className="btn btn-outline-secondary">
                        <i className="bi bi-people"></i> Directory
                    </Link>
                    <Link to="/payroll" className="btn btn-primary">
                        <i className="bi bi-cash"></i> Run Payroll
                    </Link>
                </div>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            {/* Core Workforce Numbers */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        title="Total Headcount"
                        value={dashboard?.totalEmployees ?? 0}
                        subtitle="Registered personnel"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        title="Active Employees"
                        value={dashboard?.activeEmployees ?? 0}
                        subtitle="Active on payroll"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        title="Present Today"
                        value={dashboard?.todayPresent ?? 0}
                        subtitle="Punched in"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        title="Pending Leaves"
                        value={dashboard?.pendingLeaves ?? 0}
                        subtitle="Requires review"
                    />
                </div>
            </div>

            {/* Organizational Breakdown */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="card p-3">
                        <div className="small text-muted mb-1" style={{ fontSize: "11px" }}>SUPER ADMINS</div>
                        <div className="fs-4 fw-semibold text-dark tabular-nums">{dashboard?.superAdminCount ?? 0}</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card p-3">
                        <div className="small text-muted mb-1" style={{ fontSize: "11px" }}>HR ADMINS</div>
                        <div className="fs-4 fw-semibold text-dark tabular-nums">{dashboard?.hrAdminCount ?? 0}</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card p-3">
                        <div className="small text-muted mb-1" style={{ fontSize: "11px" }}>TEAM MANAGERS</div>
                        <div className="fs-4 fw-semibold text-dark tabular-nums">{dashboard?.managerCount ?? 0}</div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card p-3">
                        <div className="small text-muted mb-1" style={{ fontSize: "11px" }}>TOTAL BRANCHES</div>
                        <div className="fs-4 fw-semibold text-dark tabular-nums">{dashboard?.totalBranches ?? 0}</div>
                    </div>
                </div>
            </div>

            {/* Management & Operations Shortcuts */}
            <div className="row g-3">
                <div className="col-12 col-lg-6">
                    <div className="card h-100">
                        <div className="card-header">
                            <span className="fw-medium">Organization Master Data</span>
                        </div>
                        <div className="card-body p-3">
                            <div className="row g-2">
                                <div className="col-6">
                                    <Link to="/company" className="btn btn-outline-secondary w-100 py-2 text-start d-flex align-items-center gap-2">
                                        <i className="bi bi-building text-secondary"></i>
                                        <span>Company Profile</span>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/branch" className="btn btn-outline-secondary w-100 py-2 text-start d-flex align-items-center gap-2">
                                        <i className="bi bi-geo-alt text-secondary"></i>
                                        <span>Branches</span>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/department" className="btn btn-outline-secondary w-100 py-2 text-start d-flex align-items-center gap-2">
                                        <i className="bi bi-diagram-3 text-secondary"></i>
                                        <span>Departments</span>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/designation" className="btn btn-outline-secondary w-100 py-2 text-start d-flex align-items-center gap-2">
                                        <i className="bi bi-award text-secondary"></i>
                                        <span>Designations</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6">
                    <div className="card h-100">
                        <div className="card-header">
                            <span className="fw-medium">Operations & Approvals</span>
                        </div>
                        <div className="card-body p-3">
                            <div className="row g-2">
                                <div className="col-6">
                                    <Link to="/attendance" className="btn btn-outline-secondary w-100 py-2 text-start d-flex align-items-center gap-2">
                                        <i className="bi bi-calendar-check text-secondary"></i>
                                        <span>Attendance Sheet</span>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/leave-approval" className="btn btn-outline-secondary w-100 py-2 text-start d-flex align-items-center gap-2">
                                        <i className="bi bi-check2-circle text-secondary"></i>
                                        <span>Leave Queue</span>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/expense-approval" className="btn btn-outline-secondary w-100 py-2 text-start d-flex align-items-center gap-2">
                                        <i className="bi bi-receipt text-secondary"></i>
                                        <span>Expense Queue</span>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/roster" className="btn btn-outline-secondary w-100 py-2 text-start d-flex align-items-center gap-2">
                                        <i className="bi bi-calendar-range text-secondary"></i>
                                        <span>Shift Roster</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;