import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import ConfirmDialog from "../shared/ConfirmDialog";
import "./CourseDetail.css";
import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";
import { getCategoryColor } from "../../utils/categoryColor";

export default function CourseDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [enrollment, setEnrollment] = useState(null);
  const [actionError, setActionError] = useState("");
  const [confirmingUnenroll, setConfirmingUnenroll] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);

  useEffect(() => {
    setLoading(true);
    setLoadError("");
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

  const refreshEnrollment = () => {
    if (!token) return;

    fetch(`${API_BASE}/my-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const match = data.courses.find(c => String(c.course_id) === String(id));
          setEnrollment(match || null);
        }
      })
      .catch(err => console.log("Fetch error:", err));
  };

  useEffect(refreshEnrollment, [token, id]);

  const handleEnroll = async () => {
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
        body: JSON.stringify({ course_id: id })
      });

      const data = await response.json();

      if (data.success || response.status === 409) {
        refreshEnrollment();
      } else {
        setActionError(data.message || "Could not enroll in course. Please try again.");
      }
    } catch (err) {
      setActionError("Couldn't reach the server — check your connection and try again.");
    }
  };

  const handleUnenrollConfirm = async () => {
    if (!enrollment?.enrollment_id) return;

    setUnenrolling(true);
    setActionError("");

    try {
      const response = await fetch(`${API_BASE}/enrollments/${enrollment.enrollment_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setEnrollment(null);
        setConfirmingUnenroll(false);
      } else {
        setActionError(data.message || "Could not unenroll. Please try again.");
      }
    } catch (err) {
      setActionError("Couldn't reach the server — check your connection and try again.");
    } finally {
      setUnenrolling(false);
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

  const isOwner = user && course && String(user.user_id) === String(course.instructor_user_id);
  const canEnroll = !user || user.role === "student";

  if (loadError === "not-found") {
    return (
      <>
        <Header />
        <div className="section">
          <div className="empty-box">
            <h3>Course not found</h3>
            <p>
              This course may have been removed. <Link to="/courses">Browse all courses</Link> instead.
            </p>
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

  return (
    <>
      <Header />

      <div className="section course-detail">
        <Link to="/courses" className="back-link">&larr; All courses</Link>

        <div className="course-detail-head">
          {course.category && (
            <span className="tag" style={{ background: getCategoryColor(course.category) }}>
              {course.category}
            </span>
          )}

          <h1>{course.title}</h1>

          <div className="meta">
            {course.instructor && <span>{course.instructor}</span>}
            {course.instructor && <span> &middot; </span>}
            <span>{course.modules.length} lesson{course.modules.length === 1 ? "" : "s"}</span>
            <span> &middot; </span>
            <span>{course.duration_weeks} wk</span>
          </div>

          {course.description && <p className="course-description">{course.description}</p>}

          {actionError && <p className="error-banner">{actionError}</p>}

          <div className="course-detail-actions">
            {enrollment ? (
              <>
                <Link to="/progress" className="btn-primary">Continue learning &rarr;</Link>
                <button className="btn-ghost-outline" onClick={() => setConfirmingUnenroll(true)}>
                  Unenroll
                </button>
              </>
            ) : canEnroll ? (
              <button className="btn-primary" onClick={handleEnroll}>Enroll in this course</button>
            ) : null}

            {isOwner && (
              <Link to={`/courses/${id}/edit`} className="btn-ghost-outline">Edit course</Link>
            )}
          </div>
        </div>

        <h2 className="modules-heading">Modules</h2>

        {course.modules.length > 0 ? (
          <ul className="module-list">
            {course.modules.map((m, i) => (
              <li key={m.module_id} className="module-item">
                <span className="module-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="module-title">{m.title}</span>
                <span className="module-duration">{m.duration_minutes} min</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="section-empty">No modules published for this course yet.</p>
        )}
      </div>

      <Footer />

      <ConfirmDialog
        open={confirmingUnenroll}
        title="Unenroll from this course?"
        message={
          enrollment
            ? `You're ${enrollment.progress_percent}% through "${course.title}". Unenrolling permanently deletes this progress — if you enroll again later, you'll start over from 0%.`
            : ""
        }
        confirmLabel="Unenroll"
        onConfirm={handleUnenrollConfirm}
        onCancel={() => setConfirmingUnenroll(false)}
        confirming={unenrolling}
      />
    </>
  );
}
