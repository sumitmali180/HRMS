import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const ConfirmModal = ({
    show,
    isOpen,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Delete",
    confirmVariant = "danger",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
    isLoading = false
}) => {
    const isVisible = show !== undefined ? show : isOpen;
    const isBusy = loading || isLoading;

    return (
        <Modal show={isVisible} onHide={onCancel} centered backdrop="static">
            <Modal.Header closeButton={!isBusy} className="py-2 px-3 border-bottom">
                <Modal.Title className="fs-6 fw-semibold text-dark">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-3 px-3">
                <p className="mb-0 text-secondary small">{message}</p>
            </Modal.Body>
            <Modal.Footer className="py-2 px-3 border-top">
                <Button variant="outline-secondary" size="sm" onClick={onCancel} disabled={loading}>
                    {cancelText}
                </Button>
                <Button variant={confirmVariant} size="sm" onClick={onConfirm} disabled={loading}>
                    {loading && (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-1"
                        />
                    )}
                    {confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;
