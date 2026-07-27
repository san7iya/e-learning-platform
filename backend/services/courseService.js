const pool = require("./db");

async function getAllCourses(category, { page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM course c WHERE $1::varchar IS NULL OR c.category = $1`,
    [category || null]
  );
  const total = countResult.rows[0].total;

  const result = await pool.query(
    `SELECT c.course_id, c.title, c.description, c.duration_weeks, c.category,
            i.name AS instructor, COUNT(m.module_id)::int AS lessons_count
     FROM course c
     LEFT JOIN instructor i ON c.instructor_id = i.instructor_id
     LEFT JOIN module m ON m.course_id = c.course_id
     WHERE $1::varchar IS NULL OR c.category = $1
     GROUP BY c.course_id, i.name
     ORDER BY c.course_id
     LIMIT $2 OFFSET $3`,
    [category || null, limit, offset]
  );

  return { courses: result.rows, total };
}

async function getRecommendedCourses(userId, limit = 4) {
  const result = await pool.query(
    `WITH my_categories AS (
       SELECT DISTINCT c.category
       FROM enrollment e
       JOIN course c ON e.course_id = c.course_id
       WHERE e.user_id = $1 AND c.category IS NOT NULL
     )
     SELECT c.course_id, c.title, c.description, c.duration_weeks, c.category,
            i.name AS instructor, COUNT(m.module_id)::int AS lessons_count
     FROM course c
     LEFT JOIN instructor i ON c.instructor_id = i.instructor_id
     LEFT JOIN module m ON m.course_id = c.course_id
     WHERE c.course_id NOT IN (
       SELECT course_id FROM enrollment WHERE user_id = $1
     )
     GROUP BY c.course_id, i.name
     ORDER BY
       CASE WHEN c.category IN (SELECT category FROM my_categories) THEN 0 ELSE 1 END,
       c.course_id
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

async function getCourseOwnerUserId(courseId) {
  const result = await pool.query(
    `SELECT i.user_id
     FROM course c
     JOIN instructor i ON c.instructor_id = i.instructor_id
     WHERE c.course_id = $1`,
    [courseId]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0].user_id;
}

async function getOrCreateInstructorForUser(userId) {
  const existing = await pool.query(
    "SELECT instructor_id FROM instructor WHERE user_id = $1",
    [userId]
  );
  if (existing.rows.length > 0) {
    return existing.rows[0].instructor_id;
  }

  const userResult = await pool.query("SELECT name FROM users WHERE user_id = $1", [userId]);
  const name = userResult.rows[0]?.name || "Unknown";

  const created = await pool.query(
    "INSERT INTO instructor (name, user_id) VALUES ($1, $2) RETURNING instructor_id",
    [name, userId]
  );
  return created.rows[0].instructor_id;
}

async function createCourse({ title, description, durationWeeks, instructorId, category }) {
  const result = await pool.query(
    `INSERT INTO course (title, description, duration_weeks, instructor_id, category)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING course_id, title, description, duration_weeks, instructor_id, category`,
    [title, description, durationWeeks, instructorId, category || null]
  );
  return result.rows[0];
}

async function updateCourse(courseId, { title, description, durationWeeks, category }) {
  const result = await pool.query(
    `UPDATE course
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         duration_weeks = COALESCE($3, duration_weeks),
         category = COALESCE($4, category)
     WHERE course_id = $5
     RETURNING course_id, title, description, duration_weeks, instructor_id, category`,
    [title, description, durationWeeks, category, courseId]
  );
  return result.rows[0] || null;
}

module.exports = {
  getAllCourses,
  getRecommendedCourses,
  getCourseOwnerUserId,
  getOrCreateInstructorForUser,
  createCourse,
  updateCourse
};
