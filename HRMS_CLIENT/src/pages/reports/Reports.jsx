import { useState, useEffect } from "react";
import { getDailyAttendance } from "../../services/attendanceService";
import { getPayrollList } from "../../services/payrollService";
import { getEmployeeList } from "../../services/employeeService";
import { getBranchLookup } from "../../services/lookupService";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Reports = () => {
    const [activeReport, setActiveReport] = useState("attendance");
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState([]);

    // Filters
    const [selectedBranch, setSelectedBranch] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    // Report data
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const list = await getBranchLookup();
                setBranches(list || []);
            } catch (err) {
                console.error("Failed to load branches:", err);
            }
        };
        fetchBranches();
    }, []);

    const loadReportData = async () => {
        try {
            setLoading(true);
            if (activeReport === "attendance") {
                const data = await getDailyAttendance(selectedBranch || null, date);
                setReportData(data || []);
            } else if (activeReport === "payroll") {
                const data = await getPayrollList(month, year, selectedBranch || null);
                setReportData(data || []);
            } else if (activeReport === "employees") {
                const data = await getEmployeeList();
                let filtered = data || [];
                if (selectedBranch) {
                    filtered = filtered.filter(e => e.branchId === Number(selectedBranch));
                }
                setReportData(filtered);
            }
        } catch (err) {
            console.error("Failed to generate report:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReportData();
    }, [activeReport, selectedBranch, date, month, year]);

    const exportToCSV = () => {
        if (reportData.length === 0) {
            alert("No data available to export.");
            return;
        }

        let headers = [];
        let rows = [];

        if (activeReport === "attendance") {
            headers = ["Employee Code", "Employee Name", "Department", "Designation", "In Time", "Out Time", "Total Hours", "Status"];
            rows = reportData.map(r => [
                `"${r.employeeCode || ""}"`,
                `"${r.employeeName || ""}"`,
                `"${r.departmentName || ""}"`,
                `"${r.designationName || ""}"`,
                `"${r.inTime ? new Date(r.inTime).toLocaleTimeString() : "--"}"`,
                `"${r.outTime ? new Date(r.outTime).toLocaleTimeString() : "--"}"`,
                `"${r.totalHours ? Number(r.totalHours).toFixed(2) : "0"}"`,
                `"${r.status || ""}"`
            ]);
        } else if (activeReport === "payroll") {
            headers = ["Employee Code", "Employee Name", "Month", "Year", "Gross Salary", "Total Deductions", "LOP Days", "Net Salary", "Payment Status"];
            rows = reportData.map(r => [
                `"${r.employeeCode || ""}"`,
                `"${r.employeeName || ""}"`,
                `"${r.month}"`,
                `"${r.year}"`,
                `"${r.grossSalary}"`,
                `"${r.totalDeductions}"`,
                `"${r.lopDays || 0}"`,
                `"${r.netSalary}"`,
                `"${r.paymentStatus || ""}"`
            ]);
        } else if (activeReport === "employees") {
            headers = ["Employee Code", "Full Name", "Email", "Phone", "Branch", "Department", "Designation", "Joining Date", "Status"];
            rows = reportData.map(r => [
                `"${r.employeeCode || ""}"`,
                `"${r.fullName || ""}"`,
                `"${r.email || ""}"`,
                `"${r.phone || ""}"`,
                `"${r.branchName || ""}"`,
                `"${r.departmentName || ""}"`,
                `"${r.designationName || ""}"`,
                `"${r.joiningDate ? new Date(r.joiningDate).toLocaleDateString() : "--"}"`,
                `"${r.status || ""}"`
            ]);
        }

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `HRMS_${activeReport}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Columns config
    const attendanceColumns = [
        { key: "employeeCode", label: "Code", render: (r) => <span className="font-monospace text-muted">{r.employeeCode}</span> },
        { key: "employeeName", label: "Employee name" },
        { key: "departmentName", label: "Department" },
        {
            key: "inTime",
            label: "In time",
            render: (r) => <span className="font-monospace tabular-nums">{r.inTime ? new Date(r.inTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</span>
        },
        {
            key: "outTime",
            label: "Out time",
            render: (r) => <span className="font-monospace tabular-nums">{r.outTime ? new Date(r.outTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</span>
        },
        {
            key: "totalHours",
            label: "Hours",
            render: (r) => <span className="font-monospace tabular-nums">{r.totalHours ? `${Number(r.totalHours).toFixed(1)} hrs` : "--"}</span>
        },
        {
            key: "status",
            label: "Status",
            render: (r) => {
                const s = (r.status || "").toLowerCase();
                const cls = s === "present" ? "badge-success" : s === "absent" ? "badge-danger" : "badge-neutral";
                return <span className={`badge ${cls}`}>{r.status}</span>;
            }
        }
    ];

    const payrollColumns = [
        { key: "employeeCode", label: "Code", render: (r) => <span className="font-monospace text-muted">{r.employeeCode}</span> },
        { key: "employeeName", label: "Employee name" },
        { key: "grossSalary", label: "Gross salary (₹)", render: (r) => <span className="font-monospace tabular-nums">₹{Number(r.grossSalary || 0).toLocaleString()}</span> },
        { key: "totalDeductions", label: "Deductions (₹)", render: (r) => <span className="font-monospace tabular-nums">₹{Number(r.totalDeductions || 0).toLocaleString()}</span> },
        { key: "lopDays", label: "LOP days", render: (r) => <span className="font-monospace tabular-nums">{r.lopDays || 0}</span> },
        {
            key: "netSalary",
            label: "Net salary (₹)",
            render: (r) => <strong className="font-monospace tabular-nums text-dark">₹{Number(r.netSalary || 0).toLocaleString()}</strong>
        },
        {
            key: "paymentStatus",
            label: "Status",
            render: (r) => {
                const s = (r.paymentStatus || "").toLowerCase();
                const cls = s === "paid" ? "badge-success" : "badge-neutral";
                return <span className={`badge ${cls}`}>{r.paymentStatus || "Pending"}</span>;
            }
        }
    ];

    const employeeColumns = [
        { key: "employeeCode", label: "Code", render: (r) => <span className="font-monospace text-muted">{r.employeeCode}</span> },
        { key: "fullName", label: "Full name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone", render: (r) => <span className="font-monospace tabular-nums">{r.phone || "--"}</span> },
        { key: "branchName", label: "Branch" },
        { key: "departmentName", label: "Department" },
        { key: "designationName", label: "Designation" },
        {
            key: "status",
            label: "Status",
            render: (r) => {
                const s = (r.status || "").toLowerCase();
                const cls = s === "active" ? "badge-success" : "badge-neutral";
                return <span className={`badge ${cls}`}>{r.status || "Active"}</span>;
            }
        }
    ];

    const getCurrentColumns = () => {
        if (activeReport === "attendance") return attendanceColumns;
        if (activeReport === "payroll") return payrollColumns;
        return employeeColumns;
    };

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                    <h3 className="h4 fw-bold text-dark mb-1">Reports</h3>
                    <p className="text-muted small mb-0">Generate and export attendance, payroll, and employee records.</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={exportToCSV}>
                    <i className="bi bi-download me-1"></i> Export to CSV
                </button>
            </div>

            {/* Navigation Tabs */}
            <ul className="nav nav-pills mb-3 bg-light p-1 rounded border">
                <li className="nav-item">
                    <button
                        className={`nav-link btn-sm ${activeReport === "attendance" ? "active" : "text-muted"}`}
                        onClick={() => setActiveReport("attendance")}
                    >
                        <i className="bi bi-clock-history me-1"></i> Attendance log
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link btn-sm ${activeReport === "payroll" ? "active" : "text-muted"}`}
                        onClick={() => setActiveReport("payroll")}
                    >
                        <i className="bi bi-cash-stack me-1"></i> Payroll register
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link btn-sm ${activeReport === "employees" ? "active" : "text-muted"}`}
                        onClick={() => setActiveReport("employees")}
                    >
                        <i className="bi bi-people me-1"></i> Employee directory
                    </button>
                </li>
            </ul>

            {/* Filter Controls */}
            <div className="card mb-3">
                <div className="card-body p-3">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label small text-muted mb-1">Branch</label>
                            <select
                                className="form-select form-select-sm"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="">All branches</option>
                                {branches.map((b) => (
                                    <option key={b.id || b.branchId} value={b.id || b.branchId}>
                                        {b.name || b.branchName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {activeReport === "attendance" && (
                            <div className="col-md-3">
                                <label className="form-label small text-muted mb-1">Date</label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        )}

                        {activeReport === "payroll" && (
                            <>
                                <div className="col-md-3">
                                    <label className="form-label small text-muted mb-1">Month</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={month}
                                        onChange={(e) => setMonth(Number(e.target.value))}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {new Date(0, i).toLocaleString("default", { month: "long" })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small text-muted mb-1">Year</label>
                                    <select
                                        className="form-select form-select-sm"
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                    >
                                        {[2024, 2025, 2026, 2027].map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="col-md-3">
                            <button className="btn btn-secondary btn-sm w-100" onClick={loadReportData}>
                                <i className="bi bi-funnel me-1"></i> Apply filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner text="Generating report data..." />
            ) : (
                <DataTable
                    columns={getCurrentColumns()}
                    data={reportData}
                    searchPlaceholder={`Search ${activeReport} records...`}
                />
            )}
        </div>
    );
};

export default Reports;
