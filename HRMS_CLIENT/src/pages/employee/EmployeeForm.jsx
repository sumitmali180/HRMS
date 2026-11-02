import { useEffect, useState } from "react";
import {
    createEmployee,
    getEmployeeById,
    updateEmployee
} from "../../services/employeeService";
import {
    getBranchLookup,
    getDepartmentLookup,
    getDesignationLookup,
    getManagerLookup,
    getRoleLookup
} from "../../services/lookupService";
import { uploadProfilePhoto } from "../../services/uploadService";

const EmployeeForm = ({ employeeId, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    // Lookups
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [managers, setManagers] = useState([]);
    const [roles, setRoles] = useState([]);

    const [formData, setFormData] = useState({
        employeeCode: "",
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "Male",
        dob: "",
        bloodGroup: "",
        email: "",
        phone: "",
        alternatePhone: "",
        address: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
        branchId: "",
        departmentId: "",
        designationId: "",
        managerId: "",
        roleId: "",
        joiningDate: "",
        confirmationDate: "",
        panNo: "",
        aadharNo: "",
        passportNo: "",
        bankName: "",
        accountNo: "",
        ifsc: "",
        profilePhoto: "",
        status: "Active",
        isActive: true
    });

    const formatDate = (date) => {
        if (!date) return "";
        return date.split("T")[0];
    };

    // Load initial lookups
    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const [bList, desList, mgrList, rList] = await Promise.all([
                    getBranchLookup(),
                    getDesignationLookup(),
                    getManagerLookup(),
                    getRoleLookup()
                ]);
                setBranches(bList || []);
                setDesignations(desList || []);
                setManagers(mgrList || []);
                setRoles(rList || []);
            } catch (err) {
                console.error("Error loading lookups:", err);
            }
        };
        fetchLookups();
    }, []);

    // Cascade: when branchId changes, fetch departments for that branch
    useEffect(() => {
        const fetchDepartments = async () => {
            if (!formData.branchId) {
                setDepartments([]);
                return;
            }
            try {
                const dList = await getDepartmentLookup(formData.branchId);
                setDepartments(dList || []);
            } catch (err) {
                console.error("Error loading departments for branch:", err);
            }
        };
        fetchDepartments();
    }, [formData.branchId]);

    // Load employee if editing
    useEffect(() => {
        if (!employeeId) return;

        const fetchEmployee = async () => {
            try {
                setLoading(true);
                const employee = await getEmployeeById(employeeId);
                if (employee) {
                    setFormData({
                        employeeCode: employee.employeeCode || "",
                        firstName: employee.firstName || "",
                        middleName: employee.middleName || "",
                        lastName: employee.lastName || "",
                        gender: employee.gender || "Male",
                        dob: formatDate(employee.dob),
                        bloodGroup: employee.bloodGroup || "",
                        email: employee.email || "",
                        phone: employee.phone || "",
                        alternatePhone: employee.alternatePhone || "",
                        address: employee.address || "",
                        city: employee.city || "",
                        state: employee.state || "",
                        country: employee.country || "India",
                        pincode: employee.pincode || "",
                        branchId: employee.branchId || "",
                        departmentId: employee.departmentId || "",
                        designationId: employee.designationId || "",
                        managerId: employee.managerId || "",
                        roleId: employee.roleId || "",
                        joiningDate: formatDate(employee.joiningDate),
                        confirmationDate: formatDate(employee.confirmationDate),
                        panNo: employee.panNo || "",
                        aadharNo: employee.aadharNo || "",
                        passportNo: employee.passportNo || "",
                        bankName: employee.bankName || "",
                        accountNo: employee.accountNo || "",
                        ifsc: employee.ifsc || "",
                        profilePhoto: employee.profilePhoto || "",
                        status: employee.status || "Active",
                        isActive: employee.isActive ?? true
                    });

                    // Preload departments for employee's branch
                    if (employee.branchId) {
                        const dList = await getDepartmentLookup(employee.branchId);
                        setDepartments(dList || []);
                    }
                }
            } catch (error) {
                console.error("Employee fetch error:", error);
                alert("Failed to load employee details.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [employeeId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingPhoto(true);
            const res = await uploadProfilePhoto(file);
            if (res.fileUrl) {
                setFormData((prev) => ({ ...prev, profilePhoto: res.fileUrl }));
            }
        } catch (err) {
            console.error("Photo upload failed:", err);
            alert(err.response?.data?.message || "Failed to upload photo.");
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const payload = {
                ...formData,
                branchId: formData.branchId ? Number(formData.branchId) : null,
                departmentId: formData.departmentId ? Number(formData.departmentId) : null,
                designationId: formData.designationId ? Number(formData.designationId) : null,
                managerId: formData.managerId ? Number(formData.managerId) : null,
                roleId: formData.roleId ? Number(formData.roleId) : null
            };

            let response;
            if (employeeId) {
                response = await updateEmployee(employeeId, payload);
            } else {
                response = await createEmployee(payload);
            }

            alert(response.message || `Employee ${employeeId ? "updated" : "created"} successfully.`);
            await onSuccess();
        } catch (error) {
            console.error("Employee save error:", error);
            alert(error.response?.data?.message || "Unable to save employee.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-backdrop fade show" />
            <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content border">
                        <div className="modal-header bg-white py-3 px-4 border-bottom">
                            <h5 className="modal-title fs-6 fw-semibold text-dark">
                                {employeeId ? "Edit employee" : "Add employee"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                disabled={loading}
                            />
                        </div>

                        {/* Tabs Navigation */}
                        <div className="border-bottom bg-light px-3 pt-2">
                            <ul className="nav nav-tabs card-header-tabs">
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className={`nav-link ${activeTab === "personal" ? "active fw-medium text-dark" : "text-secondary"}`}
                                        onClick={() => setActiveTab("personal")}
                                    >
                                        Personal info
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className={`nav-link ${activeTab === "contact" ? "active fw-medium text-dark" : "text-secondary"}`}
                                        onClick={() => setActiveTab("contact")}
                                    >
                                        Contact & address
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className={`nav-link ${activeTab === "job" ? "active fw-medium text-dark" : "text-secondary"}`}
                                        onClick={() => setActiveTab("job")}
                                    >
                                        Job & organization
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        type="button"
                                        className={`nav-link ${activeTab === "statutory" ? "active fw-medium text-dark" : "text-secondary"}`}
                                        onClick={() => setActiveTab("statutory")}
                                    >
                                        Statutory & banking
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1 overflow-hidden">
                            <div className="modal-body overflow-auto p-4" style={{ maxHeight: "68vh" }}>
                                {loading && employeeId ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" />
                                        <p className="mt-2 text-muted">Loading employee details...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* TAB 1: PERSONAL INFO */}
                                        {activeTab === "personal" && (
                                            <div className="row g-3">
                                                <div className="col-12 d-flex align-items-center mb-2">
                                                    <div className="me-3 position-relative">
                                                        {formData.profilePhoto ? (
                                                            <img
                                                                src={formData.profilePhoto}
                                                                alt="Profile"
                                                                className="rounded-circle border"
                                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            <div
                                                                className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-muted"
                                                                style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                                                            >
                                                                <i className="bi bi-person"></i>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="form-label fw-bold mb-1">Profile Photo</label>
                                                        <input
                                                            type="file"
                                                            className="form-control form-control-sm"
                                                            accept="image/*"
                                                            onChange={handlePhotoUpload}
                                                            disabled={uploadingPhoto}
                                                        />
                                                        {uploadingPhoto && <small className="text-primary">Uploading photo...</small>}
                                                        <small className="text-muted d-block">JPG, PNG or WEBP up to 2MB</small>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">Employee Code <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="employeeCode"
                                                        value={formData.employeeCode}
                                                        onChange={handleChange}
                                                        placeholder="EMP001"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">First Name <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">Middle Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="middleName"
                                                        value={formData.middleName}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">Last Name <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">Gender <span className="text-danger">*</span></label>
                                                    <select
                                                        className="form-select"
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">Date of Birth</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="dob"
                                                        value={formData.dob}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">Blood Group</label>
                                                    <select
                                                        className="form-select"
                                                        name="bloodGroup"
                                                        value={formData.bloodGroup}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">Select Blood Group</option>
                                                        <option value="A+">A+</option>
                                                        <option value="A-">A-</option>
                                                        <option value="B+">B+</option>
                                                        <option value="B-">B-</option>
                                                        <option value="AB+">AB+</option>
                                                        <option value="AB-">AB-</option>
                                                        <option value="O+">O+</option>
                                                        <option value="O-">O-</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB 2: CONTACT & ADDRESS */}
                                        {activeTab === "contact" && (
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="john.doe@example.com"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Phone <span className="text-danger">*</span></label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="9876543210"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Alternate Phone</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        name="alternatePhone"
                                                        value={formData.alternatePhone}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Address Line</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                        placeholder="Street, Landmark"
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="form-label fw-semibold">City</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="form-label fw-semibold">State</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="form-label fw-semibold">Country</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="form-label fw-semibold">Pincode</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="pincode"
                                                        value={formData.pincode}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB 3: JOB & ORGANIZATION */}
                                        {activeTab === "job" && (
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Branch <span className="text-danger">*</span></label>
                                                    <select
                                                        className="form-select"
                                                        name="branchId"
                                                        value={formData.branchId}
                                                        onChange={(e) => {
                                                            handleChange(e);
                                                            // Clear department when branch changes
                                                            setFormData((prev) => ({ ...prev, departmentId: "" }));
                                                        }}
                                                        required
                                                    >
                                                        <option value="">Select Branch</option>
                                                        {branches.map((b) => (
                                                            <option key={b.id || b.branchId} value={b.id || b.branchId}>
                                                                {b.name || b.branchName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Department <span className="text-danger">*</span></label>
                                                    <select
                                                        className="form-select"
                                                        name="departmentId"
                                                        value={formData.departmentId}
                                                        onChange={handleChange}
                                                        required
                                                        disabled={!formData.branchId}
                                                    >
                                                        <option value="">
                                                            {!formData.branchId ? "Select a Branch first" : "Select Department"}
                                                        </option>
                                                        {departments.map((d) => (
                                                            <option key={d.id || d.departmentId} value={d.id || d.departmentId}>
                                                                {d.name || d.departmentName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Designation <span className="text-danger">*</span></label>
                                                    <select
                                                        className="form-select"
                                                        name="designationId"
                                                        value={formData.designationId}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">Select Designation</option>
                                                        {designations.map((des) => (
                                                            <option key={des.id || des.designationId} value={des.id || des.designationId}>
                                                                {des.name || des.designationName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Reporting Manager</label>
                                                    <select
                                                        className="form-select"
                                                        name="managerId"
                                                        value={formData.managerId}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="">None (Top Level / Self)</option>
                                                        {managers
                                                            .filter((m) => !employeeId || (m.id || m.employeeId) !== Number(employeeId))
                                                            .map((m) => (
                                                                <option key={m.id || m.employeeId} value={m.id || m.employeeId}>
                                                                    {m.name || m.fullName} ({m.employeeCode || "Mgr"})
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">System Role <span className="text-danger">*</span></label>
                                                    <select
                                                        className="form-select"
                                                        name="roleId"
                                                        value={formData.roleId}
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">Select Role</option>
                                                        {roles.map((r) => (
                                                            <option key={r.id || r.roleId} value={r.id || r.roleId}>
                                                                {r.name || r.roleName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Status</label>
                                                    <select
                                                        className="form-select"
                                                        name="status"
                                                        value={formData.status}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="Active">Active</option>
                                                        <option value="Probation">Probation</option>
                                                        <option value="Notice Period">Notice Period</option>
                                                        <option value="Terminated">Terminated</option>
                                                        <option value="Resigned">Resigned</option>
                                                    </select>
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Date of Joining</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="joiningDate"
                                                        value={formData.joiningDate}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">Confirmation Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="confirmationDate"
                                                        value={formData.confirmationDate}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* TAB 4: STATUTORY & BANKING */}
                                        {activeTab === "statutory" && (
                                            <div className="row g-3">
                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">PAN Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="panNo"
                                                        value={formData.panNo}
                                                        onChange={handleChange}
                                                        placeholder="ABCDE1234F"
                                                        maxLength={10}
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">Aadhar Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="aadharNo"
                                                        value={formData.aadharNo}
                                                        onChange={handleChange}
                                                        placeholder="1234 5678 9012"
                                                        maxLength={14}
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">Passport Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="passportNo"
                                                        value={formData.passportNo}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">Bank Name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="bankName"
                                                        value={formData.bankName}
                                                        onChange={handleChange}
                                                        placeholder="e.g. HDFC Bank"
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">Account Number</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="accountNo"
                                                        value={formData.accountNo}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="col-md-4">
                                                    <label className="form-label fw-semibold">IFSC Code</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="ifsc"
                                                        value={formData.ifsc}
                                                        onChange={handleChange}
                                                        placeholder="HDFC0001234"
                                                    />
                                                </div>

                                                <div className="col-12 mt-3">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="isActiveCheck"
                                                            name="isActive"
                                                            checked={formData.isActive}
                                                            onChange={handleChange}
                                                        />
                                                        <label className="form-check-label fw-semibold" htmlFor="isActiveCheck">
                                                            Active Employee Account
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="modal-footer bg-light flex-shrink-0">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Saving...
                                        </>
                                    ) : employeeId ? (
                                        "Update Employee"
                                    ) : (
                                        "Create Employee"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeForm;