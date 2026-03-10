import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/HeroSection.css";

// Hero Section
const HeroSection = () => {

  // Navigation handler
  const navigate = useNavigate();

  // Analyze button handler
  const handleAnalyze = () => {
    navigate("/upload");
  };

  return (
    <section className="hero">

      <div className="hero-content">
        <h1 className="hero-title">
          Log File Intelligence System
        </h1>

        <p className="hero-subtitle">
          Upload your server logs and instantly discover hidden errors,
          patterns, and insights.
        </p>

        {/* Analyze button */}
        <button className="hero-btn" onClick={handleAnalyze}>
          Analyze Logs Smartly
        </button>
      </div>

    </section>
  );
};

export default HeroSection;