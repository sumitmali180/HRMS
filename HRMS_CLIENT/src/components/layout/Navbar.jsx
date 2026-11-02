import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav
            className="navbar navbar-expand-lg border-bottom px-4"
            style={{
                height: "56px",
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-hairline)",
                position: "sticky",
                top: 0,
                zIndex: 1020,
            }}
        >
            <div className="container-fluid p-0">
                {/* Mobile menu trigger */}
                <button
                    className="btn btn-outline-secondary d-lg-none me-3 btn-sm"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sidebar"
                >
                    <i className="bi bi-list"></i>
                </button>

                <div className="d-flex align-items-center gap-2">
                    <span className="small text-secondary fw-medium">Workforce directory</span>
                    <span className="text-muted small">/</span>
                    <span className="small text-white fw-semibold">Internal HR management</span>
                </div>

                <div className="ms-auto d-flex align-items-center gap-2">
                    {/* User profile dropdown */}
                    <div className="position-relative" ref={dropdownRef}>
                        <button
                            className="btn btn-outline-secondary border d-flex align-items-center gap-2 py-1 px-2"
                            type="button"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            style={{
                                borderRadius: "6px",
                                backgroundColor: "var(--bg-raised)",
                                borderColor: "var(--border-hairline)",
                            }}
                        >
                            <div
                                className="rounded bg-primary text-white d-flex align-items-center justify-content-center fw-medium"
                                style={{ width: "24px", height: "24px", fontSize: "0.75rem" }}
                            >
                                {user?.employeeName?.[0] || "U"}
                            </div>
                            <span className="small fw-medium text-white">{user?.employeeName || "User"}</span>
                            <i className={`bi bi-chevron-${dropdownOpen ? "up" : "down"} text-secondary`} style={{ fontSize: "0.7rem" }}></i>
                        </button>

                        {/* Controlled Dropdown Menu */}
                        {dropdownOpen && (
                            <ul
                                className="dropdown-menu dropdown-menu-end shadow-lg border mt-1 show"
                                style={{
                                    display: "block",
                                    position: "absolute",
                                    right: 0,
                                    top: "100%",
                                    minWidth: "230px",
                                    borderRadius: "8px",
                                    backgroundColor: "var(--bg-surface)",
                                    borderColor: "var(--border-hairline)",
                                    zIndex: 1050,
                                }}
                            >
                                <li className="px-3 py-2 border-bottom" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-raised)" }}>
                                    <div className="fw-semibold text-white small">{user?.employeeName}</div>
                                    <div className="text-secondary small text-truncate">{user?.email}</div>
                                    <span className="badge badge-neutral mt-1">{user?.role}</span>
                                </li>

                                <li>
                                    <Link
                                        to="/profile"
                                        className="dropdown-item py-2 small d-flex align-items-center gap-2 text-secondary"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <i className="bi bi-person"></i> Profile overview
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/my-attendance"
                                        className="dropdown-item py-2 small d-flex align-items-center gap-2 text-secondary"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <i className="bi bi-clock-history"></i> Attendance
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/my-payroll"
                                        className="dropdown-item py-2 small d-flex align-items-center gap-2 text-secondary"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <i className="bi bi-receipt"></i> Monthly payslips
                                    </Link>
                                </li>

                                <li>
                                    <hr className="dropdown-divider my-1" style={{ borderColor: "var(--border-hairline)" }} />
                                </li>

                                <li>
                                    <button
                                        className="dropdown-item py-2 small d-flex align-items-center gap-2 text-danger"
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            logout();
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-right"></i> Sign out
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Dedicated Always-Visible Logout Button */}
                    <button
                        onClick={logout}
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 py-1 px-3"
                        style={{
                            borderRadius: "6px",
                            fontSize: "0.825rem",
                            borderColor: "rgba(239, 68, 68, 0.4)",
                            backgroundColor: "rgba(239, 68, 68, 0.08)",
                            color: "#f87171",
                        }}
                        title="Sign out of HRMS"
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        <span className="d-none d-sm-inline fw-medium">Sign Out</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;