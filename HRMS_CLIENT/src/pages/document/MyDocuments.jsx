import { useState, useEffect } from "react";
import { getMyDocuments, uploadDocumentRecord } from "../../services/documentService";

const MyDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const [form, setForm] = useState({
        documentType: "GovtID",
        title: "",
        filePath: ""
    });

    const loadDocs = async () => {
        try {
            setLoading(true);
            const data = await getMyDocuments();
            setDocuments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocs();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            const res = await uploadDocumentRecord(form);
            if (res.success) {
                setAlert({ type: "success", text: "Document registered in vault." });
                loadDocs();
                const el = document.getElementById("docModal");
                window.bootstrap?.Modal.getInstance(el)?.hide();
            } else {
                setAlert({ type: "danger", text: res.message || "Failed to register document." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error saving document." });
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Digital locker</h4>
                    <p className="text-secondary small mb-0">Secure repository for government IDs, contracts, offer letters, and degrees</p>
                </div>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#docModal">
                    <i className="bi bi-plus"></i> Upload document
                </button>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="card-title mb-0 fw-semibold text-dark">Verified files ({documents.length})</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small fw-medium">
                                <tr>
                                    <th>Document title</th>
                                    <th>Category</th>
                                    <th>Uploaded date</th>
                                    <th>Verification</th>
                                    <th>File reference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="text-center py-4 text-muted small">Loading documents...</td></tr>
                                ) : documents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted small">
                                            <i className="bi bi-folder2-open fs-4 d-block mb-2 text-muted"></i>
                                            Your digital locker is empty.
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map(d => (
                                        <tr key={d.documentId}>
                                            <td className="fw-medium text-dark small">
                                                <i className="bi bi-file-earmark text-muted me-2"></i>
                                                {d.title}
                                            </td>
                                            <td>
                                                <span className="badge badge-neutral">
                                                    {d.documentType}
                                                </span>
                                            </td>
                                            <td className="tabular-nums small">{new Date(d.uploadedDate).toLocaleDateString()}</td>
                                            <td>
                                                {d.isVerified ? (
                                                    <span className="badge badge-success">
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-warning">Pending audit</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="text-muted small font-monospace">
                                                    {d.filePath || "Secured blob"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: Upload */}
            <div className="modal fade" id="docModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleUpload}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Upload to Personal Document Vault</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Document Category</label>
                                    <select
                                        className="form-select"
                                        value={form.documentType}
                                        onChange={e => setForm({ ...form, documentType: e.target.value })}
                                    >
                                        <option value="GovtID">Government ID (Passport / SSN / Driver License)</option>
                                        <option value="Degree">Educational Degree / Transcript</option>
                                        <option value="Contract">Signed Employment Contract</option>
                                        <option value="Certification">Professional Certification</option>
                                        <option value="Other">Other Official Record</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Document Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Master's Degree Diploma"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Cloud File Path / Vault Storage Reference</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="vault/docs/employee-certificate.pdf"
                                        value={form.filePath}
                                        onChange={e => setForm({ ...form, filePath: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save to Vault</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyDocuments;
