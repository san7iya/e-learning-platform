const pool = require("./db");

async function enrollUserInCourse(userId, courseId) {
  const result = await pool.query(
    `INSERT INTO enrollment (user_id, course_id, enrollment_date, progress_percent)
     VALUES ($1, $2, NOW(), 0)
     RETURNING enrollment_id, user_id, course_id, enrollment_date, progress_percent`,
    [userId, courseId]
  );
  return result.rows[0];
}

async function getMyCourses(userId) {
  const result = await pool.query(
    `SELECT e.enrollment_id, e.progress_percent, e.enrollment_date,
            c.course_id, c.title, c.description, c.duration_weeks, c.category,
            i.name AS instructor, COUNT(m.module_id)::int AS lessons_count
     FROM enrollment e
     JOIN course c ON e.course_id = c.course_id
     LEFT JOIN instructor i ON c.instructor_id = i.instructor_id
     LEFT JOIN module m ON m.course_id = c.course_id
     WHERE e.user_id = $1
     GROUP BY e.enrollment_id, c.course_id, i.name
     ORDER BY e.enrollment_date DESC`,
    [userId]
  );
  return result.rows;
}

async function getEnrollmentOwnerUserId(enrollmentId) {
  const result = await pool.query(
    "SELECT user_id FROM enrollment WHERE enrollment_id = $1",
    [enrollmentId]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0].user_id;
}

async function updateProgress(enrollmentId, progressPercent) {
  const result = await pool.query(
    `UPDATE enrollment
     SET progress_percent = $1
     WHERE enrollment_id = $2
     RETURNING enrollment_id, user_id, course_id, progress_percent`,
    [progressPercent, enrollmentId]
  );
  return result.rows[0] || null;
}

module.exports = { enrollUserInCourse, getMyCourses, getEnrollmentOwnerUserId, updateProgress };
