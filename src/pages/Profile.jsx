import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Tab, Tabs, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, itemsAPI, transactionsAPI } from '../services/api.js';
import { FaUser, FaEdit, FaSave, FaTimes, FaBox, FaExchangeAlt, FaEye, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { DashboardLayout, LoadingSpinner, ItemCard } from '../components';
import './Profile.css';


const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bio: '',
    location: '',
    joinDate: ''
  });
  const [userItems, setUserItems] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    soldItems: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileResponse, itemsResponse, transactionsResponse] = await Promise.all([
        userAPI.getProfile(user.id),
        itemsAPI.getUserItems(user.id),
        transactionsAPI.getUserTransactions(user.id)
      ]);

      const profileData = profileResponse.data;
      setProfile({
        username: profileData.username || '',
        email: profileData.email || '',
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        phoneNumber: profileData.phoneNumber || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        joinDate: profileData.createdAt || ''
      });

      const items = itemsResponse.data || [];
      const transactions = transactionsResponse.data || [];

      setUserItems(items.slice(0, 6)); // Show only recent 6 items
      setUserTransactions(transactions.slice(0, 5)); // Show only recent 5 transactions

      // Calculate stats
      const totalRevenue = transactions
        .filter(t => t.status === 'COMPLETED' && t.type === 'SALE')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      setStats({
        totalItems: items.length,
        activeItems: items.filter(item => item.status === 'AVAILABLE').length,
        soldItems: items.filter(item => item.status === 'SOLD').length,
        totalRevenue
      });

      setError('');
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await userAPI.updateProfile(user.id, profile);
      updateUser(response.data); // Update user context
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 5000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    // Reset to original values
    fetchProfileData();
    setEditing(false);
    setError('');
    setMessage('');
  };

  if (loading) {
    return (
      <DashboardLayout title="Profile">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="User Profile">
      {/*Success/Error Messages
      {message && (
        <Row className="mb-4">
          <Col>
            <AlertMessage 
              variant="success" 
              message={message} 
              onClose={() => setMessage('')}
            />
          </Col>
        </Row>
      )}

      {error && (
        <Row className="mb-4">
          <Col>
            <AlertMessage 
              variant="danger" 
              message={error} 
              onClose={() => setError('')}
            />
          </Col>
        </Row>
      )}*/}

      <Row>
        {/* Profile Header */}
        <Col lg={4} className="mb-4">
          <Card className="profile-header-card">
            <Card.Body className="text-center">
              <div className="profile-avatar">
                <FaUser />
              </div>
              <h3 className="profile-name">
                {profile.firstName && profile.lastName 
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile.username
                }
              </h3>
              <p className="profile-username">@{profile.username}</p>
              {profile.bio && (
                <p className="profile-bio">{profile.bio}</p>
              )}
              
              <div className="profile-info">
                {profile.location && (
                  <div className="profile-info-item">
                    <FaMapMarkerAlt className="me-1" />
                    {profile.location}
                  </div>
                )}
                {profile.phoneNumber && (
                  <div className="profile-info-item">
                    <FaPhone className="me-1" />
                    {profile.phoneNumber}
                  </div>
                )}
                <div className="profile-info-item">
                  <FaEnvelope className="me-1" />
                  {profile.email}
                </div>
                {profile.joinDate && (
                  <div className="profile-info-item">
                    <FaCalendarAlt className="me-1" />
                    Joined {new Date(profile.joinDate).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                )}
              </div>

              <Button 
                variant={editing ? "outline-secondary" : "primary"} 
                onClick={() => editing ? cancelEdit() : setEditing(true)}
                className="mt-3"
              >
                {editing ? (
                  <>
                    <FaTimes className="me-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <FaEdit className="me-1" />
                    Edit Profile
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>

          {/* Stats Card */}
          <Card className="profile-stats-card">
            <Card.Header>
              <h6 className="mb-0">Profile Statistics</h6>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col xs={6} className="mb-3">
                  <div className="stat-item">
                    <h4 className="stat-number">{stats.totalItems}</h4>
                    <p className="stat-label">Total Items</p>
                  </div>
                </Col>
                <Col xs={6} className="mb-3">
                  <div className="stat-item">
                    <h4 className="stat-number">{stats.activeItems}</h4>
                    <p className="stat-label">Active</p>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="stat-item">
                    <h4 className="stat-number">{stats.soldItems}</h4>
                    <p className="stat-label">Sold</p>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="stat-item">
                    <h4 className="stat-number">RWF {stats.totalRevenue.toLocaleString()}</h4>
                    <p className="stat-label">Revenue</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={8}>
          <Card className="profile-content-card">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="profile-tabs"
              >
                {/* Profile Information Tab */}
                <Tab eventKey="profile" title="Profile Information">
                  <div className="tab-content-wrapper">
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                              type="text"
                              name="username"
                              value={profile.username}
                              disabled
                              className="form-control-readonly"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={profile.email}
                              disabled
                              className="form-control-readonly"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={profile.firstName}
                              onChange={handleChange}
                              disabled={!editing}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={profile.lastName}
                              onChange={handleChange}
                              disabled={!editing}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="phoneNumber"
                              value={profile.phoneNumber}
                              onChange={handleChange}
                              disabled={!editing}
                              placeholder="+250 xxx xxx xxx"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                              type="text"
                              name="location"
                              value={profile.location}
                              onChange={handleChange}
                              disabled={!editing}
                              placeholder="City, District"
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="bio"
                          value={profile.bio}
                          onChange={handleChange}
                          disabled={!editing}
                          placeholder="Tell us about yourself..."
                        />
                      </Form.Group>

                      {editing && (
                        <div className="d-flex gap-2">
                          <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <LoadingSpinner size="sm" className="me-1" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <FaSave className="me-1" />
                                Save Changes
                              </>
                            )}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline-secondary" 
                            onClick={cancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </Form>
                  </div>
                </Tab>

                {/* My Items Tab */}
                <Tab 
                  eventKey="items" 
                  title={
                    <span>
                      My Items <Badge bg="primary">{stats.totalItems}</Badge>
                    </span>
                  }
                >
                  <div className="tab-content-wrapper">
                    {userItems.length === 0 ? (
                      <div className="profile-empty-state">
                        <FaBox className="empty-icon" />
                        <h5>No items listed yet</h5>
                        <p className="text-muted">Start selling by listing your first item!</p>
                        <Button variant="primary" href="/create-item">
                          List Your First Item
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Row>
                          {userItems.map((item) => (
                            <Col md={6} lg={4} key={item.id} className="mb-4">
                              <ItemCard item={item} size="sm" showActions />
                            </Col>
                          ))}
                        </Row>
                        {stats.totalItems > 6 && (
                          <div className="text-center mt-4">
                            <Button variant="outline-primary" href="/dashboard">
                              View All Items ({stats.totalItems})
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Tab>

                {/* Transaction History Tab */}
                <Tab 
                  eventKey="transactions" 
                  title={
                    <span>
                      Transactions <Badge bg="success">{userTransactions.length}</Badge>
                    </span>
                  }
                >
                  <div className="tab-content-wrapper">
                    {userTransactions.length === 0 ? (
                      <div className="profile-empty-state">
                        <FaExchangeAlt className="empty-icon" />
                        <h5>No transactions yet</h5>
                        <p className="text-muted">Your transaction history will appear here.</p>
                      </div>
                    ) : (
                      <>
                        <div className="transaction-history">
                          {userTransactions.map((transaction) => (
                            <div key={transaction.id} className="transaction-history-item">
                              <div className="transaction-icon">
                                <FaExchangeAlt />
                              </div>
                              <div className="transaction-details">
                                <h6>{transaction.itemTitle}</h6>
                                <p className="text-muted">
                                  {transaction.type === 'SALE' ? 'Sold to' : 'Bought from'}: {transaction.otherUserName}
                                </p>
                                <small className="text-muted">
                                  {new Date(transaction.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                              <div className="transaction-amount">
                                <strong>RWF {transaction.amount?.toLocaleString()}</strong>
                                <Badge 
                                  bg={transaction.status === 'COMPLETED' ? 'success' : 'warning'}
                                  className="d-block mt-1"
                                >
                                  {transaction.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center mt-4">
                          <Button variant="outline-primary" href="/transactions">
                            View All Transactions
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};

export default Profile;