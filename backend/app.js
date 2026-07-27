require("dotenv").config();

const express = require("express");
const cors = require("cors");

const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const app = express();

// disable caching fully
app.disable("etag");
app.set('etag', false);
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// enable cors
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PATCH"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.use(courseRoutes);
app.use(authRoutes);
app.use(enrollmentRoutes);

module.exports = app;
