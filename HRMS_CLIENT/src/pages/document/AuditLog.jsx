import { useState, useEffect } from "react";
import { getAuditLogs } from "../../services/documentService";

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await getAuditLogs();
            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Audit log</h4>
                    <p className="text-secondary small mb-0">Immutable compliance log tracking administrative activities, logins, and payroll runs</p>
                </div>
                <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2" onClick={loadLogs}>
                    <i className="bi bi-arrow-clockwise"></i> Refresh
                </button>
            </div>

            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0 fw-semibold text-dark">System events ({logs.length})</h6>
                    <span className="badge badge-neutral">Security log</span>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small fw-medium">
                                <tr>
                                    <th>Event ID</th>
                                    <th>Timestamp</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Entity</th>
                                    <th>Event details</th>
                                    <th>IP address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-4 text-muted small">Loading audit entries...</td></tr>
                                ) : logs.length === 0 ? (
                                    <tr><td colSpan="7" className="text-center py-4 text-muted small">No audit events recorded.</td></tr>
                                ) : (
                                    logs.map(log => (
                                        <tr key={log.auditLogId}>
                                            <td className="font-monospace small text-muted">#{log.auditLogId}</td>
                                            <td className="tabular-nums small text-muted">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td className="fw-medium text-dark small">{log.userName || "System"}</td>
                                            <td>
                                                <span className="badge badge-neutral font-monospace">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td><code className="text-secondary small">{log.entityName}</code></td>
                                            <td className="small text-secondary">{log.details}</td>
                                            <td><span className="font-monospace small text-muted">{log.ipAddress || "127.0.0.1"}</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLog;
