import React from 'react';
import { BookOpen } from 'lucide-react';
import { Link } from "react-router-dom";

export default function Header({ onNavigate }) {
  return (
    <header className="frame">
      <div className="logo-section">
        <div className="polygon">
          <BookOpen size={24} />
        </div>
        <div className="text-wrapper">Brainy</div>
      </div>
      
      <nav className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/courses" className="nav-item">Courses</Link>
      </nav>

      <div className="auth-buttons">
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>

        <Link to="/register">
          <button className="signup-btn">Sign Up</button>
        </Link>
      </div>
    </header>
  );
}