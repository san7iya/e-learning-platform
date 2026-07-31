import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import CourseCard from '../courses/CourseCard';
import { API_BASE } from '../../config';

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const didFetch = useRef(false); // guard for StrictMode

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    fetch(`${API_BASE}/courses?limit=6`)
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          const formatted = data.courses.map(c => ({
            id: c.course_id,
            title: c.title,
            author: c.instructor,
            totalLessons: c.lessons_count,
            durationWeeks: c.duration_weeks,
            category: c.category || "Uncategorized"
          }));
          setCourses(formatted);
        } else {
          setLoadError(true);
        }
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section">
      <div className="section-head">
        <h2>Explore courses</h2>
        <Link to="/courses" className="see-all">browse all &rarr;</Link>
      </div>

      {loading ? (
        <p className="section-empty">Loading courses...</p>
      ) : loadError ? (
        <div className="empty-box">
          <h3>Couldn't load courses</h3>
          <p>Check your connection and try again.</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="grid">
          {courses.map(course => <CourseCard key={course.id} {...course} />)}
        </div>
      ) : (
        <p className="section-empty">No courses available yet — check back soon.</p>
      )}
    </div>
  );
}
