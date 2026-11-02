import { useState, useEffect } from "react";
import { getExpenseCategories, getMyClaims, submitExpenseClaim } from "../../services/expenseService";

const MyExpenses = () => {
    const [claims, setClaims] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        expenseCategoryId: "",
        claimDate: new Date().toISOString().split("T")[0],
        amount: "",
        description: "",
        receiptPath: ""
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [cats, myClaims] = await Promise.all([
                getExpenseCategories(),
                getMyClaims()
            ]);
            setCategories(cats);
            setClaims(myClaims);
            if (cats.length > 0 && !formData.expenseCategoryId) {
                setFormData(prev => ({ ...prev, expenseCategoryId: cats[0].expenseCategoryId }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        try {
            const res = await submitExpenseClaim({
                ...formData,
                amount: parseFloat(formData.amount),
                expenseCategoryId: parseInt(formData.expenseCategoryId)
            });
            if (res.success) {
                setMessage({ type: "success", text: "Expense claim submitted successfully!" });
                setFormData({
                    expenseCategoryId: categories[0]?.expenseCategoryId || "",
                    claimDate: new Date().toISOString().split("T")[0],
                    amount: "",
                    description: "",
                    receiptPath: ""
                });
                loadData();
            } else {
                setMessage({ type: "danger", text: res.message || "Failed to submit claim." });
            }
        } catch (err) {
            setMessage({ type: "danger", text: "An error occurred while submitting." });
        } finally {
            setSubmitting(false);
        }
    };

    const totalClaimed = claims.reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0);
    const approvedTotal = claims.filter(c => c.status === "Approved").reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0);
    const pendingTotal = claims.filter(c => c.status === "Pending").reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0);

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Expense claims</h4>
                    <p className="text-secondary small mb-0">Claim business travel, per diem, and office expenditures</p>
                </div>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#newClaimModal">
                    <i className="bi bi-plus"></i> Submit claim
                </button>
            </div>

            {/* Metrics */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card metric-card">
                        <div className="card-body p-3">
                            <div className="metric-label">Total claims</div>
                            <div className="metric-value tabular-nums mt-1">${totalClaimed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="metric-subtext mt-1">{claims.length} total requests</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card metric-card">
                        <div className="card-body p-3">
                            <div className="metric-label">Approved & paid</div>
                            <div className="metric-value tabular-nums mt-1">${approvedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="metric-subtext mt-1">Cleared for payroll payout</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card metric-card">
                        <div className="card-body p-3">
                            <div className="metric-label">Pending review</div>
                            <div className="metric-value tabular-nums mt-1">${pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            <div className="metric-subtext mt-1">Awaiting approval</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Claims Table */}
            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="card-title mb-0 fw-semibold text-dark">Claims history</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small fw-medium">
                                <tr>
                                    <th>Claim #</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted small">Loading claims...</td>
                                    </tr>
                                ) : claims.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted">
                                            <i className="bi bi-receipt fs-4 d-block mb-2"></i>
                                            <span className="small">No expense claims submitted yet.</span>
                                        </td>
                                    </tr>
                                ) : (
                                    claims.map(claim => (
                                        <tr key={claim.expenseClaimId}>
                                            <td className="fw-medium font-monospace small">#EXP-{claim.expenseClaimId}</td>
                                            <td>
                                                <span className="badge badge-neutral">
                                                    {claim.categoryName}
                                                </span>
                                            </td>
                                            <td className="tabular-nums small">{new Date(claim.claimDate).toLocaleDateString()}</td>
                                            <td className="fw-medium tabular-nums">${parseFloat(claim.amount).toFixed(2)}</td>
                                            <td className="text-truncate small" style={{ maxWidth: "250px" }}>{claim.description}</td>
                                            <td>
                                                <span className={`badge ${
                                                    claim.status === "Approved" ? "badge-success" :
                                                    claim.status === "Rejected" ? "badge-danger" : "badge-warning"
                                                }`}>
                                                    {claim.status}
                                                </span>
                                            </td>
                                            <td className="small text-secondary">{claim.remarks || "—"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" id="newClaimModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Submit Expense Claim</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                {message && (
                                    <div className={`alert alert-${message.type} py-2`}>{message.text}</div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Expense Category</label>
                                    <select
                                        className="form-select"
                                        value={formData.expenseCategoryId}
                                        onChange={e => setFormData({ ...formData, expenseCategoryId: e.target.value })}
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.expenseCategoryId} value={cat.expenseCategoryId}>
                                                {cat.categoryName} (Max: ${cat.maxLimit})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Expense Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={formData.claimDate}
                                            onChange={e => setFormData({ ...formData, claimDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Amount ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            className="form-control"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Business Purpose / Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Detail client name, project, or travel destination..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Receipt Document / Invoice URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Receipt file path or cloud invoice URL..."
                                        value={formData.receiptPath}
                                        onChange={e => setFormData({ ...formData, receiptPath: e.target.value })}
                                    />
                                    <small className="text-muted">Digital receipt recommended for fast approval</small>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? "Submitting..." : "Submit Claim"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyExpenses;
