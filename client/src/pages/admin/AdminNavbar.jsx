// components/AdminNavbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../components/styles/Navbar.css";

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar admin-navbar">
      <h1 className="logo">Admin Panel</h1>

      {/* Hamburger */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/admin/users">All Users</Link></li>
        <li><Link to="/admin/files">File Monitoring</Link></li>
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;