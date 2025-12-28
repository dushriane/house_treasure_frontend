import React from 'react';
import { Alert } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const AlertMessage = ({ 
  variant = 'info', 
  message, 
  onClose, 
  dismissible = true,
  className = ''
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <FaCheckCircle className="me-2" />;
      case 'danger':
      case 'error':
        return <FaExclamationTriangle className="me-2" />;
      case 'warning':
        return <FaExclamationTriangle className="me-2" />;
      case 'info':
      default:
        return <FaInfoCircle className="me-2" />;
    }
  };

  return (
    <Alert 
      variant={variant === 'error' ? 'danger' : variant} 
      dismissible={dismissible && onClose}
      onClose={onClose}
      className={`d-flex align-items-center ${className}`}
    >
      {getIcon()}
      <span>{message}</span>
    </Alert>
  );
};

AlertMessage.propTypes = {
  variant: PropTypes.oneOf(['success', 'danger', 'error', 'warning', 'info']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  dismissible: PropTypes.bool,
  className: PropTypes.string
};

export default AlertMessage;
