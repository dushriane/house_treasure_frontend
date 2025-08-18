import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemsAPI, categoriesAPI } from '../services/api.js';
import { FaSearch, FaPlus, FaHandshake, FaShieldAlt, FaMobileAlt, FaMapMarkerAlt } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          itemsAPI.getAllItems({ limit: 8 }),
          categoriesAPI.getAllCategories()
        ]);
        setFeaturedItems(itemsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="hero-content">
              <h1 className="hero-title">
                Turn Your Unused Items Into
                <span className="text-gradient"> Cash</span>
              </h1>
              <p className="hero-subtitle">
                Discover hidden treasures in your home and connect with buyers in Rwanda. 
                Sell your unused items directly to people who need them, using secure mobile money payments.
              </p>
              <div className="hero-buttons">
                {user ? (
                  <Button as={Link} to="/create-item" size="lg" className="btn-primary-custom me-3">
                    <FaPlus className="me-2" />
                    Sell Your Item
                  </Button>
                ) : (
                  <Button as={Link} to="/register" size="lg" className="btn-primary-custom me-3">
                    Get Started
                  </Button>
                )}
                <Button as={Link} to="/items" variant="outline-light" size="lg">
                  <FaSearch className="me-2" />
                  Browse Items
                </Button>
              </div>
            </Col>
            <Col lg={6} className="hero-image">
              <div className="hero-image-container">
                <img 
                  src="/images/hero-illustration.jpg" 
                  alt="House Treasures" 
                  className="img-fluid"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Why Choose House Treasures?</h2>
              <p className="section-subtitle">
                The easiest way to sell your unused items in Rwanda
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaHandshake />
                  </div>
                  <Card.Title>Direct P2P Selling</Card.Title>
                  <Card.Text>
                    Connect directly with buyers. No middlemen, no hidden fees. 
                    Sell your items at the price you want.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaMobileAlt />
                  </div>
                  <Card.Title>Mobile Money Payments</Card.Title>
                  <Card.Text>
                    Secure payments through MTN Mobile Money and Airtel Money. 
                    Fast, safe, and convenient for everyone.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaShieldAlt />
                  </div>
                  <Card.Title>Safe & Secure</Card.Title>
                  <Card.Text>
                    Verified users, secure transactions, and built-in dispute resolution. 
                    Your safety is our priority.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Items Section */}
      <section className="featured-section py-5 bg-light">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="section-title">Featured Items</h2>
              <p className="section-subtitle">Discover amazing deals from your neighbors</p>
            </Col>
          </Row>
          <Row>
            {featuredItems.map((item) => (
              <Col key={item.id} lg={3} md={6} className="mb-4">
                <Card className="item-card h-100">
                  <div className="item-image-container">
                    <Card.Img 
                      variant="top" 
                      src={item.imageUrls?.[0] || '/images/pictureOne.png'} 
                      alt={item.title}
                    />
                    <Badge bg="success" className="item-status">
                      {item.status}
                    </Badge>
                  </div>
                  <Card.Body>
                    <Card.Title className="item-title">{item.title}</Card.Title>
                    <Card.Text className="item-price">
                      RWF {item.price?.toLocaleString()}
                    </Card.Text>
                    <Card.Text className="item-location">
                      <FaMapMarkerAlt className="me-1" />
                      {item.pickupDistrict}, {item.pickupProvince}
                    </Card.Text>
                    <Button 
                      as={Link} 
                      to={`/items/${item.id}`} 
                      variant="outline-primary" 
                      className="w-100"
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className="text-center mt-4">
            <Col>
              <Button as={Link} to="/items" variant="primary" size="lg">
                View All Items
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5">
        <Container>
          <Row className="mb-4">
            <Col>
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Find exactly what you're looking for</p>
            </Col>
          </Row>
          <Row>
            {categories.slice(0, 8).map((category) => (
              <Col key={category.id} lg={3} md={6} className="mb-4">
                <Card 
                  as={Link} 
                  to={`/items?category=${category.id}`}
                  className="category-card h-100 text-decoration-none"
                >
                  <Card.Body className="text-center">
                    <div className="category-icon">
                      {category.iconUrl ? (
                        <img src={category.iconUrl} alt={category.name} />
                      ) : (
                        <div className="category-placeholder">
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <Card.Title className="category-title">{category.name}</Card.Title>
                    <Card.Text className="category-count">
                      {category.itemCount || 0} items
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h2 className="cta-title">Ready to Start Selling?</h2>
              <p className="cta-subtitle">
                Join thousands of Rwandans who are already earning money from their unused items
              </p>
              {user ? (
                <Button as={Link} to="/create-item" size="lg" className="btn-primary-custom">
                  <FaPlus className="me-2" />
                  List Your First Item
                </Button>
              ) : (
                <Button as={Link} to="/register" size="lg" className="btn-primary-custom">
                  Join House Treasures
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home; 