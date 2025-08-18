import React from "react";
import "./listings.css";
import  Navbar  from "../components/layout/Navbar";

const Listings = () => {
  const listingsData = [
    {
      id: 1,
      title: "Vintage Kitchen Utensils",
      description: "A set of classic utensils for your kitchen.",
      price: "$30",
      image:
        "https://img.freepik.com/free-photo/flat-lay-kitchen-utensils-arrangement_23-2149491471.jpg",
    },
    {
      id: 2,
      title: "Wooden Coffee Table",
      description: "Elegant and modern wooden coffee table.",
      price: "$120",
      image:
        "https://img.freepik.com/free-photo/top-view-modern-wooden-coffee-table_23-2148952096.jpg",
    },
    {
      id: 3,
      title: "Cozy Armchair",
      description: "Comfortable armchair in excellent condition.",
      price: "$90",
      image:
        "https://img.freepik.com/free-photo/cozy-modern-armchair-living-room_23-2148917005.jpg",
    },
    // Add more listings as needed
  ];

  return (
    <div className="listings-container">
      <Navbar />
      <main className="listings-main">
        <h1>Available Listings</h1>
        <div className="listings-grid">
          {listingsData.map((item) => (
            <div className="listing-card" key={item.id}>
              <img
                src={item.image}
                alt={item.title}
                className="listing-image"
              />
              <div className="listing-info">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <span className="listing-price">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Listings;
