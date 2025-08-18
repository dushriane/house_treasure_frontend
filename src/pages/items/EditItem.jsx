import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch item details on mount
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`/api/items/${id}`);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category,
          price: res.data.price,
          image: null, // Don't prefill image
        });
      } catch (err) {
        setError('Failed to load item details.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('price', formData.price);
      if (formData.image) {
        data.append('image', formData.image);
      }
      await axios.put(`/api/items/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Item updated successfully!');
      setTimeout(() => navigate('/items'), 1500);
    } catch (err) {
      setError('Failed to update item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <h1>Edit Item</h1>
          <p>Update your item listing below.</p>
          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Item Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="books">Books</option>
                  <option value="furniture">Furniture</option>
                  <option value="fashion">Fashion</option>
                  <option value="kitchen">Kitchen</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="price">
                <Form.Label>Price (USD)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Upload New Image (optional)</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </Form.Group>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : 'Update Item'}
              </Button>
              {message && <Alert variant="success" className="mt-3">{message}</Alert>}
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EditItem;