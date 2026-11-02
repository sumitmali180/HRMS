import React, { useState, useEffect } from "react";
import { Button, Badge } from "react-bootstrap";
import DataTable from "../../components/common/DataTable";
import ConfirmModal from "../../components/common/ConfirmModal";
import CompanyForm from "./CompanyForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getCompanyList, deleteCompany } from "../../services/companyService";

const Company = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            const data = await getCompanyList();
            setCompanies(data);
        } catch (err) {
            console.error("Error loading companies:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompanies();
    }, []);

    const handleEdit = (id) => {
        setSelectedCompanyId(id);
        setShowForm(true);
    };

    const handleDeletePrompt = (id) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            setIsDeleting(true);
            await deleteCompany(deletingId);
            setShowDeleteModal(false);
            setDeletingId(null);
            loadCompanies();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete company.");
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            key: "companyName",
            label: "Company",
            sortable: true,
            render: (row) => (
                <div className="d-flex align-items-center gap-2">
                    {row.logo ? (
                        <img
                            src={row.logo}
                            alt="logo"
                            className="rounded-circle border"
                            style={{ width: "32px", height: "32px", objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            className="rounded-circle bg-light border text-secondary d-flex align-items-center justify-content-center fw-medium small"
                            style={{ width: "32px", height: "32px" }}
                        >
                            {row.companyName?.charAt(0) || "C"}
                        </div>
                    )}
                    <div>
                        <div className="fw-medium text-dark">{row.companyName}</div>
                        {row.website && (
                            <small className="text-muted">
                                <a href={row.website} target="_blank" rel="noreferrer" className="text-decoration-none text-muted">
                                    {row.website}
                                </a>
                            </small>
                        )}
                    </div>
                </div>
            )
        },
        { key: "gstNo", label: "GST / tax ID", sortable: true, render: (r) => <span className="font-monospace small">{r.gstNo || "--"}</span> },
        { key: "email", label: "Email", sortable: true, render: (r) => <span className="small">{r.email}</span> },
        { key: "phone", label: "Phone", render: (r) => <span className="font-monospace small">{r.phone || "--"}</span> },
        {
            key: "currency",
            label: "Currency / zone",
            render: (row) => (
                <span className="text-muted small font-monospace">
                    {row.currency || "USD"} &bull; {row.timeZone || "UTC"}
                </span>
            )
        },
        {
            key: "isActive",
            label: "Status",
            render: (row) => (
                <span className={`badge ${row.isActive ? "badge-success" : "badge-neutral"}`}>
                    {row.isActive ? "Active" : "Inactive"}
                </span>
            )
        },
        {
            key: "actions",
            label: "Actions",
            render: (row) => (
                <div className="d-flex gap-1 justify-content-end">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleEdit(row.companyId)}
                        title="Edit"
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeletePrompt(row.companyId)}
                        title="Delete"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="container-fluid py-2">
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-semibold text-dark mb-1">Company profiles</h3>
                    <p className="text-muted small mb-0">Organization profiles, contact, and statutory details</p>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                        setSelectedCompanyId(null);
                        setShowForm(true);
                    }}
                >
                    <i className="bi bi-plus-lg me-1"></i>Add company
                </button>
            </div>

            {loading ? (
                <LoadingSpinner text="Loading companies..." />
            ) : (
                <DataTable
                    columns={columns}
                    data={companies}
                    keyField="companyId"
                    searchPlaceholder="Search company, GST, email..."
                />
            )}

            <CompanyForm
                show={showForm}
                companyId={selectedCompanyId}
                onClose={() => setShowForm(false)}
                onSuccess={() => {
                    setShowForm(false);
                    loadCompanies();
                }}
            />

            <ConfirmModal
                show={showDeleteModal}
                title="Deactivate Company"
                message="Are you sure you want to deactivate this company record?"
                confirmText="Deactivate"
                loading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default Company;
