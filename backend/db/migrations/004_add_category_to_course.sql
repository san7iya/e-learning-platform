-- Adds real category data so the frontend can stop forcing "General". Safe to re-run.
ALTER TABLE course ADD COLUMN IF NOT EXISTS category VARCHAR(50);
