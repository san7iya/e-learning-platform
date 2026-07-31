import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./Profile.css";
import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";

const ROLE_LABELS = {
  student: "Student",
  instructor: "Instructor",
  "org-admin": "Org Admin"
};

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(data.user);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <>
      <Header />

      <div className="section">
        <div className="section-head">
          <h2>Profile</h2>
        </div>

        {loading ? (
          <p className="section-empty">Loading your profile...</p>
        ) : error || !profile ? (
          <div className="empty-box">
            <h3>Couldn't load your profile</h3>
            <p>Check your connection and try again.</p>
          </div>
        ) : (
          <div className="profile-card">
            <div className="profile-avatar">{profile.name.trim().charAt(0).toUpperCase()}</div>
            <div className="profile-details">
              <h3>{profile.name}</h3>
              <p className="profile-email">{profile.email}</p>
              <span className="tag profile-role">{ROLE_LABELS[profile.role] || profile.role}</span>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
