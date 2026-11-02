const Footer = () => {
    return (
        <footer className="border-top py-2 px-4" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-hairline)" }}>
            <div className="container-fluid d-flex justify-content-between align-items-center p-0">
                <span className="small text-secondary" style={{ fontSize: "12px" }}>
                    HRMS Enterprise System
                </span>
                <span className="small text-secondary" style={{ fontSize: "12px" }}>
                    © {new Date().getFullYear()} All rights reserved.
                </span>
            </div>
        </footer>
    );
};

export default Footer;