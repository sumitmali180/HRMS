import { useState, useEffect } from "react";
import { getRoster, getShifts, assignRoster } from "../../services/shiftService";
import { getEmployees } from "../../services/employeeService";

const RosterPlanner = () => {
    const [roster, setRoster] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());

    const [assignData, setAssignData] = useState({
        employeeId: "",
        shiftId: "",
        rosterDate: new Date().toISOString().split("T")[0],
        isWeekend: false,
        remarks: ""
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [rosterList, shiftList, empList] = await Promise.all([
                getRoster(month, year),
                getShifts(),
                getEmployees()
            ]);
            setRoster(rosterList);
            setShifts(shiftList);
            setEmployees(empList);
            if (empList.length > 0 && !assignData.employeeId) {
                setAssignData(prev => ({
                    ...prev,
                    employeeId: empList[0].employeeId,
                    shiftId: shiftList[0]?.shiftId || ""
                }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [month, year]);

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            const res = await assignRoster({
                ...assignData,
                employeeId: parseInt(assignData.employeeId),
                shiftId: parseInt(assignData.shiftId)
            });
            if (res.success) {
                setAlert({ type: "success", text: "Employee shift assigned." });
                loadData();
                const el = document.getElementById("assignModal");
                window.bootstrap?.Modal.getInstance(el)?.hide();
            } else {
                setAlert({ type: "danger", text: res.message || "Failed to assign roster." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error assigning shift." });
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Roster planner</h4>
                    <p className="text-secondary small mb-0">Assign daily work shifts, schedule rotational duty, and manage weekend rosters</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#assignModal">
                        <i className="bi bi-plus"></i> Assign shift
                    </button>
                </div>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            {/* Filter Bar */}
            <div className="card border mb-4 p-3 bg-white">
                <div className="row g-3 align-items-center">
                    <div className="col-auto">
                        <span className="small text-secondary">Period:</span>
                    </div>
                    <div className="col-auto">
                        <select className="form-select form-select-sm" value={month} onChange={e => setMonth(parseInt(e.target.value))}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(2026, i, 1).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-auto">
                        <select className="form-select form-select-sm" value={year} onChange={e => setYear(parseInt(e.target.value))}>
                            <option value={2026}>2026</option>
                            <option value={2027}>2027</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Roster Table */}
            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                    <h6 className="card-title mb-0 fw-semibold text-dark">Roster assignments ({roster.length})</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small fw-medium">
                                <tr>
                                    <th>Date</th>
                                    <th>Employee</th>
                                    <th>Department</th>
                                    <th>Assigned shift</th>
                                    <th>Hours</th>
                                    <th>Weekend/off</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-4 text-muted small">Loading roster schedule...</td></tr>
                                ) : roster.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-secondary">
                                            No roster schedules assigned for this period. Click "Assign Shift" to schedule.
                                        </td>
                                    </tr>
                                ) : (
                                    roster.map(r => (
                                        <tr key={r.rosterId}>
                                            <td className="fw-bold">{new Date(r.rosterDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                                            <td>
                                                <div className="fw-bold text-dark">{r.employeeName}</div>
                                                <small className="text-muted">{r.employeeCode}</small>
                                            </td>
                                            <td>{r.departmentName}</td>
                                            <td>
                                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                                                    {r.shiftName} ({r.shiftCode})
                                                </span>
                                            </td>
                                            <td>{r.startTime?.substring(0, 5)} - {r.endTime?.substring(0, 5)}</td>
                                            <td>
                                                {r.isWeekend ? (
                                                    <span className="badge bg-secondary">Weekend Off</span>
                                                ) : (
                                                    <span className="badge bg-success-subtle text-success">Working</span>
                                                )}
                                            </td>
                                            <td className="small text-muted">{r.remarks || "—"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: Assign Roster */}
            <div className="modal fade" id="assignModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleAssign}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Assign Employee Shift</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Employee</label>
                                    <select
                                        className="form-select"
                                        value={assignData.employeeId}
                                        onChange={e => setAssignData({ ...assignData, employeeId: e.target.value })}
                                        required
                                    >
                                        {employees.map(emp => (
                                            <option key={emp.employeeId} value={emp.employeeId}>
                                                {emp.firstName} {emp.lastName} ({emp.employeeCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Shift Pattern</label>
                                    <select
                                        className="form-select"
                                        value={assignData.shiftId}
                                        onChange={e => setAssignData({ ...assignData, shiftId: e.target.value })}
                                        required
                                    >
                                        {shifts.map(s => (
                                            <option key={s.shiftId} value={s.shiftId}>
                                                {s.shiftName} ({s.startTime?.substring(0, 5)} - {s.endTime?.substring(0, 5)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-8">
                                        <label className="form-label fw-semibold">Duty Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={assignData.rosterDate}
                                            onChange={e => setAssignData({ ...assignData, rosterDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-4 d-flex align-items-end">
                                        <div className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="chkWeekend"
                                                checked={assignData.isWeekend}
                                                onChange={e => setAssignData({ ...assignData, isWeekend: e.target.checked })}
                                            />
                                            <label className="form-check-label small fw-semibold" htmlFor="chkWeekend">
                                                Weekend Off
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Notes / Shift Swapping Reason</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="Optional assignment remarks..."
                                        value={assignData.remarks}
                                        onChange={e => setAssignData({ ...assignData, remarks: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Roster Duty</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RosterPlanner;
