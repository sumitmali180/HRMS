import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import DataTable from "../../components/common/DataTable";
import ConfirmModal from "../../components/common/ConfirmModal";
import DepartmentForm from "./DepartmentForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getDepartmentList, deleteDepartment } from "../../services/departmentService";

const Department = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            const data = await getDepartmentList();
            setDepartments(data);
        } catch (err) {
            console.error("Error loading departments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, []);

    const handleEdit = (id) => {
        setSelectedDepartmentId(id);
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
            await deleteDepartment(deletingId);
            setShowDeleteModal(false);
            setDeletingId(null);
            loadDepartments();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete department.");
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            key: "departmentName",
            label: "Department name",
            sortable: true,
            render: (row) => (
                <div className="fw-medium text-dark">
                    {row.departmentName}
                </div>
            )
        },
        {
            key: "branchName",
            label: "Branch",
            sortable: true,
            render: (row) => <span className="text-secondary small">{row.branchName || "Main HQ"}</span>
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
                        onClick={() => handleEdit(row.departmentId)}
                        title="Edit"
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeletePrompt(row.departmentId)}
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
                    <h3 className="fw-semibold text-dark mb-1">Departments</h3>
                    <p className="text-muted small mb-0">Organize and manage corporate functional units and teams</p>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                        setSelectedDepartmentId(null);
                        setShowForm(true);
                    }}
                >
                    <i className="bi bi-plus-lg me-1"></i>Add department
                </button>
            </div>

            {loading ? (
                <LoadingSpinner text="Loading departments..." />
            ) : (
                <DataTable
                    columns={columns}
                    data={departments}
                    keyField="departmentId"
                    searchPlaceholder="Search departments..."
                />
            )}

            <DepartmentForm
                show={showForm}
                departmentId={selectedDepartmentId}
                onClose={() => setShowForm(false)}
                onSuccess={() => {
                    setShowForm(false);
                    loadDepartments();
                }}
            />

            <ConfirmModal
                show={showDeleteModal}
                title="Delete Department"
                message="Are you sure you want to delete this department?"
                confirmText="Delete"
                loading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default Department;
