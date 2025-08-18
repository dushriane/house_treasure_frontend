import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="py-5">
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-section">
              <h5 className="footer-title">
                <FaHome className="me-2" />
                House Treasures
              </h5>
              <p className="footer-description">
                Turn your unused items into cash. Connect with buyers in Rwanda 
                and sell your treasures directly through secure mobile money payments.
              </p>
              <div className="social-links">
                <a
                  href="https://github.com/dushriane"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://x.com/ArianeDshm"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://linkedin.com/in/ariane-dushime"
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-subtitle">Quick Links</h6>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/items">Browse Items</Link></li>
                <li><Link to="/create-item">Sell Item</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-subtitle">Categories</h6>
              <ul className="footer-links">
                <li><Link to="/items?category=electronics">Electronics</Link></li>
                <li><Link to="/items?category=furniture">Furniture</Link></li>
                <li><Link to="/items?category=clothing">Clothing</Link></li>
                <li><Link to="/items?category=books">Books</Link></li>
              </ul>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-subtitle">Support</h6>
              <ul className="footer-links">
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <div className="footer-section">
              <h6 className="footer-subtitle">Contact Info</h6>
              <div className="contact-info">
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <span>+250 788 123 456</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>info@housetreasures.rw</span>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>Kigali, Rwanda</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        
        <Row className="border-top pt-4">
          <Col className="text-center">
            <p className="footer-bottom">
              © 2024 House Treasures. All rights reserved. 
              Making Rwanda's unused items valuable again.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 