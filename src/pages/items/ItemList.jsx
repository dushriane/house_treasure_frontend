import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Dropdown, Pagination, Alert, Spinner } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { itemsAPI, categoriesAPI } from '../../services/api';
import { ItemCard, SearchBox, DashboardLayout } from '../../components';
import { 
  FaFilter, 
  FaSortAmountDown, 
  FaSortAmountUp, 
  FaGrid3X3, 
  FaList, 
  FaMapMarkerAlt,
  FaTimes
} from 'react-icons/fa';
import './ItemList.css';

const ItemList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filters and search
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    location: searchParams.get('location') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchItems();
    updateURL();
  }, [filters, pagination.currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage - 1, // API uses 0-based indexing
        size: pagination.itemsPerPage
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await itemsAPI.getAllItems(params);
      
      setItems(response.data.content || response.data);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages || Math.ceil(response.data.length / prev.itemsPerPage),
        totalItems: response.data.totalElements || response.data.length
      }));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    if (pagination.currentPage > 1) {
      params.set('page', pagination.currentPage.toString());
    }
    
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handleSearch = (searchQuery) => {
    handleFilterChange('search', searchQuery);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortOptions = [
    { value: 'createdAt', label: 'Date Listed', icon: FaSortAmountDown },
    { value: 'price', label: 'Price', icon: FaSortAmountDown },
    { value: 'title', label: 'Title', icon: FaSortAmountDown }
  ];

  const conditionOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'GOOD', label: 'Good' },
    { value: 'FAIR', label: 'Fair' },
    { value: 'POOR', label: 'Poor' }
  ];

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value && value !== 'createdAt' && value !== 'desc'
    ).length;
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const halfRange = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, pagination.currentPage - halfRange);
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === pagination.currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.First 
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
          />
          <Pagination.Prev 
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          />
          {startPage > 1 && (
            <>
              <Pagination.Item onClick={() => handlePageChange(1)}>1</Pagination.Item>
              {startPage > 2 && <Pagination.Ellipsis />}
            </>
          )}
          {pages}
          {endPage < pagination.totalPages && (
            <>
              {endPage < pagination.totalPages - 1 && <Pagination.Ellipsis />}
              <Pagination.Item onClick={() => handlePageChange(pagination.totalPages)}>
                {pagination.totalPages}
              </Pagination.Item>
            </>
          )}
          <Pagination.Next 
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          />
          <Pagination.Last 
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
          />
        </Pagination>
      </div>
    );
  };

  return (
    <DashboardLayout title="Browse Items">
      <Container fluid>
        {/* Search and Filters Header */}
        <Row className="mb-4">
          <Col lg={8} className="mb-3 mb-lg-0">
            <SearchBox
              placeholder="Search for items..."
              onSearch={handleSearch}
              initialValue={filters.search}
              size="lg"
            />
          </Col>
          <Col lg={4}>
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                className="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="me-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="filter-count">{getActiveFiltersCount()}</span>
                )}
              </Button>
              
              <div className="view-mode-toggle">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <FaGrid3X3 />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <FaList />
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Advanced Filters */}
        {showFilters && (
          <Row className="mb-4">
            <Col>
              <div className="filters-panel">
                <Row>
                  <Col md={6} lg={3} className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col md={6} lg={3} className="mb-3">
                    <Form.Label>Condition</Form.Label>
                    <Form.Select
                      value={filters.condition}
                      onChange={(e) => handleFilterChange('condition', e.target.value)}
                    >
                      <option value="">Any Condition</option>
                      {conditionOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  
                  <Col md={6} lg={2} className="mb-3">
                    <Form.Label>Min Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </Col>
                  
                  <Col md={6} lg={2} className="mb-3">
                    <Form.Label>Max Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="999999"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </Col>
                  
                  <Col lg={2} className="mb-3">
                    <Form.Label>Sort By</Form.Label>
                    <div className="d-flex">
                      <Form.Select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="me-2"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                      >
                        {filters.sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                      </Button>
                    </div>
                  </Col>
                </Row>
                
                <div className="filter-actions">
                  <Button variant="outline-danger" size="sm" onClick={handleClearFilters}>
                    <FaTimes className="me-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* Results Header */}
        <Row className="mb-3">
          <Col>
            <div className="results-header">
              <span className="results-count">
                {loading ? 'Loading...' : `${pagination.totalItems} items found`}
              </span>
            </div>
          </Col>
        </Row>

        {/* Loading State */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
            <div className="mt-3">
              <Button variant="outline-primary" onClick={fetchItems}>
                Try Again
              </Button>
            </div>
          </Alert>
        )}

        {/* Items Grid/List */}
        {!loading && !error && (
          <>
            {items.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaMapMarkerAlt size={60} />
                </div>
                <h3>No items found</h3>
                <p>Try adjusting your search criteria or filters</p>
                <Button variant="primary" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <Row className={viewMode === 'grid' ? 'items-grid' : 'items-list'}>
                {items.map(item => (
                  <Col 
                    key={item.id} 
                    lg={viewMode === 'grid' ? 4 : 12} 
                    md={viewMode === 'grid' ? 6 : 12} 
                    className="mb-4"
                  >
                    <ItemCard 
                      item={item} 
                      size={viewMode === 'list' ? 'large' : 'default'}
                      onClick={() => navigate(`/items/${item.id}`)}
                    />
                  </Col>
                ))}
              </Row>
            )}

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default ItemList;
