import api from "./api";

export const getAssetCategories = async () => {
    const res = await api.get("Asset/categories");
    return res.data?.data || [];
};

export const getAllAssets = async () => {
    const res = await api.get("Asset");
    return res.data?.data || [];
};

export const getMyAssets = async () => {
    const res = await api.get("Asset/my-assets");
    return res.data?.data || [];
};

export const createAsset = async (data) => {
    const res = await api.post("Asset", data);
    return res.data;
};

export const updateAsset = async (data) => {
    const res = await api.put("Asset", data);
    return res.data;
};

export const allocateAsset = async (data) => {
    const res = await api.post("Asset/allocate", data);
    return res.data;
};

export const returnAsset = async (data) => {
    const res = await api.post("Asset/return", data);
    return res.data;
};

export const deleteAsset = async (assetId) => {
    const res = await api.delete(`Asset/${assetId}`);
    return res.data;
};
