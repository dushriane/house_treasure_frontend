import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaExclamationTriangle, FaArrowLeft, FaCompass } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="not-found-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={6} md={8} className="text-center">
            <Card className="not-found-card border-0 shadow-lg">
              <Card.Body className="p-5">
                <div className="not-found-content">
                  <div className="not-found-icon mb-4">
                    <FaExclamationTriangle />
                  </div>
                  <div className="not-found-number">404</div>
                  <h1 className="not-found-title">Page Not Found</h1>
                  <p className="not-found-description">
                    Oops! The page you're looking for seems to have vanished into thin air. 
                    It might have been moved, deleted, or you may have entered an incorrect URL.
                  </p>
                  
                  <div className="not-found-suggestions mb-4">
                    <h6 className="mb-3">Here's what you can do:</h6>
                    <ul className="list-unstyled text-start">
                      <li className="mb-2">
                        <FaSearch className="me-2 text-primary" />
                        Check the URL for any typos
                      </li>
                      <li className="mb-2">
                        <FaCompass className="me-2 text-primary" />
                        Use the navigation menu to find what you need
                      </li>
                      <li className="mb-2">
                        <FaHome className="me-2 text-primary" />
                        Go back to the homepage and start fresh
                      </li>
                    </ul>
                  </div>

                  <div className="not-found-actions">
                    <Button 
                      onClick={handleGoBack}
                      variant="outline-primary" 
                      className="me-3 mb-2 mb-md-0"
                    >
                      <FaArrowLeft className="me-2" />
                      Go Back
                    </Button>
                    <Button as={Link} to="/" variant="primary" className="me-3 mb-2 mb-md-0">
                      <FaHome className="me-2" />
                      Go Home
                    </Button>
                    <Button as={Link} to="/items" variant="outline-success">
                      <FaSearch className="me-2" />
                      Browse Items
                    </Button>
                  </div>

                  <div className="not-found-help mt-4">
                    <p className="text-muted small">
                      Still having trouble? Contact our support team for assistance.
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound; 