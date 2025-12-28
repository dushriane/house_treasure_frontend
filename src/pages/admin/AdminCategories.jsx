import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaFolder } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { categoriesAPI } from '../../services/api';
import { DashboardLayout, LoadingSpinner, AlertMessage } from '../../components';
import './AdminCategories.css';

const AdminCategories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    isActive: true
  });
  
  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'ADMIN') {
      setError('Access denied. Admin privileges required.');
      setLoading(false);
      return;
    }
    
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAllCategories();
      setCategories(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, category = null) => {
    setModalMode(mode);
    setSelectedCategory(category);
    
    if (mode === 'edit' && category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '',
        isActive: category.isActive !== undefined ? category.isActive : true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
        isActive: true
      });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: '',
      isActive: true
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setActionLoading(true);
      
      if (modalMode === 'create') {
        await categoriesAPI.createCategory(formData);
        setSuccessMsg('Category created successfully!');
      } else {
        await categoriesAPI.updateCategory(selectedCategory.id, formData);
        setSuccessMsg('Category updated successfully!');
      }
      
      handleCloseModal();
      await fetchCategories();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving category:', err);
      setError(err.response?.data?.message || 'Failed to save category. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setActionLoading(true);
      await categoriesAPI.deleteCategory(categoryToDelete.id);
      setSuccessMsg('Category deleted successfully!');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      await fetchCategories();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.message || 'Failed to delete category. It may be in use.');
    } finally {
      setActionLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <DashboardLayout title="Admin Panel">
        <Container>
          <Alert variant="danger">
            <h5>Access Denied</h5>
            <p>You do not have permission to access this page. Admin privileges are required.</p>
          </Alert>
        </Container>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout title="Category Management">
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin - Category Management">
      <Container>
        {/* Success/Error Messages */}
        {successMsg && (
          <AlertMessage 
            variant="success" 
            message={successMsg} 
            onClose={() => setSuccessMsg('')}
          />
        )}
        
        {error && (
          <AlertMessage 
            variant="danger" 
            message={error} 
            onClose={() => setError('')}
          />
        )}

        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4>
                  <FaFolder className="me-2" />
                  Categories
                </h4>
                <p className="text-muted mb-0">Manage product categories</p>
              </div>
              <Button 
                variant="primary" 
                onClick={() => handleOpenModal('create')}
              >
                <FaPlus className="me-2" />
                Add Category
              </Button>
            </div>
          </Col>
        </Row>

        {/* Categories Table */}
        <Card>
          <Card.Body>
            {categories.length === 0 ? (
              <div className="text-center py-5">
                <FaFolder className="text-muted" size={48} />
                <p className="mt-3 text-muted">No categories found</p>
                <Button variant="primary" onClick={() => handleOpenModal('create')}>
                  Create First Category
                </Button>
              </div>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Items Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        {category.icon ? (
                          <span className="category-icon">{category.icon}</span>
                        ) : (
                          <FaFolder className="text-muted" />
                        )}
                      </td>
                      <td>
                        <strong>{category.name}</strong>
                      </td>
                      <td>
                        {category.description || <span className="text-muted">No description</span>}
                      </td>
                      <td>
                        <Badge bg={category.isActive ? 'success' : 'secondary'}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg="info">{category.itemCount || 0}</Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleOpenModal('edit', category)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteClick(category)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Create/Edit Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalMode === 'create' ? 'Create Category' : 'Edit Category'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Category Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Electronics"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of this category"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Icon (Emoji)</Form.Label>
                <Form.Control
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="📱"
                  maxLength={2}
                />
                <Form.Text className="text-muted">
                  Enter an emoji to represent this category
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="checkbox"
                  name="isActive"
                  label="Active"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                <FaTimes className="me-2" />
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    {modalMode === 'create' ? 'Create' : 'Update'}
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete the category <strong>{categoryToDelete?.name}</strong>?</p>
            <Alert variant="warning" className="mb-0">
              <small>This action cannot be undone. Items in this category will need to be reassigned.</small>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </DashboardLayout>
  );
};

export default AdminCategories;
