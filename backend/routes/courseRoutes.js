const express = require("express");
const { getCourses, getRecommendedCourses, getMyTaughtCourses, getOrgCourses, getCategories, getCourseDetail, createCourse, updateCourse } = require("../controllers/courseController");
const { requireAuth } = require("../middleware/auth");
const { requireRole, requireOwnership } = require("../middleware/rbac");
const courseService = require("../services/courseService");

const router = express.Router();

router.get("/courses", getCourses);
router.get("/categories", getCategories);
router.get("/recommended-courses", requireAuth, getRecommendedCourses);
router.get(
  "/my-taught-courses",
  requireAuth,
  requireRole(["instructor"]),
  getMyTaughtCourses
);
router.get(
  "/org-courses",
  requireAuth,
  requireRole(["org-admin"]),
  getOrgCourses
);
router.get("/courses/:id", getCourseDetail);

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
