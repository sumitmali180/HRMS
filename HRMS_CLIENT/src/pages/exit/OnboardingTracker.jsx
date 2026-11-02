import { useState, useEffect } from "react";
import { getOnboardingTasks } from "../../services/exitService";

const OnboardingTracker = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const data = await getOnboardingTasks();
                setTasks(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const itTasks = tasks.filter(t => t.department === "IT");
    const hrTasks = tasks.filter(t => t.department === "HR");
    const financeTasks = tasks.filter(t => t.department === "Finance");
    const deptTasks = tasks.filter(t => t.department === "Department");

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h4 className="fw-semibold mb-1 text-dark">Onboarding roadmap</h4>
                <p className="text-secondary small mb-0">Cross-departmental standard provisioning and orientation checklist</p>
            </div>

            <div className="row g-4">
                {/* IT Track */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card border h-100">
                        <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                            <h6 className="card-title mb-0 fw-semibold text-dark d-flex align-items-center gap-2">
                                <i className="bi bi-laptop text-muted"></i> IT & hardware
                            </h6>
                            <span className="badge badge-neutral">{itTasks.length}</span>
                        </div>
                        <div className="card-body p-3">
                            <ul className="list-group list-group-flush">
                                {itTasks.map(t => (
                                    <li key={t.taskId} className="list-group-item px-0 py-2">
                                        <div className="d-flex align-items-start gap-2">
                                            <i className="bi bi-check2 text-muted mt-1"></i>
                                            <div>
                                                <div className="fw-medium text-dark small">{t.title}</div>
                                                <div className="text-muted small">{t.description}</div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* HR Track */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card border h-100">
                        <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                            <h6 className="card-title mb-0 fw-semibold text-dark d-flex align-items-center gap-2">
                                <i className="bi bi-file-earmark-person text-muted"></i> HR & compliance
                            </h6>
                            <span className="badge badge-neutral">{hrTasks.length}</span>
                        </div>
                        <div className="card-body p-3">
                            <ul className="list-group list-group-flush">
                                {hrTasks.map(t => (
                                    <li key={t.taskId} className="list-group-item px-0 py-2">
                                        <div className="d-flex align-items-start gap-2">
                                            <i className="bi bi-check2 text-muted mt-1"></i>
                                            <div>
                                                <div className="fw-medium text-dark small">{t.title}</div>
                                                <div className="text-muted small">{t.description}</div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Finance Track */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card border h-100">
                        <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                            <h6 className="card-title mb-0 fw-semibold text-dark d-flex align-items-center gap-2">
                                <i className="bi bi-cash-coin text-muted"></i> Finance & payroll
                            </h6>
                            <span className="badge badge-neutral">{financeTasks.length}</span>
                        </div>
                        <div className="card-body p-3">
                            <ul className="list-group list-group-flush">
                                {financeTasks.map(t => (
                                    <li key={t.taskId} className="list-group-item px-0 py-2">
                                        <div className="d-flex align-items-start gap-2">
                                            <i className="bi bi-check2 text-muted mt-1"></i>
                                            <div>
                                                <div className="fw-medium text-dark small">{t.title}</div>
                                                <div className="text-muted small">{t.description}</div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Manager Track */}
                <div className="col-12 col-md-6 col-lg-3">
                    <div className="card border h-100">
                        <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                            <h6 className="card-title mb-0 fw-semibold text-dark d-flex align-items-center gap-2">
                                <i className="bi bi-people text-muted"></i> Team & manager
                            </h6>
                            <span className="badge badge-neutral">{deptTasks.length}</span>
                        </div>
                        <div className="card-body p-3">
                            <ul className="list-group list-group-flush">
                                {deptTasks.map(t => (
                                    <li key={t.taskId} className="list-group-item px-0 py-2">
                                        <div className="d-flex align-items-start gap-2">
                                            <i className="bi bi-check2 text-muted mt-1"></i>
                                            <div>
                                                <div className="fw-medium text-dark small">{t.title}</div>
                                                <div className="text-muted small">{t.description}</div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingTracker;
