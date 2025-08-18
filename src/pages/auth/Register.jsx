import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    province: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    mtnMobileMoneyNumber: '',
    airtelMoneyNumber: '',
    preferredPaymentMethod: 'MTN'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword from the data sent to API
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const rwandaProvinces = [
    'Kigali City',
    'Eastern Province',
    'Northern Province',
    'Southern Province',
    'Western Province'
  ];

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center align-items-center py-5">
          <Col md={8} lg={6}>
            <Card className="auth-card">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="auth-title">Join House Treasures</h2>
                  <p className="auth-subtitle">
                    Create your account and start selling your unused items
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <div className="input-group-custom">
                          <FaUser className="input-icon" />
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                            className="form-control-custom"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <div className="input-group-custom">
                          <FaUser className="input-icon" />
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                            className="form-control-custom"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <div className="input-group-custom">
                          <FaUser className="input-icon" />
                          <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            required
                            className="form-control-custom"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <div className="input-group-custom">
                          <FaEnvelope className="input-icon" />
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="form-control-custom"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <div className="input-group-custom">
                          <FaLock className="input-icon" />
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="form-control-custom"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <div className="input-group-custom">
                          <FaLock className="input-icon" />
                          <Form.Control
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            required
                            className="form-control-custom"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <div className="input-group-custom">
                      <FaPhone className="input-icon" />
                      <Form.Control
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                        className="form-control-custom"
                      />
                    </div>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Province</Form.Label>
                        <div className="input-group-custom">
                          <FaMapMarkerAlt className="input-icon" />
                          <Form.Select
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            required
                            className="form-control-custom"
                          >
                            <option value="">Select Province</option>
                            {rwandaProvinces.map(province => (
                              <option key={province} value={province}>
                                {province}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>District</Form.Label>
                        <div className="input-group-custom">
                          <FaMapMarkerAlt className="input-icon" />
                          <Form.Control
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            placeholder="Enter your district"
                            required
                            className="form-control-custom"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Sector</Form.Label>
                        <div className="input-group-custom">
                          <FaMapMarkerAlt className="input-icon" />
                          <Form.Control
                            type="text"
                            name="sector"
                            value={formData.sector}
                            onChange={handleChange}
                            placeholder="Enter your sector"
                            required
                            className="form-control-custom"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Cell</Form.Label>
                        <div className="input-group-custom">
                          <FaMapMarkerAlt className="input-icon" />
                          <Form.Control
                            type="text"
                            name="cell"
                            value={formData.cell}
                            onChange={handleChange}
                            placeholder="Enter your cell"
                            required
                            className="form-control-custom"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Village</Form.Label>
                    <div className="input-group-custom">
                      <FaMapMarkerAlt className="input-icon" />
                      <Form.Control
                        type="text"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        placeholder="Enter your village"
                        required
                        className="form-control-custom"
                      />
                    </div>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>MTN Mobile Money Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="mtnMobileMoneyNumber"
                          value={formData.mtnMobileMoneyNumber}
                          onChange={handleChange}
                          placeholder="MTN Mobile Money number"
                          className="form-control-custom"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Airtel Money Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="airtelMoneyNumber"
                          value={formData.airtelMoneyNumber}
                          onChange={handleChange}
                          placeholder="Airtel Money number"
                          className="form-control-custom"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Preferred Payment Method</Form.Label>
                    <Form.Select
                      name="preferredPaymentMethod"
                      value={formData.preferredPaymentMethod}
                      onChange={handleChange}
                      className="form-control-custom"
                    >
                      <option value="MTN">MTN Mobile Money</option>
                      <option value="AIRTEL">Airtel Money</option>
                      <option value="BOTH">Both</option>
                    </Form.Select>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    className="btn-auth w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="auth-link">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register; 