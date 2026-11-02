import { useState, useEffect } from "react";
import { getResignationQueue, getMyResignation, submitResignation, actionResignation } from "../../services/exitService";
import useAuth from "../../hooks/useAuth";

const ResignationManagement = () => {
    const { user } = useAuth();
    const isHRorAdmin = user?.role === "Super Admin" || user?.role === "HR Admin" || user?.role === "Admin" || user?.role === "Manager";

    const [myResignations, setMyResignations] = useState([]);
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const [form, setForm] = useState({
        noticePeriodDays: 30,
        preferredRelievingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        reason: "",
        feedback: ""
    });

    const [actionState, setActionState] = useState({
        resignationId: null,
        status: "Approved",
        approvedRelievingDate: "",
        remarks: ""
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const myRes = await getMyResignation();
            setMyResignations(myRes);

            if (isHRorAdmin) {
                const queueData = await getResignationQueue();
                setQueue(queueData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [isHRorAdmin]);

    const handleSubmitResignation = async (e) => {
        e.preventDefault();
        try {
            const res = await submitResignation(form);
            if (res.success) {
                setAlert({ type: "success", text: "Resignation formal notice submitted." });
                loadData();
                closeModal("resignModal");
            } else {
                setAlert({ type: "danger", text: res.message || "Failed to submit resignation." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error submitting resignation." });
        }
    };

    const handleAction = async (e) => {
        e.preventDefault();
        try {
            const res = await actionResignation(actionState);
            if (res.success) {
                setAlert({ type: "success", text: `Resignation marked as ${actionState.status}.` });
                loadData();
                closeModal("actionResignModal");
            } else {
                setAlert({ type: "danger", text: res.message || "Action failed." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error updating resignation status." });
        }
    };

    const openActionModal = (item, status) => {
        setActionState({
            resignationId: item.resignationId,
            status: status,
            approvedRelievingDate: item.preferredRelievingDate?.split("T")[0] || "",
            remarks: ""
        });
        openModal("actionResignModal");
    };

    const openModal = (id) => {
        const el = document.getElementById(id);
        if (el && window.bootstrap) new window.bootstrap.Modal(el).show();
    };

    const closeModal = (id) => {
        const el = document.getElementById(id);
        window.bootstrap?.Modal.getInstance(el)?.hide();
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Separation management</h4>
                    <p className="text-secondary small mb-0">Resignation workflow, notice period tracking, and clearance</p>
                </div>
                <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2" onClick={() => openModal("resignModal")}>
                    <i className="bi bi-box-arrow-right"></i> Submit resignation
                </button>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            {/* Admin Separation Queue */}
            {isHRorAdmin && (
                <div className="card border mb-4">
                    <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                        <h6 className="card-title mb-0 fw-semibold text-dark">Separation queue ({queue.length})</h6>
                        <span className="badge badge-neutral">Review queue</span>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-secondary small fw-medium">
                                    <tr>
                                        <th>Employee</th>
                                        <th>Department & role</th>
                                        <th>Submitted</th>
                                        <th>Notice</th>
                                        <th>Preferred exit</th>
                                        <th>Status</th>
                                        <th>Reason</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="8" className="text-center py-4 text-muted small">Loading queue...</td></tr>
                                    ) : queue.length === 0 ? (
                                        <tr><td colSpan="8" className="text-center py-4 text-muted small">No separation requests pending.</td></tr>
                                    ) : (
                                        queue.map(item => (
                                            <tr key={item.resignationId}>
                                                <td>
                                                    <div className="fw-medium text-dark small">{item.employeeName}</div>
                                                    <div className="text-muted small font-monospace">{item.employeeCode}</div>
                                                </td>
                                                <td className="small">{item.departmentName} - {item.designationName}</td>
                                                <td className="tabular-nums small">{new Date(item.submissionDate).toLocaleDateString()}</td>
                                                <td><span className="badge badge-neutral">{item.noticePeriodDays} days</span></td>
                                                <td className="tabular-nums small text-dark fw-medium">{new Date(item.preferredRelievingDate).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        item.status === "Approved" ? "badge-success" :
                                                        item.status === "Rejected" ? "badge-danger" : "badge-warning"
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="text-truncate small" style={{ maxWidth: "200px" }}>{item.reason}</td>
                                                <td className="text-end">
                                                    {item.status === "Pending" && (
                                                        <div className="btn-group btn-group-sm">
                                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => openActionModal(item, "Approved")}>
                                                                Accept
                                                            </button>
                                                            <button className="btn btn-outline-danger btn-sm" onClick={() => openActionModal(item, "Rejected")}>
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* My Resignation Status */}
            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="card-title mb-0 fw-semibold text-dark">My resignation request history</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small fw-medium">
                                <tr>
                                    <th>Submission date</th>
                                    <th>Notice period</th>
                                    <th>Requested exit</th>
                                    <th>Approved exit</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myResignations.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted small">
                                            You have not submitted any active resignation request.
                                        </td>
                                    </tr>
                                ) : (
                                    myResignations.map(r => (
                                        <tr key={r.resignationId}>
                                            <td className="tabular-nums small">{new Date(r.submissionDate).toLocaleDateString()}</td>
                                            <td className="small">{r.noticePeriodDays} days</td>
                                            <td className="tabular-nums small">{new Date(r.preferredRelievingDate).toLocaleDateString()}</td>
                                            <td className="small fw-medium">{r.approvedRelievingDate ? new Date(r.approvedRelievingDate).toLocaleDateString() : "Pending acceptance"}</td>
                                            <td>
                                                <span className={`badge ${
                                                    r.status === "Approved" ? "badge-success" :
                                                    r.status === "Rejected" ? "badge-danger" : "badge-warning"
                                                }`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="small text-secondary">{r.remarks || "—"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: Resign */}
            <div className="modal fade" id="resignModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmitResignation}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold text-danger">Submit Formal Resignation</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-warning small">
                                    <i className="bi bi-exclamation-triangle-fill me-1"></i>
                                    Submitting this form initiates standard notice period clearance and Full & Final settlement workflows.
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Notice Period (Days)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form.noticePeriodDays}
                                            onChange={e => setForm({ ...form, noticePeriodDays: parseInt(e.target.value) })}
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Preferred Relieving Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={form.preferredRelievingDate}
                                            onChange={e => setForm({ ...form, preferredRelievingDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Primary Reason for Leaving</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="Better opportunity, higher education, personal relocation..."
                                        value={form.reason}
                                        onChange={e => setForm({ ...form, reason: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Confidential Exit Feedback (Optional)</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Feedback regarding team culture, growth, or leadership support..."
                                        value={form.feedback}
                                        onChange={e => setForm({ ...form, feedback: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-danger">Confirm Resignation</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal: Action */}
            <div className="modal fade" id="actionResignModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleAction}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">
                                    {actionState.status === "Approved" ? "Accept Resignation" : "Reject Resignation"}
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                {actionState.status === "Approved" && (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Approved Final Working Day (LWD)</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={actionState.approvedRelievingDate}
                                            onChange={e => setActionState({ ...actionState, approvedRelievingDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Management Remarks / Notes</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Clearance timeline, handover instructions..."
                                        value={actionState.remarks}
                                        onChange={e => setActionState({ ...actionState, remarks: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className={`btn ${actionState.status === "Approved" ? "btn-success" : "btn-danger"}`}>
                                    Confirm {actionState.status}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResignationManagement;
