import { useState, useEffect } from "react";
import { getAppraisalCycles, getAppraisalReviews, submitSelfReview, submitManagerReview } from "../../services/pmsService";
import useAuth from "../../hooks/useAuth";

const AppraisalForm = () => {
    const { user } = useAuth();
    const isManagerOrAdmin = user?.role === "Super Admin" || user?.role === "HR Admin" || user?.role === "Admin" || user?.role === "Manager";

    const [cycles, setCycles] = useState([]);
    const [selectedCycleId, setSelectedCycleId] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    // Self review state
    const [selfData, setSelfData] = useState({
        selfRating: 4.5,
        selfComments: ""
    });

    // Manager review state
    const [managerReviewState, setManagerReviewState] = useState({
        reviewId: null,
        employeeId: null,
        selfRating: 4.0,
        managerRating: 4.0,
        managerComments: "",
        promotionRecommendation: "Eligible for Promotion"
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const cycleList = await getAppraisalCycles();
            setCycles(cycleList);
            if (cycleList.length > 0) {
                const cId = selectedCycleId || cycleList[0].cycleId;
                setSelectedCycleId(cId);
            }
            if (isManagerOrAdmin) {
                const reviewList = await getAppraisalReviews();
                setReviews(reviewList);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [isManagerOrAdmin]);

    const handleSelfSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await submitSelfReview({
                cycleId: parseInt(selectedCycleId),
                selfRating: parseFloat(selfData.selfRating),
                selfComments: selfData.selfComments
            });
            if (res.success) {
                setAlert({ type: "success", text: "Self assessment submitted." });
                loadData();
            } else {
                setAlert({ type: "danger", text: res.message || "Failed to submit self review." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error submitting review." });
        }
    };

    const handleManagerSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await submitManagerReview({
                cycleId: parseInt(selectedCycleId),
                employeeId: managerReviewState.employeeId,
                selfRating: managerReviewState.selfRating,
                managerRating: parseFloat(managerReviewState.managerRating),
                managerComments: managerReviewState.managerComments,
                promotionRecommendation: managerReviewState.promotionRecommendation
            });
            if (res.success) {
                setAlert({ type: "success", text: "Manager appraisal recorded." });
                loadData();
                const el = document.getElementById("mgrModal");
                window.bootstrap?.Modal.getInstance(el)?.hide();
            } else {
                setAlert({ type: "danger", text: res.message || "Review failed." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error submitting manager review." });
        }
    };

    const openManagerModal = (r) => {
        setManagerReviewState({
            reviewId: r.reviewId,
            employeeId: r.employeeId,
            selfRating: r.selfRating || 3.0,
            managerRating: r.managerRating || 4.0,
            managerComments: r.managerComments || "",
            promotionRecommendation: r.promotionRecommendation || "Eligible for Promotion"
        });
        const el = document.getElementById("mgrModal");
        if (el && window.bootstrap) new window.bootstrap.Modal(el).show();
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Performance appraisal</h4>
                    <p className="text-secondary small mb-0">Structured review cycle, competency assessment, and score normalization</p>
                </div>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            {/* Self Appraisal Form */}
            <div className="card border mb-4">
                <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="card-title mb-0 fw-semibold text-dark">Self-assessment submission</h6>
                </div>
                <div className="card-body p-3">
                    <form onSubmit={handleSelfSubmit}>
                        <div className="row g-3 mb-3">
                            <div className="col-12 col-md-6">
                                <label className="form-label text-secondary small fw-medium">Review cycle</label>
                                <select className="form-select form-select-sm" value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)}>
                                    {cycles.map(c => (
                                        <option key={c.cycleId} value={c.cycleId}>
                                            {c.cycleName} (Deadline: {new Date(c.reviewDeadline).toLocaleDateString()})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 col-md-6">
                                <label className="form-label text-secondary small fw-medium">Self rating: <strong className="tabular-nums text-dark">{selfData.selfRating.toFixed(1)} / 5.0</strong></label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="1.0"
                                    max="5.0"
                                    step="0.1"
                                    value={selfData.selfRating}
                                    onChange={e => setSelfData({ ...selfData, selfRating: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-secondary small fw-medium">Key achievements & deliverable impact</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Highlight quarterly deliverables, system improvements, or leadership contributions..."
                                value={selfData.selfComments}
                                onChange={e => setSelfData({ ...selfData, selfComments: e.target.value })}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm">
                            Submit evaluation
                        </button>
                    </form>
                </div>
            </div>

            {/* Manager Review Board */}
            {isManagerOrAdmin && (
                <div className="card border">
                    <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                        <h6 className="card-title mb-0 fw-semibold text-dark">Team review submissions ({reviews.length})</h6>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light text-secondary small fw-medium">
                                    <tr>
                                        <th>Employee</th>
                                        <th>Cycle</th>
                                        <th>Self score</th>
                                        <th>Self remarks</th>
                                        <th>Manager score</th>
                                        <th>Final score</th>
                                        <th>Status</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="8" className="text-center py-4 text-muted small">Loading team evaluations...</td></tr>
                                    ) : reviews.length === 0 ? (
                                        <tr><td colSpan="8" className="text-center py-4 text-muted small">No reviews submitted yet in this cycle.</td></tr>
                                    ) : (
                                        reviews.map(r => (
                                            <tr key={r.reviewId}>
                                                <td>
                                                    <div className="fw-medium text-dark small">{r.employeeName}</div>
                                                    <div className="text-muted small font-monospace">{r.employeeCode} - {r.departmentName}</div>
                                                </td>
                                                <td className="small">{r.cycleName}</td>
                                                <td>
                                                    {r.selfRating ? (
                                                        <span className="badge badge-neutral tabular-nums">{parseFloat(r.selfRating).toFixed(1)} / 5</span>
                                                    ) : "—"}
                                                </td>
                                                <td className="text-truncate small" style={{ maxWidth: "200px" }}>{r.selfComments || "—"}</td>
                                                <td>
                                                    {r.managerRating ? (
                                                        <span className="badge badge-neutral tabular-nums">{parseFloat(r.managerRating).toFixed(1)} / 5</span>
                                                    ) : (
                                                        <span className="text-muted small">Pending</span>
                                                    )}
                                                </td>
                                                <td className="fw-medium tabular-nums small text-dark">
                                                    {r.finalScore ? `${parseFloat(r.finalScore).toFixed(1)} / 5` : "—"}
                                                </td>
                                                <td>
                                                    <span className={`badge ${
                                                        r.status === "Completed" ? "badge-success" : "badge-warning"
                                                    }`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => openManagerModal(r)}>
                                                        Evaluate
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
            )}

            {/* Modal: Manager Review */}
            <div className="modal fade" id="mgrModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleManagerSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Manager Evaluation & Scoring</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Manager Score (1.0 to 5.0)</label>
                                    <div className="d-flex align-items-center gap-3">
                                        <input
                                            type="range"
                                            className="form-range flex-grow-1"
                                            min="1.0"
                                            max="5.0"
                                            step="0.1"
                                            value={managerReviewState.managerRating}
                                            onChange={e => setManagerReviewState({ ...managerReviewState, managerRating: parseFloat(e.target.value) })}
                                        />
                                        <span className="badge bg-success fs-6 px-3 py-2">{parseFloat(managerReviewState.managerRating).toFixed(1)} / 5.0</span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Promotion / Increment Recommendation</label>
                                    <select
                                        className="form-select"
                                        value={managerReviewState.promotionRecommendation}
                                        onChange={e => setManagerReviewState({ ...managerReviewState, promotionRecommendation: e.target.value })}
                                    >
                                        <option value="Eligible for Promotion">Eligible for Promotion</option>
                                        <option value="Merit Salary Increment">Merit Salary Increment</option>
                                        <option value="Retain Current Band">Retain Current Band</option>
                                        <option value="Performance Improvement Plan (PIP)">Performance Improvement Plan (PIP)</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Manager Feedback & Competency Notes</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Detailed strengths, development opportunities, and career pathing..."
                                        value={managerReviewState.managerComments}
                                        onChange={e => setManagerReviewState({ ...managerReviewState, managerComments: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Finalize Appraisal</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppraisalForm;
