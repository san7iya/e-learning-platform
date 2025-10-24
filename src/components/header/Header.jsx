import React from "react";
import polygon2 from "./Polygon 2.svg"; 
import "./style.css";
import { useNavigate } from "react-router-dom";

export const Frame = () => {
  return (
    <header className="frame">
      <div className="logo-section">
        <img className="polygon" alt="Polygon" src={polygon2} />
        <div className="text-wrapper">E-learning Platform</div>
      </div>

      <nav className="navbar">
        <div>Home</div>
        <div>Courses</div>
        <div>About Us</div>
      </nav>

      <div className="auth-buttons">
            <button className="login-btn" onClick={() => navigate("/login")}>
                Login
            </button>
            <button className="signup-btn" onClick={() => navigate("/register")}>
                Sign Up
            </button>
        </div>
    </header>
  );
};