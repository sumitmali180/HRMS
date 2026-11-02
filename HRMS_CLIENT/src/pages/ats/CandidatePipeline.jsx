import { useState, useEffect } from "react";
import { getCandidates, getJobs, addCandidate, updateCandidateStage } from "../../services/atsService";

const PIPELINE_STAGES = [
    { key: "Applied", label: "Applied", color: "secondary" },
    { key: "Screening", label: "Screening", color: "info" },
    { key: "Interviewing", label: "Interviewing", color: "primary" },
    { key: "Offered", label: "Offered", color: "warning" },
    { key: "Hired", label: "Hired", color: "success" }
];

const CandidatePipeline = () => {
    const [candidates, setCandidates] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState("");
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const [newCandidate, setNewCandidate] = useState({
        jobId: "",
        fullName: "",
        email: "",
        phone: "",
        expectedSalary: "",
        noticePeriodDays: 30,
        notes: ""
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [jobList, candList] = await Promise.all([
                getJobs(),
                getCandidates(selectedJobId ? parseInt(selectedJobId) : null)
            ]);
            setJobs(jobList);
            setCandidates(candList);
            if (jobList.length > 0 && !newCandidate.jobId) {
                setNewCandidate(prev => ({ ...prev, jobId: jobList[0].jobId }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedJobId]);

    const handleAddCandidate = async (e) => {
        e.preventDefault();
        try {
            const res = await addCandidate({
                ...newCandidate,
                jobId: parseInt(newCandidate.jobId),
                expectedSalary: newCandidate.expectedSalary ? parseFloat(newCandidate.expectedSalary) : null,
                noticePeriodDays: parseInt(newCandidate.noticePeriodDays || 30)
            });
            if (res.success) {
                setAlert({ type: "success", text: "Candidate added to recruitment pipeline." });
                loadData();
                const el = document.getElementById("candModal");
                window.bootstrap?.Modal.getInstance(el)?.hide();
            } else {
                setAlert({ type: "danger", text: res.message || "Failed to add candidate." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error saving candidate." });
        }
    };

    const handleMoveStage = async (candidateId, nextStage) => {
        try {
            const res = await updateCandidateStage({
                candidateId: candidateId,
                stage: nextStage
            });
            if (res.success) {
                setAlert({ type: "success", text: `Candidate moved to ${nextStage}.` });
                loadData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Recruitment pipeline</h4>
                    <p className="text-secondary small mb-0">Track applicants through screening, interviews, offers, and hiring</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#candModal">
                        <i className="bi bi-plus"></i> Add candidate
                    </button>
                </div>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            {/* Filter by Job Requisition */}
            <div className="card border mb-4 p-3 bg-white">
                <div className="row g-2 align-items-center">
                    <div className="col-auto">
                        <span className="small text-secondary">Job requisition:</span>
                    </div>
                    <div className="col-md-5">
                        <select className="form-select form-select-sm" value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)}>
                            <option value="">All job openings ({jobs.length})</option>
                            {jobs.map(j => (
                                <option key={j.jobId} value={j.jobId}>
                                    {j.title} ({j.departmentName})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="row g-3">
                {PIPELINE_STAGES.map(stage => {
                    const stageCandidates = candidates.filter(c => c.stage === stage.key);
                    return (
                        <div key={stage.key} className="col-12 col-md-6 col-lg" style={{ minWidth: "220px" }}>
                            <div className="card border h-100 bg-white">
                                <div className="card-header bg-white py-2 px-3 border-bottom d-flex justify-content-between align-items-center">
                                    <span className="fw-medium small text-dark">{stage.label}</span>
                                    <span className="badge badge-neutral">{stageCandidates.length}</span>
                                </div>
                                <div className="card-body p-2 d-flex flex-column gap-2" style={{ minHeight: "450px" }}>
                                    {stageCandidates.map(c => (
                                        <div key={c.candidateId} className="card border p-3 bg-white">
                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                <h6 className="fw-medium mb-0 text-dark small">{c.fullName}</h6>
                                                {c.rating && (
                                                    <span className="badge badge-neutral small tabular-nums">
                                                        {parseFloat(c.rating).toFixed(1)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="small text-secondary mb-1">
                                                {c.jobTitle}
                                            </div>
                                            <div className="small text-muted mb-2 font-monospace" style={{ fontSize: "11px" }}>
                                                {c.email}
                                            </div>
                                            {c.expectedSalary && (
                                                <div className="small text-secondary tabular-nums mb-2">
                                                    Target: ${parseFloat(c.expectedSalary).toLocaleString()}
                                                </div>
                                            )}

                                            {/* Action Stage advance */}
                                            <div className="border-top pt-2 mt-auto d-flex justify-content-between align-items-center">
                                                <span className="small text-muted">Advance:</span>
                                                <div className="btn-group btn-group-sm">
                                                    {stage.key === "Applied" && (
                                                        <button className="btn btn-outline-secondary btn-sm py-0 px-2 small" onClick={() => handleMoveStage(c.candidateId, "Screening")}>
                                                            Screen
                                                        </button>
                                                    )}
                                                    {stage.key === "Screening" && (
                                                        <button className="btn btn-outline-secondary btn-sm py-0 px-2 small" onClick={() => handleMoveStage(c.candidateId, "Interviewing")}>
                                                            Interview
                                                        </button>
                                                    )}
                                                    {stage.key === "Interviewing" && (
                                                        <button className="btn btn-outline-secondary btn-sm py-0 px-2 small" onClick={() => handleMoveStage(c.candidateId, "Offered")}>
                                                            Offer
                                                        </button>
                                                    )}
                                                    {stage.key === "Offered" && (
                                                        <button className="btn btn-outline-secondary btn-sm py-0 px-2 small" onClick={() => handleMoveStage(c.candidateId, "Hired")}>
                                                            Hire
                                                        </button>
                                                    )}
                                                    {stage.key === "Hired" && (
                                                        <span className="badge badge-success small">Hired</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {stageCandidates.length === 0 && (
                                        <div className="text-center py-4 text-muted small">
                                            No candidates in {stage.label.toLowerCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal: Add Candidate */}
            <div className="modal fade" id="candModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleAddCandidate}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Enroll Candidate into Pipeline</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Target Job Opening</label>
                                    <select
                                        className="form-select"
                                        value={newCandidate.jobId}
                                        onChange={e => setNewCandidate({ ...newCandidate, jobId: e.target.value })}
                                        required
                                    >
                                        {jobs.map(j => (
                                            <option key={j.jobId} value={j.jobId}>
                                                {j.title} ({j.departmentName})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Candidate Name"
                                            value={newCandidate.fullName}
                                            onChange={e => setNewCandidate({ ...newCandidate, fullName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="candidate@email.com"
                                            value={newCandidate.email}
                                            onChange={e => setNewCandidate({ ...newCandidate, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="+1 555-..."
                                            value={newCandidate.phone}
                                            onChange={e => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Expected Salary ($)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="110000"
                                            value={newCandidate.expectedSalary}
                                            onChange={e => setNewCandidate({ ...newCandidate, expectedSalary: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Initial Screening Notes</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="Impressions, tech stack alignment, portfolio link..."
                                        value={newCandidate.notes}
                                        onChange={e => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Candidate</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidatePipeline;
