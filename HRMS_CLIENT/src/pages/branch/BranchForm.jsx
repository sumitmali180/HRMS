import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { createBranch, updateBranch, getBranchById } from "../../services/branchService";
import { getCompanyLookup, getManagerLookup } from "../../services/lookupService";

const BranchForm = ({ show, branchId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [companies, setCompanies] = useState([]);
    const [managers, setManagers] = useState([]);

    const [formData, setFormData] = useState({
        companyId: "",
        branchName: "",
        branchCode: "",
        address: "",
        phone: "",
        email: "",
        managerId: ""
    });

    useEffect(() => {
        if (!show) return;

        // Load lookups
        Promise.all([getCompanyLookup(), getManagerLookup()])
            .then(([compData, mgrData]) => {
                setCompanies(compData);
                setManagers(mgrData);
            })
            .catch(console.error);

        if (branchId) {
            setLoading(true);
            getBranchById(branchId)
                .then((data) => {
                    if (data) {
                        setFormData({
                            companyId: data.companyId || "",
                            branchName: data.branchName || "",
                            branchCode: data.branchCode || "",
                            address: data.address || "",
                            phone: data.phone || "",
                            email: data.email || "",
                            managerId: data.managerId || ""
                        });
                    }
                })
                .catch(() => setError("Failed to load branch details."))
                .finally(() => setLoading(false));
        } else {
            setFormData({
                companyId: "",
                branchName: "",
                branchCode: "",
                address: "",
                phone: "",
                email: "",
                managerId: ""
            });
            setError(null);
        }
    }, [show, branchId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            const payload = {
                ...formData,
                companyId: Number(formData.companyId),
                managerId: formData.managerId ? Number(formData.managerId) : null
            };

            if (branchId) {
                await updateBranch(branchId, { branchId, ...payload });
            } else {
                await createBranch(payload);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save branch.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered backdrop="static">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton={!saving}>
                    <Modal.Title className="fs-6 fw-semibold text-dark">
                        {branchId ? "Edit branch" : "Add branch"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-3">
                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" size="sm" variant="secondary" />
                        </div>
                    ) : (
                        <>
                            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Company *</Form.Label>
                                        <Form.Select
                                            className="form-select-sm"
                                            name="companyId"
                                            value={formData.companyId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select company</option>
                                            {companies.map((c) => (
                                                <option key={c.id} value={c.id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Branch code *</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="text"
                                            name="branchCode"
                                            value={formData.branchCode}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. HQ-01"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Branch name *</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="text"
                                            name="branchName"
                                            value={formData.branchName}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Headquarters"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Branch manager</Form.Label>
                                        <Form.Select
                                            className="form-select-sm"
                                            name="managerId"
                                            value={formData.managerId}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select manager (optional)</option>
                                            {managers.map((m) => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name} ({m.code || m.id})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Phone</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1-800-555-0199"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Email</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="branch@company.com"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Address</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            as="textarea"
                                            rows={2}
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Branch physical address"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer className="py-2">
                    <Button variant="secondary" size="sm" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit" disabled={saving || loading}>
                        {saving && <Spinner animation="border" size="sm" className="me-2" />}
                        {branchId ? "Save changes" : "Create branch"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default BranchForm;
