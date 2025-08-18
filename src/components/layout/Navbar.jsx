import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FaSearch, FaUser, FaSignOutAlt, FaHome, FaPlus, FaComments, FaExchangeAlt, FaHandshake } from 'react-icons/fa';
import './Navbar.css';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar bg="white" expand="lg" className="navbar-custom shadow-sm" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <FaHome className="me-2" />
          House Treasures
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/items" 
              className={isActive('/items') ? 'active' : ''}
            >
              Browse Items
            </Nav.Link>
            {user && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/create-item" 
                  className={isActive('/create-item') ? 'active' : ''}
                >
                  <FaPlus className="me-1" />
                  Sell Item
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/messages" 
                  className={isActive('/messages') ? 'active' : ''}
                >
                  <FaComments className="me-1" />
                  Messages
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Search Bar */}
          <Form className="d-flex mx-auto" onSubmit={handleSearch}>
            <InputGroup style={{ width: '400px' }}>
              <Form.Control
                type="search"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Button type="submit" variant="outline-primary">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>

          <Nav className="ms-auto">
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                  <FaUser className="me-1" />
                  {user.firstName || user.username}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/dashboard">
                    <FaHome className="me-2" />
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/profile">
                    <FaUser className="me-2" />
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/transactions">
                    <FaExchangeAlt className="me-2" />
                    Transactions
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/offers">
                    <FaHandshake className="me-2" />
                    Offers
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-primary">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="primary">
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 