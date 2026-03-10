import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/HeroSection.css";

// Hero Section
const HeroSection = () => {

  const navigate = useNavigate();
  const { user } = useAuth(); // get logged in user

  const handleAnalyze = () => {
    navigate("/upload");
  };

  const isAdmin = user?.role === "admin";

  return (
    <section className="hero">

      <div className="hero-content">

        <h1 className="hero-title">
          {isAdmin
            ? "Log Analysis Admin Dashboard"
            : "Log File Intelligence System"}
        </h1>

        <p className="hero-subtitle">
          {isAdmin
            ? "Monitor system activity, manage users, and oversee log analysis across the platform."
            : "Upload your server logs and instantly discover hidden errors, patterns, and insights."}
        </p>

        {/* Show only for normal users */}
        {!isAdmin && (
          <button className="hero-btn" onClick={handleAnalyze}>
            Analyze Logs Smartly
          </button>
        )}

      </div>

    </section>
  );
};

export default HeroSection;