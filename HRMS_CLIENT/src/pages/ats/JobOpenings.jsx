import { useState, useEffect } from "react";
import { getJobs, saveJob } from "../../services/atsService";
import { getDepartments } from "../../services/departmentService";
import { getDesignations } from "../../services/designationService";

const JobOpenings = () => {
    const [jobs, setJobs] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const [form, setForm] = useState({
        title: "",
        departmentId: "",
        designationId: "",
        location: "New York / Remote",
        jobType: "FullTime",
        experienceYears: "3-5 Years",
        openPositions: 1,
        description: "",
        requirements: ""
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [jobList, deptList, desigList] = await Promise.all([
                getJobs(),
                getDepartments(),
                getDesignations()
            ]);
            setJobs(jobList);
            setDepartments(deptList);
            setDesignations(desigList);
            if (deptList.length > 0 && !form.departmentId) {
                setForm(prev => ({
                    ...prev,
                    departmentId: deptList[0].departmentId,
                    designationId: desigList[0]?.designationId || ""
                }));
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

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            const res = await saveJob({
                ...form,
                departmentId: parseInt(form.departmentId),
                designationId: parseInt(form.designationId),
                openPositions: parseInt(form.openPositions)
            });
            if (res.success) {
                setAlert({ type: "success", text: "Job requisition published." });
                loadData();
                const el = document.getElementById("jobModal");
                window.bootstrap?.Modal.getInstance(el)?.hide();
            } else {
                setAlert({ type: "danger", text: res.message || "Failed to publish job." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error saving job." });
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Job requisitions</h4>
                    <p className="text-secondary small mb-0">Publish talent requisitions, manage open headcount, and recruit candidates</p>
                </div>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#jobModal">
                    <i className="bi bi-plus"></i> Post requisition
                </button>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            <div className="row g-3">
                {loading ? (
                    <div className="col-12 text-center py-5 text-muted small">Loading open positions...</div>
                ) : (
                    jobs.map(j => (
                        <div key={j.jobId} className="col-12 col-md-6 col-lg-4">
                            <div className="card border h-100">
                                <div className="card-body p-3 d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <span className="badge badge-neutral">
                                            {j.departmentName}
                                        </span>
                                        <span className="badge badge-neutral">
                                            {j.openPositions} position{j.openPositions > 1 ? "s" : ""}
                                        </span>
                                    </div>
                                    <h6 className="fw-semibold text-dark mt-1 mb-1">{j.title}</h6>
                                    <div className="text-secondary small mb-2">
                                        {j.location} • {j.jobType}
                                    </div>
                                    <p className="small text-muted flex-grow-1">{j.description}</p>
                                    
                                    <div className="bg-light p-2 rounded small mb-3 border">
                                        <span className="text-secondary">Skills:</span> {j.requirements}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center border-top pt-2">
                                        <div className="small text-secondary tabular-nums">
                                            {j.totalApplicants} applicants
                                        </div>
                                        <span className="small text-muted">
                                            Exp: {j.experienceYears}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal: Job Opening */}
            <div className="modal fade" id="jobModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleCreateJob}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Post Job Opening</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Job Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Senior Backend Engineer"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Department</label>
                                        <select
                                            className="form-select"
                                            value={form.departmentId}
                                            onChange={e => setForm({ ...form, departmentId: e.target.value })}
                                            required
                                        >
                                            {departments.map(d => (
                                                <option key={d.departmentId} value={d.departmentId}>
                                                    {d.departmentName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Designation Title</label>
                                        <select
                                            className="form-select"
                                            value={form.designationId}
                                            onChange={e => setForm({ ...form, designationId: e.target.value })}
                                            required
                                        >
                                            {designations.map(d => (
                                                <option key={d.designationId} value={d.designationId}>
                                                    {d.designationName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={form.location}
                                            onChange={e => setForm({ ...form, location: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Job Type</label>
                                        <select
                                            className="form-select"
                                            value={form.jobType}
                                            onChange={e => setForm({ ...form, jobType: e.target.value })}
                                        >
                                            <option value="FullTime">Full Time</option>
                                            <option value="PartTime">Part Time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Headcount Needed</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="1"
                                            value={form.openPositions}
                                            onChange={e => setForm({ ...form, openPositions: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Job Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Core responsibilities and role summary..."
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Skill Requirements</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="C#, SQL Server, React 19, Clean Architecture..."
                                        value={form.requirements}
                                        onChange={e => setForm({ ...form, requirements: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Publish Job Opening</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobOpenings;
