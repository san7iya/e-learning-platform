import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import CourseCard from '../courses/CourseCard';
import { API_BASE } from '../../config';

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const didFetch = useRef(false); // guard for StrictMode

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    fetch(`${API_BASE}/courses`, { cache: "no-store" }) // avoid 304 issues
      .then(async (res) => {
        // Handle 304 explicitly in dev
        if (res.status === 304) {
          // Try re-fetch with no-cache
          return fetch(`${API_BASE}/courses`, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" }
          }).then(r => r.json());
        }
        return res.json();
      })
      .then(data => {
        if (data?.success) {
          const formatted = data.courses.map(c => ({
            id: c.course_id,
            title: c.title,
            author: c.instructor || "Unknown",
            progress: 0,
            lessonsDone: 0,
            totalLessons: c.lessons_count,
            category: c.category || "Uncategorized"
          }));
          setCourses(formatted);
        }
      })
      .catch(err => console.log("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="courses-section">
      <div className="section-header">
        <h2 className="section-title">Top Listed Courses</h2>
        <Link to="/courses" className="see-all-link">See all →</Link>
      </div>

      <div className="courses-grid">
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading courses...</p>
        ) : courses.length > 0 ? (
          courses.slice(0,6).map(course => <CourseCard key={course.id} {...course} />)
        ) : (
          <p style={{ textAlign: "center" }}>No courses available</p>
        )}
      </div>
    </div>
  );
}
