import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import ConfirmDialog from "../shared/ConfirmDialog";
import "./MyProgress.css";
import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";
import { getCategoryColor } from "../../utils/categoryColor";

function ProgressRow({ course, token, onSaved, onUnenrollRequest }) {
  const [value, setValue] = useState(course.progress_percent);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const dirty = value !== course.progress_percent;

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const response = await fetch(`${API_BASE}/enrollments/${course.enrollment_id}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ progress_percent: value })
      });

      const data = await response.json();

      if (data.success) {
        onSaved(course.enrollment_id, value);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
      } else {
        setSaveError(data.message || "Could not update progress.");
      }
    } catch (err) {
      setSaveError("Couldn't reach the server — try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="progress-row">
      <div className="progress-row-info">
        {course.category && (
          <span className="tag" style={{ background: getCategoryColor(course.category) }}>
            {course.category}
          </span>
        )}
        <h3><Link to={`/courses/${course.course_id}`}>{course.title}</Link></h3>
        <div className="meta">
          {course.instructor} &middot; {course.lessons_count} lessons &middot; {course.duration_weeks} wk
        </div>
        <button type="button" className="unenroll-link" onClick={() => onUnenrollRequest(course)}>
          Unenroll
        </button>
        {saveError && <div className="progress-row-error">{saveError}</div>}
      </div>

      <div className="progress-row-control">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={`Progress for ${course.title}`}
        />
        <span className="progress-value">{value}%</span>
        <button className="save-btn" onClick={handleSave} disabled={!dirty || saving}>
          {saving ? "Saving..." : justSaved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function MyProgress() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [pendingUnenroll, setPendingUnenroll] = useState(null);
  const [unenrolling, setUnenrolling] = useState(false);
  const [unenrollError, setUnenrollError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/my-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCourses(data.courses);
        } else {
          setLoadError(true);
        }
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSaved = (enrollmentId, newValue) => {
    setCourses(prev =>
      prev.map(c => c.enrollment_id === enrollmentId ? { ...c, progress_percent: newValue } : c)
    );
  };

  const handleUnenrollConfirm = async () => {
    if (!pendingUnenroll) return;

    setUnenrolling(true);
    setUnenrollError("");

    try {
      const response = await fetch(`${API_BASE}/enrollments/${pendingUnenroll.enrollment_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setCourses(prev => prev.filter(c => c.enrollment_id !== pendingUnenroll.enrollment_id));
        setPendingUnenroll(null);
      } else {
        setUnenrollError(data.message || "Could not unenroll. Please try again.");
      }
    } catch (err) {
      setUnenrollError("Couldn't reach the server — check your connection and try again.");
    } finally {
      setUnenrolling(false);
    }
  };

  return (
    <>
      <Header />

      <div className="section">
        <div className="section-head">
          <h2>My progress</h2>
        </div>

        {unenrollError && <p className="error-banner">{unenrollError}</p>}

        {loading ? (
          <p className="section-empty">Loading your courses...</p>
        ) : loadError ? (
          <div className="empty-box">
            <h3>Couldn't load your progress</h3>
            <p>Check your connection and try again.</p>
          </div>
        ) : courses.length > 0 ? (
          <div className="progress-list">
            {courses.map(c => (
              <ProgressRow
                key={c.enrollment_id}
                course={c}
                token={token}
                onSaved={handleSaved}
                onUnenrollRequest={setPendingUnenroll}
              />
            ))}
          </div>
        ) : (
          <div className="empty-box">
            <h3>No progress yet</h3>
            <p>
              You haven't enrolled in any courses yet — <Link to="/courses">browse courses</Link> to get started.
            </p>
          </div>
        )}
      </div>

      <Footer />

      <ConfirmDialog
        open={!!pendingUnenroll}
        title="Unenroll from this course?"
        message={
          pendingUnenroll
            ? `You're ${pendingUnenroll.progress_percent}% through "${pendingUnenroll.title}". Unenrolling permanently deletes this progress — if you enroll again later, you'll start over from 0%.`
            : ""
        }
        confirmLabel="Unenroll"
        onConfirm={handleUnenrollConfirm}
        onCancel={() => { setPendingUnenroll(null); setUnenrollError(""); }}
        confirming={unenrolling}
      />
    </>
  );
}
