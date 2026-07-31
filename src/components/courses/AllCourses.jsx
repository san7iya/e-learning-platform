import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CourseCard from "./CourseCard";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./AllCourses.css";
import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";

const PAGE_SIZE = 6;

export default function AllCourses() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const canEnroll = !user || user.role === "student";

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories);
      })
      .catch(err => console.log("Fetch error:", err));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (category) params.set("category", category);

    setLoading(true);
    setLoadError(false);
    fetch(`${API_BASE}/courses?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.courses.map(c => ({
            id: c.course_id,
            title: c.title,
            author: c.instructor,
            totalLessons: c.lessons_count,
            durationWeeks: c.duration_weeks,
            category: c.category || "Uncategorized"
          }));
          setCourses(formatted);
          setTotalPages(data.pagination?.totalPages || 1);
        } else {
          setLoadError(true);
        }
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [category, page]);

  useEffect(() => {
    if (!token || !canEnroll) return;

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
  }, [token, canEnroll]);

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setActionError("");

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
        setActionError(data.message || "Could not enroll in course. Please try again.");
      }
    } catch (err) {
      setActionError("Couldn't reach the server — check your connection and try again.");
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
      <Header />

      <div className="section">
        <div className="section-head">
          <h2>All courses</h2>

          <select
            className="category-filter"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {actionError && <p className="error-banner">{actionError}</p>}

        {loading ? (
          <p className="section-empty">Loading courses...</p>
        ) : loadError ? (
          <div className="empty-box">
            <h3>Couldn't load courses</h3>
            <p>Check your connection and try again.</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                {...course}
                enrolled={enrolledIds.has(course.id)}
                onEnroll={canEnroll ? () => handleEnroll(course.id) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="empty-box">
            <h3>No courses found</h3>
            <p>
              {category
                ? `Nothing in "${category}" right now — try a different category.`
                : "There aren't any courses yet — check back soon."}
            </p>
          </div>
        )}

        {!loading && courses.length > 0 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </button>

            <span className="page-status">Page {page} of {totalPages}</span>

            <button
              className="page-btn"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
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
