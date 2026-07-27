const courseService = require("../services/courseService");
const { handleServerError } = require("../utils/errors");

async function getCourses(req, res) {
  try {
    const courses = await courseService.getAllCourses();
    res.json({ success: true, courses });
  } catch (err) {
    handleServerError(res, err);
  }
}

module.exports = { getCourses };
