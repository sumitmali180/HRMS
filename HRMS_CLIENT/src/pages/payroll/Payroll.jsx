import { useState, useEffect } from "react";
import {
    getPayrollList,
    processMonthlyPayroll,
    markAsPaid,
    getPayslip,
    saveSalaryStructure,
    getSalaryStructure
} from "../../services/payrollService";
import { getBranchLookup } from "../../services/lookupService";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Payroll = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState("");
    const [payrollList, setPayrollList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Payslip modal state
    const [selectedPayslip, setSelectedPayslip] = useState(null);
    const [payslipLoading, setPayslipLoading] = useState(false);

    // Salary Structure modal state
    const [structureModal, setStructureModal] = useState({
        isOpen: false,
        employeeId: null,
        employeeName: "",
        basic: 0,
        hra: 0,
        allowances: 0,
        pf: 0,
        pt: 0,
        otherDeductions: 0
    });
    const [structureLoading, setStructureLoading] = useState(false);

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
            const data = await getPayrollList(month, year, selectedBranch || null);
            setPayrollList(data || []);
        } catch (err) {
            console.error("Failed to load payroll:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [month, year, selectedBranch]);

    const handleRunPayroll = async () => {
        if (!window.confirm(`Are you sure you want to run payroll calculation for ${new Date(year, month - 1).toLocaleString("default", { month: "long" })} ${year}?`)) {
            return;
        }

        try {
            setProcessing(true);
            const res = await processMonthlyPayroll(month, year, selectedBranch ? Number(selectedBranch) : null);
            alert(res.message || "Payroll calculated successfully.");
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to process payroll.");
        } finally {
            setProcessing(false);
        }
    };

    const handleMarkAsPaid = async (payrollId) => {
        try {
            await markAsPaid(payrollId);
            alert("Payment marked as Paid.");
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to mark as paid.");
        }
    };

    const handleViewPayslip = async (payrollId) => {
        try {
            setPayslipLoading(true);
            const slip = await getPayslip(payrollId);
            setSelectedPayslip(slip);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to load payslip.");
        } finally {
            setPayslipLoading(false);
        }
    };

    const handleOpenStructure = async (row) => {
        try {
            setStructureLoading(true);
            const struct = await getSalaryStructure(row.employeeId);
            setStructureModal({
                isOpen: true,
                employeeId: row.employeeId,
                employeeName: row.employeeName,
                basic: struct?.basic || 0,
                hra: struct?.hra || 0,
                allowances: struct?.allowances || 0,
                pf: struct?.pf || 0,
                pt: struct?.pt || 0,
                otherDeductions: struct?.otherDeductions || 0
            });
        } catch (err) {
            alert("Failed to load current salary structure.");
        } finally {
            setStructureLoading(false);
        }
    };

    const handleSaveStructure = async (e) => {
        e.preventDefault();
        try {
            await saveSalaryStructure({
                employeeId: structureModal.employeeId,
                basic: Number(structureModal.basic),
                hra: Number(structureModal.hra),
                allowances: Number(structureModal.allowances),
                pf: Number(structureModal.pf),
                pt: Number(structureModal.pt),
                otherDeductions: Number(structureModal.otherDeductions)
            });
            alert("Salary structure updated.");
            setStructureModal({ ...structureModal, isOpen: false });
            await loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save salary structure.");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(amount || 0);
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
                    <span className="fw-medium text-dark">{r.employeeName}</span>
                    <small className="text-muted d-block">{r.departmentName}</small>
                </div>
            )
        },
        {
            key: "grossSalary",
            label: "Gross",
            render: (r) => <span className="font-monospace tabular-nums">{formatCurrency(r.grossSalary)}</span>
        },
        {
            key: "totalDeductions",
            label: "Deductions",
            render: (r) => <span className="font-monospace tabular-nums text-muted">-{formatCurrency(r.totalDeductions)}</span>
        },
        {
            key: "lopDays",
            label: "LOP days",
            render: (r) => r.lopDays > 0 ? <span className="badge badge-warning font-monospace">{r.lopDays} days</span> : <span className="text-muted font-monospace">0</span>
        },
        {
            key: "netSalary",
            label: "Net pay",
            render: (r) => <span className="font-monospace tabular-nums fw-semibold text-dark">{formatCurrency(r.netSalary)}</span>
        },
        {
            key: "paymentStatus",
            label: "Status",
            render: (r) => {
                const isPaid = r.paymentStatus?.toLowerCase() === "paid";
                return <span className={`badge ${isPaid ? "badge-success" : "badge-warning"}`}>{r.paymentStatus || "Processed"}</span>;
            }
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (r) => (
                <div className="d-flex gap-1 justify-content-end">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleViewPayslip(r.payrollId)}
                        title="View payslip"
                    >
                        Slip
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleOpenStructure(r)}
                        title="Edit salary structure"
                    >
                        <i className="bi bi-sliders"></i>
                    </button>
                    {r.paymentStatus?.toLowerCase() !== "paid" && (
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleMarkAsPaid(r.payrollId)}
                            title="Mark as paid"
                        >
                            Mark paid
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h3 className="fw-semibold text-dark mb-1">Payroll register</h3>
                    <p className="text-muted mb-0 small">Compute salaries, generate payslips, and manage compensation</p>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleRunPayroll}
                    disabled={processing}
                >
                    {processing ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Calculating...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-play-fill me-1"></i>Run payroll calculation
                        </>
                    )}
                </button>
            </div>

            {/* Filter Bar */}
            <div className="card border mb-4">
                <div className="card-body p-3">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-3">
                            <label className="form-label small text-muted mb-1">Month</label>
                            <select
                                className="form-select"
                                value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small text-muted mb-1">Year</label>
                            <select
                                className="form-select"
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                            >
                                {[2024, 2025, 2026, 2027].map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
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
                        <div className="col-md-3 d-flex align-items-end pt-3">
                            <button className="btn btn-secondary w-100" onClick={loadData}>
                                <i className="bi bi-arrow-repeat me-1"></i>Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner text="Loading payroll register..." />
            ) : (
                <DataTable
                    columns={columns}
                    data={payrollList}
                    searchPlaceholder="Search payroll by employee name, code..."
                />
            )}

            {/* Payslip View Modal */}
            {selectedPayslip && (
                <>
                    <div className="modal-backdrop fade show" />
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content border shadow-sm">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fs-6 fw-semibold text-dark">
                                        Employee payslip
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setSelectedPayslip(null)}
                                    />
                                </div>
                                <div className="modal-body p-4" id="printable-payslip">
                                    <div className="border-bottom pb-3 mb-3">
                                        <h5 className="fw-semibold text-dark mb-1">Enterprise HRMS</h5>
                                        <p className="text-muted small mb-0">Salary slip for {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}</p>
                                    </div>

                                    <div className="row mb-3 small">
                                        <div className="col-6">
                                            <p className="mb-1"><span className="text-muted">Employee:</span> <span className="fw-medium text-dark">{selectedPayslip.employeeName}</span></p>
                                            <p className="mb-1"><span className="text-muted">Code:</span> <span className="font-monospace">{selectedPayslip.employeeCode}</span></p>
                                            <p className="mb-1"><span className="text-muted">Designation:</span> {selectedPayslip.designationName}</p>
                                        </div>
                                        <div className="col-6 text-end">
                                            <p className="mb-1"><span className="text-muted">Department:</span> {selectedPayslip.departmentName}</p>
                                            <p className="mb-1"><span className="text-muted">LOP days:</span> <span className="font-monospace">{selectedPayslip.lopDays || 0}</span></p>
                                            <p className="mb-1"><span className="text-muted">Status:</span> <span className="badge badge-success ms-1">{selectedPayslip.paymentStatus}</span></p>
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
                                                                <td className="text-muted">Basic pay</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedPayslip.basic)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-muted">HRA</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedPayslip.hra)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-muted">Special allowances</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedPayslip.allowances)}</td>
                                                            </tr>
                                                            <tr className="border-top fw-semibold">
                                                                <td>Gross earnings</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedPayslip.grossSalary)}</td>
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
                                                                <td className="text-end font-monospace">{formatCurrency(selectedPayslip.pf)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-muted">Professional tax (PT)</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedPayslip.pt)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="text-muted">Other deductions / LOP</td>
                                                                <td className="text-end font-monospace">{formatCurrency(selectedPayslip.otherDeductions)}</td>
                                                            </tr>
                                                            <tr className="border-top fw-semibold">
                                                                <td>Total deductions</td>
                                                                <td className="text-end font-monospace text-muted">-{formatCurrency(selectedPayslip.totalDeductions)}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-light rounded border d-flex justify-content-between align-items-center mt-3">
                                        <span className="small text-muted">Net salary payable</span>
                                        <strong className="fs-5 font-monospace text-dark">{formatCurrency(selectedPayslip.netSalary)}</strong>
                                    </div>
                                </div>
                                <div className="modal-footer bg-white border-top">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setSelectedPayslip(null)}
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

            {/* Salary Structure Modal */}
            {structureModal.isOpen && (
                <>
                    <div className="modal-backdrop fade show" />
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border shadow-sm">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fs-6 fw-semibold text-dark">Salary structure</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setStructureModal({ ...structureModal, isOpen: false })}
                                    />
                                </div>
                                <form onSubmit={handleSaveStructure}>
                                    <div className="modal-body p-4">
                                        <p className="small text-muted mb-3">Employee: <strong className="text-dark">{structureModal.employeeName}</strong></p>
                                        <div className="row g-3">
                                            <div className="col-6">
                                                <label className="form-label small text-muted">Basic pay (₹)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={structureModal.basic}
                                                    onChange={(e) => setStructureModal({ ...structureModal, basic: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small text-muted">HRA (₹)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={structureModal.hra}
                                                    onChange={(e) => setStructureModal({ ...structureModal, hra: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small text-muted">Allowances (₹)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={structureModal.allowances}
                                                    onChange={(e) => setStructureModal({ ...structureModal, allowances: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small text-muted">PF deduction (₹)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={structureModal.pf}
                                                    onChange={(e) => setStructureModal({ ...structureModal, pf: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small text-muted">PT (₹)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={structureModal.pt}
                                                    onChange={(e) => setStructureModal({ ...structureModal, pt: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label small text-muted">Other deductions (₹)</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={structureModal.otherDeductions}
                                                    onChange={(e) => setStructureModal({ ...structureModal, otherDeductions: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-white border-top">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setStructureModal({ ...structureModal, isOpen: false })}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-primary btn-sm">
                                            Save structure
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

export default Payroll;
