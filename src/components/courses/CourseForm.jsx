import React, { useState } from "react";
import "./CourseForm.css";

export default function CourseForm({ initialValues, onSubmit, submitLabel, error }) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [durationWeeks, setDurationWeeks] = useState(initialValues?.duration_weeks ?? "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        category,
        duration_weeks: durationWeeks === "" ? null : Number(durationWeeks)
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="course-form" onSubmit={handleSubmit}>
      {error && <p className="error-banner">{error}</p>}

      <div className="input-group">
        <label>Title</label>
        <input
          type="text"
          placeholder="e.g. Introduction to Machine Learning"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label>Description</label>
        <textarea
          placeholder="What will students learn in this course?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div className="input-group">
        <label>Category</label>
        <input
          type="text"
          placeholder="e.g. Development, Design, Data"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Duration (weeks)</label>
        <input
          type="number"
          min="1"
          placeholder="e.g. 8"
          value={durationWeeks}
          onChange={(e) => setDurationWeeks(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary course-form-submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
