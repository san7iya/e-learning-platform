import React from "react";
import "./CourseCard.css";
import courseThumbnail from "./coursecard_photo.svg";

export default function CourseCard({
  title,
  author,
  progress,
  lessonsDone,
  totalLessons,
  category,
  onEnroll,
  enrolled
}) {
  return (
    <div className="course-card">
      <img src={courseThumbnail} alt="course thumbnail" className="course-thumb" />

      <span className="category-tag">{category}</span>

      <h3>{title}</h3>

      <div className="author">
        <div className="avatar"></div>
        <span>{author}</span>
      </div>

      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <span className="lesson-count">Lesson {lessonsDone} of {totalLessons}</span>

      {onEnroll && (
        <button className="enroll-btn" onClick={onEnroll} disabled={enrolled}>
          {enrolled ? "Enrolled" : "Enroll"}
        </button>
      )}
    </div>
  );
}

