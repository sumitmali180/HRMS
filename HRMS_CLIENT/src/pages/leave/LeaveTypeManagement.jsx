import { useState, useEffect } from "react";
import { getLeaveTypes } from "../../services/leaveService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import DataTable from "../../components/common/DataTable";

const LeaveTypeManagement = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTypes = async () => {
        try {
            setLoading(true);
            const data = await getLeaveTypes();
            setLeaveTypes(data || []);
        } catch (err) {
            console.error("Failed to load leave types:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTypes();
    }, []);

    const columns = [
        {
            key: "leaveTypeCode",
            label: "Code",
            render: (r) => <span className="badge badge-neutral font-monospace">{r.leaveTypeCode}</span>
        },
        {
            key: "leaveTypeName",
            label: "Leave type",
            render: (r) => <span className="fw-medium text-dark">{r.leaveTypeName}</span>
        },
        {
            key: "daysAllowed",
            label: "Days allowed (annual)",
            render: (r) => <span className="font-monospace tabular-nums">{r.daysAllowed} days</span>
        },
        {
            key: "isPaid",
            label: "Compensation",
            render: (r) => (
                <span className={`badge ${r.isPaid ? "badge-success" : "badge-neutral"}`}>
                    {r.isPaid ? "Paid" : "Unpaid / LOP"}
                </span>
            )
        },
        {
            key: "description",
            label: "Description",
            render: (r) => <span className="text-muted small">{r.description || "--"}</span>
        }
    ];

    if (loading) {
        return <LoadingSpinner text="Loading leave types..." />;
    }

    return (
        <div className="container-fluid py-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-semibold text-dark mb-1">Leave policies</h3>
                    <p className="text-muted mb-0 small">Company leave categories, annual allowances, and pay rules</p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={leaveTypes}
                searchPlaceholder="Search leave policies..."
            />
        </div>
    );
};

export default LeaveTypeManagement;
