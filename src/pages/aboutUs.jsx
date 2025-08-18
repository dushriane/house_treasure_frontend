import React from "react";
import "./aboutUs.css";
import Navbar from "../components/layout/Navbar";

const AboutUs = () => {
  return (
    <div className="about-container">
      <Navbar />
      <main className="about-main">
        <section className="about-header">
          <h1>About Us</h1>
          <p>Connecting buyers and sellers, one treasure at a time.</p>
        </section>
        <section className="about-content">
          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              Our goal is to create a seamless and trusted platform where users
              can buy or sell pre-loved items. Whether you're looking to
              declutter your home or find hidden treasures, we've got you
              covered.
            </p>
          </div>
          <div className="about-card">
            <h2>For Sellers</h2>
            <p>
              List your unused items in minutes and turn them into extra cash.
              Our intuitive platform ensures your listings reach the right
              audience.
            </p>
          </div>
          <div className="about-card">
            <h2>For Buyers</h2>
            <p>
              Discover a wide range of items at affordable prices. From
              household essentials to rare finds, our platform is the perfect
              place to shop sustainably.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
