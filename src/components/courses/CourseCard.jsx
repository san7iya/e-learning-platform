import React from "react";
import { Link } from "react-router-dom";
import "./CourseCard.css";
import { getCategoryColor } from "../../utils/categoryColor";

export default function CourseCard({
  id,
  title,
  author,
  totalLessons,
  durationWeeks,
  category,
  progress,
  onEnroll,
  enrolled,
  enrolledCount,
  editHref
}) {
  return (
    <div className="ccard">
      {category && (
        <span className="tag" style={{ background: getCategoryColor(category) }}>
          {category}
        </span>
      )}

      <h3>{id ? <Link to={`/courses/${id}`}>{title}</Link> : title}</h3>

      <div className="meta">
        {author && <span>{author}</span>}
        {author && (totalLessons != null || durationWeeks != null) && <span> · </span>}
        {totalLessons != null && <span>{totalLessons} lesson{totalLessons === 1 ? "" : "s"}</span>}
        {totalLessons != null && durationWeeks != null && <span> · </span>}
        {durationWeeks != null && <span>{durationWeeks} wk</span>}
      </div>

      {progress != null && (
        <>
          <div className="track">
            <div className="fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="pct">{progress}% complete</span>
        </>
      )}

      {enrolledCount != null && (
        <p className="enrolled-count">
          {enrolledCount} student{enrolledCount === 1 ? "" : "s"} enrolled
        </p>
      )}

      {onEnroll && (
        <button className="enroll-btn" onClick={onEnroll} disabled={enrolled}>
          {enrolled ? "Enrolled" : "Enroll"}
        </button>
      )}

      {editHref && (
        <Link to={editHref} className="edit-link">Edit</Link>
      )}
    </div>
  );
}
