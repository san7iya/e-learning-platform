const enrollmentService = require("../services/enrollmentService");
const { handleServerError } = require("../utils/errors");

async function enroll(req, res) {
  const { course_id } = req.body;

  if (!course_id) {
    return res.status(400).json({ success: false, message: "course_id is required" });
  }

  try {
    const enrollment = await enrollmentService.enrollUserInCourse(req.user.user_id, course_id);
    res.status(201).json({ success: true, enrollment });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ success: false, message: "Already enrolled in this course" });
    }
    if (err.code === "23503") {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    handleServerError(res, err, "Could not enroll in course");
  }
}

async function getMyCourses(req, res) {
  try {
    const courses = await enrollmentService.getMyCourses(req.user.user_id);
    res.json({ success: true, courses });
  } catch (err) {
    handleServerError(res, err);
  }
}

async function updateProgress(req, res) {
  const { progress_percent } = req.body;

  if (
    typeof progress_percent !== "number" ||
    progress_percent < 0 ||
    progress_percent > 100
  ) {
    return res.status(400).json({ success: false, message: "progress_percent must be a number between 0 and 100" });
  }

  try {
    const enrollment = await enrollmentService.updateProgress(req.params.id, progress_percent);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    res.json({ success: true, enrollment });
  } catch (err) {
    handleServerError(res, err, "Could not update progress");
  }
}

async function unenroll(req, res) {
  try {
    const enrollment = await enrollmentService.unenroll(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    res.json({ success: true });
  } catch (err) {
    handleServerError(res, err, "Could not unenroll from course");
  }
}

module.exports = { enroll, getMyCourses, updateProgress, unenroll };
