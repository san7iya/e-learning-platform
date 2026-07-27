import React from "react";
import { BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="frame">
      <Link to="/" className="logo-section">
        <div className="polygon">
          <BookOpen size={24} />
        </div>
        <div className="text-wrapper">Brainy</div>
      </Link>

      <nav className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/courses" className="nav-item">Courses</Link>
      </nav>

      {!user && (
        <div className="auth-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/register">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      )}

      {user && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
}
