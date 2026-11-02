import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { createDepartment, updateDepartment, getDepartmentById } from "../../services/departmentService";
import { getBranchLookup } from "../../services/lookupService";

const DepartmentForm = ({ show, departmentId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [branches, setBranches] = useState([]);

    const [formData, setFormData] = useState({
        branchId: "",
        departmentName: "",
        description: ""
    });

    useEffect(() => {
        if (!show) return;

        getBranchLookup().then(setBranches).catch(console.error);

        if (departmentId) {
            setLoading(true);
            getDepartmentById(departmentId)
                .then((data) => {
                    if (data) {
                        setFormData({
                            branchId: data.branchId || "",
                            departmentName: data.departmentName || "",
                            description: data.description || ""
                        });
                    }
                })
                .catch(() => setError("Failed to load department details."))
                .finally(() => setLoading(false));
        } else {
            setFormData({
                branchId: "",
                departmentName: "",
                description: ""
            });
            setError(null);
        }
    }, [show, departmentId]);

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
                branchId: Number(formData.branchId)
            };

            if (departmentId) {
                await updateDepartment(departmentId, { departmentId, ...payload });
            } else {
                await createDepartment(payload);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save department.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered backdrop="static">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton={!saving}>
                    <Modal.Title className="fs-6 fw-semibold text-dark">
                        {departmentId ? "Edit department" : "Add department"}
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
                                        <Form.Label className="small text-muted mb-1">Branch *</Form.Label>
                                        <Form.Select
                                            className="form-select-sm"
                                            name="branchId"
                                            value={formData.branchId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select branch</option>
                                            {branches.map((b) => (
                                                 <option key={b.id} value={b.id}>
                                                     {b.name} ({b.code || b.id})
                                                 </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Department name *</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="text"
                                            name="departmentName"
                                            value={formData.departmentName}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Information Technology"
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
                                            placeholder="Overview of department responsibilities"
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
                        {departmentId ? "Save changes" : "Create department"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default DepartmentForm;
