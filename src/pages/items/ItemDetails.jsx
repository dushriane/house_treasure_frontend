import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Carousel, Modal, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { itemsAPI, offersAPI } from '../../services/api';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaTag, 
  FaUser, 
  FaHeart, 
  FaShare, 
  FaEdit, 
  FaTrash,
  FaHandshake,
  FaComments,
  FaChevronLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { DashboardLayout } from '../../components';
import './ItemDetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await itemsAPI.getItemById(id);
      setItem(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching item details:', err);
      setError('Failed to load item details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      alert('Please enter a valid offer amount');
      return;
    }

    try {
      setSubmittingOffer(true);
      await offersAPI.createOffer({
        itemId: id,
        amount: parseFloat(offerAmount),
        message: offerMessage
      });
      
      setShowOfferModal(false);
      setOfferAmount('');
      setOfferMessage('');
      alert('Offer submitted successfully!');
    } catch (err) {
      console.error('Error submitting offer:', err);
      alert('Failed to submit offer. Please try again.');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await itemsAPI.deleteItem(id);
      setShowDeleteModal(false);
      navigate('/dashboard/my-items');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API call
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const isOwner = user && item && user.id === item.sellerId;
  const canMakeOffer = user && !isOwner && item?.status === 'AVAILABLE';

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="danger" className="text-center">
          <FaExclamationTriangle className="me-2" />
          {error}
          <div className="mt-3">
            <Button variant="outline-primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
        </Alert>
      </DashboardLayout>
    );
  }

  if (!item) {
    return (
      <DashboardLayout>
        <Alert variant="warning" className="text-center">
          Item not found
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container fluid>
        {/* Breadcrumb */}
        <Row className="mb-3">
          <Col>
            <Button
              variant="link"
              className="text-decoration-none p-0 mb-3"
              onClick={() => navigate(-1)}
            >
              <FaChevronLeft className="me-2" />
              Back to listings
            </Button>
          </Col>
        </Row>

        <Row>
          {/* Image Gallery */}
          <Col lg={8} className="mb-4">
            <Card className="item-gallery-card">
              <Card.Body className="p-0">
                {item.imageUrls && item.imageUrls.length > 0 ? (
                  <Carousel 
                    activeIndex={currentImageIndex} 
                    onSelect={setCurrentImageIndex}
                    className="item-carousel"
                  >
                    {item.imageUrls.map((imageUrl, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100 item-main-image"
                          src={imageUrl}
                          alt={`${item.title} - Image ${index + 1}`}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <div className="no-image-placeholder">
                    <FaTag size={60} />
                    <p>No images available</p>
                  </div>
                )}
                
                {/* Image thumbnails */}
                {item.imageUrls && item.imageUrls.length > 1 && (
                  <div className="image-thumbnails">
                    {item.imageUrls.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Thumbnail ${index + 1}`}
                        className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Item Details */}
          <Col lg={4}>
            <Card className="item-details-card sticky-top">
              <Card.Body>
                {/* Status Badge */}
                <Badge 
                  bg={item.status === 'AVAILABLE' ? 'success' : 'secondary'} 
                  className="status-badge mb-3"
                >
                  {item.status}
                </Badge>

                {/* Title and Price */}
                <h1 className="item-title">{item.title}</h1>
                <div className="item-price mb-3">
                  <span className="currency">RWF</span>
                  <span className="amount">{item.price?.toLocaleString()}</span>
                  {item.isNegotiable && (
                    <small className="negotiable-label">Negotiable</small>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="quick-actions mb-4">
                  {canMakeOffer && (
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-100 mb-2"
                      onClick={() => setShowOfferModal(true)}
                    >
                      <FaHandshake className="me-2" />
                      Make Offer
                    </Button>
                  )}
                  
                  {isOwner && (
                    <div className="owner-actions">
                      <Button 
                        variant="outline-primary" 
                        className="me-2"
                        as={Link}
                        to={`/edit-item/${item.id}`}
                      >
                        <FaEdit className="me-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <FaTrash className="me-2" />
                        Delete
                      </Button>
                    </div>
                  )}

                  {!isOwner && (
                    <div className="buyer-actions">
                      <Button
                        variant="outline-secondary"
                        className="me-2"
                        onClick={handleToggleWishlist}
                      >
                        <FaHeart className={`me-2 ${isWishlisted ? 'text-danger' : ''}`} />
                        {isWishlisted ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={handleShare}
                      >
                        <FaShare className="me-2" />
                        Share
                      </Button>
                    </div>
                  )}
                </div>

                {/* Item Information */}
                <div className="item-info">
                  <h5 className="section-title">Details</h5>
                  
                  <div className="info-item">
                    <FaTag className="info-icon" />
                    <span className="info-label">Category:</span>
                    <span className="info-value">{item.category}</span>
                  </div>

                  <div className="info-item">
                    <FaShieldAlt className="info-icon" />
                    <span className="info-label">Condition:</span>
                    <span className="info-value">{item.condition}</span>
                  </div>

                  {item.brand && (
                    <div className="info-item">
                      <span className="info-label">Brand:</span>
                      <span className="info-value">{item.brand}</span>
                    </div>
                  )}

                  {item.model && (
                    <div className="info-item">
                      <span className="info-label">Model:</span>
                      <span className="info-value">{item.model}</span>
                    </div>
                  )}

                  {item.yearOfPurchase && (
                    <div className="info-item">
                      <FaCalendarAlt className="info-icon" />
                      <span className="info-label">Year:</span>
                      <span className="info-value">{item.yearOfPurchase}</span>
                    </div>
                  )}

                  <div className="info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    <span className="info-label">Location:</span>
                    <span className="info-value">
                      {item.pickupDistrict}, {item.pickupProvince}
                    </span>
                  </div>

                  {item.createdAt && (
                    <div className="info-item">
                      <FaCalendarAlt className="info-icon" />
                      <span className="info-label">Listed:</span>
                      <span className="info-value">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Seller Information */}
                {item.seller && (
                  <div className="seller-info">
                    <h5 className="section-title">Seller</h5>
                    <div className="seller-profile">
                      <div className="seller-avatar">
                        {item.seller.profileImage ? (
                          <img src={item.seller.profileImage} alt={item.seller.firstName} />
                        ) : (
                          <div className="avatar-placeholder">
                            {item.seller.firstName?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="seller-details">
                        <h6 className="seller-name">
                          {item.seller.firstName} {item.seller.lastName}
                        </h6>
                        <div className="seller-rating">
                          <FaCheckCircle className="verified-icon" />
                          <span>Verified Seller</span>
                        </div>
                      </div>
                    </div>
                    
                    {!isOwner && (
                      <Button 
                        variant="outline-primary" 
                        className="w-100 mt-3"
                        as={Link}
                        to={`/messages?user=${item.seller.id}`}
                      >
                        <FaComments className="me-2" />
                        Message Seller
                      </Button>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Description */}
        <Row className="mt-4">
          <Col>
            <Card className="description-card">
              <Card.Body>
                <h5 className="section-title">Description</h5>
                <p className="item-description">{item.description}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Make Offer Modal */}
        <Modal show={showOfferModal} onHide={() => setShowOfferModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Make an Offer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Offer Amount (RWF)</label>
              <input
                type="number"
                className="form-control"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="Enter your offer amount"
                max={item.price}
              />
              <small className="text-muted">
                Listed price: RWF {item.price?.toLocaleString()}
              </small>
            </div>
            <div className="mb-3">
              <label className="form-label">Message (Optional)</label>
              <textarea
                className="form-control"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="Add a message to your offer..."
                rows={3}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowOfferModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleMakeOffer}
              disabled={submittingOffer || !offerAmount}
            >
              {submittingOffer ? 'Submitting...' : 'Submit Offer'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteItem}>
              Delete Item
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default ItemDetails;
