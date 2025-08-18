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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle single file (original receipt)
  const handleFileUpload = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      originalReceipt: e.target.files[0],
    }));
  };

  // Handle multiple images
  const handleImagesUpload = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      images: Array.from(e.target.files),
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      setMessage(response.data);
    } catch (error) {
      console.error("Error adding item:", error);
      setMessage("Failed to add item. Please try again.");
    }
  };

  return (
    <div className="sell-item-container">
      <Navbar />
      <h1 className="sell-item-title">Sell Your Treasure</h1>
      <p className="sell-item-subtitle">
        Turn your unused items into extra cash!
      </p>
      
      {message && <p className="message">{message}</p>}
      
      <form className="sell-item-form" onSubmit={handleSubmit}>
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
          />
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
