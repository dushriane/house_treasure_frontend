import React, { useState } from 'react';
import { Nav, Badge, Collapse, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaPlus, 
  FaShoppingCart, 
  FaHeart, 
  FaComments, 
  FaHandshake, 
  FaExchangeAlt, 
  FaCog, 
  FaUser, 
  FaChartLine,
  FaBars,
  FaTimes,
  FaSearch,
  FaMoneyBillWave,
  FaHistory,
  FaEye,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import './DashboardSidebar.css';

const DashboardSidebar = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    selling: true,
    buying: true,
    marketplace: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = {
    main: [
      {
        path: '/dashboard',
        icon: FaTachometerAlt,
        label: 'Dashboard Overview',
        badge: null
      }
    ],
    selling: [
      {
        path: '/dashboard/my-items',
        icon: FaBox,
        label: 'My Items',
        badge: null
      },
      {
        path: '/create-item',
        icon: FaPlus,
        label: 'List New Item',
        badge: null,
        highlight: true
      },
      {
        path: '/dashboard/sales',
        icon: FaMoneyBillWave,
        label: 'Sales & Revenue',
        badge: null
      },
      {
        path: '/dashboard/offers-received',
        icon: FaHandshake,
        label: 'Offers Received',
        badge: 3 // This would come from props or state
      }
    ],
    buying: [
      {
        path: '/items',
        icon: FaSearch,
        label: 'Browse Items',
        badge: null
      },
      {
        path: '/dashboard/purchases',
        icon: FaShoppingCart,
        label: 'My Purchases',
        badge: null
      },
      {
        path: '/dashboard/offers-sent',
        icon: FaHandshake,
        label: 'Offers Sent',
        badge: 2
      },
      {
        path: '/dashboard/watchlist',
        icon: FaHeart,
        label: 'Watchlist',
        badge: 8
      }
    ],
    marketplace: [
      {
        path: '/dashboard/analytics',
        icon: FaChartLine,
        label: 'Market Analytics',
        badge: null
      },
      {
        path: '/dashboard/trending',
        icon: FaEye,
        label: 'Trending Items',
        badge: null
      }
    ],
    communication: [
      {
        path: '/messages',
        icon: FaComments,
        label: 'Messages',
        badge: 5
      },
      {
        path: '/transactions',
        icon: FaExchangeAlt,
        label: 'Transactions',
        badge: null
      },
      {
        path: '/dashboard/history',
        icon: FaHistory,
        label: 'Activity History',
        badge: null
      }
    ],
    account: [
      {
        path: '/profile',
        icon: FaUser,
        label: 'Profile Settings',
        badge: null
      },
      {
        path: '/dashboard/settings',
        icon: FaCog,
        label: 'Preferences',
        badge: null
      }
    ]
  };

  const renderNavItem = (item) => (
    <Nav.Item key={item.path}>
      <Nav.Link
        as={Link}
        to={item.path}
        className={`sidebar-nav-link ${isActive(item.path) ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
      >
        <item.icon className="nav-icon" />
        <span className="nav-label">{item.label}</span>
        {item.badge && (
          <Badge bg="primary" className="nav-badge">
            {item.badge}
          </Badge>
        )}
      </Nav.Link>
    </Nav.Item>
  );

  const renderSection = (title, items, sectionKey) => (
    <div className="sidebar-section" key={sectionKey}>
      <div 
        className="sidebar-section-header"
        onClick={() => toggleSection(sectionKey)}
      >
        <span className="section-title">{title}</span>
        {expandedSections[sectionKey] ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      <Collapse in={expandedSections[sectionKey]}>
        <div>
          <Nav className="sidebar-nav">
            {items.map(renderNavItem)}
          </Nav>
        </div>
      </Collapse>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay d-lg-none" onClick={onToggle} />
      )}
      
      {/* Sidebar */}
      <div className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.firstName} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="user-details">
              <h6 className="user-name">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username}
              </h6>
              <span className="user-role">Member</span>
            </div>
          </div>
          <Button
            variant="link"
            className="sidebar-toggle d-lg-none"
            onClick={onToggle}
          >
            <FaTimes />
          </Button>
        </div>

        {/* Navigation */}
        <div className="sidebar-content">
          {/* Main Dashboard */}
          <Nav className="sidebar-nav main-nav">
            {menuItems.main.map(renderNavItem)}
          </Nav>

          {/* Selling Section */}
          {renderSection('Selling', menuItems.selling, 'selling')}

          {/* Buying Section */}
          {renderSection('Buying', menuItems.buying, 'buying')}

          {/* Marketplace Section */}
          {renderSection('Marketplace', menuItems.marketplace, 'marketplace')}

          {/* Communication Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span className="section-title">Communication</span>
            </div>
            <Nav className="sidebar-nav">
              {menuItems.communication.map(renderNavItem)}
            </Nav>
          </div>

          {/* Account Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <span className="section-title">Account</span>
            </div>
            <Nav className="sidebar-nav">
              {menuItems.account.map(renderNavItem)}
            </Nav>
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-stats">
            <div className="stat-item">
              <FaBox className="stat-icon" />
              <span>12 Items</span>
            </div>
            <div className="stat-item">
              <FaMoneyBillWave className="stat-icon" />
              <span>RWF 45K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile toggle button */}
      <Button
        variant="primary"
        className="mobile-sidebar-toggle d-lg-none"
        onClick={onToggle}
      >
        <FaBars />
      </Button>
    </>
  );
};

export default DashboardSidebar;
