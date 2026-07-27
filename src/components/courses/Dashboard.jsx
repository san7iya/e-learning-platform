import React, { useState, useEffect } from 'react';
import { Header } from "../header/Header";
import { Pencil, Monitor, Receipt, Briefcase } from "lucide-react";
import courseThumbnail from "./coursecard_photo.svg";
import { API_BASE } from "../../config";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        window.location.href = "/login"; // redirect if not logged in
      } else {
        setUser(storedUser);
      }
    } catch (error) {
      console.log("Invalid localStorage user");
      window.location.href = "/login";
    }

    setLoadingUser(false);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/courses`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.courses.map(c => ({
            title: c.title,
            author: c.instructor,
            progress: 60,
            category: "General"
          }));
          setInProgressCourses(formatted);
        }
      })
      .catch(err => console.log("Fetch error:", err));
  }, []);

  if (loadingUser || !user) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  const username = user.name || "User";

  const categories = [
    { icon: Pencil, title: "Design", color: "#2dd4bf" },
    { icon: Monitor, title: "Development", color: "#818cf8" },
    { icon: Receipt, title: "Finance", color: "#60a5fa" },
    { icon: Briefcase, title: "Business", color: "#14b8a6" }
  ];

  const recommendedCourses = [
    { title: "AWS Certified Solutions Architect", author: "Lina", price: "$80", oldPrice: "$100", category: "Cloud" },
    { title: "React Mastery Bootcamp", author: "Max", price: "$60", oldPrice: "$90", category: "Development" },
    { title: "Data Science for Beginners", author: "Sarah", price: "$75", oldPrice: "$110", category: "Data" },
    { title: "UI/UX Design Masterclass", author: "Julia", price: "$50", oldPrice: "$85", category: "Design" }
  ];

  const Card = ({ title, author, progress, price, oldPrice, category }) => (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 6px 18px rgba(15, 15, 30, 0.06)",
        cursor: "pointer",
        transition: "0.2s",
        width: "100%"
      }}
    >
      <img
        src={courseThumbnail}
        style={{
          width: "100%",
          height: "160px",
          objectFit: "cover",
          borderRadius: "10px",
          marginBottom: "10px"
        }}
      />

      {category && (
        <span
          style={{
            background: "#e0e7ff",
            color: "#3744c5",
            fontSize: "12px",
            padding: "3px 12px",
            borderRadius: "50px",
            display: "inline-block",
            marginBottom: "6px"
          }}
        >
          {category}
        </span>
      )}

      <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "6px 0" }}>{title}</h3>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <div style={{ width: "28px", height: "28px", background: "#ccc", borderRadius: "50%" }} />
        <span style={{ fontSize: "14px", color: "#374151" }}>{author}</span>
      </div>

      {progress !== undefined && (
        <div style={{ height: "8px", background: "#eee", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ height: "8px", width: `${progress}%`, background: "#6c3ba1" }} />
        </div>
      )}

      {price && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <span style={{ textDecoration: "line-through", fontSize: "12px", color: "#888" }}>{oldPrice}</span>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#6c3ba1" }}>{price}</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Header />

      <div
        style={{
          background: "#b6baf6",
          padding: "60px 32px",
          width: "100%"
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "600" }}>
              Welcome back, {username}! Ready for your next lesson?
            </h1>
            <span style={{ fontWeight: "700", color: "#6c3ba1", cursor: "pointer" }}>View history</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {inProgressCourses.map((c, i) => (
              <Card key={i} {...c} />
            ))}
          </div>
        </div>
      </div>

      <section style={{ background: "#fff", padding: "80px 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "600", marginBottom: "40px" }}>
            Choose favourite course from top category
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {categories.map((cat, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.06)"
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "12px",
                    background: cat.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px"
                  }}
                >
                  <cat.icon color="#fff" size={30} />
                </div>

                <h3 style={{ fontWeight: "600", marginBottom: "6px" }}>{cat.title}</h3>
                <p style={{ color: "#555", fontSize: "14px" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#f9fafb", padding: "60px 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "600" }}>Recommended for you</h2>
            <span style={{ color: "#6c3ba1", fontWeight: "700", cursor: "pointer" }}>See all</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {recommendedCourses.map((c, i) => (
              <Card key={i} {...c} />
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: "#b6baf6", padding: "60px 0", color: "#fff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "40px", marginBottom: "40px" }}>

            <div>
              <h3 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Brainy.</h3>
              <p>Learning Reinvented</p>
            </div>

            <div>
              <h4 style={{ fontWeight: "600", marginBottom: "10px" }}>Company</h4>
              <p>About us</p>
              <p>Contact</p>
              <p>Values & Press</p>
              <p>Career</p>
            </div>

            <div>
              <h4 style={{ fontWeight: "600", marginBottom: "10px" }}>Essentials</h4>
              <p>Pricing</p>
              <p>Courses</p>
              <p>Privacy policy</p>
              <p>Your Agreements</p>
            </div>

            <div>
              <h4 style={{ fontWeight: "600", marginBottom: "10px" }}>Follow us</h4>
              <p>Facebook</p>
              <p>Twitter</p>
              <p>Newsletter</p>
              <p>Instagram</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: "20px", textAlign: "center" }}>
            Brainy ©2024 – All rights reserved
          </div>
        </div>
      </footer>
    </>
  );
}
