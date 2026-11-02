import { useState, useEffect } from "react";
import { getPendingClaims, actionExpenseClaim } from "../../services/expenseService";

const ExpenseApproval = () => {
    const [pendingClaims, setPendingClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [remarks, setRemarks] = useState("");
    const [actionType, setActionType] = useState("Approved");
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState(null);

    const loadClaims = async () => {
        try {
            setLoading(true);
            const data = await getPendingClaims();
            setPendingClaims(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClaims();
    }, []);

    const handleAction = async (status, claim) => {
        setSelectedClaim(claim);
        setActionType(status);
        setRemarks("");
        // Open modal
        const modalEl = document.getElementById("actionModal");
        if (modalEl && window.bootstrap) {
            const modal = new window.bootstrap.Modal(modalEl);
            modal.show();
        }
    };

    const confirmAction = async () => {
        if (!selectedClaim) return;
        setSubmitting(true);
        try {
            const res = await actionExpenseClaim({
                expenseClaimId: selectedClaim.expenseClaimId,
                status: actionType,
                remarks: remarks
            });
            if (res.success) {
                setAlert({ type: "success", text: `Claim #EXP-${selectedClaim.expenseClaimId} marked as ${actionType}.` });
                loadClaims();
                const modalEl = document.getElementById("actionModal");
                const modal = window.bootstrap?.Modal.getInstance(modalEl);
                modal?.hide();
            } else {
                setAlert({ type: "danger", text: res.message || "Failed to update claim." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error updating claim." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Expense approvals</h4>
                    <p className="text-secondary small mb-0">Review employee reimbursement claims and authorize payroll payouts</p>
                </div>
                <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2" onClick={loadClaims}>
                    <i className="bi bi-arrow-clockwise"></i> Refresh
                </button>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0 fw-semibold text-dark">Review queue ({pendingClaims.length})</h6>
                    <span className="badge badge-warning">Action required</span>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small fw-medium">
                                <tr>
                                    <th>Claim #</th>
                                    <th>Employee</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                    <th>Receipt</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4 text-muted small">Loading pending claims...</td>
                                    </tr>
                                ) : pendingClaims.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-muted">
                                            <i className="bi bi-check2-circle fs-4 text-muted d-block mb-2"></i>
                                            <span className="small">No pending claims in review queue.</span>
                                        </td>
                                    </tr>
                                ) : (
                                    pendingClaims.map(claim => (
                                        <tr key={claim.expenseClaimId}>
                                            <td className="fw-medium font-monospace small">#EXP-{claim.expenseClaimId}</td>
                                            <td>
                                                <div className="fw-medium text-dark small">{claim.employeeName}</div>
                                                <div className="text-muted small font-monospace">{claim.employeeCode}</div>
                                            </td>
                                            <td>
                                                <span className="badge badge-neutral">
                                                    {claim.categoryName}
                                                </span>
                                            </td>
                                            <td className="tabular-nums small">{new Date(claim.claimDate).toLocaleDateString()}</td>
                                            <td className="fw-medium tabular-nums text-dark">${parseFloat(claim.amount).toFixed(2)}</td>
                                            <td className="text-truncate small" style={{ maxWidth: "220px" }}>{claim.description}</td>
                                            <td>
                                                {claim.receiptPath ? (
                                                    <span className="badge badge-neutral">
                                                        <i className="bi bi-paperclip me-1"></i> Attached
                                                    </span>
                                                ) : (
                                                    <span className="text-muted small">No file</span>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => handleAction("Approved", claim)}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => handleAction("Rejected", claim)}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Action Modal */}
            <div className="modal fade" id="actionModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fw-bold">
                                {actionType === "Approved" ? "Approve Expense Claim" : "Reject Expense Claim"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <p>
                                Are you sure you want to mark claim <strong>#EXP-{selectedClaim?.expenseClaimId}</strong> for{" "}
                                <strong>${parseFloat(selectedClaim?.amount || 0).toFixed(2)}</strong> as <strong>{actionType}</strong>?
                            </p>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Review Remarks / Reason</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder={actionType === "Approved" ? "Optional approval notes..." : "Reason for rejection required..."}
                                    value={remarks}
                                    onChange={e => setRemarks(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button
                                type="button"
                                className={`btn ${actionType === "Approved" ? "btn-success" : "btn-danger"}`}
                                onClick={confirmAction}
                                disabled={submitting}
                            >
                                {submitting ? "Processing..." : `Confirm ${actionType}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseApproval;
