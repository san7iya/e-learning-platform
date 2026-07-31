const { Pool } = require("pg");

// Hosted Postgres (Render, Railway, Supabase, ...) provides a single
// DATABASE_URL and requires SSL; local dev uses the discrete DB_* vars.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

pool.query('SET search_path TO public;');

module.exports = pool;
