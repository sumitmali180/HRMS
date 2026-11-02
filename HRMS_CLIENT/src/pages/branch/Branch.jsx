import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import DataTable from "../../components/common/DataTable";
import ConfirmModal from "../../components/common/ConfirmModal";
import BranchForm from "./BranchForm";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getBranchList, deleteBranch } from "../../services/branchService";

const Branch = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadBranches = async () => {
        try {
            setLoading(true);
            const data = await getBranchList();
            setBranches(data);
        } catch (err) {
            console.error("Error loading branches:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBranches();
    }, []);

    const handleEdit = (id) => {
        setSelectedBranchId(id);
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
            await deleteBranch(deletingId);
            setShowDeleteModal(false);
            setDeletingId(null);
            loadBranches();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete branch.");
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            key: "branchCode",
            label: "Code",
            sortable: true,
            render: (row) => <span className="badge badge-neutral font-monospace">{row.branchCode}</span>
        },
        {
            key: "branchName",
            label: "Branch name",
            sortable: true,
            render: (row) => (
                <div>
                    <div className="fw-medium text-dark">{row.branchName}</div>
                    <small className="text-muted">{row.companyName || "Acme Global"}</small>
                </div>
            )
        },
        {
            key: "managerName",
            label: "Branch manager",
            render: (row) => row.managerName ? (
                <span>{row.managerName}</span>
            ) : (
                <span className="text-muted small">Not assigned</span>
            )
        },
        { key: "phone", label: "Phone", render: (r) => <span className="font-monospace small">{r.phone || "--"}</span> },
        { key: "email", label: "Email", render: (r) => <span className="small">{r.email || "--"}</span> },
        {
            key: "actions",
            label: "Actions",
            render: (row) => (
                <div className="d-flex gap-1 justify-content-end">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleEdit(row.branchId)}
                        title="Edit"
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeletePrompt(row.branchId)}
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
                    <h3 className="fw-semibold text-dark mb-1">Branch locations</h3>
                    <p className="text-muted small mb-0">Organizational branches, regional offices, and centers</p>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                        setSelectedBranchId(null);
                        setShowForm(true);
                    }}
                >
                    <i className="bi bi-plus-lg me-1"></i>Add branch
                </button>
            </div>

            {loading ? (
                <LoadingSpinner text="Loading branches..." />
            ) : (
                <DataTable
                    columns={columns}
                    data={branches}
                    keyField="branchId"
                    searchPlaceholder="Search branch by name, code, manager..."
                />
            )}

            <BranchForm
                show={showForm}
                branchId={selectedBranchId}
                onClose={() => setShowForm(false)}
                onSuccess={() => {
                    setShowForm(false);
                    loadBranches();
                }}
            />

            <ConfirmModal
                show={showDeleteModal}
                title="Delete Branch"
                message="Are you sure you want to delete this branch?"
                confirmText="Delete"
                loading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </div>
    );
};

export default Branch;
