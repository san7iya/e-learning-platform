-- Schema for the elearning database, as documented in README.md

CREATE TABLE IF NOT EXISTS users (
  user_id    SERIAL PRIMARY KEY,
  name       VARCHAR(100),
  email      VARCHAR(100) UNIQUE,
  password   TEXT,
  join_date  TIMESTAMP,
  role       VARCHAR(20) NOT NULL DEFAULT 'student'
             CHECK (role IN ('student', 'instructor', 'org-admin'))
);

CREATE TABLE IF NOT EXISTS organization (
  org_id    SERIAL PRIMARY KEY,
  name      VARCHAR(100),
  location  VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS instructor (
  instructor_id  SERIAL PRIMARY KEY,
  name           VARCHAR(100),
  bio            TEXT,
  org_id         INT REFERENCES organization(org_id),
  user_id        INT UNIQUE REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS course (
  course_id       SERIAL PRIMARY KEY,
  title           VARCHAR(255),
  description     TEXT,
  duration_weeks  INT,
  instructor_id   INT REFERENCES instructor(instructor_id),
  category        VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS module (
  module_id         SERIAL PRIMARY KEY,
  course_id         INT REFERENCES course(course_id),
  title             VARCHAR(255),
  duration_minutes  INT
);

CREATE TABLE IF NOT EXISTS enrollment (
  enrollment_id     SERIAL PRIMARY KEY,
  user_id           INT REFERENCES users(user_id),
  course_id         INT REFERENCES course(course_id),
  enrollment_date   TIMESTAMP,
  progress_percent  INT,
  UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_category ON course(category);
CREATE INDEX IF NOT EXISTS idx_course_instructor_id ON course(instructor_id);
CREATE INDEX IF NOT EXISTS idx_module_course_id ON module(course_id);
