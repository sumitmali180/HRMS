import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        if (this.props.onReset) {
            this.props.onReset();
        } else {
            window.location.reload();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="container-fluid d-flex justify-content-center align-items-center py-5"
                    style={{ minHeight: "65vh" }}
                >
                    <div
                        className="card border-0 shadow-lg p-4 text-center"
                        style={{
                            maxWidth: "520px",
                            width: "100%",
                            background: "var(--bs-dark, #161b22)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            borderRadius: "12px",
                            color: "#f0f6fc"
                        }}
                    >
                        <div className="mb-3">
                            <i
                                className="bi bi-exclamation-triangle-fill text-warning"
                                style={{ fontSize: "2.8rem" }}
                            />
                        </div>
                        <h2 className="h5 fw-bold text-light mb-2">Something went wrong</h2>
                        <p className="text-secondary small mb-3">
                            An unexpected runtime error occurred while rendering this module. You can try refreshing the view or returning to the dashboard.
                        </p>

                        {this.state.error?.message && (
                            <div
                                className="text-start p-2 mb-3 rounded font-monospace small"
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.35)",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    color: "#f85149",
                                    fontSize: "0.8rem",
                                    wordBreak: "break-word",
                                    maxHeight: "120px",
                                    overflowY: "auto"
                                }}
                            >
                                {this.state.error.message}
                            </div>
                        )}

                        <div className="d-flex gap-2 justify-content-center">
                            <button
                                type="button"
                                className="btn btn-outline-light btn-sm px-3"
                                onClick={this.handleReset}
                            >
                                <i className="bi bi-arrow-clockwise me-1" />
                                Reload View
                            </button>
                            <a
                                href="/dashboard"
                                className="btn btn-primary btn-sm px-3"
                            >
                                <i className="bi bi-speedometer2 me-1" />
                                Go to Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
