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

async function createCourse(req, res) {
  const { title, description, duration_weeks } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: "Title is required" });
  }

  try {
    const instructorId = await courseService.getOrCreateInstructorForUser(req.user.user_id);
    const course = await courseService.createCourse({
      title,
      description,
      durationWeeks: duration_weeks,
      instructorId
    });
    res.status(201).json({ success: true, course });
  } catch (err) {
    handleServerError(res, err, "Could not create course");
  }
}

async function updateCourse(req, res) {
  const { title, description, duration_weeks } = req.body;

  try {
    const course = await courseService.updateCourse(req.params.id, {
      title,
      description,
      durationWeeks: duration_weeks
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, course });
  } catch (err) {
    handleServerError(res, err, "Could not update course");
  }
}

module.exports = { getCourses, createCourse, updateCourse };
