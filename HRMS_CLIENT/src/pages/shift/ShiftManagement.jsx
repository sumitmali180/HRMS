import { useState, useEffect } from "react";
import { getShifts, createShift } from "../../services/shiftService";

const ShiftManagement = () => {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const [form, setForm] = useState({
        shiftName: "",
        shiftCode: "",
        startTime: "09:00",
        endTime: "18:00",
        breakMinutes: 60,
        graceMinutes: 15,
        nightAllowance: 0
    });

    const loadShifts = async () => {
        try {
            setLoading(true);
            const data = await getShifts();
            setShifts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadShifts();
    }, []);

    const handleCreateShift = async (e) => {
        e.preventDefault();
        try {
            const res = await createShift({
                ...form,
                startTime: form.startTime + ":00",
                endTime: form.endTime + ":00",
                breakMinutes: parseInt(form.breakMinutes),
                graceMinutes: parseInt(form.graceMinutes),
                nightAllowance: parseFloat(form.nightAllowance || 0)
            });
            if (res.success) {
                setAlert({ type: "success", text: "Shift pattern created." });
                loadShifts();
                const el = document.getElementById("shiftModal");
                window.bootstrap?.Modal.getInstance(el)?.hide();
            } else {
                setAlert({ type: "danger", text: res.message || "Failed to create shift." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error saving shift." });
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Shift policies</h4>
                    <p className="text-secondary small mb-0">Define organizational work schedules, break limits, and night allowances</p>
                </div>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" data-bs-toggle="modal" data-bs-target="#shiftModal">
                    <i className="bi bi-plus"></i> Add shift
                </button>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            <div className="row g-3">
                {loading ? (
                    <div className="col-12 text-center py-5 text-muted small">Loading shifts...</div>
                ) : (
                    shifts.map(s => (
                        <div key={s.shiftId} className="col-12 col-md-6 col-lg-3">
                            <div className="card border h-100">
                                <div className="card-body p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="badge badge-neutral font-monospace">
                                            {s.shiftCode}
                                        </span>
                                        <span className="badge badge-success">Active</span>
                                    </div>
                                    <h6 className="fw-semibold text-dark mb-2">{s.shiftName}</h6>
                                    <div className="fs-5 fw-medium text-dark tabular-nums mb-3">
                                        {s.startTime?.substring(0, 5)} - {s.endTime?.substring(0, 5)}
                                    </div>
                                    <div className="small text-secondary mb-1">
                                        Break: <strong className="tabular-nums text-dark">{s.breakMinutes} mins</strong>
                                    </div>
                                    <div className="small text-secondary mb-1">
                                        Grace period: <strong className="tabular-nums text-dark">{s.graceMinutes} mins</strong>
                                    </div>
                                    <div className="small text-secondary">
                                        Night allowance: <strong className="tabular-nums text-dark">${parseFloat(s.nightAllowance).toFixed(2)}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal: Add Shift */}
            <div className="modal fade" id="shiftModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleCreateShift}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Define Work Shift</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-2 mb-3">
                                    <div className="col-8">
                                        <label className="form-label fw-semibold">Shift Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Afternoon Support Shift"
                                            value={form.shiftName}
                                            onChange={e => setForm({ ...form, shiftName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Code</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="AFT"
                                            value={form.shiftCode}
                                            onChange={e => setForm({ ...form, shiftCode: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Start Time</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            value={form.startTime}
                                            onChange={e => setForm({ ...form, startTime: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">End Time</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            value={form.endTime}
                                            onChange={e => setForm({ ...form, endTime: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Break (Mins)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form.breakMinutes}
                                            onChange={e => setForm({ ...form, breakMinutes: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Grace (Mins)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form.graceMinutes}
                                            onChange={e => setForm({ ...form, graceMinutes: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label className="form-label fw-semibold">Night Payout ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={form.nightAllowance}
                                            onChange={e => setForm({ ...form, nightAllowance: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Shift Pattern</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShiftManagement;
