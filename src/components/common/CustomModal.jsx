import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import './CustomModal.css';

const CustomModal = ({
  show,
  onHide,
  title,
  children,
  size = "default", // "sm", "default", "lg", "xl"
  centered = true,
  backdrop = true,
  keyboard = true,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  showCloseButton = true,
  closeButtonVariant = "outline-secondary",
  primaryAction,
  secondaryAction,
  footerContent,
  scrollable = false,
  fullscreen = false,
  animation = true
}) => {
  const getModalSize = () => {
    if (fullscreen) return undefined;
    switch (size) {
      case "sm":
        return "sm";
      case "lg":
        return "lg";
      case "xl":
        return "xl";
      default:
        return undefined;
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={getModalSize()}
      centered={centered}
      backdrop={backdrop}
      keyboard={keyboard}
      className={`custom-modal ${className}`}
      scrollable={scrollable}
      fullscreen={fullscreen}
      animation={animation}
    >
      {title && (
        <Modal.Header 
          className={`custom-modal-header ${headerClassName}`}
          closeButton={false}
        >
          <Modal.Title className="custom-modal-title">
            {title}
          </Modal.Title>
          {showCloseButton && (
            <Button
              variant="link"
              className="custom-close-btn"
              onClick={onHide}
              aria-label="Close"
            >
              <FaTimes />
            </Button>
          )}
        </Modal.Header>
      )}

      <Modal.Body className={`custom-modal-body ${bodyClassName}`}>
        {children}
      </Modal.Body>

      {(primaryAction || secondaryAction || footerContent) && (
        <Modal.Footer className={`custom-modal-footer ${footerClassName}`}>
          {footerContent}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "outline-secondary"}
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
              className={secondaryAction.className}
            >
              {secondaryAction.text}
            </Button>
          )}
          {primaryAction && (
            <Button
              variant={primaryAction.variant || "primary"}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className={primaryAction.className}
            >
              {primaryAction.text}
            </Button>
          )}
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CustomModal;
