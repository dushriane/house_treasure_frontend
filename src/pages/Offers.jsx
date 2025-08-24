import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { offersAPI } from '../services/api.js';
import { FaHandshake, FaEye, FaCheck, FaTimes, FaClock, FaCheckCircle, FaTimesCircle, FaFilter } from 'react-icons/fa';
import { DashboardLayout, LoadingSpinner } from '../components';
import './Offers.css';

const Offers = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filterOptions = [
    { key: 'all', label: 'All', icon: FaHandshake },
    { key: 'PENDING', label: 'Pending', icon: FaClock },
    { key: 'ACCEPTED', label: 'Accepted', icon: FaCheckCircle },
    { key: 'REJECTED', label: 'Rejected', icon: FaTimesCircle }
  ];

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [offers, activeFilter]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await offersAPI.getUserOffers(user.id);
      setOffers(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to load offers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterOffers = () => {
    if (activeFilter === 'all') {
      setFilteredOffers(offers);
    } else {
      setFilteredOffers(offers.filter(offer => offer.status === activeFilter));
    }
  };

  const handleAccept = async (offerId) => {
    try {
      setActionLoading(offerId);
      await offersAPI.acceptOffer(offerId);
      setActionMsg('Offer accepted successfully!');
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'ACCEPTED' } : o));
    } catch (error) {
      console.error('Error accepting offer:', error);
      setActionMsg('Failed to accept offer. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (offerId) => {
    try {
      setActionLoading(offerId);
      await offersAPI.rejectOffer(offerId);
      setActionMsg('Offer rejected.');
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'REJECTED' } : o));
    } catch (error) {
      console.error('Error rejecting offer:', error);
      setActionMsg('Failed to reject offer. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: 'warning', icon: FaClock },
      ACCEPTED: { bg: 'success', icon: FaCheckCircle },
      REJECTED: { bg: 'danger', icon: FaTimesCircle }
    };

    const config = statusConfig[status] || { bg: 'secondary', icon: FaHandshake };
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
      <DashboardLayout title="Offers">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Offer Management">
      {/* Action Message */}
      {actionMsg && (
        <Row className="mb-4">
          <Col>
            <AlertMessage 
              variant={actionMsg.includes('Failed') ? 'danger' : 'success'}
              message={actionMsg}
              onClose={() => setActionMsg('')}
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
                  <h5 className="mb-1">Filter Offers</h5>
                  <p className="text-muted mb-0">Manage offers you have received or sent</p>
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
                            {offers.filter(offer => offer.status === filter.key).length}
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
              <Button variant="outline-danger" onClick={fetchOffers} className="mt-2">
                Try Again
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Offers List */}
      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {activeFilter === 'all' ? 'All Offers' : `${activeFilter} Offers`}
              </h5>
              <div className="d-flex align-items-center">
                <FaFilter className="me-2 text-muted" />
                <span className="text-muted">
                  {filteredOffers.length} offer{filteredOffers.length !== 1 ? 's' : ''}
                </span>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {filteredOffers.length === 0 ? (
                <div className="dashboard-empty py-5">
                  <FaHandshake className="dashboard-empty-icon" />
                  <h6 className="dashboard-empty-title">
                    {activeFilter === 'all' ? 'No offers yet' : `No ${activeFilter.toLowerCase()} offers`}
                  </h6>
                  <p className="dashboard-empty-text">
                    {activeFilter === 'all' 
                      ? 'Offers you receive or send will appear here'
                      : `You don't have any ${activeFilter.toLowerCase()} offers at the moment`
                    }
                  </p>
                  <Button as={Link} to="/items" variant="primary">
                    Browse Items
                  </Button>
                </div>
              ) : (
                <div className="offer-list">
                  {filteredOffers.map((offer) => (
                    <div key={offer.id} className="offer-item">
                      <div className="offer-main">
                        <div className="offer-icon">
                          <FaHandshake />
                        </div>
                        <div className="offer-details">
                          <h6 className="offer-title">{offer.itemTitle}</h6>
                          <p className="offer-info">
                            {offer.type === 'RECEIVED' ? 'From' : 'To'}: {offer.fromUserName || offer.toUserName}
                          </p>
                          <div className="offer-meta">
                            <span className="offer-date">
                              {new Date(offer.date || offer.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="offer-type">
                              {offer.type || (offer.fromUserId === user.id ? 'SENT' : 'RECEIVED')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="offer-right">
                        <div className="offer-amount">
                          RWF {offer.amount?.toLocaleString()}
                        </div>
                        <div className="offer-status mb-2">
                          {getStatusBadge(offer.status)}
                        </div>
                        <div className="offer-actions">
                          {offer.status === 'PENDING' && offer.type === 'RECEIVED' && (
                            <>
                              <Button
                                size="sm"
                                variant="success"
                                className="me-2"
                                onClick={() => handleAccept(offer.id)}
                                disabled={actionLoading === offer.id}
                              >
                                {actionLoading === offer.id ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <>
                                    <FaCheck className="me-1" />
                                    Accept
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleReject(offer.id)}
                                disabled={actionLoading === offer.id}
                              >
                                {actionLoading === offer.id ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <>
                                    <FaTimes className="me-1" />
                                    Reject
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                          <Button 
                            as={Link} 
                            to={`/offers/${offer.id}`} 
                            size="sm" 
                            variant="outline-primary"
                            className="ms-2"
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
    </DashboardLayout>
  );
};

export default Offers;