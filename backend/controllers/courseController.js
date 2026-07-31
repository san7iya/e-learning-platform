const courseService = require("../services/courseService");
const { handleServerError } = require("../utils/errors");

async function getCourses(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const { courses, total } = await courseService.getAllCourses(req.query.category, { page, limit });

    res.json({
      success: true,
      courses,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
    });
  } catch (err) {
    handleServerError(res, err);
  }
}

async function getRecommendedCourses(req, res) {
  try {
    const courses = await courseService.getRecommendedCourses(req.user.user_id);
    res.json({ success: true, courses });
  } catch (err) {
    handleServerError(res, err);
  }
}

async function getMyTaughtCourses(req, res) {
  try {
    const courses = await courseService.getCoursesByInstructorUser(req.user.user_id);
    res.json({ success: true, courses });
  } catch (err) {
    handleServerError(res, err);
  }
}

async function getOrgCourses(req, res) {
  try {
    const courses = await courseService.getCoursesByOrgAdminUser(req.user.user_id);
    res.json({ success: true, courses });
  } catch (err) {
    handleServerError(res, err);
  }
}

async function getCategories(req, res) {
  try {
    const categories = await courseService.getDistinctCategories();
    res.json({ success: true, categories });
  } catch (err) {
    handleServerError(res, err);
  }
}

async function getCourseDetail(req, res) {
  try {
    const course = await courseService.getCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, course });
  } catch (err) {
    handleServerError(res, err);
  }
}

async function createCourse(req, res) {
  const { title, description, duration_weeks, category } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: "Title is required" });
  }

  try {
    const instructorId = await courseService.getOrCreateInstructorForUser(req.user.user_id);
    const course = await courseService.createCourse({
      title,
      description,
      durationWeeks: duration_weeks,
      instructorId,
      category
    });
    res.status(201).json({ success: true, course });
  } catch (err) {
    handleServerError(res, err, "Could not create course");
  }
}

async function updateCourse(req, res) {
  const { title, description, duration_weeks, category } = req.body;

  try {
    const course = await courseService.updateCourse(req.params.id, {
      title,
      description,
      durationWeeks: duration_weeks,
      category
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, course });
  } catch (err) {
    handleServerError(res, err, "Could not update course");
  }
}

module.exports = { getCourses, getRecommendedCourses, getMyTaughtCourses, getOrgCourses, getCategories, getCourseDetail, createCourse, updateCourse };
