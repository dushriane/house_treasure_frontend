import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./onelisting.css";

const ListingDetail = () => {
  const { id } = useParams(); // Get listing ID from the route
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/listings/${id}`
        );
        setListing(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch listing details.");
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="listing-detail-container">
      <div className="listing-image">
        <img src={listing.imageUrl} alt={listing.title} />
      </div>
      <div className="listing-info">
        <h1>{listing.title}</h1>
        <p className="price">${listing.price}</p>
        <p className="description">{listing.description}</p>
        <p className="category">Category: {listing.category}</p>
        <p className="seller">Seller: {listing.sellerName}</p>
        <button className="contact-button">Contact Seller</button>
      </div>
    </div>
  );
};

export default ListingDetail;
