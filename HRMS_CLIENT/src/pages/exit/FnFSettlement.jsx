import { useState, useEffect } from "react";
import { getFnFList, calculateFnF, getResignationQueue } from "../../services/exitService";

const FnFSettlement = () => {
    const [settlements, setSettlements] = useState([]);
    const [resignations, setResignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    const [calcData, setCalcData] = useState({
        resignationId: "",
        employeeId: "",
        lastWorkingDay: new Date().toISOString().split("T")[0],
        earnedSalary: 0,
        gratuityAmount: 0,
        leaveEncashmentAmount: 0,
        noticePayAmount: 0,
        deductions: 0,
        remarks: ""
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [fnfs, resQueue] = await Promise.all([
                getFnFList(),
                getResignationQueue()
            ]);
            setSettlements(fnfs);
            setResignations(resQueue);
            if (resQueue.length > 0 && !calcData.resignationId) {
                setCalcData(prev => ({
                    ...prev,
                    resignationId: resQueue[0].resignationId,
                    employeeId: resQueue[0].employeeId
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
    }, []);

    const handleCalculate = async (e) => {
        e.preventDefault();
        try {
            const res = await calculateFnF({
                ...calcData,
                resignationId: parseInt(calcData.resignationId),
                employeeId: parseInt(calcData.employeeId),
                earnedSalary: parseFloat(calcData.earnedSalary || 0),
                gratuityAmount: parseFloat(calcData.gratuityAmount || 0),
                leaveEncashmentAmount: parseFloat(calcData.leaveEncashmentAmount || 0),
                noticePayAmount: parseFloat(calcData.noticePayAmount || 0),
                deductions: parseFloat(calcData.deductions || 0)
            });
            if (res.success) {
                setAlert({ type: "success", text: "Full & final settlement calculated and recorded." });
                loadData();
                const el = document.getElementById("fnfModal");
                window.bootstrap?.Modal.getInstance(el)?.hide();
            } else {
                setAlert({ type: "danger", text: res.message || "Computation failed." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error calculating settlement." });
        }
    };

    const netPayable = (parseFloat(calcData.earnedSalary || 0) +
        parseFloat(calcData.gratuityAmount || 0) +
        parseFloat(calcData.leaveEncashmentAmount || 0) +
        parseFloat(calcData.noticePayAmount || 0)) -
        parseFloat(calcData.deductions || 0);

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Full & final settlement</h4>
                    <p className="text-secondary small mb-0">Compute exit payouts, gratuity, leave encashment, and clearances</p>
                </div>
                <button
                    className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                    data-bs-toggle="modal"
                    data-bs-target="#fnfModal"
                    disabled={resignations.length === 0}
                >
                    <i className="bi bi-calculator"></i> Calculate settlement
                </button>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="card-title mb-0 fw-semibold text-dark">Settlement register ({settlements.length})</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small fw-medium">
                                <tr>
                                    <th>Settlement #</th>
                                    <th>Employee</th>
                                    <th>Last working day</th>
                                    <th>Earned salary</th>
                                    <th>Gratuity</th>
                                    <th>Leave encashment</th>
                                    <th>Deductions</th>
                                    <th>Net payout</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="9" className="text-center py-4 text-muted small">Loading settlements...</td></tr>
                                ) : settlements.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-5 text-muted small">
                                            No settlements finalized yet.
                                        </td>
                                    </tr>
                                ) : (
                                    settlements.map(f => (
                                        <tr key={f.settlementId}>
                                            <td className="fw-medium font-monospace small">#FNF-{f.settlementId}</td>
                                            <td>
                                                <div className="fw-medium text-dark small">{f.employeeName}</div>
                                                <div className="text-muted small font-monospace">{f.employeeCode}</div>
                                            </td>
                                            <td className="tabular-nums small">{new Date(f.lastWorkingDay).toLocaleDateString()}</td>
                                            <td className="tabular-nums small">${parseFloat(f.earnedSalary).toFixed(2)}</td>
                                            <td className="tabular-nums small">${parseFloat(f.gratuityAmount).toFixed(2)}</td>
                                            <td className="tabular-nums small">${parseFloat(f.leaveEncashmentAmount).toFixed(2)}</td>
                                            <td className="tabular-nums small text-secondary">-${parseFloat(f.deductions).toFixed(2)}</td>
                                            <td className="fw-semibold tabular-nums small text-dark">${parseFloat(f.netPayable).toFixed(2)}</td>
                                            <td>
                                                <span className="badge badge-success">{f.status}</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: Calculate F&F */}
            <div className="modal fade" id="fnfModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={handleCalculate}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Compute Full & Final Payout</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Select Separated Employee</label>
                                    <select
                                        className="form-select"
                                        value={calcData.resignationId}
                                        onChange={e => {
                                            const r = resignations.find(x => x.resignationId === parseInt(e.target.value));
                                            setCalcData({
                                                ...calcData,
                                                resignationId: e.target.value,
                                                employeeId: r ? r.employeeId : ""
                                            });
                                        }}
                                        required
                                    >
                                        {resignations.map(r => (
                                            <option key={r.resignationId} value={r.resignationId}>
                                                {r.employeeName} ({r.employeeCode}) — Relieving: {new Date(r.preferredRelievingDate).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Last Working Day</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={calcData.lastWorkingDay}
                                            onChange={e => setCalcData({ ...calcData, lastWorkingDay: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Earned Days Salary ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={calcData.earnedSalary}
                                            onChange={e => setCalcData({ ...calcData, earnedSalary: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Gratuity Settlement ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={calcData.gratuityAmount}
                                            onChange={e => setCalcData({ ...calcData, gratuityAmount: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Leave Encashment ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={calcData.leaveEncashmentAmount}
                                            onChange={e => setCalcData({ ...calcData, leaveEncashmentAmount: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Notice Pay Adjustment ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={calcData.noticePayAmount}
                                            onChange={e => setCalcData({ ...calcData, noticePayAmount: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold">Recoveries & Asset Deductions ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            value={calcData.deductions}
                                            onChange={e => setCalcData({ ...calcData, deductions: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="card bg-light p-3 border-0 rounded-3 mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold fs-6">Net Final Payable Amount:</span>
                                        <span className="fs-4 fw-bold text-success">${netPayable.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Remarks / Clearance Summary</label>
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="All assets surrendered, finance dues cleared..."
                                        value={calcData.remarks}
                                        onChange={e => setCalcData({ ...calcData, remarks: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Authorize & Record F&F</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FnFSettlement;
