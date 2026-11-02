import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/renalyze-logo.png";

function Navbar() {
  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <nav className="navbar">
      {/* LEFT: LOGO + NAME */}
      <Link to="/" className="logo">
        <img src={logo} alt="Renalyze AI Logo" className="navbar-logo" />

        <span className="logo-text">
          <span className="logo-text-main">Renalyze</span>
          <span className="logo-text-highlight">AI</span>
        </span>
      </Link>

      {/* CENTER: NAV LINKS */}
      <div className="navbar-center">
        <NavLink to="/" className={getLinkClass}>
          Home
        </NavLink>
        <NavLink to="/predict" className={getLinkClass}>
          Predict CKD
        </NavLink>
        <NavLink to="/about" className={getLinkClass}>
          About
        </NavLink>
        <NavLink to="/how-it-works" className={getLinkClass}>
          How It Works
        </NavLink>
        <NavLink to="/contact" className={getLinkClass}>
          Contact
        </NavLink>
      </div>

      {/* RIGHT: AUTH BUTTONS */}
      <div className="navbar-right">
        <Link to="/login" className="btn-outline">
          Sign In
        </Link>
        <Link to="/signup" className="btn-primary">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
