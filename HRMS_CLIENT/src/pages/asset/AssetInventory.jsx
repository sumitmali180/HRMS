import { useState, useEffect } from "react";
import { getAllAssets, getAssetCategories, createAsset, allocateAsset, returnAsset } from "../../services/assetService";
import { getEmployees } from "../../services/employeeService";

const AssetInventory = () => {
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    // Form states
    const [newAsset, setNewAsset] = useState({
        assetCategoryId: "",
        assetTag: "",
        AssetName: "",
        serialNumber: "",
        manufacturer: "",
        model: "",
        status: "Available",
        condition: "New"
    });

    const [allocateData, setAllocateData] = useState({
        assetId: "",
        employeeId: "",
        allocationNotes: ""
    });

    const [returnData, setReturnData] = useState({
        assetId: "",
        condition: "Good",
        returnNotes: ""
    });

    const loadData = async () => {
        try {
            setLoading(true);
            const [assetList, catList, empList] = await Promise.all([
                getAllAssets(),
                getAssetCategories(),
                getEmployees()
            ]);
            setAssets(assetList);
            setCategories(catList);
            setEmployees(empList);
            if (catList.length > 0 && !newAsset.assetCategoryId) {
                setNewAsset(prev => ({ ...prev, assetCategoryId: catList[0].assetCategoryId }));
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

    const handleCreateAsset = async (e) => {
        e.preventDefault();
        try {
            const res = await createAsset({
                ...newAsset,
                assetCategoryId: parseInt(newAsset.assetCategoryId)
            });
            if (res.success) {
                setAlert({ type: "success", text: "Asset registered successfully in inventory." });
                setNewAsset({
                    assetCategoryId: categories[0]?.assetCategoryId || "",
                    assetTag: "",
                    AssetName: "",
                    serialNumber: "",
                    manufacturer: "",
                    model: "",
                    status: "Available",
                    condition: "New"
                });
                loadData();
                closeModal("addAssetModal");
            } else {
                setAlert({ type: "danger", text: res.message || "Failed to create asset." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error saving asset." });
        }
    };

    const handleAllocate = async (e) => {
        e.preventDefault();
        try {
            const res = await allocateAsset({
                assetId: parseInt(allocateData.assetId),
                employeeId: parseInt(allocateData.employeeId),
                allocationNotes: allocateData.allocationNotes
            });
            if (res.success) {
                setAlert({ type: "success", text: "Asset allocated to employee successfully." });
                loadData();
                closeModal("allocateModal");
            } else {
                setAlert({ type: "danger", text: res.message || "Allocation failed." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error allocating asset." });
        }
    };

    const handleReturn = async (e) => {
        e.preventDefault();
        try {
            const res = await returnAsset({
                assetId: parseInt(returnData.assetId),
                condition: returnData.condition,
                returnNotes: returnData.returnNotes
            });
            if (res.success) {
                setAlert({ type: "success", text: "Asset returned and marked available." });
                loadData();
                closeModal("returnModal");
            } else {
                setAlert({ type: "danger", text: res.message || "Return failed." });
            }
        } catch (err) {
            setAlert({ type: "danger", text: "Error returning asset." });
        }
    };

    const openAllocateModal = (asset) => {
        setAllocateData({
            assetId: asset.assetId,
            employeeId: employees[0]?.employeeId || "",
            allocationNotes: ""
        });
        openModal("allocateModal");
    };

    const openReturnModal = (asset) => {
        setReturnData({
            assetId: asset.assetId,
            condition: "Good",
            returnNotes: ""
        });
        openModal("returnModal");
    };

    const openModal = (id) => {
        const el = document.getElementById(id);
        if (el && window.bootstrap) {
            new window.bootstrap.Modal(el).show();
        }
    };

    const closeModal = (id) => {
        const el = document.getElementById(id);
        const modal = window.bootstrap?.Modal.getInstance(el);
        modal?.hide();
    };

    const totalAssets = assets.length;
    const allocatedCount = assets.filter(a => a.status === "Allocated").length;
    const availableCount = assets.filter(a => a.status === "Available").length;

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold mb-1 text-dark">Hardware inventory</h4>
                    <p className="text-secondary small mb-0">Track company devices, IT peripherals, and employee allocations</p>
                </div>
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={() => openModal("addAssetModal")}>
                    <i className="bi bi-plus"></i> Add hardware
                </button>
            </div>

            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show py-2 small`} role="alert">
                    {alert.text}
                    <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
            )}

            {/* KPI Cards */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card metric-card">
                        <div className="card-body p-3">
                            <div className="metric-label">Total inventory</div>
                            <div className="metric-value tabular-nums mt-1">{totalAssets}</div>
                            <div className="metric-subtext mt-1">Hardware in registry</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card metric-card">
                        <div className="card-body p-3">
                            <div className="metric-label">Currently allocated</div>
                            <div className="metric-value tabular-nums mt-1">{allocatedCount}</div>
                            <div className="metric-subtext mt-1">Issued to staff members</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card metric-card">
                        <div className="card-body p-3">
                            <div className="metric-label">Available for issue</div>
                            <div className="metric-value tabular-nums mt-1">{availableCount}</div>
                            <div className="metric-subtext mt-1">In stock for assignment</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="card-title mb-0 fw-semibold text-dark">Device master list</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small fw-medium">
                                <tr>
                                    <th>Asset tag</th>
                                    <th>Device name</th>
                                    <th>Category</th>
                                    <th>Brand & model</th>
                                    <th>Serial no.</th>
                                    <th>Status</th>
                                    <th>Assigned to</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4 text-muted small">Loading assets...</td>
                                    </tr>
                                ) : assets.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-5 text-muted small">
                                            No assets found in master inventory.
                                        </td>
                                    </tr>
                                ) : (
                                    assets.map(asset => (
                                        <tr key={asset.assetId}>
                                            <td className="fw-medium font-monospace small">{asset.assetTag}</td>
                                            <td className="fw-medium text-dark small">{asset.assetName}</td>
                                            <td>
                                                <span className="badge badge-neutral">
                                                    {asset.categoryName}
                                                </span>
                                            </td>
                                            <td className="small">{asset.manufacturer || "—"} {asset.model || ""}</td>
                                            <td><code className="text-muted small">{asset.serialNumber || "—"}</code></td>
                                            <td>
                                                <span className={`badge ${
                                                    asset.status === "Available" ? "badge-success" :
                                                    asset.status === "Allocated" ? "badge-neutral" : "badge-danger"
                                                }`}>
                                                    {asset.status}
                                                </span>
                                            </td>
                                            <td className="small">
                                                {asset.assignedEmployeeName ? (
                                                    <div>
                                                        <div className="fw-medium text-dark">{asset.assignedEmployeeName}</div>
                                                        <div className="text-muted small font-monospace">{asset.assignedEmployeeCode}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                {asset.status === "Available" ? (
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => openAllocateModal(asset)}
                                                    >
                                                        Allocate
                                                    </button>
                                                ) : asset.status === "Allocated" ? (
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        onClick={() => openReturnModal(asset)}
                                                    >
                                                        Return
                                                    </button>
                                                ) : (
                                                    <span className="text-muted small">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal: Add Asset */}
            <div className="modal fade" id="addAssetModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleCreateAsset}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Register Hardware Asset</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Asset Category</label>
                                    <select
                                        className="form-select"
                                        value={newAsset.assetCategoryId}
                                        onChange={e => setNewAsset({ ...newAsset, assetCategoryId: e.target.value })}
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.assetCategoryId} value={cat.assetCategoryId}>
                                                {cat.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Asset Tag #</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. LAP-2026-001"
                                            value={newAsset.assetTag}
                                            onChange={e => setNewAsset({ ...newAsset, assetTag: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Device Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="MacBook Pro 16"
                                            value={newAsset.assetName}
                                            onChange={e => setNewAsset({ ...newAsset, assetName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Manufacturer</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Apple / Dell / Lenovo"
                                            value={newAsset.manufacturer}
                                            onChange={e => setNewAsset({ ...newAsset, manufacturer: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label fw-semibold">Model</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="M3 Max / XPS 15"
                                            value={newAsset.model}
                                            onChange={e => setNewAsset({ ...newAsset, model: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Hardware Serial Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="C02G..."
                                        value={newAsset.serialNumber}
                                        onChange={e => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save to Inventory</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal: Allocate */}
            <div className="modal fade" id="allocateModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleAllocate}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Allocate Asset to Employee</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Select Employee</label>
                                    <select
                                        className="form-select"
                                        value={allocateData.employeeId}
                                        onChange={e => setAllocateData({ ...allocateData, employeeId: e.target.value })}
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
                                    <label className="form-label fw-semibold">Allocation Notes / Handover Acknowledgment</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="e.g. Issued with charger, laptop bag, and HDMI adapter..."
                                        value={allocateData.allocationNotes}
                                        onChange={e => setAllocateData({ ...allocateData, allocationNotes: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Confirm Allocation</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal: Return */}
            <div className="modal fade" id="returnModal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleReturn}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold">Process Asset Return</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Device Condition on Return</label>
                                    <select
                                        className="form-select"
                                        value={returnData.condition}
                                        onChange={e => setReturnData({ ...returnData, condition: e.target.value })}
                                    >
                                        <option value="Good">Good / Undamaged</option>
                                        <option value="Fair">Fair / Minor Wear</option>
                                        <option value="Damaged">Damaged / Needs Repair</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Return Clearance Notes</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Checked screen, charger returned, data wipe initiated..."
                                        value={returnData.returnNotes}
                                        onChange={e => setReturnData({ ...returnData, returnNotes: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-warning">Complete Return</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetInventory;
