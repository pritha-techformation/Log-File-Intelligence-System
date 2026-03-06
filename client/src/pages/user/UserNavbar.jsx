// components/UserNavbar.jsx
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../components/styles/Navbar.css";

const UserNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
  

  return (
    <nav className="navbar">
      <h1>Log File Intelligence System</h1>

       {/* Hamburger */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/upload">Upload Logs</Link></li>
        <li><Link to="/history">Upload History</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default UserNavbar;