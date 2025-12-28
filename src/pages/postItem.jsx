import React, { useState } from "react";
import "./postItem.css";
import Navbar from "../components/layout/Navbar";
import axios from "axios";

const SellItem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    condition: "",
    brand: "",
    model: "",
    yearOfPurchase: "",
    originalReceipt: null,
    pickupProvince: "",
    pickupDistrict: "",
    pickupSector: "",
    pickupCell: "",
    pickupVillage: "",
    pickupAddress: "",
    images: [], // for multiple images
    isNegotiable: true,
    minimumPrice: "",
  });
  const [message, setMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle single file (original receipt)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        originalReceipt: file,
      }));
      
      // Create preview for receipt
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview({
          url: reader.result,
          name: file.name,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setFormData((prevData) => ({
      ...prevData,
      originalReceipt: null,
    }));
    setReceiptPreview(null);
  };

  // Handle multiple images
  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 10) {
      setErrors(prev => ({ ...prev, images: 'Maximum 10 images allowed' }));
      return;
    }
    
    setFormData((prevData) => ({
      ...prevData,
      images: files,
    }));
    
    // Create previews
    const previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push({
          url: reader.result,
          name: file.name
        });
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.condition) {
      newErrors.condition = 'Please select a condition';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'Please upload at least one image';
    }
    if (formData.isNegotiable && (!formData.minimumPrice || parseFloat(formData.minimumPrice) <= 0)) {
      newErrors.minimumPrice = 'Please set a minimum price for negotiable items';
    }
    if (formData.isNegotiable && parseFloat(formData.minimumPrice) >= parseFloat(formData.price)) {
      newErrors.minimumPrice = 'Minimum price must be less than price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage('Please fix the errors in the form');
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Create a FormData object to handle image file upload
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("condition", formData.condition);
      data.append("brand", formData.brand);
      data.append("model", formData.model);
      data.append("yearOfPurchase", formData.yearOfPurchase);
      data.append("pickupProvince", formData.pickupProvince);
      data.append("pickupDistrict", formData.pickupDistrict);
      data.append("pickupSector", formData.pickupSector);
      data.append("pickupCell", formData.pickupCell);
      data.append("pickupVillage", formData.pickupVillage);
      data.append("pickupAddress", formData.pickupAddress);
      data.append("isNegotiable", formData.isNegotiable);
      data.append("minimumPrice", formData.minimumPrice);


      // Append original receipt if present
      if (formData.originalReceipt) {
        data.append("originalReceipt", formData.originalReceipt);
      }

      // Append all images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((img, idx) => {
          data.append("images", img);
        });
      }

      // Send POST request to the backend
      const response = await axios.post("http://localhost:8080/api/items", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Display success message
      setMessage('Item posted successfully!');
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        condition: "",
        brand: "",
        model: "",
        yearOfPurchase: "",
        originalReceipt: null,
        pickupProvince: "",
        pickupDistrict: "",
        pickupSector: "",
        pickupCell: "",
        pickupVillage: "",
        pickupAddress: "",
        images: [],
        isNegotiable: true,
        minimumPrice: "",
      });
      setImagePreviews([]);
      setReceiptPreview(null);
    } catch (error) {
      console.error("Error adding item:", error);
      setMessage(error.response?.data?.message || "Failed to add item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sell-item-container">
      <Navbar />
      <h1 className="sell-item-title">Sell Your Treasure</h1>
      <p className="sell-item-subtitle">
        Turn your unused items into extra cash!
      </p>
      
      {message && <p className={message.includes('success') ? "message success" : "message error"}>{message}</p>}
      
      <form className="sell-item-form" onSubmit={handleSubmit}>
        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="form-group">
            <label>Image Previews</label>
            <div className="image-preview-grid">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview-item">
                  <img src={preview.url} alt={preview.name} />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {receiptPreview && (
          <div className="form-group">
            <label>Receipt Preview</label>
            <div className="receipt-preview">
              {receiptPreview.type.startsWith('image/') ? (
                <img src={receiptPreview.url} alt="Receipt" style={{maxWidth: '200px'}} />
              ) : (
                <p>📄 {receiptPreview.name}</p>
              )}
              <button
                type="button"
                className="remove-receipt-btn"
                onClick={removeReceipt}
              >
                Remove
              </button>
            </div>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="title">Item Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the title of your item"
            required
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a detailed description"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
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
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
          >
            <option value="">Select condition</option>
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand (optional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Model (optional)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="yearOfPurchase">Year of Purchase</label>
          <input
            type="number"
            id="yearOfPurchase"
            name="yearOfPurchase"
            value={formData.yearOfPurchase}
            onChange={handleChange}
            placeholder="Year of purchase"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price (USD)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Set a price for your item"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="originalReceipt">Original Receipt (optional)</label>
          <input
            type="file"
            id="originalReceipt"
            name="originalReceipt"
            onChange={handleFileUpload} // implement this handler
            accept="image/*,application/pdf"
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImagesUpload} // implement this handler for multiple files
            accept="image/*"
            multiple
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isNegotiable"
              checked={formData.isNegotiable}
              onChange={e => setFormData(prev => ({ ...prev, isNegotiable: e.target.checked }))}
            />
            Negotiable
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="minimumPrice">Minimum Price (if negotiable)</label>
          <input
            type="number"
            id="minimumPrice"
            name="minimumPrice"
            value={formData.minimumPrice}
            onChange={handleChange}
            placeholder="Minimum price"
            disabled={!formData.isNegotiable}
          />
        </div>
        <button type="submit" className="submit-button">
          Post Item
        </button>
      </form>
    </div>
  );
};

export default SellItem;
