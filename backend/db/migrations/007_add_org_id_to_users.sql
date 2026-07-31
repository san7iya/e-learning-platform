-- Links a user (in particular org-admins) to the organization they belong to.
ALTER TABLE users ADD COLUMN IF NOT EXISTS org_id INT REFERENCES organization(org_id);
