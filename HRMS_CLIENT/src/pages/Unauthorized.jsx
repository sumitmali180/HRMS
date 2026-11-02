import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
            <div className="card p-4 text-center" style={{ maxWidth: "420px", width: "100%" }}>
                <div className="font-monospace text-muted mb-2" style={{ fontSize: "2.5rem", letterSpacing: "-0.05em", fontWeight: 600 }}>
                    403
                </div>
                <h2 className="h5 fw-semibold text-dark mb-2">Access denied</h2>
                <p className="text-muted small mb-4">
                    You do not have permission to access this page. Contact your administrator if you believe this is an error.
                </p>
                <div>
                    <Link to="/dashboard" className="btn btn-secondary btn-sm">
                        Return to dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;