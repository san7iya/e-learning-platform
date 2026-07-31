import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import CourseCard from "./CourseCard";
import "./Dashboard.css";
import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, token } = useAuth();

  if (user?.role === "instructor") {
    return <InstructorDashboard user={user} token={token} />;
  }

  if (user?.role === "org-admin") {
    return <OrgAdminDashboard user={user} token={token} />;
  }

  return <StudentDashboard user={user} token={token} />;
}

function OrgAdminDashboard({ user, token }) {
  const [orgCourses, setOrgCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/org-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.courses.map(c => ({
            id: c.course_id,
            title: c.title,
            author: c.instructor,
            totalLessons: c.lessons_count,
            durationWeeks: c.duration_weeks,
            category: c.category || "Uncategorized",
            enrolledCount: c.enrolled_count
          }));
          setOrgCourses(formatted);
        } else {
          setLoadError(true);
        }
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [token]);

  const username = user?.name || "there";

  return (
    <>
      <Header />

      <div className="section">
        <h1 className="dashboard-welcome">Welcome back, {username}.</h1>

        <div className="section-head">
          <h2>Courses in your organization</h2>
          <Link to="/courses/new" className="see-all">+ create new course</Link>
        </div>

        {loading ? (
          <p className="section-empty">Loading courses...</p>
        ) : loadError ? (
          <div className="empty-box">
            <h3>Couldn't load courses</h3>
            <p>Check your connection and try again.</p>
          </div>
        ) : orgCourses.length > 0 ? (
          <div className="grid">
            {orgCourses.map(c => <CourseCard key={c.id} {...c} />)}
          </div>
        ) : (
          <p className="section-empty">
            No courses in your organization yet.
          </p>
        )}
      </div>

      <Footer />
    </>
  );
}

function InstructorDashboard({ user, token }) {
  const [taughtCourses, setTaughtCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/my-taught-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.courses.map(c => ({
            id: c.course_id,
            title: c.title,
            totalLessons: c.lessons_count,
            durationWeeks: c.duration_weeks,
            category: c.category || "Uncategorized",
            enrolledCount: c.enrolled_count
          }));
          setTaughtCourses(formatted);
        } else {
          setLoadError(true);
        }
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [token]);

  const username = user?.name || "there";

  return (
    <>
      <Header />

      <div className="section">
        <h1 className="dashboard-welcome">Welcome back, {username}.</h1>

        <div className="section-head">
          <h2>My courses</h2>
          <Link to="/courses/new" className="see-all">+ create new course</Link>
        </div>

        {loading ? (
          <p className="section-empty">Loading your courses...</p>
        ) : loadError ? (
          <div className="empty-box">
            <h3>Couldn't load your courses</h3>
            <p>Check your connection and try again.</p>
          </div>
        ) : taughtCourses.length > 0 ? (
          <div className="grid">
            {taughtCourses.map(c => (
              <CourseCard key={c.id} {...c} editHref={`/courses/${c.id}/edit`} />
            ))}
          </div>
        ) : (
          <p className="section-empty">
            You haven't created any courses yet — <Link to="/courses/new">create your first course</Link>.
          </p>
        )}
      </div>

      <Footer />
    </>
  );
}

function StudentDashboard({ user, token }) {
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loadingInProgress, setLoadingInProgress] = useState(true);
  const [inProgressError, setInProgressError] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/my-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.courses.map(c => ({
            id: c.course_id,
            title: c.title,
            author: c.instructor,
            progress: c.progress_percent,
            totalLessons: c.lessons_count,
            durationWeeks: c.duration_weeks,
            category: c.category || "Uncategorized"
          }));
          setInProgressCourses(formatted);
        } else {
          setInProgressError(true);
        }
      })
      .catch(() => setInProgressError(true))
      .finally(() => setLoadingInProgress(false));
  }, [token]);

  useEffect(() => {
    fetch(`${API_BASE}/recommended-courses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
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
          setRecommendedCourses(formatted);
        }
      })
      .catch(err => console.log("Fetch error:", err));
  }, [token]);

  const handleEnroll = async (courseId) => {
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

  const username = user?.name || "there";

  return (
    <>
      <Header />

      <div className="section">
        <h1 className="dashboard-welcome">Welcome back, {username}.</h1>

        <div className="section-head">
          <h2>Continue learning</h2>
          <Link to="/courses" className="see-all">browse all &rarr;</Link>
        </div>

        {actionError && <p className="error-banner">{actionError}</p>}

        {loadingInProgress ? (
          <p className="section-empty">Loading your courses...</p>
        ) : inProgressError ? (
          <div className="empty-box">
            <h3>Couldn't load your courses</h3>
            <p>Check your connection and try again.</p>
          </div>
        ) : inProgressCourses.length > 0 ? (
          <div className="grid">
            {inProgressCourses.map(c => <CourseCard key={c.id} {...c} />)}
          </div>
        ) : (
          <p className="section-empty">
            You haven't enrolled in any courses yet — <Link to="/courses">browse courses</Link> to get started.
          </p>
        )}
      </div>

      {recommendedCourses.length > 0 && (
        <div className="section">
          <div className="section-head">
            <h2>Recommended for you</h2>
          </div>

          <div className="grid">
            {recommendedCourses.map(c => (
              <CourseCard
                key={c.id}
                {...c}
                enrolled={enrolledIds.has(c.id)}
                onEnroll={() => handleEnroll(c.id)}
              />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
