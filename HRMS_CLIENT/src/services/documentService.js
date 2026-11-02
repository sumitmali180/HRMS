import api from "./api";

export const getDocumentTemplates = async () => {
    const res = await api.get("Document/templates");
    return res.data?.data || [];
};

export const saveDocumentTemplate = async (data) => {
    const res = await api.post("Document/templates", data);
    return res.data;
};

export const generateLetter = async (data) => {
    const res = await api.post("Document/generate-letter", data);
    return res.data?.data?.content || "";
};

export const getMyDocuments = async () => {
    const res = await api.get("Document/my-documents");
    return res.data?.data || [];
};

export const getEmployeeDocuments = async (employeeId) => {
    const res = await api.get(`Document/employee/${employeeId}`);
    return res.data?.data || [];
};

export const uploadDocumentRecord = async (data) => {
    const res = await api.post("Document/upload", data);
    return res.data;
};

export const getAuditLogs = async () => {
    const res = await api.get("Document/audit-logs");
    return res.data?.data || [];
};

export const logAuditEvent = async (data) => {
    const res = await api.post("Document/audit-log", data);
    return res.data;
};
