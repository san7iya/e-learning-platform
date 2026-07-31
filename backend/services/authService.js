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

async function registerOrgAdmin(name, email, password, orgName, orgLocation) {
  const hash = await bcrypt.hash(password, 10);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orgResult = await client.query(
      "INSERT INTO organization (name, location) VALUES ($1, $2) RETURNING org_id",
      [orgName, orgLocation || null]
    );
    const orgId = orgResult.rows[0].org_id;

    const userResult = await client.query(
      `INSERT INTO users (name, email, password, join_date, role, org_id)
       VALUES ($1, $2, $3, NOW(), 'org-admin', $4)
       RETURNING user_id, name, email, role, org_id`,
      [name, email, hash, orgId]
    );

    await client.query("COMMIT");
    return userResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
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

module.exports = { registerUser, registerOrgAdmin, verifyCredentials, getUserById };
