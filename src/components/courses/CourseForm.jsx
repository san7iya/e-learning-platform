import React, { useState } from "react";
import "./CourseForm.css";

export default function CourseForm({ initialValues, onSubmit, submitLabel, error }) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [category, setCategory] = useState(initialValues?.category || "");
  const [durationWeeks, setDurationWeeks] = useState(initialValues?.duration_weeks ?? "");
  const [modules, setModules] = useState(
    initialValues?.modules?.map(m => ({ title: m.title, duration_minutes: m.duration_minutes ?? "" })) || []
  );
  const [submitting, setSubmitting] = useState(false);

  const addModule = () => setModules(prev => [...prev, { title: "", duration_minutes: "" }]);
  const removeModule = (index) => setModules(prev => prev.filter((_, i) => i !== index));
  const updateModule = (index, field, value) =>
    setModules(prev => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        category,
        duration_weeks: durationWeeks === "" ? null : Number(durationWeeks),
        modules: modules
          .filter(m => m.title.trim())
          .map(m => ({
            title: m.title.trim(),
            duration_minutes: m.duration_minutes === "" ? null : Number(m.duration_minutes)
          }))
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

      <div className="input-group">
        <label>Lessons</label>

        {modules.map((m, i) => (
          <div className="module-row" key={i}>
            <input
              type="text"
              placeholder="Lesson title"
              value={m.title}
              onChange={(e) => updateModule(i, "title", e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="min"
              className="module-duration"
              value={m.duration_minutes}
              onChange={(e) => updateModule(i, "duration_minutes", e.target.value)}
            />
            <button
              type="button"
              className="module-remove"
              onClick={() => removeModule(i)}
              aria-label="Remove lesson"
            >
              &times;
            </button>
          </div>
        ))}

        <button type="button" className="module-add" onClick={addModule}>
          + Add lesson
        </button>
      </div>

      <button type="submit" className="btn-primary course-form-submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
