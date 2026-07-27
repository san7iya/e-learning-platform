const express = require("express");
const { enroll, getMyCourses, updateProgress } = require("../controllers/enrollmentController");
const { requireAuth } = require("../middleware/auth");
const { requireOwnership } = require("../middleware/rbac");
const enrollmentService = require("../services/enrollmentService");

const router = express.Router();

router.post("/enroll", requireAuth, enroll);
router.get("/my-courses", requireAuth, getMyCourses);
router.patch(
  "/enrollments/:id/progress",
  requireAuth,
  requireOwnership(req => enrollmentService.getEnrollmentOwnerUserId(req.params.id)),
  updateProgress
);

module.exports = router;
