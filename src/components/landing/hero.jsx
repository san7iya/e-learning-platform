import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../../config';
import { getCategoryColor } from '../../utils/categoryColor';

export default function HeroSection() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/courses?limit=2`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setFeatured(data.courses);
      })
      .catch(err => console.log("Fetch error:", err));
  }, []);

  return (
    <div className="hero">
      <div>
        <div className="sticker">✎&nbsp;no fluff, just progress</div>
        <h1>Learn at the pace of <mark>your actual week.</mark></h1>
        <p className="sub">
          Track what you've finished, pick up exactly where you stopped, and
          never lose your place between one course and the next.
        </p>
        <Link to="/courses" className="btn-primary">Browse courses &rarr;</Link>
      </div>

      <div className="stack">
        {featured.map((course, i) => (
          <Link key={course.course_id} to={`/courses/${course.course_id}`} className={`hcard c${i + 1}`}>
            <span className="tag" style={{ background: getCategoryColor(course.category) }}>
              {course.category || "Uncategorized"}
            </span>
            <h3>{course.title}</h3>
            <div className="meta">
              {course.lessons_count} lesson{course.lessons_count === 1 ? "" : "s"} &middot; {course.duration_weeks} wk
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
