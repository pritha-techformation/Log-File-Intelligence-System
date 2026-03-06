// components/UserNavbar.jsx
import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../../components/styles/Navbar.css";

const UserNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
  

  return (
    <nav className="navbar">
      <h1><Link to="/">LogIntel System</Link></h1>

       {/* Hamburger */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/upload">Upload Logs</NavLink></li>
        <li><NavLink to="/history">Upload History</NavLink></li>
        <li><NavLink to="/logout">Logout</NavLink></li>
      </ul>
    </nav>
  );
};

export default UserNavbar;