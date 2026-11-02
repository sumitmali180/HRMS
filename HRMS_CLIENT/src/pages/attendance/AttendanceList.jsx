import { useState, useEffect } from "react";
import { getDailyAttendance, regularizeAttendance } from "../../services/attendanceService";
import { getBranchLookup } from "../../services/lookupService";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AttendanceList = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    // Regularize modal for admin
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalInTime, setModalInTime] = useState("09:00");
    const [modalOutTime, setModalOutTime] = useState("18:00");
    const [modalReason, setModalReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const list = await getBranchLookup();
                setBranches(list || []);
            } catch (err) {
                console.error("Failed to load branches:", err);
            }
        };
        fetchBranches();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await getDailyAttendance(selectedBranch || null, selectedDate || null);
            setAttendanceData(data || []);
        } catch (err) {
            console.error("Failed to load daily attendance:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedBranch, selectedDate]);

    const handleOpenRegularize = (row) => {
        setSelectedRecord(row);
        setModalInTime(row.inTime ? new Date(row.inTime).toTimeString().substring(0, 5) : "09:00");
        setModalOutTime(row.outTime ? new Date(row.outTime).toTimeString().substring(0, 5) : "18:00");
        setModalReason("");
        setShowModal(true);
    };

    const handleSaveRegularize = async (e) => {
        e.preventDefault();
        if (!selectedRecord) return;
        try {
            setSubmitting(true);
            await regularizeAttendance({
                employeeId: selectedRecord.employeeId,
                attendanceDate: selectedDate,
                inTime: `${selectedDate}T${modalInTime}:00`,
                outTime: `${selectedDate}T${modalOutTime}:00`,
                reason: modalReason || "Admin regularized"
            });
            alert("Attendance updated successfully.");
            setShowModal(false);
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update attendance.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleExportCSV = () => {
        if (attendanceData.length === 0) {
            alert("No data available to export.");
            return;
        }

        const headers = ["Employee Code", "Employee Name", "Department", "Designation", "In Time", "Out Time", "Total Hours", "Status"];
        const rows = attendanceData.map((d) => [
            `"${d.employeeCode || ""}"`,
            `"${d.employeeName || ""}"`,
            `"${d.departmentName || ""}"`,
            `"${d.designationName || ""}"`,
            `"${d.inTime ? new Date(d.inTime).toLocaleTimeString() : "--"}"`,
            `"${d.outTime ? new Date(d.outTime).toLocaleTimeString() : "--"}"`,
            `"${d.totalHours ? Number(d.totalHours).toFixed(2) : "0"}"`,
            `"${d.status || ""}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Daily_Attendance_${selectedDate}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        {
            key: "employeeCode",
            label: "Code",
            render: (r) => <span className="badge badge-neutral font-monospace">{r.employeeCode}</span>
        },
        {
            key: "employeeName",
            label: "Employee",
            render: (r) => (
                <div>
                    <span className="fw-semibold">{r.employeeName}</span>
                    <small className="text-muted d-block">{r.departmentName} &bull; {r.designationName}</small>
                </div>
            )
        },
        {
            key: "inTime",
            label: "Clock in",
            render: (r) => <span className="font-monospace">{r.inTime ? new Date(r.inTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</span>
        },
        {
            key: "outTime",
            label: "Clock out",
            render: (r) => <span className="font-monospace">{r.outTime ? new Date(r.outTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</span>
        },
        {
            key: "totalHours",
            label: "Hours",
            render: (r) => <span className="tabular-nums font-monospace">{r.totalHours ? `${Number(r.totalHours).toFixed(1)} hrs` : "--"}</span>
        },
        {
            key: "status",
            label: "Status",
            render: (r) => {
                const s = r.status?.toLowerCase();
                const badge = s === "present" ? "badge-success" : s === "late" ? "badge-warning" : s === "halfday" ? "badge-info" : "badge-danger";
                return <span className={`badge ${badge}`}>{r.status || "Absent"}</span>;
            }
        },
        {
            key: "action",
            label: "Action",
            sortable: false,
            render: (r) => (
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleOpenRegularize(r)}
                    title="Regularize / edit punch"
                >
                    <i className="bi bi-pencil-square me-1"></i>Regularize
                </button>
            )
        }
    ];

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-semibold text-dark mb-1">Daily attendance</h3>
                    <p className="text-muted mb-0 small">Monitor workforce attendance, shifts, and punch records</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
                        <i className="bi bi-download me-1"></i>Export CSV
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="card border mb-4">
                <div className="card-body p-3">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-4">
                            <label className="form-label small text-muted mb-1">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small text-muted mb-1">Branch</label>
                            <select
                                className="form-select"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="">All branches</option>
                                {branches.map((b) => (
                                    <option key={b.id || b.branchId} value={b.id || b.branchId}>
                                        {b.name || b.branchName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 d-flex align-items-end pt-3">
                            <button className="btn btn-primary w-100" onClick={loadData}>
                                <i className="bi bi-arrow-repeat me-1"></i>Refresh records
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner text="Loading daily attendance logs..." />
            ) : (
                <DataTable
                    columns={columns}
                    data={attendanceData}
                    searchPlaceholder="Search by name, employee code, department..."
                />
            )}

            {/* Regularize Modal */}
            {showModal && selectedRecord && (
                <>
                    <div className="modal-backdrop fade show" />
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border shadow-sm">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fs-6 fw-semibold">Attendance regularization</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    />
                                </div>
                                <form onSubmit={handleSaveRegularize}>
                                    <div className="modal-body p-4">
                                        <p className="mb-3 small text-muted">
                                            Regularizing for <strong className="text-dark">{selectedRecord.employeeName}</strong> on <span className="font-monospace">{selectedDate}</span>
                                        </p>
                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                <label className="form-label small text-muted">In time</label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={modalInTime}
                                                    onChange={(e) => setModalInTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small text-muted">Out time</label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    value={modalOutTime}
                                                    onChange={(e) => setModalOutTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Correction reason</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={modalReason}
                                                onChange={(e) => setModalReason(e.target.value)}
                                                placeholder="e.g. Device failure / Approved remote punch"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-white border-top">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            disabled={submitting}
                                        >
                                            {submitting ? "Saving..." : "Save correction"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AttendanceList;
