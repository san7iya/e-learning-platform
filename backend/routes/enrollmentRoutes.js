const express = require("express");
const { enroll, getMyCourses, updateProgress, unenroll } = require("../controllers/enrollmentController");
const { requireAuth } = require("../middleware/auth");
const { requireOwnership, requireRole } = require("../middleware/rbac");
const enrollmentService = require("../services/enrollmentService");

const router = express.Router();

router.post("/enroll", requireAuth, requireRole(["student"]), enroll);
router.get("/my-courses", requireAuth, getMyCourses);
router.patch(
  "/enrollments/:id/progress",
  requireAuth,
  requireOwnership(req => enrollmentService.getEnrollmentOwnerUserId(req.params.id)),
  updateProgress
);
router.delete(
  "/enrollments/:id",
  requireAuth,
  requireOwnership(req => enrollmentService.getEnrollmentOwnerUserId(req.params.id)),
  unenroll
);

module.exports = router;
