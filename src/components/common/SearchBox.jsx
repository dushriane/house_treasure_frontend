import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBox.css';

const SearchBox = ({ 
  placeholder = "Search for items...",
  onSearch,
  onClear,
  initialValue = "",
  className = "",
  size = "default", // "sm", "default", "lg"
  autoFocus = false,
  disabled = false
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onClear) {
      onClear();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <Form 
      className={`search-box ${className}`} 
      onSubmit={handleSubmit}
    >
      <InputGroup className={`search-input-group ${size !== 'default' ? `search-input-group-${size}` : ''}`}>
        <Form.Control
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
          size={size}
          autoFocus={autoFocus}
          disabled={disabled}
          aria-label="Search"
        />
        
        {searchQuery && (
          <Button 
            variant="outline-secondary" 
            className="clear-btn"
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
            disabled={disabled}
          >
            <FaTimes />
          </Button>
        )}
        
        <Button 
          type="submit" 
          variant="outline-primary"
          className="search-btn"
          disabled={disabled || !searchQuery.trim()}
          aria-label="Search"
        >
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
