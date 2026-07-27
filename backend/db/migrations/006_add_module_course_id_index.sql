-- module.course_id is the join column for every course-listing query
-- (getAllCourses, getRecommendedCourses, getMyCourses all LEFT JOIN module
-- on it to compute lessons_count), but had no index beyond the module_id
-- primary key. See backend/benchmark/ for the measured before/after impact.
-- Safe to re-run.
CREATE INDEX IF NOT EXISTS idx_module_course_id ON module(course_id);
