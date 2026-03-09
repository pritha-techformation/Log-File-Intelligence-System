// components/AdminNavbar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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

      <ul className={`nav-links z-50 ${menuOpen ? "active" : ""}`}>
        <li><NavLink to="/admin/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/admin/users">All Users</NavLink></li>
        <li><NavLink to="/admin/files">File Monitoring</NavLink></li>
        <li><NavLink to="/logout">Logout</NavLink></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;