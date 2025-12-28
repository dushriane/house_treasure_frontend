import React from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // You can also log to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <div className="text-center" style={{ maxWidth: '600px' }}>
            <FaExclamationTriangle size={80} className="text-danger mb-4" />
            <h1 className="mb-3">Oops! Something went wrong</h1>
            <Alert variant="danger" className="text-start">
              <Alert.Heading>Error Details:</Alert.Heading>
              <p className="mb-2">
                <strong>{this.state.error?.toString()}</strong>
              </p>
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-3">
                  <summary style={{ cursor: 'pointer' }}>Stack Trace</summary>
                  <pre className="mt-2 p-3 bg-light" style={{ fontSize: '0.85rem', overflowX: 'auto' }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </Alert>
            <p className="text-muted mb-4">
              We're sorry for the inconvenience. The error has been logged and we'll look into it.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Button variant="primary" onClick={this.handleReload}>
                Reload Page
              </Button>
              <Button variant="outline-primary" onClick={this.handleGoHome}>
                Go to Home
              </Button>
            </div>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
