const pool = require("./db");

async function getAllCourses() {
  const result = await pool.query(`
    SELECT c.course_id, c.title, c.description, c.duration_weeks, i.name AS instructor
    FROM course c
    LEFT JOIN instructor i ON c.instructor_id = i.instructor_id
  `);
  return result.rows;
}

module.exports = { getAllCourses };
