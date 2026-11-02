import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
    const { user, logout } = useAuth();
    const role = user?.role;

    const isAdmin = role === "Super Admin" || role === "HR Admin" || role === "Admin" || role === "HR";
    const isManager = role === "Manager";

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className="d-none d-lg-flex flex-column text-white"
                style={{
                    width: "250px",
                    minHeight: "100vh",
                    backgroundColor: "var(--bg-sidebar)",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                }}
            >
                {/* Brand Header */}
                <div className="px-4 py-3 border-bottom d-flex align-items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <div
                        className="rounded d-flex align-items-center justify-content-center"
                        style={{ width: "30px", height: "30px", backgroundColor: "rgba(255,255,255,0.1)", color: "#f8fafc" }}
                    >
                        <i className="bi bi-grid-1x2-fill" style={{ fontSize: "14px" }}></i>
                    </div>
                    <div>
                        <div className="fw-semibold text-white" style={{ fontSize: "14px", lineHeight: "1.2" }}>HRMS Core</div>
                        <div className="text-secondary" style={{ fontSize: "11px" }}>Organization Systems</div>
                    </div>
                </div>

                {/* User quick tag */}
                <div className="px-4 py-2 border-bottom d-flex align-items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(0,0,0,0.15)" }}>
                    <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-medium"
                        style={{ width: "26px", height: "26px", fontSize: "11px", backgroundColor: "#334155" }}
                    >
                        {user?.employeeName?.[0] || "U"}
                    </div>
                    <div className="overflow-hidden">
                        <div className="text-truncate text-white" style={{ fontSize: "12px", fontWeight: "500" }}>{user?.employeeName || "User"}</div>
                        <div className="text-secondary" style={{ fontSize: "11px" }}>{user?.role || "Staff"}</div>
                    </div>
                </div>

                {/* Nav Menu */}
                <div className="p-3 flex-grow-1 overflow-auto">
                    <SidebarMenu isAdmin={isAdmin} isManager={isManager} />
                </div>

                {/* Sidebar Footer with Logout Button */}
                <div className="p-3 border-top mt-auto" style={{ borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(0,0,0,0.25)" }}>
                    <button
                        onClick={logout}
                        className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 small fw-semibold"
                        style={{
                            borderRadius: "6px",
                            borderColor: "rgba(239, 68, 68, 0.4)",
                            backgroundColor: "rgba(239, 68, 68, 0.08)",
                            color: "#f87171",
                        }}
                        title="Sign out of your session"
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <div className="offcanvas offcanvas-start text-white" tabIndex="-1" id="sidebar" style={{ backgroundColor: "var(--bg-sidebar)" }}>
                <div className="offcanvas-header border-bottom" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                    <h6 className="offcanvas-title fw-semibold">HRMS Workforce</h6>
                    <button type="button" className="btn-close btn-close-white btn-sm" data-bs-dismiss="offcanvas" />
                </div>
                <div className="offcanvas-body p-3 d-flex flex-column">
                    <div className="flex-grow-1 overflow-auto">
                        <SidebarMenu isAdmin={isAdmin} isManager={isManager} />
                    </div>
                    <div className="pt-3 border-top mt-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                        <button
                            onClick={logout}
                            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 small fw-semibold"
                            style={{
                                borderRadius: "6px",
                                borderColor: "rgba(239, 68, 68, 0.4)",
                                backgroundColor: "rgba(239, 68, 68, 0.08)",
                                color: "#f87171",
                            }}
                        >
                            <i className="bi bi-box-arrow-right"></i>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const SidebarMenu = ({ isAdmin, isManager }) => {
    return (
        <div className="nav flex-column gap-1">
            <NavLink to="/dashboard" className={getMenuClass}>
                <i className="bi bi-grid me-2" style={{ width: "18px" }}></i>
                <span>Dashboard</span>
            </NavLink>

            {/* Admin Masters */}
            {isAdmin && (
                <>
                    <div className="text-secondary small fw-medium mt-3 mb-1 px-2" style={{ fontSize: "11px" }}>
                        Organization Masters
                    </div>

                    <NavLink to="/company" className={getMenuClass}>
                        <i className="bi bi-building me-2" style={{ width: "18px" }}></i> Company
                    </NavLink>

                    <NavLink to="/branch" className={getMenuClass}>
                        <i className="bi bi-geo-alt me-2" style={{ width: "18px" }}></i> Branches
                    </NavLink>

                    <NavLink to="/department" className={getMenuClass}>
                        <i className="bi bi-diagram-3 me-2" style={{ width: "18px" }}></i> Departments
                    </NavLink>

                    <NavLink to="/designation" className={getMenuClass}>
                        <i className="bi bi-award me-2" style={{ width: "18px" }}></i> Designations
                    </NavLink>

                    <NavLink to="/employee" className={getMenuClass}>
                        <i className="bi bi-people me-2" style={{ width: "18px" }}></i> Employees
                    </NavLink>

                    <NavLink to="/assets" className={getMenuClass}>
                        <i className="bi bi-laptop me-2" style={{ width: "18px" }}></i> IT Assets
                    </NavLink>

                    <NavLink to="/shifts" className={getMenuClass}>
                        <i className="bi bi-clock me-2" style={{ width: "18px" }}></i> Shift Patterns
                    </NavLink>

                    <NavLink to="/job-openings" className={getMenuClass}>
                        <i className="bi bi-briefcase me-2" style={{ width: "18px" }}></i> Requisitions
                    </NavLink>

                    <div className="text-secondary small fw-medium mt-3 mb-1 px-2" style={{ fontSize: "11px" }}>
                        HR Operations
                    </div>

                    <NavLink to="/attendance" className={getMenuClass}>
                        <i className="bi bi-calendar-check me-2" style={{ width: "18px" }}></i> Daily Attendance
                    </NavLink>

                    <NavLink to="/roster" className={getMenuClass}>
                        <i className="bi bi-calendar-range me-2" style={{ width: "18px" }}></i> Shift Roster
                    </NavLink>

                    <NavLink to="/leave-approval" className={getMenuClass}>
                        <i className="bi bi-check2-circle me-2" style={{ width: "18px" }}></i> Leave Queue
                    </NavLink>

                    <NavLink to="/expense-approval" className={getMenuClass}>
                        <i className="bi bi-receipt me-2" style={{ width: "18px" }}></i> Expense Queue
                    </NavLink>

                    <NavLink to="/candidate-pipeline" className={getMenuClass}>
                        <i className="bi bi-kanban me-2" style={{ width: "18px" }}></i> Candidate Pipeline
                    </NavLink>

                    <NavLink to="/document-templates" className={getMenuClass}>
                        <i className="bi bi-file-earmark-text me-2" style={{ width: "18px" }}></i> Letter Templates
                    </NavLink>

                    <NavLink to="/onboarding" className={getMenuClass}>
                        <i className="bi bi-list-check me-2" style={{ width: "18px" }}></i> Onboarding Checklist
                    </NavLink>

                    <NavLink to="/fnf-settlement" className={getMenuClass}>
                        <i className="bi bi-calculator me-2" style={{ width: "18px" }}></i> Full & Final Payouts
                    </NavLink>

                    <NavLink to="/payroll" className={getMenuClass}>
                        <i className="bi bi-cash me-2" style={{ width: "18px" }}></i> Payroll Runs
                    </NavLink>

                    <NavLink to="/audit-logs" className={getMenuClass}>
                        <i className="bi bi-shield-check me-2" style={{ width: "18px" }}></i> Security Audit Log
                    </NavLink>

                    <NavLink to="/reports" className={getMenuClass}>
                        <i className="bi bi-graph-up me-2" style={{ width: "18px" }}></i> Reports
                    </NavLink>
                </>
            )}

            {/* Manager View */}
            {isManager && (
                <>
                    <div className="text-secondary small fw-medium mt-3 mb-1 px-2" style={{ fontSize: "11px" }}>
                        Team Management
                    </div>

                    <NavLink to="/team" className={getMenuClass}>
                        <i className="bi bi-people me-2" style={{ width: "18px" }}></i> Team Directory
                    </NavLink>

                    <NavLink to="/attendance" className={getMenuClass}>
                        <i className="bi bi-clock me-2" style={{ width: "18px" }}></i> Attendance
                    </NavLink>

                    <NavLink to="/roster" className={getMenuClass}>
                        <i className="bi bi-calendar-range me-2" style={{ width: "18px" }}></i> Shift Roster
                    </NavLink>

                    <NavLink to="/leave-approval" className={getMenuClass}>
                        <i className="bi bi-check2-circle me-2" style={{ width: "18px" }}></i> Leave Approvals
                    </NavLink>

                    <NavLink to="/expense-approval" className={getMenuClass}>
                        <i className="bi bi-receipt me-2" style={{ width: "18px" }}></i> Expense Review
                    </NavLink>

                    <NavLink to="/candidate-pipeline" className={getMenuClass}>
                        <i className="bi bi-kanban me-2" style={{ width: "18px" }}></i> Recruitment Pipeline
                    </NavLink>

                    <NavLink to="/reports" className={getMenuClass}>
                        <i className="bi bi-graph-up me-2" style={{ width: "18px" }}></i> Reports
                    </NavLink>
                </>
            )}

            {/* Personal Workspace */}
            <div className="text-secondary small fw-medium mt-3 mb-1 px-2" style={{ fontSize: "11px" }}>
                My Workspace
            </div>

            <NavLink to="/profile" className={getMenuClass}>
                <i className="bi bi-person me-2" style={{ width: "18px" }}></i> My Profile
            </NavLink>

            <NavLink to="/my-attendance" className={getMenuClass}>
                <i className="bi bi-stopwatch me-2" style={{ width: "18px" }}></i> Attendance Log
            </NavLink>

            <NavLink to="/apply-leave" className={getMenuClass}>
                <i className="bi bi-calendar-plus me-2" style={{ width: "18px" }}></i> Leave Requests
            </NavLink>

            <NavLink to="/my-payroll" className={getMenuClass}>
                <i className="bi bi-receipt me-2" style={{ width: "18px" }}></i> My Payslips
            </NavLink>

            <NavLink to="/my-expenses" className={getMenuClass}>
                <i className="bi bi-wallet2 me-2" style={{ width: "18px" }}></i> Expense Claims
            </NavLink>

            <NavLink to="/my-assets" className={getMenuClass}>
                <i className="bi bi-laptop me-2" style={{ width: "18px" }}></i> Issued Hardware
            </NavLink>

            <NavLink to="/goals" className={getMenuClass}>
                <i className="bi bi-bullseye me-2" style={{ width: "18px" }}></i> Goals & OKRs
            </NavLink>

            <NavLink to="/appraisal" className={getMenuClass}>
                <i className="bi bi-star me-2" style={{ width: "18px" }}></i> Performance Review
            </NavLink>

            <NavLink to="/my-documents" className={getMenuClass}>
                <i className="bi bi-folder me-2" style={{ width: "18px" }}></i> Document Vault
            </NavLink>

            <NavLink to="/resignation" className={getMenuClass}>
                <i className="bi bi-box-arrow-right me-2" style={{ width: "18px" }}></i> Resignation Notice
            </NavLink>
        </div>
    );
};

const getMenuClass = ({ isActive }) => {
    return `nav-link rounded px-3 py-2 d-flex align-items-center mb-1 ${
        isActive
            ? "bg-primary text-white fw-medium shadow-sm"
            : "text-light-muted hover-nav-item"
    }`;
};

export default Sidebar;