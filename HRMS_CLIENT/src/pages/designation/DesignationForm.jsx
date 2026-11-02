import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { createDesignation, updateDesignation, getDesignationById } from "../../services/designationService";

const DesignationForm = ({ show, designationId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        designationName: "",
        grade: "",
        basicSalary: "",
        description: ""
    });

    useEffect(() => {
        if (!show) return;

        if (designationId) {
            setLoading(true);
            getDesignationById(designationId)
                .then((data) => {
                    if (data) {
                        setFormData({
                            designationName: data.designationName || "",
                            grade: data.grade || "",
                            basicSalary: data.basicSalary !== undefined ? data.basicSalary : "",
                            description: data.description || ""
                        });
                    }
                })
                .catch(() => setError("Failed to load designation details."))
                .finally(() => setLoading(false));
        } else {
            setFormData({
                designationName: "",
                grade: "",
                basicSalary: "",
                description: ""
            });
            setError(null);
        }
    }, [show, designationId]);

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
                basicSalary: formData.basicSalary ? Number(formData.basicSalary) : 0
            };

            if (designationId) {
                await updateDesignation(designationId, { designationId, ...payload });
            } else {
                await createDesignation(payload);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save designation.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered backdrop="static">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton={!saving}>
                    <Modal.Title className="fs-6 fw-semibold text-dark">
                        {designationId ? "Edit designation" : "Add designation"}
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
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Designation title *</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="text"
                                            name="designationName"
                                            value={formData.designationName}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Senior Software Engineer"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Grade / level</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="text"
                                            name="grade"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            placeholder="e.g. L4, M2"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Standard basic salary</Form.Label>
                                        <Form.Control
                                            className="form-control-sm font-monospace tabular-nums"
                                            type="number"
                                            step="0.01"
                                            name="basicSalary"
                                            value={formData.basicSalary}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Description</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Role scope and key expectations"
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
                        {designationId ? "Save changes" : "Create designation"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default DesignationForm;
