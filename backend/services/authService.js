const bcrypt = require("bcrypt");
const pool = require("./db");

async function registerUser(name, email, password) {
  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, join_date)
     VALUES ($1, $2, $3, NOW())
     RETURNING user_id, name, email`,
    [name, email, hash]
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

module.exports = { registerUser, verifyCredentials };
