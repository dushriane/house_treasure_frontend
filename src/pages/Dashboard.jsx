import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemsAPI, transactionsAPI, offersAPI } from '../services/api.js';
import { FaPlus, FaBox, FaExchangeAlt, FaHandshake, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    soldItems: 0,
    totalTransactions: 0,
    pendingOffers: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [itemsResponse, transactionsResponse, offersResponse] = await Promise.all([
        itemsAPI.getUserItems(user.id),
        transactionsAPI.getUserTransactions(user.id),
        offersAPI.getUserOffers(user.id)
      ]);

      const items = itemsResponse.data;
      const transactions = transactionsResponse.data;
      const offers = offersResponse.data;

      setStats({
        totalItems: items.length,
        activeItems: items.filter(item => item.status === 'AVAILABLE').length,
        soldItems: items.filter(item => item.status === 'SOLD').length,
        totalTransactions: transactions.length,
        pendingOffers: offers.filter(offer => offer.status === 'PENDING').length
      });

      setRecentItems(items.slice(0, 5));
      setRecentTransactions(transactions.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard-page">
      <Container className="py-5">
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <h1 className="dashboard-title">
              Welcome back, {user.firstName || user.username}!
            </h1>
            <p className="dashboard-subtitle">
              Here's what's happening with your House Treasures account
            </p>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-5">
          <Col lg={3} md={6} className="mb-3">
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
          <Col lg={3} md={6} className="mb-3">
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
          <Col lg={3} md={6} className="mb-3">
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
          <Col lg={3} md={6} className="mb-3">
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

        {/* Quick Actions */}
        <Row className="mb-5">
          <Col>
            <Card className="quick-actions-card">
              <Card.Body>
                <h4 className="card-title mb-3">Quick Actions</h4>
                <div className="quick-actions">
                  <Button as={Link} to="/create-item" variant="primary" className="action-btn">
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
                          <Button as={Link} to={`/edit-item/${item.id}`} size="sm" variant="outline-secondary">
                            <FaEdit />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No items listed yet</p>
                    <Button as={Link} to="/create-item" variant="primary">
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
                          <h6 className="transaction-title">{transaction.item?.title}</h6>
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
                  <div className="text-center py-4">
                    <p className="text-muted">No transactions yet</p>
                    <Button as={Link} to="/items" variant="primary">
                      <FaEye className="me-2" />
                      Browse Items to Buy
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard; 