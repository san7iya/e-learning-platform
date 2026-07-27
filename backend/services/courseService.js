const pool = require("./db");

async function getAllCourses() {
  const result = await pool.query(`
    SELECT c.course_id, c.title, c.description, c.duration_weeks, i.name AS instructor
    FROM course c
    LEFT JOIN instructor i ON c.instructor_id = i.instructor_id
  `);
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

async function createCourse({ title, description, durationWeeks, instructorId }) {
  const result = await pool.query(
    `INSERT INTO course (title, description, duration_weeks, instructor_id)
     VALUES ($1, $2, $3, $4)
     RETURNING course_id, title, description, duration_weeks, instructor_id`,
    [title, description, durationWeeks, instructorId]
  );
  return result.rows[0];
}

async function updateCourse(courseId, { title, description, durationWeeks }) {
  const result = await pool.query(
    `UPDATE course
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         duration_weeks = COALESCE($3, duration_weeks)
     WHERE course_id = $4
     RETURNING course_id, title, description, duration_weeks, instructor_id`,
    [title, description, durationWeeks, courseId]
  );
  return result.rows[0] || null;
}

module.exports = {
  getAllCourses,
  getCourseOwnerUserId,
  getOrCreateInstructorForUser,
  createCourse,
  updateCourse
};
