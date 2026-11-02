import { useEffect, useState } from "react";
import { getEmployeeList, deleteEmployee } from "../../services/employeeService";
import EmployeeForm from "./EmployeeForm";
import DataTable from "../../components/common/DataTable";
import ConfirmModal from "../../components/common/ConfirmModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        employeeId: null,
        employeeName: "",
        loading: false
    });

    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getEmployeeList();
            setEmployees(data || []);
        } catch (err) {
            console.error("Employee API Error:", err);
            setError(err.response?.data?.message || "Unable to load employees.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const handleAdd = () => {
        setSelectedEmployeeId(null);
        setShowForm(true);
    };

    const handleEdit = (employeeId) => {
        setSelectedEmployeeId(employeeId);
        setShowForm(true);
    };

    const handleDeleteClick = (employee) => {
        setDeleteModal({
            isOpen: true,
            employeeId: employee.employeeId,
            employeeName: employee.fullName,
            loading: false
        });
    };

    const handleConfirmDelete = async () => {
        try {
            setDeleteModal((prev) => ({ ...prev, loading: true }));
            await deleteEmployee(deleteModal.employeeId);
            setDeleteModal({ isOpen: false, employeeId: null, employeeName: "", loading: false });
            await loadEmployees();
        } catch (err) {
            console.error("Delete Employee Error:", err);
            alert(err.response?.data?.message || "Unable to delete employee.");
            setDeleteModal((prev) => ({ ...prev, loading: false }));
        }
    };

    const columns = [
        {
            key: "employeeCode",
            label: "Code",
            render: (row) => <span className="badge badge-neutral font-monospace">{row.employeeCode}</span>
        },
        {
            key: "fullName",
            label: "Employee",
            render: (row) => (
                <div className="d-flex align-items-center">
                    {row.profilePhoto ? (
                        <img
                            src={row.profilePhoto}
                            alt=""
                            className="rounded-circle me-2"
                            style={{ width: "32px", height: "32px", objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            className="rounded-circle bg-light border text-secondary d-flex align-items-center justify-content-center me-2 fw-medium"
                            style={{ width: "32px", height: "32px", fontSize: "0.75rem" }}
                        >
                            {row.firstName?.[0]}{row.lastName?.[0]}
                        </div>
                    )}
                    <div>
                        <div className="fw-medium text-dark small">{row.fullName}</div>
                        <span className="text-muted small font-monospace" style={{ fontSize: "11px" }}>{row.email}</span>
                    </div>
                </div>
            )
        },
        {
            key: "phone",
            label: "Phone",
            render: (row) => <span className="small text-secondary tabular-nums">{row.phone || "—"}</span>
        },
        {
            key: "departmentName",
            label: "Department",
            render: (row) => <span className="small">{row.departmentName || "—"}</span>
        },
        {
            key: "designationName",
            label: "Designation",
            render: (row) => <span className="small">{row.designationName || "—"}</span>
        },
        {
            key: "branchName",
            label: "Branch",
            render: (row) => <span className="small">{row.branchName || "—"}</span>
        },
        {
            key: "status",
            label: "Status",
            render: (row) => {
                const badgeClass = row.status === "Active" ? "badge-success" : row.status === "Probation" ? "badge-neutral" : "badge-warning";
                return <span className={`badge ${badgeClass}`}>{row.status}</span>;
            }
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (row) => (
                <div className="d-flex justify-content-center gap-1">
                    <button
                        className="btn btn-sm btn-outline-secondary py-0 px-2"
                        onClick={() => handleEdit(row.employeeId)}
                        title="Edit"
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger py-0 px-2"
                        onClick={() => handleDeleteClick(row)}
                        title="Delete"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    if (loading && employees.length === 0) {
        return <LoadingSpinner text="Loading employees..." />;
    }

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold text-dark mb-1">Employee directory</h4>
                    <p className="text-secondary small mb-0">Manage employee records, profiles, and organization hierarchy</p>
                </div>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={handleAdd}>
                    <i className="bi bi-plus"></i> Add employee
                </button>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
            )}

            <DataTable
                columns={columns}
                data={employees}
                searchPlaceholder="Search employees by name, code, email, department..."
            />

            {showForm && (
                <EmployeeForm
                    employeeId={selectedEmployeeId}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedEmployeeId(null);
                    }}
                    onSuccess={async () => {
                        setShowForm(false);
                        setSelectedEmployeeId(null);
                        await loadEmployees();
                    }}
                />
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Delete Employee"
                message={`Are you sure you want to delete employee "${deleteModal.employeeName}"? This action cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
                isLoading={deleteModal.loading}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModal({ isOpen: false, employeeId: null, employeeName: "", loading: false })}
            />
        </div>
    );
};

export default Employee;