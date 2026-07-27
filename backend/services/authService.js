const bcrypt = require("bcrypt");
const pool = require("./db");

async function registerUser(name, email, password, role = "student") {
  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, join_date, role)
     VALUES ($1, $2, $3, NOW(), $4)
     RETURNING user_id, name, email, role`,
    [name, email, hash, role]
  );

  return result.rows[0];
}

async function verifyCredentials(email, password) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password);

  return validPassword ? user : null;
}

async function getUserById(userId) {
  const result = await pool.query(
    "SELECT user_id, name, email, role FROM users WHERE user_id = $1",
    [userId]
  );
  return result.rows[0] || null;
}

module.exports = { registerUser, verifyCredentials, getUserById };
