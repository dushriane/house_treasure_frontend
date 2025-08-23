import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import './CustomButton.css';

const CustomButton = ({ 
  children,
  variant = "primary",
  size = "default",
  className = "",
  loading = false,
  disabled = false,
  gradient = false,
  rounded = false,
  icon,
  iconPosition = "left", // "left", "right"
  loadingText = "Loading...",
  ...props
}) => {
  const getButtonClass = () => {
    let baseClass = "custom-btn";
    
    if (gradient) {
      baseClass += ` custom-btn-gradient-${variant}`;
    } else {
      baseClass += ` custom-btn-${variant}`;
    }
    
    if (size !== "default") {
      baseClass += ` custom-btn-${size}`;
    }
    
    if (rounded) {
      baseClass += " custom-btn-rounded";
    }
    
    if (loading) {
      baseClass += " custom-btn-loading";
    }
    
    return `${baseClass} ${className}`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {loadingText}
        </>
      );
    }

    return (
      <>
        {icon && iconPosition === "left" && (
          <span className="btn-icon btn-icon-left">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="btn-icon btn-icon-right">{icon}</span>
        )}
      </>
    );
  };

  return (
    <BootstrapButton
      {...props}
      className={getButtonClass()}
      disabled={disabled || loading}
    >
      {renderContent()}
    </BootstrapButton>
  );
};

export default CustomButton;
