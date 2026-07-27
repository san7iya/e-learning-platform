const express = require("express");
const { register, login } = require("../controllers/authController");
const { getMe } = require("../controllers/userController");
const { authLimiter } = require("../middleware/rateLimit");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", requireAuth, getMe);

module.exports = router;
