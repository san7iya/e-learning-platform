const express = require("express");
const { getCourses, getRecommendedCourses, createCourse, updateCourse } = require("../controllers/courseController");
const { requireAuth } = require("../middleware/auth");
const { requireRole, requireOwnership } = require("../middleware/rbac");
const courseService = require("../services/courseService");

const router = express.Router();

router.get("/courses", getCourses);
router.get("/recommended-courses", requireAuth, getRecommendedCourses);

router.post(
  "/courses",
  requireAuth,
  requireRole(["instructor", "org-admin"]),
  createCourse
);

router.patch(
  "/courses/:id",
  requireAuth,
  requireRole(["instructor", "org-admin"]),
  requireOwnership(req => courseService.getCourseOwnerUserId(req.params.id)),
  updateCourse
);

module.exports = router;
