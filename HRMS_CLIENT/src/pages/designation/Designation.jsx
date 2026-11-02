import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import DataTable from "../../components/common/DataTable";
import ConfirmModal from "../../components/common/ConfirmModal";
import DesignationForm from "./DesignationForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getDesignationList, deleteDesignation } from "../../services/designationService";

const Designation = () => {
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDesignationId, setSelectedDesignationId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadDesignations = async () => {
        try {
            setLoading(true);
            const data = await getDesignationList();
            setDesignations(data);
        } catch (err) {
            console.error("Error loading designations:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDesignations();
    }, []);

    const handleEdit = (id) => {
        setSelectedDesignationId(id);
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
            await deleteDesignation(deletingId);
            setShowDeleteModal(false);
            setDeletingId(null);
            loadDesignations();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete designation.");
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            key: "designationName",
            label: "Designation",
            sortable: true,
            render: (row) => (
                <div className="fw-medium text-dark">
                    {row.designationName}
                </div>
            )
        },
        {
            key: "grade",
            label: "Grade",
            sortable: true,
            render: (row) => row.grade ? (
                <span className="badge badge-neutral font-monospace">{row.grade}</span>
            ) : (
                <span className="text-muted small">-</span>
            )
        },
        {
            key: "basicSalary",
            label: "Basic salary",
            sortable: true,
            render: (row) => row.basicSalary !== undefined ? (
                <span className="font-monospace tabular-nums">${Number(row.basicSalary).toLocaleString()}</span>
            ) : "-"
        },
        {
            key: "description",
            label: "Description",
            render: (row) => (
                <span className="text-muted small">
                    {row.description || "No description provided"}
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
                        onClick={() => handleEdit(row.designationId)}
                        title="Edit"
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeletePrompt(row.designationId)}
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
                    <h3 className="fw-semibold text-dark mb-1">Job designations</h3>
                    <p className="text-muted small mb-0">Define corporate job titles, pay bands, and functional levels</p>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                        setSelectedDesignationId(null);
                        setShowForm(true);
                    }}
                >
                    <i className="bi bi-plus-lg me-1"></i>Add designation
                </button>
            </div>

            {loading ? (
                <LoadingSpinner text="Loading designations..." />
            ) : (
                <DataTable
                    columns={columns}
                    data={designations}
                    keyField="designationId"
                    searchPlaceholder="Search designations, grades..."
                />
            )}

            <DesignationForm
                show={showForm}
                designationId={selectedDesignationId}
                onClose={() => setShowForm(false)}
                onSuccess={() => {
                    setShowForm(false);
                    loadDesignations();
                }}
            />

            <ConfirmModal
                show={showDeleteModal}
                title="Delete Designation"
                message="Are you sure you want to delete this designation?"
                confirmText="Delete"
                loading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default Designation;
