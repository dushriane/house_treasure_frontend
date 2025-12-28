import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { FaWifi, FaExclamationTriangle } from 'react-icons/fa';
import './OfflineIndicator.css';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAlert, setShowAlert] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(true);
      // Auto-hide "back online" message after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showAlert) return null;

  return (
    <div className="offline-indicator-container">
      <Alert 
        variant={isOnline ? 'success' : 'warning'} 
        dismissible 
        onClose={() => setShowAlert(false)}
        className="offline-indicator-alert"
      >
        <div className="d-flex align-items-center gap-2">
          {isOnline ? (
            <>
              <FaWifi size={18} />
              <span><strong>Back Online</strong> - Your connection has been restored</span>
            </>
          ) : (
            <>
              <FaExclamationTriangle size={18} />
              <span><strong>No Internet Connection</strong> - Some features may be unavailable</span>
            </>
          )}
        </div>
      </Alert>
    </div>
  );
};

export default OfflineIndicator;
