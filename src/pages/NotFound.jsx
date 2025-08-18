import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} className="text-center">
            <div className="not-found-content">
              <div className="not-found-icon">
                <FaExclamationTriangle />
              </div>
              <h1 className="not-found-title">404</h1>
              <h2 className="not-found-subtitle">Page Not Found</h2>
              <p className="not-found-description">
                Oops! The page you're looking for doesn't exist. 
                It might have been moved, deleted, or you entered the wrong URL.
              </p>
              <div className="not-found-actions">
                <Button as={Link} to="/" variant="primary" className="me-3">
                  <FaHome className="me-2" />
                  Go Home
                </Button>
                <Button as={Link} to="/items" variant="outline-primary">
                  <FaSearch className="me-2" />
                  Browse Items
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound; 