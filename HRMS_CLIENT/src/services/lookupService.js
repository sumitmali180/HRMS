import api from "./api";

export const getCompanyLookup = async () => {
    const res = await api.get("Company/lookup");
    return res.data?.data || [];
};

export const getBranchLookup = async (companyId = null) => {
    const url = companyId ? `Branch/lookup?companyId=${companyId}` : "Branch/lookup";
    const res = await api.get(url);
    return res.data?.data || [];
};

export const getDepartmentLookup = async (branchId = null) => {
    const url = branchId ? `Department/lookup?branchId=${branchId}` : "Department/lookup";
    const res = await api.get(url);
    return res.data?.data || [];
};

export const getDesignationLookup = async () => {
    const res = await api.get("Designation/lookup");
    return res.data?.data || [];
};

export const getManagerLookup = async () => {
    const res = await api.get("Employee/managers-lookup");
    return res.data?.data || [];
};

export const getRoleLookup = async () => {
    const res = await api.get("Employee/roles-lookup");
    return res.data?.data || [];
};
