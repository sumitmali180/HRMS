import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import {
    getLeaveTypes,
    getLeaveBalances,
    applyLeave,
    getMyLeaveHistory,
    cancelLeave
} from "../../services/leaveService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ApplyLeave = () => {
    const { user } = useAuth();
    const [leaveBalances, setLeaveBalances] = useState([]);
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Apply modal
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        leaveTypeId: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        isHalfDay: false,
        reason: ""
    });

    const loadData = async () => {
        if (!user?.employeeId) return;
        try {
            setLoading(true);
            const [types, balances, history] = await Promise.all([
                getLeaveTypes(),
                getLeaveBalances(user.employeeId),
                getMyLeaveHistory(user.employeeId)
            ]);
            setLeaveTypes(types || []);
            setLeaveBalances(balances || []);
            setLeaveHistory(history || []);
        } catch (err) {
            console.error("Failed to load leave data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user?.employeeId]);

    // Calculate duration in days
    const calculateDays = () => {
        if (formData.isHalfDay) return 0.5;
        if (!formData.startDate || !formData.endDate) return 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = end - start;
        if (diffTime < 0) return 0;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const handleApply = async (e) => {
        e.preventDefault();
        const days = calculateDays();
        if (days <= 0) {
            alert("Invalid date range selected.");
            return;
        }

        try {
            setSubmitting(true);
            await applyLeave({
                employeeId: user?.employeeId,
                leaveTypeId: Number(formData.leaveTypeId),
                startDate: formData.startDate,
                endDate: formData.isHalfDay ? formData.startDate : formData.endDate,
                totalDays: days,
                isHalfDay: formData.isHalfDay,
                reason: formData.reason
            });
            alert("Leave application submitted successfully!");
            setShowModal(false);
            setFormData({
                leaveTypeId: "",
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date().toISOString().split("T")[0],
                isHalfDay: false,
                reason: ""
            });
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit leave application.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (leaveId) => {
        if (!window.confirm("Are you sure you want to cancel this leave application?")) return;
        try {
            await cancelLeave(leaveId);
            alert("Leave application cancelled.");
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel leave.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return <span className="badge badge-success">Approved</span>;
            case "pending":
                return <span className="badge badge-warning">Pending</span>;
            case "rejected":
                return <span className="badge badge-danger">Rejected</span>;
            case "cancelled":
                return <span className="badge badge-neutral">Cancelled</span>;
            default:
                return <span className="badge badge-neutral">{status}</span>;
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading leave balances and history..." />;
    }

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-semibold text-dark mb-1">Leave requests</h3>
                    <p className="text-muted mb-0 small">Review quotas, track applications, and request time off</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                    <i className="bi bi-plus-lg me-1"></i>Apply for leave
                </button>
            </div>

            {/* Leave Balance Cards */}
            <div className="row g-3 mb-4">
                {leaveBalances.length === 0 ? (
                    <div className="col-12">
                        <div className="p-3 bg-light rounded border text-muted small">
                            <i className="bi bi-info-circle me-2"></i>No leave allocations found for this year.
                        </div>
                    </div>
                ) : (
                    leaveBalances.map((bal) => (
                        <div className="col-md-4 col-sm-6" key={bal.leaveAllocationId || bal.leaveTypeId}>
                            <div className="card border h-100">
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="fw-medium text-dark">{bal.leaveTypeName}</span>
                                        <span className="badge badge-neutral font-monospace">
                                            {bal.remainingLeaves} days left
                                        </span>
                                    </div>
                                    <div className="progress mb-3" style={{ height: "4px" }}>
                                        <div
                                            className="progress-bar bg-dark"
                                            role="progressbar"
                                            style={{
                                                width: `${bal.allocatedLeaves > 0 ? ((bal.allocatedLeaves - bal.remainingLeaves) / bal.allocatedLeaves) * 100 : 0}%`
                                            }}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-between text-muted small">
                                        <span>Allocated: <span className="font-monospace text-dark">{bal.allocatedLeaves}</span></span>
                                        <span>Used: <span className="font-monospace text-dark">{bal.usedLeaves}</span></span>
                                        <span>Balance: <span className="font-monospace text-dark">{bal.remainingLeaves}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* My Leave Applications Table */}
            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-semibold text-dark">My applications</span>
                </div>
                <div className="card-body p-0">
                    {leaveHistory.length === 0 ? (
                        <div className="p-5 text-center text-muted">
                            <i className="bi bi-journal-x fs-3 d-block mb-2 text-secondary opacity-50"></i>
                            <span className="small">You have not submitted any leave applications yet.</span>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Leave type</th>
                                        <th>Duration</th>
                                        <th>Days</th>
                                        <th>Reason</th>
                                        <th>Applied on</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaveHistory.map((item) => (
                                        <tr key={item.leaveId}>
                                            <td className="fw-medium">{item.leaveTypeName}</td>
                                            <td className="small">
                                                {new Date(item.startDate).toLocaleDateString()} &ndash; {new Date(item.endDate).toLocaleDateString()}
                                                {item.isHalfDay && <span className="badge badge-neutral ms-1">Half day</span>}
                                            </td>
                                            <td>
                                                <span className="font-monospace tabular-nums">{item.totalDays}</span>
                                            </td>
                                            <td className="text-muted small" style={{ maxWidth: "250px" }}>
                                                {item.reason}
                                            </td>
                                            <td className="text-muted small">
                                                {item.appliedDate ? new Date(item.appliedDate).toLocaleDateString() : "--"}
                                            </td>
                                            <td>{getStatusBadge(item.status)}</td>
                                            <td>
                                                {item.status?.toLowerCase() === "pending" && (
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleCancel(item.leaveId)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Apply Leave Modal */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show" />
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border shadow-sm">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fs-6 fw-semibold">Apply for leave</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    />
                                </div>
                                <form onSubmit={handleApply}>
                                    <div className="modal-body p-4">
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Leave type</label>
                                            <select
                                                className="form-select"
                                                value={formData.leaveTypeId}
                                                onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
                                                required
                                            >
                                                <option value="">Select leave type</option>
                                                {leaveTypes.map((t) => (
                                                    <option key={t.leaveTypeId} value={t.leaveTypeId}>
                                                        {t.leaveTypeName} ({t.isPaid ? "Paid" : "Unpaid"})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-check form-switch mb-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="halfDayCheck"
                                                checked={formData.isHalfDay}
                                                onChange={(e) => setFormData({ ...formData, isHalfDay: e.target.checked })}
                                            />
                                            <label className="form-check-label small" htmlFor="halfDayCheck">
                                                Half day leave (0.5 day)
                                            </label>
                                        </div>

                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                <label className="form-label small text-muted">Start date</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        startDate: e.target.value,
                                                        endDate: formData.isHalfDay ? e.target.value : formData.endDate
                                                    })}
                                                    required
                                                />
                                            </div>
                                            {!formData.isHalfDay && (
                                                <div className="col-6">
                                                    <label className="form-label small text-muted">End date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={formData.endDate}
                                                        min={formData.startDate}
                                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-2 bg-light border rounded mb-3 small d-flex justify-content-between align-items-center">
                                            <span className="text-muted">Calculated duration:</span>
                                            <span className="font-monospace fw-semibold text-dark">{calculateDays()} day(s)</span>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Reason</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={formData.reason}
                                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                                placeholder="Provide details about your leave request"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-white border-top">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            disabled={submitting}
                                        >
                                            {submitting ? "Submitting..." : "Submit request"}
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

export default ApplyLeave;
