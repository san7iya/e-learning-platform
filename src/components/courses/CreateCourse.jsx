import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import CourseForm from "./CourseForm";
import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";

export default function CreateCourse() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    setError("");
    try {
      const response = await fetch(`${API_BASE}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/courses/${data.course.course_id}`);
      } else {
        setError(data.message || "Could not create course");
      }
    } catch (err) {
      setError("Could not create course — check your connection and try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="section">
        <div className="section-head">
          <h2>Create a new course</h2>
        </div>
        <CourseForm onSubmit={handleSubmit} submitLabel="Create course" error={error} />
      </div>
      <Footer />
    </>
  );
}
