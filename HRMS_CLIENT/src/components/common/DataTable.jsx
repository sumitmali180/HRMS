import React, { useState, useMemo } from "react";

const DataTable = ({
    columns,
    data = [],
    keyField = "id",
    searchPlaceholder = "Search...",
    actions,
    emptyMessage = "No records found"
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

    // Filter
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;
        const term = searchTerm.toLowerCase();

        return data.filter((item) =>
            columns.some((col) => {
                const val = col.accessor ? col.accessor(item) : item[col.key];
                return val !== null && val !== undefined && String(val).toLowerCase().includes(term);
            })
        );
    }, [data, searchTerm, columns]);

    // Sort
    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredData;

        return [...filteredData].sort((a, b) => {
            const valA = sortColumn.accessor ? sortColumn.accessor(a) : a[sortColumn.key];
            const valB = sortColumn.accessor ? sortColumn.accessor(b) : b[sortColumn.key];

            if (valA === valB) return 0;
            if (valA === null || valA === undefined) return 1;
            if (valB === null || valB === undefined) return -1;

            if (typeof valA === "number" && typeof valB === "number") {
                return sortDirection === "asc" ? valA - valB : valB - valA;
            }

            const strA = String(valA).toLowerCase();
            const strB = String(valB).toLowerCase();
            return sortDirection === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });
    }, [filteredData, sortColumn, sortDirection]);

    // Paginate
    const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

    const handleSort = (col) => {
        if (!col.sortable) return;
        if (sortColumn?.key === col.key) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(col);
            setSortDirection("asc");
        }
    };

    return (
        <div className="card shadow-sm border-0">
            {/* Header with Search and Actions */}
            <div className="card-header bg-white py-3 border-0">
                <div className="row g-2 align-items-center justify-content-between">
                    <div className="col-12 col-md-5 col-lg-4">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control bg-light border-start-0"
                                placeholder={searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                            {searchTerm && (
                                <button
                                    className="btn btn-light border"
                                    type="button"
                                    onClick={() => setSearchTerm("")}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="col-auto d-flex align-items-center gap-2">
                        {actions}
                        <select
                            className="form-select form-select-sm"
                            style={{ width: "auto" }}
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={5}>5 / page</option>
                            <option value={10}>10 / page</option>
                            <option value={25}>25 / page</option>
                            <option value={50}>50 / page</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-secondary small fw-medium">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={col.key || idx}
                                    style={{
                                        cursor: col.sortable ? "pointer" : "default",
                                        width: col.width || "auto"
                                    }}
                                    onClick={() => handleSort(col)}
                                >
                                    <div className="d-flex align-items-center gap-1">
                                        <span>{col.label}</span>
                                        {col.sortable && (
                                            <span className="text-muted small">
                                                {sortColumn?.key === col.key ? (
                                                    sortDirection === "asc" ? (
                                                        <i className="bi bi-arrow-up" style={{ fontSize: "11px" }}></i>
                                                    ) : (
                                                        <i className="bi bi-arrow-down" style={{ fontSize: "11px" }}></i>
                                                    )
                                                ) : (
                                                    <i className="bi bi-chevron-expand text-muted opacity-50" style={{ fontSize: "11px" }}></i>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-5 text-muted">
                                    <div className="d-flex flex-column align-items-center">
                                        <i className="bi bi-inbox fs-4 text-muted mb-2"></i>
                                        <span className="small">{emptyMessage}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item, rowIdx) => (
                                <tr key={item[keyField] || rowIdx}>
                                    {columns.map((col, colIdx) => (
                                        <td key={col.key || colIdx}>
                                            {col.render
                                                ? col.render(item)
                                                : col.accessor
                                                ? col.accessor(item)
                                                : item[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Pagination */}
            <div className="card-footer bg-white border-0 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                <small className="text-muted">
                    Showing{" "}
                    <strong>
                        {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                    </strong>{" "}
                    to{" "}
                    <strong>
                        {Math.min(currentPage * pageSize, sortedData.length)}
                    </strong>{" "}
                    of <strong>{sortedData.length}</strong> entries
                </small>

                <nav aria-label="Table pagination">
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            >
                                Previous
                            </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(
                                (p) =>
                                    p === 1 ||
                                    p === totalPages ||
                                    Math.abs(p - currentPage) <= 1
                            )
                            .map((p, idx, arr) => {
                                const prev = arr[idx - 1];
                                return (
                                    <React.Fragment key={p}>
                                        {prev && p - prev > 1 && (
                                            <li className="page-item disabled">
                                                <span className="page-link">...</span>
                                            </li>
                                        )}
                                        <li className={`page-item ${currentPage === p ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(p)}>
                                                {p}
                                            </button>
                                        </li>
                                    </React.Fragment>
                                );
                            })}

                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default DataTable;
