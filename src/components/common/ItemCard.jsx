import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaHeart, FaShare } from 'react-icons/fa';
import './ItemCard.css';

const ItemCard = ({ 
  item, 
  showActions = true, 
  className = "",
  onFavorite,
  onShare,
  size = "default" // "default", "small", "large"
}) => {
  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavorite) onFavorite(item.id);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) onShare(item);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'success';
      case 'sold':
        return 'secondary';
      case 'pending':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Card className={`item-card ${size !== 'default' ? `item-card-${size}` : ''} ${className}`}>
      <div className="item-image-container">
        <Card.Img 
          variant="top" 
          src={item.imageUrls?.[0] || item.image || '/images/placeholder.jpg'} 
          alt={item.title}
          className="item-image"
        />
        <Badge 
          bg={getStatusBadgeVariant(item.status)} 
          className="item-status-badge"
        >
          {item.status || 'Available'}
        </Badge>
        
        {showActions && (
          <div className="item-actions-overlay">
            <Button
              variant="light"
              size="sm"
              className="action-btn favorite-btn"
              onClick={handleFavorite}
              title="Add to favorites"
            >
              <FaHeart />
            </Button>
            <Button
              variant="light"
              size="sm"
              className="action-btn share-btn"
              onClick={handleShare}
              title="Share item"
            >
              <FaShare />
            </Button>
          </div>
        )}
      </div>
      
      <Card.Body className="item-card-body">
        <Card.Title className="item-title">{item.title}</Card.Title>
        
        <div className="item-price">
          {item.currency || 'RWF'} {item.price?.toLocaleString()}
        </div>
        
        {item.pickupDistrict && item.pickupProvince && (
          <div className="item-location">
            <FaMapMarkerAlt className="location-icon" />
            {item.pickupDistrict}, {item.pickupProvince}
          </div>
        )}
        
        {item.description && (
          <Card.Text className="item-description">
            {item.description.length > 100 
              ? `${item.description.substring(0, 100)}...` 
              : item.description
            }
          </Card.Text>
        )}
        
        <div className="item-meta">
          {item.condition && (
            <span className="item-condition">
              Condition: {item.condition}
            </span>
          )}
          {item.category && (
            <span className="item-category">
              {item.category}
            </span>
          )}
        </div>
        
        <Button 
          as={Link} 
          to={`/items/${item.id}`} 
          variant="outline-primary" 
          className="w-100 view-details-btn"
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ItemCard;
