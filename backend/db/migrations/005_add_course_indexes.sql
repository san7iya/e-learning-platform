-- /courses filters on category and joins on instructor_id on every request. Safe to re-run.
CREATE INDEX IF NOT EXISTS idx_course_category ON course(category);
CREATE INDEX IF NOT EXISTS idx_course_instructor_id ON course(instructor_id);
