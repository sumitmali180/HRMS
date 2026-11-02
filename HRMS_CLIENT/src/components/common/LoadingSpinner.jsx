import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = ({ text = "Loading data...", fullPage = false }) => {
    const content = (
        <div className="d-flex flex-column align-items-center justify-content-center p-4">
            <Spinner animation="border" variant="secondary" size="sm" style={{ width: "1.75rem", height: "1.75rem", borderWidth: "2px" }} />
            {text && <p className="mt-2 text-muted small">{text}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
                {content}
            </div>
        );
    }

    return content;
};

export default LoadingSpinner;
