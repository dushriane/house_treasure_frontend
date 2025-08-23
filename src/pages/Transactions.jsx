import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, ButtonGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transactionsAPI } from '../services/api.js';
import { FaExchangeAlt, FaEye, FaFilter, FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { DashboardLayout, LoadingSpinner } from '../components';
import './Transactions.css';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filterOptions = [
    { key: 'all', label: 'All', icon: FaExchangeAlt },
    { key: 'PENDING', label: 'Pending', icon: FaClock },
    { key: 'ONGOING', label: 'Ongoing', icon: FaExchangeAlt },
    { key: 'COMPLETED', label: 'Completed', icon: FaCheckCircle },
    { key: 'CANCELLED', label: 'Cancelled', icon: FaTimesCircle }
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, activeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsAPI.getUserTransactions(user.id);
      setTransactions(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    if (activeFilter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(tx => tx.status === activeFilter));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'warning', icon: FaClock },
      ONGOING: { bg: 'info', icon: FaExchangeAlt },
      COMPLETED: { bg: 'success', icon: FaCheckCircle },
      CANCELLED: { bg: 'danger', icon: FaTimesCircle }
    };

    const config = statusConfig[status] || { bg: 'secondary', icon: FaExchangeAlt };
    const IconComponent = config.icon;

    return (
      <Badge bg={config.bg} className="d-flex align-items-center">
        <IconComponent className="me-1" size={12} />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Transactions">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Transaction History">
      {/* Filter Section */}
      <Row className="mb-4">
        <Col>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center">
                <div className="mb-3 mb-lg-0">
                  <h5 className="mb-1">Filter Transactions</h5>
                  <p className="text-muted mb-0">View transactions by status</p>
                </div>
                <ButtonGroup>
                  {filterOptions.map((filter) => {
                    const IconComponent = filter.icon;
                    return (
                      <Button
                        key={filter.key}
                        variant={activeFilter === filter.key ? 'primary' : 'outline-primary'}
                        onClick={() => setActiveFilter(filter.key)}
                        className="d-flex align-items-center"
                      >
                        <IconComponent className="me-1" size={14} />
                        {filter.label}
                        {filter.key !== 'all' && (
                          <Badge 
                            bg="light" 
                            text="dark" 
                            className="ms-2"
                          >
                            {transactions.filter(tx => tx.status === filter.key).length}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </ButtonGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" className="text-center">
              {error}
              <br />
              <Button variant="outline-danger" onClick={fetchTransactions} className="mt-2">
                Try Again
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Transactions List */}
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {activeFilter === 'all' ? 'All Transactions' : `${activeFilter} Transactions`}
              </h5>
              <div className="d-flex align-items-center">
                <FaFilter className="me-2 text-muted" />
                <span className="text-muted">
                  {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                </span>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredTransactions.length === 0 ? (
                <div className="dashboard-empty py-5">
                  <FaExchangeAlt className="dashboard-empty-icon" />
                  <h6 className="dashboard-empty-title">
                    {activeFilter === 'all' ? 'No transactions yet' : `No ${activeFilter.toLowerCase()} transactions`}
                  </h6>
                  <p className="dashboard-empty-text">
                    {activeFilter === 'all' 
                      ? 'Your transaction history will appear here when you buy or sell items'
                      : `You don't have any ${activeFilter.toLowerCase()} transactions at the moment`
                    }
                  </p>
                  <Button as={Link} to="/items" variant="primary">
                    Browse Items
                  </Button>
                </div>
              ) : (
                <div className="transaction-list">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-main">
                        <div className="transaction-icon">
                          <FaMoneyBillWave />
                        </div>
                        <div className="transaction-details">
                          <h6 className="transaction-title">{transaction.itemTitle}</h6>
                          <p className="transaction-info">
                            {transaction.type === 'SALE' ? 'Sold to' : 'Bought from'}: {transaction.otherUserName}
                          </p>
                          <div className="transaction-meta">
                            <span className="transaction-date">
                              {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="transaction-type">
                              {transaction.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="transaction-right">
                        <div className="transaction-amount">
                          RWF {transaction.amount?.toLocaleString()}
                        </div>
                        <div className="transaction-status mb-2">
                          {getStatusBadge(transaction.status)}
                        </div>
                        <Button 
                          as={Link} 
                          to={`/transactions/${transaction.id}`} 
                          size="sm" 
                          variant="outline-primary"
                        >
                          <FaEye className="me-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default Transactions; 