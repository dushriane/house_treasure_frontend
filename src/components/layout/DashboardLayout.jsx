import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DashboardSidebar from './DashboardSidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ children, title, showSidebar = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      {showSidebar && (
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          onToggle={toggleSidebar} 
        />
      )}
      
      <div className={`dashboard-main ${showSidebar ? 'with-sidebar' : 'full-width'}`}>
        <Container fluid className="dashboard-container">
          {title && (
            <Row className="dashboard-header-row">
              <Col>
                <div className="dashboard-page-header">
                  <h1 className="dashboard-page-title">{title}</h1>
                </div>
              </Col>
            </Row>
          )}
          
          <Row>
            <Col>
              <div className="dashboard-content">
                {children}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout;
