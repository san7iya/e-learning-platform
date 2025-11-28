const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

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
  methods: "GET,POST"
}));

app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "elearning",
  password: "redBERRY123/",
  port: 5432,
});

pool.query('SET search_path TO public;');

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.get("/courses", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.course_id, c.title, c.description, c.duration_weeks, i.name AS instructor
      FROM course c
      LEFT JOIN instructor i ON c.instructor_id = i.instructor_id
    `);

    res.json({ success: true, courses: result.rows });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, join_date)
       VALUES ($1, $2, $3, NOW())
       RETURNING user_id, name, email`,
      [name, email, hash]
    );

    return res.json({ success: true, user: result.rows[0] });

  } catch (err) {
    res.json({ success: false, message: "Email already registered or error", error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    return res.json({ success: true, user });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, server_time: result.rows[0] });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get("/debug-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT current_database(), current_user");
    res.json(result.rows);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/add-course", async (req, res) => {
    const { title, instructor, price } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO courses (title, instructor, price) VALUES ($1, $2, $3) RETURNING *",
      [title, instructor, price]
    );

    res.json({ success: true, course: result.rows[0] });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

