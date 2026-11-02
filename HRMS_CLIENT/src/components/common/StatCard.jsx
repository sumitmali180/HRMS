import React from "react";

const StatCard = ({
    title,
    value,
    trend,
    trendText,
    subtitle
}) => {
    return (
        <div className="card h-100 p-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small text-muted fw-medium" style={{ fontSize: "12px" }}>
                    {title}
                </span>
                {trend && (
                    <span className={`badge ${trend > 0 ? "badge-success" : "badge-danger"}`}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </span>
                )}
            </div>

            <div className="fs-3 fw-semibold text-dark my-1 tabular-nums">
                {value}
            </div>

            {(subtitle || trendText) && (
                <div className="small text-muted" style={{ fontSize: "11px" }}>
                    {trendText && <span className="text-secondary fw-medium me-1">{trendText}</span>}
                    {subtitle}
                </div>
            )}
        </div>
    );
};

export default StatCard;
