import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";


const Login = () => {
    const navigate = useNavigate();

    const { login } = useAuth();


    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (!email.trim()) {

            setError(
                "Please enter email."
            );

            return;
        }


        if (!password.trim()) {

            setError(
                "Please enter password."
            );

            return;
        }


        setLoading(true);


        const result =
            await login(
                email,
                password
            );


        setLoading(false);


        if (result.success) {

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );

        } else {

            setError(
                result.message
            );
        }
    };


    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center py-5 px-3" style={{ backgroundColor: "var(--bg-page)" }}>
            <div className="card border shadow-sm w-100" style={{ maxWidth: "420px" }}>
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <div
                            className="rounded-3 bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold mb-3 font-monospace"
                            style={{ width: "40px", height: "40px", fontSize: "16px" }}
                        >
                            H
                        </div>
                        <h4 className="fw-semibold text-white mb-1">Sign in to HRMS</h4>
                        <p className="text-secondary small mb-0">Human resources and workforce management</p>
                    </div>

                    {error && (
                        <div className="p-3 mb-3 bg-danger-subtle text-danger border border-danger-subtle rounded small">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small text-secondary">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label small text-secondary">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>
                </div>
                <div className="card-footer border-top py-3 text-center">
                    <small className="text-muted">Enterprise Workforce Portal &bull; Antigravity HRMS</small>
                </div>
            </div>
        </div>
    );
};

export default Login;