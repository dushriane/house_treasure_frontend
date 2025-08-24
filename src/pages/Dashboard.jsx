import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemsAPI, transactionsAPI, offersAPI } from '../services/api.js';
import { FaPlus, FaBox, FaExchangeAlt, FaHandshake, FaEye, FaEdit, FaTrash, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { DashboardLayout, LoadingSpinner } from '../components';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    soldItems: 0,
    totalTransactions: 0,
    pendingOffers: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    totalViews: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentOffers, setRecentOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [itemsResponse, transactionsResponse, offersResponse] = await Promise.all([
        itemsAPI.getUserItems(user.id),
        transactionsAPI.getUserTransactions(user.id),
        offersAPI.getUserOffers(user.id)
      ]);

      const items = itemsResponse.data || [];
      const transactions = transactionsResponse.data || [];
      const offers = offersResponse.data || [];

      // Calculate revenue
      const totalRevenue = transactions
        .filter(t => t.status === 'COMPLETED' && t.type === 'SALE')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const currentMonth = new Date().getMonth();
      const thisMonthRevenue = transactions
        .filter(t => {
          const transactionMonth = new Date(t.createdAt).getMonth();
          return t.status === 'COMPLETED' && t.type === 'SALE' && transactionMonth === currentMonth;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      setStats({
        totalItems: items.length,
        activeItems: items.filter(item => item.status === 'AVAILABLE').length,
        soldItems: items.filter(item => item.status === 'SOLD').length,
        totalTransactions: transactions.length,
        pendingOffers: offers.filter(offer => offer.status === 'PENDING').length,
        totalRevenue,
        thisMonthRevenue,
        totalViews: items.reduce((sum, item) => sum + (item.views || 0), 0)
      });

      setRecentItems(items.slice(0, 5));
      setRecentTransactions(transactions.slice(0, 5));
      setRecentOffers(offers.slice(0, 3));
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <Alert variant="danger" className="text-center">
          {error}
          <br />
          <Button variant="outline-danger" onClick={fetchDashboardData} className="mt-2">
            Try Again
          </Button>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard Overview">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <Card className="welcome-card">
            <Card.Body>
              <h2 className="welcome-title">
                Welcome back, {user.firstName || user.username}! 👋
              </h2>
              <p className="welcome-subtitle">
                Here's what's happening with your House Treasures account today
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4 dashboard-grid dashboard-grid-4">
        <Col>
          <Card className="stats-card">
            <Card.Body className="text-center">
              <div className="stats-icon">
                <FaBox />
              </div>
              <h3 className="stats-number">{stats.totalItems}</h3>
              <p className="stats-label">Total Items</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="stats-card">
            <Card.Body className="text-center">
              <div className="stats-icon active">
                <FaEye />
              </div>
              <h3 className="stats-number">{stats.activeItems}</h3>
              <p className="stats-label">Active Listings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="stats-card">
            <Card.Body className="text-center">
              <div className="stats-icon sold">
                <FaExchangeAlt />
              </div>
              <h3 className="stats-number">{stats.soldItems}</h3>
              <p className="stats-label">Items Sold</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="stats-card">
            <Card.Body className="text-center">
              <div className="stats-icon offers">
                <FaHandshake />
              </div>
              <h3 className="stats-number">{stats.pendingOffers}</h3>
              <p className="stats-label">Pending Offers</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Revenue Stats */}
      <Row className="mb-4 dashboard-grid dashboard-grid-3">
        <Col>
          <Card className="stats-card revenue-card">
            <Card.Body className="text-center">
              <div className="stats-icon revenue">
                <FaMoneyBillWave />
              </div>
              <h3 className="stats-number">RWF {stats.totalRevenue.toLocaleString()}</h3>
              <p className="stats-label">Total Revenue</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="stats-card">
            <Card.Body className="text-center">
              <div className="stats-icon month">
                <FaChartLine />
              </div>
              <h3 className="stats-number">RWF {stats.thisMonthRevenue.toLocaleString()}</h3>
              <p className="stats-label">This Month</p>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="stats-card">
            <Card.Body className="text-center">
              <div className="stats-icon views">
                <FaEye />
              </div>
              <h3 className="stats-number">{stats.totalViews.toLocaleString()}</h3>
              <p className="stats-label">Total Views</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="dashboard-actions">
                <Button as={Link} to="/items/create" variant="primary" className="action-btn">
                  <FaPlus className="me-2" />
                  List New Item
                </Button>
                <Button as={Link} to="/items" variant="outline-primary" className="action-btn">
                  <FaEye className="me-2" />
                  Browse Items
                </Button>
                <Button as={Link} to="/messages" variant="outline-primary" className="action-btn">
                  <FaHandshake className="me-2" />
                  View Messages
                </Button>
                <Button as={Link} to="/offers" variant="outline-primary" className="action-btn">
                  <FaHandshake className="me-2" />
                  Manage Offers
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Items */}
        <Col lg={6} className="mb-4">
          <Card className="dashboard-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Items</h5>
              <Button as={Link} to="/items" variant="link" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {recentItems.length > 0 ? (
                <div className="recent-items">
                  {recentItems.map((item) => (
                    <div key={item.id} className="recent-item">
                      <div className="item-info">
                        <h6 className="item-title">{item.title}</h6>
                        <p className="item-price">RWF {item.price?.toLocaleString()}</p>
                        <Badge 
                          bg={item.status === 'AVAILABLE' ? 'success' : 'secondary'}
                          className="item-status"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <div className="item-actions">
                        <Button as={Link} to={`/items/${item.id}`} size="sm" variant="outline-primary">
                          <FaEye />
                        </Button>
                        <Button as={Link} to={`/items/${item.id}/edit`} size="sm" variant="outline-secondary">
                          <FaEdit />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty">
                  <FaBox className="dashboard-empty-icon" />
                  <h6 className="dashboard-empty-title">No items yet</h6>
                  <p className="dashboard-empty-text">Start by listing your first item!</p>
                  <Button as={Link} to="/items/create" variant="primary">
                    <FaPlus className="me-2" />
                    List Your First Item
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Transactions */}
        <Col lg={6} className="mb-4">
          <Card className="dashboard-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Transactions</h5>
              <Button as={Link} to="/transactions" variant="link" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body>
              {recentTransactions.length > 0 ? (
                <div className="recent-transactions">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="recent-transaction">
                      <div className="transaction-info">
                        <h6 className="transaction-title">{transaction.itemTitle}</h6>
                        <p className="transaction-amount">RWF {transaction.amount?.toLocaleString()}</p>
                        <Badge 
                          bg={transaction.status === 'COMPLETED' ? 'success' : 'warning'}
                          className="transaction-status"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="transaction-date">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty">
                  <FaExchangeAlt className="dashboard-empty-icon" />
                  <h6 className="dashboard-empty-title">No transactions yet</h6>
                  <p className="dashboard-empty-text">Your transaction history will appear here</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default Dashboard;
