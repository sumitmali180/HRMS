import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { getPayrollList, getPayslip } from "../../services/payrollService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const MyPayroll = () => {
    const { user } = useAuth();
    const [year, setYear] = useState(new Date().getFullYear());
    const [slips, setSlips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    const loadSlips = async () => {
        if (!user?.employeeId) return;
        try {
            setLoading(true);
            // Fetch records across all 12 months for this year
            const allPromises = Array.from({ length: 12 }, (_, i) =>
                getPayrollList(i + 1, year).catch(() => [])
            );
            const results = await Promise.all(allPromises);
            const userRecords = results.flat().filter(r => r.employeeId === user.employeeId);
            setSlips(userRecords);
        } catch (err) {
            console.error("Failed to load user payslips:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSlips();
    }, [user?.employeeId, year]);

    const handleViewPayslip = async (payrollId) => {
        try {
            setViewLoading(true);
            const data = await getPayslip(payrollId);
            setSelectedSlip(data);
        } catch (err) {
            alert("Failed to load payslip details.");
        } finally {
            setViewLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-semibold text-dark mb-1">My salary & payslips</h3>
                    <p className="text-muted mb-0 small">Monthly compensation statements, tax deductions, and payslips</p>
                </div>
                <div>
                    <select
                        className="form-select form-select-sm"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        {[2024, 2025, 2026, 2027].map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom">
                    <span className="fw-semibold text-dark">Payslips issued for {year}</span>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="p-5 text-center">
                            <LoadingSpinner text="Loading your payslips..." />
                        </div>
                    ) : slips.length === 0 ? (
                        <div className="p-5 text-center text-muted">
                            <i className="bi bi-file-earmark-x fs-3 d-block mb-2 text-secondary opacity-50"></i>
                            <span className="small">No payslips have been issued for this period yet.</span>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th>Gross earnings</th>
                                        <th>Deductions</th>
                                        <th>LOP days</th>
                                        <th>Net salary</th>
                                        <th>Status</th>
                                        <th className="text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slips.map((item) => (
                                        <tr key={item.payrollId}>
                                            <td className="fw-medium text-dark">
                                                {new Date(item.year, item.month - 1).toLocaleString("default", { month: "long" })} {item.year}
                                            </td>
                                            <td className="font-monospace tabular-nums">{formatCurrency(item.grossSalary)}</td>
                                            <td className="font-monospace tabular-nums text-muted">-{formatCurrency(item.totalDeductions)}</td>
                                            <td className="font-monospace tabular-nums">{item.lopDays || 0}</td>
                                            <td className="font-monospace tabular-nums fw-semibold text-dark">{formatCurrency(item.netSalary)}</td>
                                            <td>
                                                <span className={`badge ${item.paymentStatus?.toLowerCase() === "paid" ? "badge-success" : "badge-warning"}`}>
                                                    {item.paymentStatus || "Processed"}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => handleViewPayslip(item.payrollId)}
                                                >
                                                    View slip
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Payslip Modal */}
            {selectedSlip && (
                <>
                    <div className="modal-backdrop fade show" />
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content border shadow-sm">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fs-6 fw-semibold text-dark">
                                        Salary slip
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setSelectedSlip(null)}
                                    />
                                </div>
                                <div className="modal-body p-4">
                                    <div className="border-bottom pb-3 mb-3">
                                        <h5 className="fw-semibold text-dark mb-1">Enterprise HRMS</h5>
                                        <p className="text-muted small mb-0">Salary statement for {new Date(selectedSlip.year, selectedSlip.month - 1).toLocaleString("default", { month: "long" })} {selectedSlip.year}</p>
                                    </div>

                                    <div className="row mb-3 small">
                                        <div className="col-6">
                                            <p className="mb-1"><span className="text-muted">Employee:</span> <span className="fw-medium text-dark">{selectedSlip.employeeName}</span></p>
                                            <p className="mb-1"><span className="text-muted">Code:</span> <span className="font-monospace">{selectedSlip.employeeCode}</span></p>
                                            <p className="mb-1"><span className="text-muted">Designation:</span> {selectedSlip.designationName}</p>
                                        </div>
                                        <div className="col-6 text-end">
                                            <p className="mb-1"><span className="text-muted">Department:</span> {selectedSlip.departmentName}</p>
                                            <p className="mb-1"><span className="text-muted">Payment status:</span> <span className="badge badge-success ms-1">{selectedSlip.paymentStatus}</span></p>
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-6">
                                            <div className="card border h-100">
                                                <div className="card-header bg-white py-2 border-bottom fw-medium small">Earnings</div>
                                                <div className="card-body p-2">
                                                    <table className="table table-sm table-borderless mb-0 small">
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-muted">Basic salary</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedSlip.basic)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-muted">HRA</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedSlip.hra)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-muted">Allowances</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedSlip.allowances)}</td>
                                                            </tr>
                                                            <tr className="border-top fw-semibold">
                                                                <td>Total gross</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedSlip.grossSalary)}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className="card border h-100">
                                                <div className="card-header bg-white py-2 border-bottom fw-medium small">Deductions</div>
                                                <div className="card-body p-2">
                                                    <table className="table table-sm table-borderless mb-0 small">
                                                        <tbody>
                                                            <tr>
                                                                <td className="text-muted">Provident fund (PF)</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedSlip.pf)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-muted">Professional tax (PT)</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedSlip.pt)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-muted">LOP / other deductions</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedSlip.otherDeductions)}</td>
                                                            </tr>
                                                            <tr className="border-top fw-semibold">
                                                                <td>Total deductions</td>
                                                                <td className="text-end font-monospace text-muted">-{formatCurrency(selectedSlip.totalDeductions)}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-light rounded border d-flex justify-content-between align-items-center mt-3">
                                        <span className="small text-muted">Net salary credited</span>
                                        <strong className="fs-5 font-monospace text-dark">{formatCurrency(selectedSlip.netSalary)}</strong>
                                    </div>
                                </div>
                                <div className="modal-footer bg-white border-top">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setSelectedSlip(null)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => window.print()}
                                    >
                                        <i className="bi bi-printer me-1"></i>Print payslip
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyPayroll;
