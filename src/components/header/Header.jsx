import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./style.css";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const initial = (user?.name || "?").trim().charAt(0).toUpperCase();
  const canCreateCourses = user && ["instructor", "org-admin"].includes(user.role);

  return (
    <header className="site-header">
      <Link to="/" className="logo-section">
        <div className="logo-mark">
          <BookOpen size={20} />
        </div>
        <span className="logo-text">Brainy</span>
      </Link>

      <nav className="nav-links">
        {user && (
          <Link to="/dashboard" className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
            Dashboard
          </Link>
        )}
        <Link to="/courses" className={`nav-item ${isActive("/courses") ? "active" : ""}`}>
          Browse
        </Link>
        {user?.role === "student" && (
          <Link to="/progress" className={`nav-item ${isActive("/progress") ? "active" : ""}`}>
            Progress
          </Link>
        )}
        {canCreateCourses && (
          <Link to="/courses/new" className={`nav-item ${isActive("/courses/new") ? "active" : ""}`}>
            + New course
          </Link>
        )}
      </nav>

      {user ? (
        <div
          className="avatar-menu"
          tabIndex={-1}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setMenuOpen(false);
          }}
        >
          <button
            type="button"
            className="avatar"
            aria-label="Account menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {initial}
          </button>
          {menuOpen && (
            <div className="avatar-dropdown">
              <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button type="button" className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login" className="btn-ghost">Sign In</Link>
          <Link to="/register" className="btn-primary-sm">Register</Link>
        </div>
      )}
    </header>
  );
}
