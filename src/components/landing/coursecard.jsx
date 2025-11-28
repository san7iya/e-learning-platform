import React from "react";
import courseThumbnail from "../courses/coursecard_photo.svg";

export default function CourseCard({
  title,
  author,
  progress,
  lessonsDone,
  totalLessons,
  category
}) {
  const styles = {
    card: {
      background: "white",
      borderRadius: "12px",
      padding: "clamp(14px, 1.8vw, 20px)",
      boxShadow: "0 6px 18px rgba(15, 15, 30, 0.06)",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      width: "100%",
      boxSizing: "border-box",
      transition: "0.2s ease-in-out"
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 10px 24px rgba(15, 15, 30, 0.12)"
    },
    thumbWrapper: {
      width: "100%",
      height: "clamp(140px, 15vw, 180px)",
      borderRadius: "10px",
      overflow: "hidden"
    },
    thumb: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    categoryTag: {
      background: "#e0e7ff",
      color: "#3744c5",
      fontSize: "12px",
      padding: "3px 12px",
      borderRadius: "50px",
      display: "inline-block",
      width: "fit-content",
      fontWeight: 500
    },
    title: {
      fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
      fontWeight: 600,
      margin: 0,
      lineHeight: "1.25",
      color: "#111827"
    },
    author: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      margin: "4px 0"
    },
    avatar: {
      background: "#6c3ba1",
      height: "28px",
      width: "28px",
      borderRadius: "50%"
    },
    authorName: {
      fontSize: "0.875rem",
      color: "#374151"
    },
    progress: {
      height: "8px",
      background: "#eee",
      borderRadius: "6px",
      overflow: "hidden"
    },
    progressBar: {
      background: "#6c3ba1",
      height: "100%",
      borderRadius: "6px",
      transition: "width 0.3s ease"
    },
    lessonCount: {
      fontSize: "0.85rem",
      color: "#444",
      marginTop: "2px"
    }
  };

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = styles.cardHover.transform;
        e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = styles.card.boxShadow;
      }}
    >
      <div style={styles.thumbWrapper}>
        <img src={courseThumbnail} alt="course" style={styles.thumb} />
      </div>

      {category && <span style={styles.categoryTag}>{category}</span>}

      <h3 style={styles.title}>{title}</h3>

      <div style={styles.author}>
        <div style={styles.avatar}></div>
        <span style={styles.authorName}>{author || "Unknown"}</span>
      </div>

      {progress !== undefined && (
        <div style={styles.progress}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
        </div>
      )}

      {lessonsDone !== undefined && totalLessons !== undefined && (
        <span style={styles.lessonCount}>
          Lesson {lessonsDone} of {totalLessons}
        </span>
      )}
    </div>
  );
}
