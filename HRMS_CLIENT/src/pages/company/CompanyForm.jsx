import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { createCompany, updateCompany, getCompanyById } from "../../services/companyService";
import { uploadCompanyLogo } from "../../services/uploadService";

const CompanyForm = ({ show, companyId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        companyName: "",
        gstNo: "",
        address: "",
        phone: "",
        email: "",
        logo: "",
        website: "",
        currency: "USD",
        timeZone: "UTC",
        isActive: true
    });

    useEffect(() => {
        if (!show) return;

        if (companyId) {
            setLoading(true);
            getCompanyById(companyId)
                .then((data) => {
                    if (data) {
                        setFormData({
                            companyName: data.companyName || "",
                            gstNo: data.gstNo || "",
                            address: data.address || "",
                            phone: data.phone || "",
                            email: data.email || "",
                            logo: data.logo || "",
                            website: data.website || "",
                            currency: data.currency || "USD",
                            timeZone: data.timeZone || "UTC",
                            isActive: data.isActive ?? true
                        });
                    }
                })
                .catch((err) => setError("Failed to load company details."))
                .finally(() => setLoading(false));
        } else {
            setFormData({
                companyName: "",
                gstNo: "",
                address: "",
                phone: "",
                email: "",
                logo: "",
                website: "",
                currency: "USD",
                timeZone: "UTC",
                isActive: true
            });
            setError(null);
        }
    }, [show, companyId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingLogo(true);
            const res = await uploadCompanyLogo(file);
            if (res.fileUrl) {
                setFormData((prev) => ({ ...prev, logo: res.fileUrl }));
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to upload logo.");
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            if (companyId) {
                await updateCompany(companyId, { companyId, ...formData });
            } else {
                await createCompany(formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save company.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered backdrop="static">
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton={!saving}>
                    <Modal.Title className="fs-6 fw-semibold text-dark">
                        {companyId ? "Edit company" : "Add company"}
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
                                        <Form.Label className="small text-muted mb-1">Company name *</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Acme Corp"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">GST / Tax ID</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="text"
                                            name="gstNo"
                                            value={formData.gstNo}
                                            onChange={handleChange}
                                            placeholder="e.g. 27AABCU9603R1ZM"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Email address *</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="contact@company.com"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Phone number</Form.Label>
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
                                            placeholder="Corporate headquarters address"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Website</Form.Label>
                                        <Form.Control
                                            className="form-control-sm"
                                            type="url"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            placeholder="https://company.com"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Currency</Form.Label>
                                        <Form.Select
                                            className="form-select-sm"
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="INR">INR (₹)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Time zone</Form.Label>
                                        <Form.Select
                                            className="form-select-sm"
                                            name="timeZone"
                                            value={formData.timeZone}
                                            onChange={handleChange}
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="IST">Asia/Kolkata (IST)</option>
                                            <option value="EST">America/New_York (EST)</option>
                                            <option value="PST">America/Los_Angeles (PST)</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={8}>
                                    <Form.Group>
                                        <Form.Label className="small text-muted mb-1">Company logo</Form.Label>
                                        <div className="d-flex align-items-center gap-2">
                                            <Form.Control
                                                className="form-control-sm"
                                                type="file"
                                                accept="image/png, image/jpeg, image/webp"
                                                onChange={handleLogoUpload}
                                                disabled={uploadingLogo}
                                            />
                                            {uploadingLogo && <Spinner animation="border" size="sm" />}
                                        </div>
                                    </Form.Group>
                                </Col>

                                {formData.logo && (
                                    <Col md={4} className="d-flex align-items-end">
                                        <img
                                            src={formData.logo}
                                            alt="Logo preview"
                                            className="border rounded p-1 bg-light"
                                            style={{ maxHeight: "36px" }}
                                        />
                                    </Col>
                                )}

                                <Col md={12}>
                                    <Form.Check
                                        type="checkbox"
                                        label="Active company"
                                        name="isActive"
                                        id="isCompanyActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="small"
                                    />
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
                        {companyId ? "Save changes" : "Create company"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CompanyForm;
