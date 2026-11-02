import api from "./api";

export const uploadProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("Upload/ProfilePhoto", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

export const uploadCompanyLogo = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("Upload/CompanyLogo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};
