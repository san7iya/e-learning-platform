const express = require("express");
const { getCourses } = require("../controllers/courseController");

const router = express.Router();

router.get("/courses", getCourses);

module.exports = router;
