-- Prevents duplicate enrollments for the same user+course. Safe to re-run.
ALTER TABLE enrollment DROP CONSTRAINT IF EXISTS enrollment_user_course_unique;
ALTER TABLE enrollment ADD CONSTRAINT enrollment_user_course_unique UNIQUE (user_id, course_id);
