import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, ButtonGroup, Spinner, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transactionsAPI } from '../services/api.js';
import { FaExchangeAlt, FaEye, FaFilter, FaMoneyBillWave, FaClock, FaCheckCircle, FaTimesCircle, FaCheck, FaBan } from 'react-icons/fa';
import { DashboardLayout, LoadingSpinner, AlertMessage } from '../components';
import './Transactions.css';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

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

  const handleConfirmPayment = async (transactionId) => {
    try {
      setActionLoading(transactionId);
      await transactionsAPI.confirmPayment(transactionId);
      setSuccessMsg('Payment confirmed successfully!');
      await fetchTransactions();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error confirming payment:', err);
      setError('Failed to confirm payment. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteTransaction = async (transactionId) => {
    try {
      setActionLoading(transactionId);
      await transactionsAPI.completeTransaction(transactionId);
      setSuccessMsg('Transaction completed successfully!');
      await fetchTransactions();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error completing transaction:', err);
      setError('Failed to complete transaction. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelTransaction = async () => {
    if (!cancelReason.trim()) {
      setError('Please provide a reason for cancellation.');
      return;
    }
    
    try {
      setActionLoading(selectedTransaction.id);
      await transactionsAPI.cancelTransaction(selectedTransaction.id, cancelReason);
      setSuccessMsg('Transaction cancelled.');
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedTransaction(null);
      await fetchTransactions();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error cancelling transaction:', err);
      setError('Failed to cancel transaction. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openCancelModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowCancelModal(true);
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
      {/* Success Message */}
      {successMsg && (
        <Row className="mb-4">
          <Col>
            <AlertMessage 
              variant="success" 
              message={successMsg} 
              onClose={() => setSuccessMsg('')}
            />
          </Col>
        </Row>
      )}

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
                        <div className="transaction-actions">
                          {transaction.status === 'PENDING' && transaction.type === 'PURCHASE' && (
                            <Button
                              size="sm"
                              variant="success"
                              className="mb-1 w-100"
                              onClick={() => handleConfirmPayment(transaction.id)}
                              disabled={actionLoading === transaction.id}
                            >
                              {actionLoading === transaction.id ? (
                                <Spinner size="sm" animation="border" />
                              ) : (
                                <>
                                  <FaCheck className="me-1" />
                                  Confirm Payment
                                </>
                              )}
                            </Button>
                          )}
                          {transaction.status === 'ONGOING' && transaction.type === 'SALE' && (
                            <Button
                              size="sm"
                              variant="primary"
                              className="mb-1 w-100"
                              onClick={() => handleCompleteTransaction(transaction.id)}
                              disabled={actionLoading === transaction.id}
                            >
                              {actionLoading === transaction.id ? (
                                <Spinner size="sm" animation="border" />
                              ) : (
                                <>
                                  <FaCheckCircle className="me-1" />
                                  Complete
                                </>
                              )}
                            </Button>
                          )}
                          {(transaction.status === 'PENDING' || transaction.status === 'ONGOING') && (
                            <Button
                              size="sm"
                              variant="outline-danger"
                              className="mb-1 w-100"
                              onClick={() => openCancelModal(transaction)}
                              disabled={actionLoading === transaction.id}
                            >
                              <FaBan className="me-1" />
                              Cancel
                            </Button>
                          )}
                          <Button 
                            as={Link} 
                            to={`/transactions/${transaction.id}`} 
                            size="sm" 
                            variant="outline-primary"
                            className="w-100"
                          >
                            <FaEye className="me-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Cancel Transaction Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Reason for Cancellation</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancelling this transaction..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button 
            variant="danger" 
            onClick={handleCancelTransaction}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              'Cancel Transaction'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default Transactions; 