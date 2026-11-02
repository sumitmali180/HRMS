import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { getEmployeeById, updateEmployee } from "../../services/employeeService";
import { uploadProfilePhoto } from "../../services/uploadService";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [saving, setSaving] = useState(false);

    const loadProfile = async () => {
        if (!user?.employeeId) return;
        try {
            setLoading(true);
            const data = await getEmployeeById(user.employeeId);
            setProfile(data);
            setEditFormData(data || {});
        } catch (err) {
            console.error("Failed to load profile:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, [user?.employeeId]);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const res = await uploadProfilePhoto(file);
            if (res.fileUrl && profile) {
                // Update employee with new photo
                const updated = { ...profile, profilePhoto: res.fileUrl };
                await updateEmployee(profile.employeeId, updated);
                setProfile(updated);
                alert("Profile photo updated successfully!");
            }
        } catch (err) {
            console.error("Photo upload error:", err);
            alert(err.response?.data?.message || "Failed to upload photo.");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveContactInfo = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateEmployee(profile.employeeId, editFormData);
            alert("Contact profile information updated!");
            setShowEditModal(false);
            await loadProfile();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Loading user profile..." />;
    }

    if (!profile) {
        return (
            <div className="container-fluid py-4 text-center">
                <div className="alert alert-warning">Profile data unavailable.</div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-2">
            {/* Profile Header Card */}
            <div className="card border mb-4 bg-white overflow-hidden">
                <div style={{ height: "80px", background: "#f1f5f9", borderBottom: "1px solid rgba(15,23,42,0.08)" }} />
                <div className="card-body px-4 pb-4 pt-0">
                    <div className="d-flex justify-content-between align-items-end flex-wrap gap-3" style={{ marginTop: "-40px" }}>
                        <div className="d-flex align-items-end gap-3">
                            <div className="position-relative">
                                {profile.profilePhoto ? (
                                    <img
                                        src={profile.profilePhoto}
                                        alt={profile.fullName}
                                        className="rounded-circle border border-2 border-white shadow-sm"
                                        style={{ width: "96px", height: "96px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-light border border-2 border-white shadow-sm text-secondary d-flex align-items-center justify-content-center fw-semibold fs-3"
                                        style={{ width: "96px", height: "96px" }}
                                    >
                                        {profile.firstName?.[0]}{profile.lastName?.[0]}
                                    </div>
                                )}
                                <label
                                    htmlFor="profile-upload"
                                    className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-1 shadow-sm cursor-pointer"
                                    style={{ width: "28px", height: "28px", textAlign: "center", cursor: "pointer", fontSize: "12px", lineHeight: "20px" }}
                                    title="Change photo"
                                >
                                    <i className="bi bi-camera"></i>
                                </label>
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    className="d-none"
                                    onChange={handlePhotoChange}
                                    disabled={uploading}
                                />
                            </div>
                            <div className="mb-2">
                                <h3 className="fw-semibold text-dark mb-0">{profile.fullName}</h3>
                                <p className="text-muted small mb-0">
                                    {profile.designationName} &bull; <span>{profile.departmentName}</span>
                                </p>
                                <small className="text-secondary">{profile.branchName}</small>
                            </div>
                        </div>

                        <div className="mb-2 d-flex gap-2">
                            <button className="btn btn-secondary btn-sm" onClick={() => setShowEditModal(true)}>
                                <i className="bi bi-pencil me-1"></i>Edit contact info
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Information Sections */}
            <div className="row g-4">
                {/* Personal Information */}
                <div className="col-lg-6">
                    <div className="card border h-100">
                        <div className="card-header bg-white py-3 border-bottom">
                            <span className="fw-semibold text-dark">Personal information</span>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-6">
                                    <small className="text-muted d-block">Employee code</small>
                                    <span className="text-dark font-monospace fw-medium">{profile.employeeCode}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Gender</small>
                                    <span className="text-dark">{profile.gender || "--"}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Date of birth</small>
                                    <span className="text-dark">
                                        {profile.dob ? new Date(profile.dob).toLocaleDateString() : "--"}
                                    </span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Blood group</small>
                                    <span className="text-dark">{profile.bloodGroup || "--"}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Email address</small>
                                    <span className="text-dark">{profile.email}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Mobile phone</small>
                                    <span className="text-dark font-monospace">{profile.phone}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Alternate phone</small>
                                    <span className="text-dark font-monospace">{profile.alternatePhone || "--"}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Status</small>
                                    <span className="badge badge-success">{profile.status}</span>
                                </div>
                                <div className="col-12">
                                    <small className="text-muted d-block">Residential address</small>
                                    <span className="text-dark">
                                        {[profile.address, profile.city, profile.state, profile.country, profile.pincode].filter(Boolean).join(", ") || "--"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organization & Statutory */}
                <div className="col-lg-6">
                    <div className="card border h-100">
                        <div className="card-header bg-white py-3 border-bottom">
                            <span className="fw-semibold text-dark">Employment & statutory</span>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-6">
                                    <small className="text-muted d-block">Date of joining</small>
                                    <span className="text-dark">
                                        {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "--"}
                                    </span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Confirmation date</small>
                                    <span className="text-dark">
                                        {profile.confirmationDate ? new Date(profile.confirmationDate).toLocaleDateString() : "--"}
                                    </span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Reporting manager</small>
                                    <span className="text-dark">{profile.managerName || "Direct / Leadership"}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Role access</small>
                                    <span className="badge badge-neutral">{profile.roleName || user?.role}</span>
                                </div>
                                <div className="col-12"><hr className="my-1 border-secondary border-opacity-10" /></div>
                                <div className="col-6">
                                    <small className="text-muted d-block">PAN card</small>
                                    <span className="text-dark font-monospace">{profile.panNo || "Not provided"}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Aadhar card</small>
                                    <span className="text-dark font-monospace">{profile.aadharNo || "Not provided"}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Bank name</small>
                                    <span className="text-dark">{profile.bankName || "--"}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Bank account no.</small>
                                    <span className="text-dark font-monospace">{profile.accountNo || "--"}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">IFSC code</small>
                                    <span className="text-dark font-monospace">{profile.ifsc || "--"}</span>
                                </div>
                                <div className="col-6">
                                    <small className="text-muted d-block">Passport number</small>
                                    <span className="text-dark font-monospace">{profile.passportNo || "--"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Contact Modal */}
            {showEditModal && (
                <>
                    <div className="modal-backdrop fade show" />
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border shadow-sm">
                                <div className="modal-header bg-white border-bottom">
                                    <h5 className="modal-title fs-6 fw-semibold text-dark">Edit contact & address</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowEditModal(false)}
                                    />
                                </div>
                                <form onSubmit={handleSaveContactInfo}>
                                    <div className="modal-body p-4">
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Phone</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                value={editFormData.phone || ""}
                                                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Alternate phone</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                value={editFormData.alternatePhone || ""}
                                                onChange={(e) => setEditFormData({ ...editFormData, alternatePhone: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small text-muted">Address line</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editFormData.address || ""}
                                                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="row g-2">
                                            <div className="col-6 mb-3">
                                                <label className="form-label small text-muted">City</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editFormData.city || ""}
                                                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-6 mb-3">
                                                <label className="form-label small text-muted">Pincode</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editFormData.pincode || ""}
                                                    onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer bg-white border-top">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => setShowEditModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm"
                                            disabled={saving}
                                        >
                                            {saving ? "Saving..." : "Save changes"}
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

export default Profile;
