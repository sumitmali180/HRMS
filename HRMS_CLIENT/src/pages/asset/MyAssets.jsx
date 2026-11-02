import { useState, useEffect } from "react";
import { getMyAssets } from "../../services/assetService";

const MyAssets = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                setLoading(true);
                const data = await getMyAssets();
                setAssets(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h4 className="fw-semibold mb-1 text-dark">Issued hardware</h4>
                <p className="text-secondary small mb-0">Hardware, laptops, and access tokens registered to your name</p>
            </div>

            <div className="card border">
                <div className="card-header bg-white py-3 border-bottom">
                    <h6 className="card-title mb-0 fw-semibold text-dark">Active custody items ({assets.length})</h6>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light text-secondary small fw-medium">
                                <tr>
                                    <th>Tag #</th>
                                    <th>Device name</th>
                                    <th>Category</th>
                                    <th>Brand & model</th>
                                    <th>Serial no.</th>
                                    <th>Allocated date</th>
                                    <th>Handover notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted small">Loading equipment...</td>
                                    </tr>
                                ) : assets.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5 text-muted small">
                                            <i className="bi bi-laptop fs-4 d-block mb-2 text-muted"></i>
                                            No company hardware currently issued to your profile.
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
                                            <td className="tabular-nums small">{new Date(asset.allocatedDate).toLocaleDateString()}</td>
                                            <td className="small text-secondary">{asset.allocationNotes || "Standard issue"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAssets;
