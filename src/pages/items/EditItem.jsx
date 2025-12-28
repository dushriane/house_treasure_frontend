import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner, Badge } from 'react-bootstrap';
import { FiUpload, FiX, FiSave, FiArrowLeft, FiImage, FiTrash2, FiPlus } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';
import { itemsAPI } from '../../services/api';
import './EditItem.css';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    tags: []
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  //const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Condition options
  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  // Hardcoded categories
  const categories = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'clothing', name: 'Clothing & Fashion' },
    { id: 'books', name: 'Books & Media' },
    { id: 'toys', name: 'Toys & Games' },
    { id: 'art-crafts', name: 'Art & Crafts' },
    { id: 'jewelry', name: 'Jewelry & Accessories' },
    { id: 'musical', name: 'Musical Instruments' },
    { id: 'collectibles', name: 'Collectibles & Antiques' },
    { id: 'health-beauty', name: 'Health & Beauty' },
    { id: 'office', name: 'Office Supplies' },
    { id: 'other', name: 'Other' }
  ];

  // Load item data and categories
  useEffect(() => {
    if (id) {
      loadItemData();
    }
    //loadCategories();
  }, [id]);

  const loadItemData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await itemsAPI.getItemById(id);
      const data = response.data;
      
      // Check if user owns this item
      if (data.seller?.id !== user?.id) {
        setError('You can only edit your own items');
        return;
      }
      
      setFormData({
        title: data.title || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        category: data.category?.id || data.category || '',
        condition: data.condition || '',
        location: data.location || '',
        tags: data.tags || []
      });
      
      setExistingImages(data.images || []);
      
    } catch (err) {
      setError(err.message || 'Failed to load item data');
    } finally {
      setLoading(false);
    }
  };

  // const loadCategories = async () => {
  //   try {
  //     const response = await fetch('/api/categories');
  //     if (response.ok) {
  //       const data = await response.json();
  //       setCategories(data);
  //     }
  //   } catch (err) {
  //     console.error('Failed to load categories:', err);
  //   }
  // };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field);
  };

  const validateField = (field) => {
    const value = formData[field];
    let error = '';

    switch (field) {
      case 'title':
        if (!value?.trim()) {
          error = 'Title is required';
        } else if (value.trim().length < 3) {
          error = 'Title must be at least 3 characters';
        } else if (value.trim().length > 100) {
          error = 'Title must be less than 100 characters';
        }
        break;
      
      case 'description':
        if (!value?.trim()) {
          error = 'Description is required';
        } else if (value.trim().length < 10) {
          error = 'Description must be at least 10 characters';
        } else if (value.trim().length > 1000) {
          error = 'Description must be less than 1000 characters';
        }
        break;
      
      case 'price':
        if (!value) {
          error = 'Price is required';
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = 'Price must be a valid positive number';
        } else if (parseFloat(value) > 1000000) {
          error = 'Price must be less than $1,000,000';
        }
        break;
      
      case 'category':
        if (!value) {
          error = 'Category is required';
        }
        break;
      
      case 'condition':
        if (!value) {
          error = 'Condition is required';
        }
        break;
      
      case 'location':
        if (!value?.trim()) {
          error = 'Location is required';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return !error;
  };

  const validateForm = () => {
    const fields = ['title', 'description', 'price', 'category', 'condition', 'location'];
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  };

  // Image handlers
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    // Supported image types
    const supportedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (existingImages.length + newImages.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    const validFiles = [];
    const previews = [];

    files.forEach(file => {
      if (file.size > maxSize) {
        setError(`Image ${file.name} is too large. Maximum size is 5MB`);
        return;
      }

      // if (!file.type.startsWith('image/')) {
      //   setError(`${file.name} is not a valid image file`);
      //   return;
      // }

      // Updated validation for specific image types
      if (!supportedTypes.includes(file.type.toLowerCase())) {
        setError(`${file.name} is not a supported image format. Please use JPEG, PNG, GIF, or WebP.`);
        return;
      }

      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push({
          file,
          preview: e.target.result,
          id: Date.now() + Math.random()
        });
        
        if (previews.length === validFiles.length) {
          setNewImages(prev => [...prev, ...validFiles]);
          setPreviewImages(prev => [...prev, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear the input
    e.target.value = '';
  };

  const removeExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    setDeletedImages(prev => [...prev, imageId]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Tag handlers
  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the errors before submitting');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();

        // Validate and add each field
      if (!formData.title?.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.description?.trim()) {
        throw new Error('Description is required');
      }
      if (!formData.price || isNaN(parseFloat(formData.price))) {
        throw new Error('Valid price is required');
      }
      if (!formData.category) {
        throw new Error('Category is required');
      }
      if (!formData.condition) {
        throw new Error('Condition is required');
      }
      if (!formData.location?.trim()) {
        throw new Error('Location is required');
      }

      // Add form fields to FormData
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('price', parseFloat(formData.price).toString());
      submitData.append('category', formData.category);
      submitData.append('condition', formData.condition);
      submitData.append('location', formData.location.trim());
      
      // // Add form fields
      // Object.keys(formData).forEach(key => {
      //   if (key === 'tags') {
      //     submitData.append('tags', JSON.stringify(formData.tags));
      //   } else {
      //     submitData.append(key, formData[key]);
      //   }
      // });
      
      // Add tags as JSON string
      if (formData.tags && formData.tags.length > 0) {
        submitData.append('tags', JSON.stringify(formData.tags));
        console.log('Adding tags:', JSON.stringify(formData.tags));
      }
      // Add new images
      if (newImages && newImages.length > 0) {
        newImages.forEach((file, index) => {
          console.log(`Adding image ${index}:`, file.name, file.size, file.type);
          submitData.append('newImages', file);
        });
      }
      
      // Add deleted image IDs
      if (deletedImages.length > 0) {
        submitData.append('deletedImages', JSON.stringify(deletedImages));
      }

      // Use itemsAPI service with proper auth handling
      const response = id 
        ? await itemsAPI.updateItem(id, submitData)
        : await itemsAPI.createItem(submitData);
      
      const savedItem = response.data;
      setSuccess(id ? 'Item updated successfully!' : 'Item created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/items/${savedItem.id}`);
      }, 1500);
      
    } catch (err) {
      setError(err.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading item data...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="outline-primary"
          onClick={() => navigate(-1)}
          className="me-3"
        >
          <FiArrowLeft className="me-2" />
          Back
        </Button>
        <h2 className="mb-0">
          {id ? 'Edit Item' : 'Create New Item'}
        </h2>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="edit-form-card">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="form-section">
                  <h5 className="section-title">Basic Information</h5>
                  
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('title')}
                          isInvalid={touched.title && errors.title}
                          placeholder="Enter item title"
                          maxLength={100}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.title}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          {formData.title.length}/100 characters
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Price *</Form.Label>
                        <div className="price-input">
                          <span className="price-symbol">$</span>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('price')}
                            isInvalid={touched.price && errors.price}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.price}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('description')}
                      isInvalid={touched.description && errors.description}
                      placeholder="Describe your item in detail..."
                      maxLength={1000}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      {formData.description.length}/1000 characters
                    </Form.Text>
                  </Form.Group>
                </div>

                {/* Category and Condition */}
                <div className="form-section">
                  <h5 className="section-title">Category & Condition</h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category *</Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('category')}
                          isInvalid={touched.category && errors.category}
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.category}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Condition *</Form.Label>
                        <Form.Select
                          name="condition"
                          value={formData.condition}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('condition')}
                          isInvalid={touched.condition && errors.condition}
                        >
                          <option value="">Select condition</option>
                          {conditionOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.condition}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Location *</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('location')}
                      isInvalid={touched.location && errors.location}
                      placeholder="Enter your location"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.location}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                {/* Tags */}
                <div className="form-section">
                  <h5 className="section-title">Tags</h5>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Add Tags (Optional)</Form.Label>
                    <div className="tag-input-wrapper">
                      <Form.Control
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                        placeholder="Type a tag and press Enter"
                        disabled={formData.tags.length >= 10}
                      />
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={addTag}
                        disabled={!tagInput.trim() || formData.tags.length >= 10}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                    <Form.Text className="text-muted">
                      Press Enter or comma to add tags. Maximum 10 tags.
                    </Form.Text>
                  </Form.Group>

                  {formData.tags.length > 0 && (
                    <div className="tags-display">
                      {formData.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          bg="primary"
                          className="tag-badge"
                        >
                          {tag}
                          <Button
                            variant="link"
                            size="sm"
                            className="tag-remove"
                            onClick={() => removeTag(tag)}
                          >
                            <FiX />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Images */}
                <div className="form-section">
                  <h5 className="section-title">Images</h5>
                  
                  <div className="image-upload-section">
                    {(existingImages.length + newImages.length) < 5 && (
                      <div className="upload-area">
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleImageUpload}
                          id="image-upload"
                          className="d-none"
                        />
                        <label htmlFor="image-upload" className="upload-label">
                          <FiUpload className="upload-icon" />
                          <span>Choose Images</span>
                          <small>JPEG, JPG, PNG, GIF up to 5MB each</small>
                        </label>
                      </div>
                    )}

                    <div className="images-grid">
                      {/* Existing Images */}
                      {existingImages.map((image, index) => (
                        <div key={image.id} className="image-item">
                          <img
                            src={image.url}
                            alt={`Item ${index + 1}`}
                            className="image-preview"
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="image-remove"
                            onClick={() => removeExistingImage(image.id)}
                          >
                            <FiTrash2 />
                          </Button>
                          {index === 0 && (
                            <Badge bg="primary" className="primary-badge">
                              Primary
                            </Badge>
                          )}
                        </div>
                      ))}

                      {/* New Images */}
                      {previewImages.map((preview, index) => (
                        <div key={preview.id} className="image-item">
                          <img
                            src={preview.preview}
                            alt={`New ${index + 1}`}
                            className="image-preview"
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="image-remove"
                            onClick={() => removeNewImage(index)}
                          >
                            <FiTrash2 />
                          </Button>
                          {existingImages.length === 0 && index === 0 && (
                            <Badge bg="primary" className="primary-badge">
                              Primary
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>

                    <Form.Text className="text-muted">
                      Upload up to 5 images. First image will be the primary display image.
                    </Form.Text>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="form-actions">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                    className="ms-3"
                  >
                    {saving ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        {id ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <FiSave className="me-2" />
                        {id ? 'Update Item' : 'Create Item'}
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Preview/Help Sidebar */}
        <Col lg={4}>
          <Card className="preview-card">
            <Card.Header>
              <h6 className="mb-0">
                <FiImage className="me-2" />
                Preview
              </h6>
            </Card.Header>
            <Card.Body>
              {(existingImages.length > 0 || previewImages.length > 0) ? (
                <div className="preview-image-container">
                  <img
                    src={existingImages[0]?.url || previewImages[0]?.preview}
                    alt="Preview"
                    className="preview-main-image"
                  />
                </div>
              ) : (
                <div className="no-image-preview">
                  <FiImage size={48} />
                  <p>No images uploaded</p>
                </div>
              )}

              <div className="preview-content">
                <h6 className="preview-title">
                  {formData.title || 'Item Title'}
                </h6>
                <p className="preview-price">
                  ${formData.price || '0.00'}
                </p>
                <p className="preview-description">
                  {formData.description || 'Item description will appear here...'}
                </p>
                
                {formData.tags.length > 0 && (
                  <div className="preview-tags">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="me-1 mb-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Tips */}
          <Card className="tips-card mt-3">
            <Card.Header>
              <h6 className="mb-0">Tips for Better Listings</h6>
            </Card.Header>
            <Card.Body>
              <ul className="tips-list">
                <li>Use clear, high-quality photos</li>
                <li>Write detailed descriptions</li>
                <li>Set competitive prices</li>
                <li>Be honest about condition</li>
                <li>Respond quickly to messages</li>
                <li>Use relevant tags for better discovery</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditItem;
