import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { getPendingApprovals, approveOrRejectLeave } from "../../services/leaveService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const LeaveApproval = () => {
    const { user } = useAuth();
    const [pendingList, setPendingList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Reject Modal
    const [rejectModal, setRejectModal] = useState({
        isOpen: false,
        leaveId: null,
        employeeName: "",
        reason: ""
    });
    const [submitting, setSubmitting] = useState(false);

    const loadPending = async () => {
        try {
            setLoading(true);
            // If manager, pass user.employeeId; if HR/Admin, passes null to see all
            const isManagerOnly = user?.role === "Manager";
            const data = await getPendingApprovals(isManagerOnly ? user.employeeId : null);
            setPendingList(data || []);
        } catch (err) {
            console.error("Failed to load pending leaves:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPending();
    }, [user?.employeeId, user?.role]);

    const handleApprove = async (leaveId) => {
        if (!window.confirm("Are you sure you want to approve this leave request?")) return;
        try {
            await approveOrRejectLeave({
                leaveId,
                status: "Approved",
                rejectionReason: null,
                approvedBy: user?.employeeId
            });
            alert("Leave approved successfully.");
            await loadPending();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to approve leave.");
        }
    };

    const handleOpenReject = (item) => {
        setRejectModal({
            isOpen: true,
            leaveId: item.leaveId,
            employeeName: item.employeeName,
            reason: ""
        });
    };

    const handleConfirmReject = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await approveOrRejectLeave({
                leaveId: rejectModal.leaveId,
                status: "Rejected",
                rejectionReason: rejectModal.reason,
                approvedBy: user?.employeeId
            });
            alert("Leave application rejected.");
            setRejectModal({ isOpen: false, leaveId: null, employeeName: "", reason: "" });
            await loadPending();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to reject leave.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading pending leave requests..." />;
    }

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-semibold text-dark mb-1">Leave approvals</h3>
                    <p className="text-muted mb-0 small">Review, approve, or reject employee leave requests</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={loadPending}>
                    <i className="bi bi-arrow-clockwise me-1"></i>Refresh
                </button>
            </div>

            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-semibold text-dark">
                        Pending approvals
                        {pendingList.length > 0 && (
                            <span className="badge badge-warning ms-2 font-monospace">{pendingList.length} pending</span>
                        )}
                    </span>
                </div>
                <div className="card-body p-0">
                    {pendingList.length === 0 ? (
                        <div className="p-5 text-center text-muted">
                            <i className="bi bi-check2-circle fs-3 text-secondary opacity-50 d-block mb-2"></i>
                            <span className="small">No pending leave requests to review.</span>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Employee</th>
                                        <th>Leave type</th>
                                        <th>Dates</th>
                                        <th>Total days</th>
                                        <th>Reason</th>
                                        <th>Applied on</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingList.map((item) => (
                                        <tr key={item.leaveId}>
                                            <td>
                                                <div className="fw-medium text-dark">{item.employeeName}</div>
                                                <small className="text-muted font-monospace">{item.employeeCode} &bull; {item.departmentName}</small>
                                            </td>
                                            <td>
                                                <span className="badge badge-neutral">
                                                    {item.leaveTypeName}
                                                </span>
                                            </td>
                                            <td className="small">
                                                {new Date(item.startDate).toLocaleDateString()} &ndash; {new Date(item.endDate).toLocaleDateString()}
                                                {item.isHalfDay && <span className="badge badge-neutral ms-1">Half day</span>}
                                            </td>
                                            <td>
                                                <span className="font-monospace tabular-nums">{item.totalDays}</span>
                                            </td>
                                            <td className="text-muted small" style={{ maxWidth: "220px" }}>
                                                {item.reason}
                                            </td>
                                            <td className="text-muted small">
                                                {item.appliedDate ? new Date(item.appliedDate).toLocaleDateString() : "--"}
                                            </td>
                                            <td className="text-end">
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => handleApprove(item.leaveId)}
                                                        title="Approve"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleOpenReject(item)}
                                                        title="Reject"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Modal */}
            {rejectModal.isOpen && (
                <>
                    <div className="modal-backdrop fade show" />
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border shadow-sm">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fs-6 fw-semibold text-danger">Reject leave request</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setRejectModal({ isOpen: false, leaveId: null, employeeName: "", reason: "" })}
                                    />
                                </div>
                                <form onSubmit={handleConfirmReject}>
                                    <div className="modal-body p-4">
                                        <p className="small text-muted mb-2">
                                            Provide a reason for rejecting the request from <strong className="text-dark">{rejectModal.employeeName}</strong>:
                                        </p>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={rejectModal.reason}
                                            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                                            placeholder="e.g. Critical sprint deadline or staffing constraints"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="modal-footer bg-white border-top">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setRejectModal({ isOpen: false, leaveId: null, employeeName: "", reason: "" })}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-danger btn-sm"
                                            disabled={submitting}
                                        >
                                            {submitting ? "Rejecting..." : "Confirm rejection"}
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

export default LeaveApproval;
