import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import CourseForm from "./CourseForm";
import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";

export default function EditCourse() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/courses/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCourse(data.course);
        } else {
          setLoadError("not-found");
        }
      })
      .catch(() => setLoadError("network"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (values) => {
    setFormError("");
    try {
      const response = await fetch(`${API_BASE}/courses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/courses/${id}`);
      } else {
        setFormError(data.message || "Could not update course");
      }
    } catch (err) {
      setFormError("Could not update course — check your connection and try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="section">
          <p className="section-empty">Loading course...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (loadError === "not-found") {
    return (
      <>
        <Header />
        <div className="section">
          <div className="empty-box">
            <h3>Course not found</h3>
            <p>This course may have been removed. <Link to="/courses">Browse all courses</Link> instead.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loadError === "network") {
    return (
      <>
        <Header />
        <div className="section">
          <div className="empty-box">
            <h3>Couldn't load this course</h3>
            <p>Check your connection and try again.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isOwner = user && String(user.user_id) === String(course.instructor_user_id);

  if (!isOwner) {
    return (
      <>
        <Header />
        <div className="section">
          <div className="empty-box">
            <h3>You don't have access to edit this course</h3>
            <p>
              Only the instructor who created this course can edit it. <Link to={`/courses/${id}`}>Back to course</Link>.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="section">
        <div className="section-head">
          <h2>Edit course</h2>
        </div>
        <CourseForm initialValues={course} onSubmit={handleSubmit} submitLabel="Save changes" error={formError} />
      </div>
      <Footer />
    </>
  );
}
