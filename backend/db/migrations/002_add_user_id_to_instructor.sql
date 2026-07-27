-- Links an instructor row to the users row that owns it, so course
-- ownership (RBAC) can be checked against req.user.user_id. Safe to re-run.
ALTER TABLE instructor ADD COLUMN IF NOT EXISTS user_id INT UNIQUE REFERENCES users(user_id);
