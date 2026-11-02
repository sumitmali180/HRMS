import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getPendingApprovals, approveOrRejectLeave } from "../../services/leaveService";
import { getDailyAttendance } from "../../services/attendanceService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatCard from "../../components/common/StatCard";

const ManagerDashboard = () => {
    const { user } = useAuth();
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [attendanceToday, setAttendanceToday] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertMsg, setAlertMsg] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [leaves, att] = await Promise.all([
                getPendingApprovals(user?.employeeId).catch(() => []),
                getDailyAttendance().catch(() => [])
            ]);
            setPendingLeaves(leaves || []);
            setAttendanceToday(att || []);
        } catch (err) {
            console.error("Manager dashboard error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user?.employeeId]);

    const handleQuickApprove = async (leaveId) => {
        try {
            await approveOrRejectLeave({
                leaveId,
                status: "Approved",
                rejectionReason: null,
                approvedBy: user?.employeeId
            });
            setAlertMsg({ type: "success", text: "Leave request approved." });
            await loadData();
        } catch (err) {
            setAlertMsg({ type: "danger", text: err.response?.data?.message || "Failed to approve leave." });
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading manager dashboard..." />;
    }

    const presentCount = attendanceToday.filter(a => a.status === "Present" || a.status === "Late").length;

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                    <h3 className="page-title">Team Operations</h3>
                    <p className="page-subtitle">Department attendance, roster scheduling, and leave approvals</p>
                </div>
                <div className="d-flex gap-2">
                    <Link to="/attendance" className="btn btn-outline-secondary">
                        <i className="bi bi-calendar-check"></i> Attendance
                    </Link>
                    <Link to="/roster" className="btn btn-primary">
                        <i className="bi bi-calendar-range"></i> Roster Planner
                    </Link>
                </div>
            </div>

            {alertMsg && (
                <div className={`alert alert-${alertMsg.type} alert-dismissible fade show py-2 mb-3`} role="alert">
                    {alertMsg.text}
                    <button type="button" className="btn-close" onClick={() => setAlertMsg(null)}></button>
                </div>
            )}

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <StatCard
                        title="Pending Leave Requests"
                        value={pendingLeaves.length}
                        subtitle="Awaiting your approval"
                    />
                </div>
                <div className="col-12 col-md-4">
                    <StatCard
                        title="Team Punches Today"
                        value={presentCount}
                        subtitle="Marked present or late"
                    />
                </div>
                <div className="col-12 col-md-4">
                    <StatCard
                        title="Department Size"
                        value={attendanceToday.length}
                        subtitle="Assigned team members"
                    />
                </div>
            </div>

            {/* Pending Approvals Table */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-medium text-dark">Leave Approval Queue</span>
                    <span className="badge badge-neutral">{pendingLeaves.length} Pending</span>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small text-uppercase">
                                <tr>
                                    <th>Employee</th>
                                    <th>Leave Type</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Days</th>
                                    <th>Reason</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingLeaves.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            No pending leave applications for your team.
                                        </td>
                                    </tr>
                                ) : (
                                    pendingLeaves.map(leave => (
                                        <tr key={leave.leaveApplicationId || leave.leaveId}>
                                            <td className="fw-semibold">{leave.employeeName}</td>
                                            <td><span className="badge badge-neutral">{leave.leaveTypeName}</span></td>
                                            <td>{new Date(leave.fromDate || leave.startDate).toLocaleDateString()}</td>
                                            <td>{new Date(leave.toDate || leave.endDate).toLocaleDateString()}</td>
                                            <td className="tabular-nums fw-medium">{leave.totalDays}</td>
                                            <td className="text-truncate" style={{ maxWidth: "200px" }}>{leave.reason}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleQuickApprove(leave.leaveApplicationId || leave.leaveId)}
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
