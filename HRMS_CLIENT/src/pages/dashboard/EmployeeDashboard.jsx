import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getTodayStatus, clockIn, clockOut } from "../../services/attendanceService";
import { getLeaveBalances } from "../../services/leaveService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [todayStatus, setTodayStatus] = useState(null);
    const [leaveBalances, setLeaveBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clockLoading, setClockLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState(null);

    const loadData = async () => {
        if (!user?.employeeId) return;
        try {
            setLoading(true);
            const [att, leaves] = await Promise.all([
                getTodayStatus(user.employeeId).catch(() => null),
                getLeaveBalances(user.employeeId).catch(() => [])
            ]);
            setTodayStatus(att);
            setLeaveBalances(leaves || []);
        } catch (err) {
            console.error("Dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user?.employeeId]);

    const handleClockIn = async () => {
        try {
            setClockLoading(true);
            await clockIn(user?.employeeId);
            setAlertMsg({ type: "success", text: "Attendance punch recorded." });
            await loadData();
        } catch (err) {
            setAlertMsg({ type: "danger", text: err.response?.data?.message || "Failed to record punch." });
        } finally {
            setClockLoading(false);
        }
    };

    const handleClockOut = async () => {
        try {
            setClockLoading(true);
            await clockOut(user?.employeeId);
            setAlertMsg({ type: "success", text: "Clock-out recorded." });
            await loadData();
        } catch (err) {
            setAlertMsg({ type: "danger", text: err.response?.data?.message || "Failed to record clock-out." });
        } finally {
            setClockLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading workspace..." />;
    }

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                    <h3 className="page-title">Personal Workspace</h3>
                    <p className="page-subtitle">{user?.employeeName} • {user?.role}</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/my-attendance" className="btn btn-outline-secondary">
                        <i className="bi bi-clock"></i> Attendance Log
                    </Link>
                    <Link to="/apply-leave" className="btn btn-primary">
                        <i className="bi bi-calendar-plus"></i> Request Leave
                    </Link>
                </div>
            </div>

            {alertMsg && (
                <div className={`alert alert-${alertMsg.type} alert-dismissible fade show py-2 mb-3`} role="alert">
                    {alertMsg.text}
                    <button type="button" className="btn-close" onClick={() => setAlertMsg(null)}></button>
                </div>
            )}

            <div className="row g-4 mb-4">
                {/* Today's Punch Card */}
                <div className="col-12 col-lg-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <span>Today's Work Log</span>
                        </div>
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div className="mb-3">
                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <span className="text-secondary small">First Punch In:</span>
                                    <span className="fw-semibold tabular-nums">
                                        {todayStatus?.inTime ? new Date(todayStatus.inTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between py-2 border-bottom">
                                    <span className="text-secondary small">Last Punch Out:</span>
                                    <span className="fw-semibold tabular-nums">
                                        {todayStatus?.outTime ? new Date(todayStatus.outTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between py-2">
                                    <span className="text-secondary small">Status:</span>
                                    <span className={`badge ${todayStatus?.status === "Present" ? "badge-success" : "badge-neutral"}`}>
                                        {todayStatus?.status || "Not Checked In"}
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-primary flex-grow-1"
                                    onClick={handleClockIn}
                                    disabled={clockLoading || Boolean(todayStatus?.inTime)}
                                >
                                    Clock In
                                </button>
                                <button
                                    className="btn btn-outline-secondary flex-grow-1"
                                    onClick={handleClockOut}
                                    disabled={clockLoading || !todayStatus?.inTime || Boolean(todayStatus?.outTime)}
                                >
                                    Clock Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leave Quota Balances */}
                <div className="col-12 col-lg-8">
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>Allocated Leave Quotas</span>
                            <span className="small text-muted" style={{ fontSize: "11px" }}>Current Calendar Year</span>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                {leaveBalances.length === 0 ? (
                                    <div className="col-12 text-muted small py-3">No leave policy allocated.</div>
                                ) : (
                                    leaveBalances.map(lb => (
                                        <div key={lb.leaveTypeId} className="col-6 col-md-4">
                                            <div className="card p-3 bg-light bg-opacity-25 h-100">
                                                <div className="small text-muted mb-1" style={{ fontSize: "12px" }}>{lb.leaveName}</div>
                                                <div className="fs-3 fw-semibold text-dark tabular-nums">{lb.remainingDays ?? lb.balanceDays ?? 0}</div>
                                                <div className="small text-muted" style={{ fontSize: "11px" }}>
                                                    Allocated: {lb.allocatedDays || lb.maxDays} days
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
