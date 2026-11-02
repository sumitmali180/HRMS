import { useState, useEffect } from "react";
import { getAppraisalCycles, getMyGoals, saveGoal } from "../../services/pmsService";

const GoalsAndOKRs = () => {
    const [cycles, setCycles] = useState([]);
    const [selectedCycleId, setSelectedCycleId] = useState("");
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const [form, setForm] = useState({
        goalId: null,
        title: "",
        description: "",
        targetMetric: "",
        progressPercent: 0,
        weightage: 25
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const cycleList = await getAppraisalCycles();
            setCycles(cycleList);
            const activeCycle = cycleList[0];
            if (activeCycle) {
                const cId = selectedCycleId || activeCycle.cycleId;
                setSelectedCycleId(cId);
                const goalList = await getMyGoals(cId);
                setGoals(goalList);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedCycleId]);

    const handleSaveGoal = async (e) => {
        e.preventDefault();
        try {
            const res = await saveGoal({
                ...form,
                cycleId: parseInt(selectedCycleId),
                progressPercent: parseInt(form.progressPercent),
                weightage: parseInt(form.weightage)
            });
            if (res.success) {
                setAlert({ type: "success", text: "Goal saved." });
                loadData();
                const el = document.getElementById("goalModal");
                window.bootstrap?.Modal.getInstance(el)?.hide();
            } else {
                setAlert({ type: "danger", text: res.message || "Failed to save goal." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error saving goal." });
        }
    };

    const handleUpdateProgress = async (goal, newProgress) => {
        try {
            await saveGoal({
                goalId: goal.goalId,
                cycleId: goal.cycleId,
                title: goal.title,
                description: goal.description,
                targetMetric: goal.targetMetric,
                progressPercent: newProgress,
                weightage: goal.weightage
            });
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const avgProgress = goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progressPercent, 0) / goals.length) : 0;

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Goals & OKRs</h4>
                    <p className="text-secondary small mb-0">Track quarterly milestones, measure metrics, and align performance</p>
                </div>
                <button
                    className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                    data-bs-toggle="modal"
                    data-bs-target="#goalModal"
                    onClick={() => setForm({ goalId: null, title: "", description: "", targetMetric: "", progressPercent: 0, weightage: 25 })}
                >
                    <i className="bi bi-plus"></i> Add goal
                </button>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            {/* Cycle Selector & Overall Progress */}
            <div className="card border mb-4 p-3 bg-white">
                <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-4">
                        <label className="form-label text-secondary small fw-medium mb-1">Appraisal cycle</label>
                        <select className="form-select form-select-sm" value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)}>
                            {cycles.map(c => (
                                <option key={c.cycleId} value={c.cycleId}>
                                    {c.cycleName} ({c.status})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-8">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="small text-secondary">Overall cycle attainment</span>
                            <span className="small fw-medium text-dark tabular-nums">{avgProgress}% complete</span>
                        </div>
                        <div className="progress" style={{ height: "6px", backgroundColor: "var(--raised)" }}>
                            <div
                                className="progress-bar bg-dark"
                                role="progressbar"
                                style={{ width: `${avgProgress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Goal Cards */}
            <div className="row g-3">
                {loading ? (
                    <div className="col-12 text-center py-5 text-muted small">Loading goals...</div>
                ) : goals.length === 0 ? (
                    <div className="col-12 text-center py-5 text-secondary">
                        <i className="bi bi-bullseye fs-1 d-block mb-2"></i>
                        No OKR goals configured for this appraisal cycle. Click "Add OKR Goal" to get started.
                    </div>
                ) : (
                    goals.map(goal => (
                        <div key={goal.goalId} className="col-12 col-md-6">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="badge bg-light text-dark border">
                                            Weightage: {goal.weightage}%
                                        </span>
                                        <span className={`badge ${goal.status === "Achieved" ? "bg-success" : "bg-warning text-dark"}`}>
                                            {goal.status}
                                        </span>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-1">{goal.title}</h5>
                                    <p className="text-secondary small mb-3">{goal.description || "No detailed notes provided."}</p>

                                    {goal.targetMetric && (
                                        <div className="alert alert-light py-2 px-3 small border mb-3">
                                            <i className="bi bi-graph-up-arrow me-1 text-primary"></i>
                                            <strong>Target Metric:</strong> {goal.targetMetric}
                                        </div>
                                    )}

                                    {/* Interactive Progress Slider */}
                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between small fw-bold mb-1">
                                            <span>Progress:</span>
                                            <span className="text-primary">{goal.progressPercent}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            className="form-range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={goal.progressPercent}
                                            onChange={e => handleUpdateProgress(goal, parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal: Save Goal */}
            <div className="modal fade" id="goalModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSaveGoal}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Set Objective / Key Result</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Objective Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Modernize API latency and database index performance"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Key Metric / Success Indicator</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Reduce p99 latency by 30% across endpoints"
                                        value={form.targetMetric}
                                        onChange={e => setForm({ ...form, targetMetric: e.target.value })}
                                    />
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Weightage (%)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="5"
                                            max="100"
                                            value={form.weightage}
                                            onChange={e => setForm({ ...form, weightage: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Initial Progress (%)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            max="100"
                                            value={form.progressPercent}
                                            onChange={e => setForm({ ...form, progressPercent: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Strategic Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Action items and quarterly execution roadmap..."
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Goal</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalsAndOKRs;
