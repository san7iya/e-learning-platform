import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import Header from "../header/Header";
import Footer from "../landing/footer";
import { API_BASE } from "../../config";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/courses`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.courses.map(c => ({
            id: c.course_id,
            title: c.title,
            author: c.instructor,
            progress: 0,
            lessonsDone: 0,
            totalLessons: 0,
            category: "General"
          }));
          setCourses(formatted);
        }
      })
      .catch(err => console.log("Fetch error:", err));
  }, []);

  return (
    <> 
    
        < Header />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "60px 32px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "40px" }}>
            All Courses
        </h2>

        <div style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))"
        }}>
            {courses.length > 0 ? (
            courses.map(course => <CourseCard key={course.id} {...course} />)
            ) : (
            <p style={{ textAlign: "center" }}>Loading courses...</p>
            )}
        </div>
        </div>

        <Footer />
    </>
  );
}
