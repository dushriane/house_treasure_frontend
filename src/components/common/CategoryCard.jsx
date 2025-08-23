import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ 
  category, 
  className = "",
  size = "default" // "default", "small", "large"
}) => {
  return (
    <Card 
      as={Link} 
      to={`/items?category=${category.id || category.name?.toLowerCase()}`}
      className={`category-card ${size !== 'default' ? `category-card-${size}` : ''} ${className} h-100 text-decoration-none`}
    >
      <Card.Body className="text-center category-card-body">
        <div className="category-icon">
          {category.iconUrl ? (
            <img src={category.iconUrl} alt={category.name} />
          ) : category.icon ? (
            <div className="category-icon-component">
              {category.icon}
            </div>
          ) : (
            <div className="category-placeholder">
              {category.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <Card.Title className="category-title">{category.name}</Card.Title>
        
        <Card.Text className="category-count">
          {category.itemCount || category.count || 0} items
        </Card.Text>
        
        {category.description && (
          <Card.Text className="category-description">
            {category.description}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default CategoryCard;
