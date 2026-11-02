import { useState, useEffect } from "react";
import { getDocumentTemplates, generateLetter } from "../../services/documentService";
import { getEmployees } from "../../services/employeeService";

const DocumentTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedTemplateCode, setSelectedTemplateCode] = useState("OFFER_LETTER");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [generatedPreview, setGeneratedPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tmplList, empList] = await Promise.all([
                getDocumentTemplates(),
                getEmployees()
            ]);
            setTemplates(tmplList);
            setEmployees(empList);
            if (empList.length > 0 && !selectedEmployeeId) {
                setSelectedEmployeeId(empList[0].employeeId);
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

    const handleGenerate = async () => {
        if (!selectedEmployeeId || !selectedTemplateCode) return;
        setGenerating(true);
        try {
            const letter = await generateLetter({
                employeeId: parseInt(selectedEmployeeId),
                templateCode: selectedTemplateCode
            });
            setGeneratedPreview(letter);
        } catch (err) {
            console.error(err);
        } finally {
            setGenerating(false);
        }
    };

    const currentTemplate = templates.find(t => t.templateCode === selectedTemplateCode);

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h4 className="fw-semibold mb-1 text-dark">Document templates</h4>
                <p className="text-secondary small mb-0">Generate dynamic offer letters, relieving certificates, and service agreements</p>
            </div>

            <div className="row g-4">
                {/* Template List & Generator Controls */}
                <div className="col-12 col-lg-5">
                    <div className="card border mb-4">
                        <div className="card-header bg-white py-3 border-bottom">
                            <h6 className="card-title mb-0 fw-semibold text-dark">Template configuration</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Document Template</label>
                                <select
                                    className="form-select"
                                    value={selectedTemplateCode}
                                    onChange={e => {
                                        setSelectedTemplateCode(e.target.value);
                                        setGeneratedPreview("");
                                    }}
                                >
                                    {templates.map(t => (
                                        <option key={t.templateId} value={t.templateCode}>
                                            {t.templateName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Target Employee</label>
                                <select
                                    className="form-select"
                                    value={selectedEmployeeId}
                                    onChange={e => {
                                        setSelectedEmployeeId(e.target.value);
                                        setGeneratedPreview("");
                                    }}
                                >
                                    {employees.map(emp => (
                                        <option key={emp.employeeId} value={emp.employeeId}>
                                            {emp.firstName} {emp.lastName} ({emp.employeeCode})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {currentTemplate && (
                                <div className="alert alert-light border small mb-4">
                                    <div className="fw-bold text-dark mb-1">Subject Header:</div>
                                    <div className="text-muted">{currentTemplate.subject}</div>
                                </div>
                            )}

                            <button
                                className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                                onClick={handleGenerate}
                                disabled={generating || loading}
                            >
                                <i className="bi bi-file-earmark-text"></i>
                                {generating ? "Generating..." : "Generate letter"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Window */}
                <div className="col-12 col-lg-7">
                    <div className="card border h-100">
                        <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                            <h6 className="card-title mb-0 fw-semibold text-dark">Document preview</h6>
                            {generatedPreview && (
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => window.print()}>
                                    <i className="bi bi-printer me-1"></i> Print / PDF
                                </button>
                            )}
                        </div>
                        <div className="card-body p-3 bg-light">
                            {generatedPreview ? (
                                <div className="card p-4 border bg-white small" style={{ minHeight: "450px", whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                                    {generatedPreview}
                                </div>
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center text-muted py-5" style={{ minHeight: "450px" }}>
                                    <i className="bi bi-file-earmark-text fs-4 mb-2 text-muted"></i>
                                    <span className="small text-muted">Select an employee and generate letter to view preview.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentTemplates;
