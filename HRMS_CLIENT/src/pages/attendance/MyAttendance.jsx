import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import {
    clockIn,
    clockOut,
    getTodayStatus,
    getMonthlyAttendance,
    regularizeAttendance
} from "../../services/attendanceService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MyAttendance = () => {
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [todayStatus, setTodayStatus] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loadingToday, setLoadingToday] = useState(true);
    const [loadingMonthly, setLoadingMonthly] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // Month & Year selection
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Regularization modal state
    const [showRegularizeModal, setShowRegularizeModal] = useState(false);
    const [regForm, setRegForm] = useState({
        attendanceDate: new Date().toISOString().split("T")[0],
        inTime: "09:00",
        outTime: "18:00",
        reason: ""
    });
    const [regLoading, setRegLoading] = useState(false);

    // Digital clock ticker
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Load today status
    const loadToday = async () => {
        try {
            setLoadingToday(true);
            const data = await getTodayStatus(user?.employeeId || 0);
            setTodayStatus(data);
        } catch (err) {
            console.error("Failed to load today status:", err);
        } finally {
            setLoadingToday(false);
        }
    };

    // Load monthly history
    const loadMonthly = async () => {
        if (!user?.employeeId) return;
        try {
            setLoadingMonthly(true);
            const data = await getMonthlyAttendance(user.employeeId, selectedMonth, selectedYear);
            setMonthlyData(data || []);
        } catch (err) {
            console.error("Failed to load monthly attendance:", err);
        } finally {
            setLoadingMonthly(false);
        }
    };

    useEffect(() => {
        loadToday();
    }, [user?.employeeId]);

    useEffect(() => {
        loadMonthly();
    }, [user?.employeeId, selectedMonth, selectedYear]);

    const handleClockIn = async () => {
        try {
            setActionLoading(true);
            await clockIn(user?.employeeId);
            alert("Clock-in successful!");
            await loadToday();
            await loadMonthly();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to clock in.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleClockOut = async () => {
        try {
            setActionLoading(true);
            await clockOut(user?.employeeId);
            alert("Clock-out successful!");
            await loadToday();
            await loadMonthly();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to clock out.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRegularizeSubmit = async (e) => {
        e.preventDefault();
        try {
            setRegLoading(true);
            await regularizeAttendance({
                employeeId: user?.employeeId,
                attendanceDate: regForm.attendanceDate,
                inTime: `${regForm.attendanceDate}T${regForm.inTime}:00`,
                outTime: `${regForm.attendanceDate}T${regForm.outTime}:00`,
                reason: regForm.reason
            });
            alert("Regularization applied successfully!");
            setShowRegularizeModal(false);
            setRegForm({
                attendanceDate: new Date().toISOString().split("T")[0],
                inTime: "09:00",
                outTime: "18:00",
                reason: ""
            });
            await loadToday();
            await loadMonthly();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to regularize attendance.");
        } finally {
            setRegLoading(false);
        }
    };

    const formatTimeOnly = (dateTimeStr) => {
        if (!dateTimeStr) return "--:--";
        const d = new Date(dateTimeStr);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    };

    // Calculate worked hours live if clocked in and not clocked out
    const calculateLiveWorked = () => {
        if (!todayStatus?.inTime) return "0h 0m";
        const inTime = new Date(todayStatus.inTime);
        const outTime = todayStatus.outTime ? new Date(todayStatus.outTime) : currentTime;
        const diffMs = Math.max(0, outTime - inTime);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${mins}m`;
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "present":
                return <span className="badge badge-success">Present</span>;
            case "late":
                return <span className="badge badge-warning">Late</span>;
            case "halfday":
                return <span className="badge badge-info">Half day</span>;
            case "absent":
                return <span className="badge badge-danger">Absent</span>;
            default:
                return <span className="badge badge-neutral">{status || "Pending"}</span>;
        }
    };

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-semibold text-dark mb-1">My attendance</h3>
                    <p className="text-muted mb-0 small">Record work hours and review monthly punch history</p>
                </div>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowRegularizeModal(true)}
                >
                    <i className="bi bi-clock-history me-1"></i>Request regularization
                </button>
            </div>

            {/* Top Cards: Live Punch Widget & Summary */}
            <div className="row g-3 mb-4">
                {/* Punch Card Widget */}
                <div className="col-lg-5 col-md-6">
                    <div className="card border h-100 bg-white">
                        <div className="card-body p-4 text-center d-flex flex-column justify-content-between">
                            <div>
                                <span className="text-muted small">Real-time clock</span>
                                <h1 className="display-6 fw-semibold my-2 font-monospace text-dark">
                                    {currentTime.toLocaleTimeString()}
                                </h1>
                                <p className="mb-0 text-muted small">
                                    {currentTime.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                </p>
                            </div>

                            <div className="my-4 py-3 bg-light rounded border">
                                <div className="row text-center">
                                    <div className="col-4 border-end">
                                        <small className="text-muted d-block">Clock in</small>
                                        <strong className="fs-6 font-monospace">{formatTimeOnly(todayStatus?.inTime)}</strong>
                                    </div>
                                    <div className="col-4 border-end">
                                        <small className="text-muted d-block">Clock out</small>
                                        <strong className="fs-6 font-monospace">{formatTimeOnly(todayStatus?.outTime)}</strong>
                                    </div>
                                    <div className="col-4">
                                        <small className="text-muted d-block">Hours</small>
                                        <strong className="fs-6 font-monospace text-dark">{calculateLiveWorked()}</strong>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2 justify-content-center">
                                <button
                                    className="btn btn-primary px-4 py-2 btn-sm fw-medium"
                                    onClick={handleClockIn}
                                    disabled={actionLoading || Boolean(todayStatus?.inTime)}
                                >
                                    {actionLoading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-box-arrow-in-right me-1"></i>}
                                    {todayStatus?.inTime ? "Clocked in" : "Clock in"}
                                </button>
                                <button
                                    className="btn btn-secondary px-4 py-2 btn-sm fw-medium"
                                    onClick={handleClockOut}
                                    disabled={actionLoading || !todayStatus?.inTime || Boolean(todayStatus?.outTime)}
                                >
                                    {actionLoading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-box-arrow-left me-1"></i>}
                                    {todayStatus?.outTime ? "Clocked out" : "Clock out"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Metrics Summary */}
                <div className="col-lg-7 col-md-6">
                    <div className="card border h-100">
                        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                            <span className="fw-semibold text-dark">Monthly overview</span>
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(0, i).toLocaleString("default", { month: "long" })}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                >
                                    {[2024, 2025, 2026, 2027].map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-6 col-sm-3">
                                    <div className="metric-card">
                                        <span className="metric-label">Present</span>
                                        <div className="metric-value">
                                            {monthlyData.filter(d => d.status?.toLowerCase() === "present").length}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-sm-3">
                                    <div className="metric-card">
                                        <span className="metric-label">Late</span>
                                        <div className="metric-value">
                                            {monthlyData.filter(d => d.status?.toLowerCase() === "late").length}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-sm-3">
                                    <div className="metric-card">
                                        <span className="metric-label">Half day</span>
                                        <div className="metric-value">
                                            {monthlyData.filter(d => d.status?.toLowerCase() === "halfday").length}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6 col-sm-3">
                                    <div className="metric-card">
                                        <span className="metric-label">Absent</span>
                                        <div className="metric-value">
                                            {monthlyData.filter(d => d.status?.toLowerCase() === "absent").length}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 p-3 bg-light rounded border">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted small">Shift policy</span>
                                    <span className="small text-dark font-monospace">General shift (09:00 - 18:00)</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted small">Grace period</span>
                                    <span className="small text-dark font-monospace">15 minutes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Attendance Log Table */}
            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom">
                    <span className="fw-semibold text-dark">Monthly attendance history</span>
                </div>
                <div className="card-body p-0">
                    {loadingMonthly ? (
                        <div className="p-5 text-center">
                            <LoadingSpinner text="Loading attendance history..." />
                        </div>
                    ) : monthlyData.length === 0 ? (
                        <div className="p-5 text-center text-muted">
                            <i className="bi bi-calendar-x fs-3 d-block mb-2 text-secondary opacity-50"></i>
                            <span className="small">No attendance records found for this period.</span>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>In time</th>
                                        <th>Out time</th>
                                        <th>Total hours</th>
                                        <th>Status</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyData.map((record) => (
                                        <tr key={record.attendanceId || record.attendanceDate}>
                                            <td className="fw-medium">
                                                {new Date(record.attendanceDate).toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="font-monospace">{formatTimeOnly(record.inTime)}</td>
                                            <td className="font-monospace">{formatTimeOnly(record.outTime)}</td>
                                            <td>
                                                <span className="font-monospace tabular-nums">
                                                    {record.totalHours ? `${Number(record.totalHours).toFixed(1)} hrs` : "--"}
                                                </span>
                                            </td>
                                            <td>{getStatusBadge(record.status)}</td>
                                            <td className="text-muted small">{record.notes || "--"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Regularization Modal */}
            {showRegularizeModal && (
                <>
                    <div className="modal-backdrop fade show" />
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border shadow-sm">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fs-6 fw-semibold">Request regularization</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowRegularizeModal(false)}
                                    />
                                </div>
                                <form onSubmit={handleRegularizeSubmit}>
                                    <div className="modal-body p-4">
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Attendance date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={regForm.attendanceDate}
                                                onChange={(e) => setRegForm({ ...regForm, attendanceDate: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                <label className="form-label small text-muted">Punch in time</label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={regForm.inTime}
                                                    onChange={(e) => setRegForm({ ...regForm, inTime: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small text-muted">Punch out time</label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={regForm.outTime}
                                                    onChange={(e) => setRegForm({ ...regForm, outTime: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Reason for regularization</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={regForm.reason}
                                                onChange={(e) => setRegForm({ ...regForm, reason: e.target.value })}
                                                placeholder="e.g. Forgot to punch due to client visit"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-white border-top">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setShowRegularizeModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            disabled={regLoading}
                                        >
                                            {regLoading ? "Submitting..." : "Submit request"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyAttendance;
