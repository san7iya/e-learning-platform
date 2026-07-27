import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CourseCard from "./CourseCard";
import Header from "../header/Header";
import Footer from "../landing/footer";
import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Design", "Development", "Data", "Finance", "Business"];
const PAGE_SIZE = 6;

export default function AllCourses() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [enrolledIds, setEnrolledIds] = useState(new Set());

  useEffect(() => {
    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (category) params.set("category", category);

    setLoading(true);
    fetch(`${API_BASE}/courses?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.courses.map(c => ({
            id: c.course_id,
            title: c.title,
            author: c.instructor,
            progress: 0,
            lessonsDone: 0,
            totalLessons: c.lessons_count,
            category: c.category || "Uncategorized"
          }));
          setCourses(formatted);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      })
      .catch(err => console.log("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [category, page]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/my-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEnrolledIds(new Set(data.courses.map(c => c.course_id)));
        }
      })
      .catch(err => console.log("Fetch error:", err));
  }, [token]);

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ course_id: courseId })
      });

      const data = await response.json();

      if (data.success || response.status === 409) {
        setEnrolledIds(prev => new Set(prev).add(courseId));
      } else {
        alert(data.message || "Could not enroll in course");
      }
    } catch (err) {
      alert("Could not enroll in course");
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const next = {};
    if (value) next.category = value;
    setSearchParams(next); // changing category resets to page 1
  };

  const goToPage = (nextPage) => {
    const next = { page: nextPage };
    if (category) next.category = category;
    setSearchParams(next);
  };

  return (
    <>

        < Header />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "60px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "700" }}>
              All Courses
          </h2>

          <select
            value={category}
            onChange={handleCategoryChange}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px"
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))"
        }}>
            {loading ? (
            <p style={{ textAlign: "center" }}>Loading courses...</p>
            ) : courses.length > 0 ? (
            courses.map(course => (
              <CourseCard
                key={course.id}
                {...course}
                enrolled={enrolledIds.has(course.id)}
                onEnroll={() => handleEnroll(course.id)}
              />
            ))
            ) : (
            <p style={{ textAlign: "center" }}>No courses found.</p>
            )}
        </div>

        {!loading && courses.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "40px" }}>
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "1px solid #6c3ba1",
                background: page <= 1 ? "#eee" : "#fff",
                color: "#6c3ba1",
                cursor: page <= 1 ? "default" : "pointer"
              }}
            >
              Previous
            </button>

            <span>Page {page} of {totalPages}</span>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "1px solid #6c3ba1",
                background: page >= totalPages ? "#eee" : "#fff",
                color: "#6c3ba1",
                cursor: page >= totalPages ? "default" : "pointer"
              }}
            >
              Next
            </button>
          </div>
        )}
        </div>

        <Footer />
    </>
  );
}
