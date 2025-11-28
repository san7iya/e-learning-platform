import React from "react";
import polygon2 from "./Polygon 2.svg"; 
import "./style.css";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="frame">
      {/* Logo */}
      <div className="logo-section" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        <img className="polygon" alt="Polygon" src={polygon2} />
        <div className="text-wrapper">Brainy</div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div onClick={() => navigate("/")}>Home</div>
        <div onClick={() => navigate("/courses")}>Courses</div> {/* ✅ FIXED */}
      </nav>

      {/* If user not logged in → Login + Sign Up */}
      {!user && (
        <div className="auth-buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="signup-btn" onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </div>
      )}

      {/* If user is logged in → Logout */}
      {user && (
        <button
          className="logout-btn"
          onClick={handleLogout}
          style={{
            background: "#6c3ba1",
            color: "white",
            border: "none",
            padding: "8px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      )}
    </header>
  );
};
