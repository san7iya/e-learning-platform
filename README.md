# E-Learning Platform

> Full‑stack E‑Learning Platform (React + Vite frontend, Node.js + Express backend, PostgreSQL)

A Coursera‑inspired project where users can register, log in, browse courses, and access a personalized dashboard with progress tracking.

---

## Features

- **Authentication:** Register & login with email/password, passwords hashed with `bcrypt`, JWT issued on login/register and sent as a `Bearer` token. Input validation and rate limiting on auth routes.
- **RBAC:** Role-gated course create/edit (`student` / `instructor` / `org-admin`), with role and ownership checked as two separate, composable middleware steps.
- **Course Management:** Courses fetched from PostgreSQL with real category and lesson (module) counts; paginated; filterable by category.
- **Enrollment & Progress:** Real enrollment records tied to each user, with per-course progress tracking (no more hardcoded values).
- **User Dashboard:** Personalized welcome message, real in‑progress courses, category-matched recommendations, clickable category filters.
- **Responsive Frontend:** Built with React + Vite, a shared `AuthContext`, and a consolidated auth-aware header.
- **Backend API:** Express REST API split into routes/controllers/services layers, PostgreSQL (`pg`), CORS enabled, env-based config via `dotenv`.
- **Tests:** backend (`jest`+`supertest`) covers auth (register/login happy + failure paths) and an RBAC-denied case; frontend (`vitest`+React Testing Library) covers `CourseCard`, `AuthContext`, and `PrivateRoute`.
- **Query Performance:** `module.course_id` — the join column used by every course-listing query — was missing an index; measured and fixed, see [Query Performance](#query-performance) below.

---

## Project Structure

```
e-learning-platform/
│
├── backend/
│   ├── app.js           # Express app (exported, no listen()) — used by tests too
│   ├── index.js         # Entry point: imports app.js, calls listen()
│   ├── routes/          # Express routers
│   ├── controllers/     # Request/response handling, validation
│   ├── services/        # DB access + business logic (incl. db.js pool)
│   ├── middleware/      # Auth (JWT), RBAC, rate limiting
│   ├── utils/           # Shared helpers (error handling, validation, JWT)
│   ├── db/              # schema.sql, seed.sql, migrations/
│   ├── benchmark/       # seed.js + queryBenchmark.js — reproducible query perf numbers
│   ├── tests/           # jest + supertest
│   ├── .env.example
│   └── package.json
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── config.js        # API_BASE constant
│   ├── test/
│   │   └── setup.js     # vitest + jest-dom setup
│   ├── context/
│   │   ├── AuthContext.jsx       # AuthProvider + useAuth()
│   │   └── AuthContext.test.jsx
│   └── components/
│       ├── landing/
│       ├── auth/
│       ├── header/       # single shared, auth-aware Header
│       ├── courses/
│       │   ├── CourseCard.jsx
│       │   └── CourseCard.test.jsx
│       └── routing/
│           ├── PrivateRoute.jsx
│           └── PrivateRoute.test.jsx
│
├── vite.config.js       # @vitejs/plugin-react + vitest config
├── package.json
└── README.md
```

---

## Database Schema (PostgreSQL)

### users
- `user_id` SERIAL PRIMARY KEY
- `name` VARCHAR(100)
- `email` VARCHAR(100) UNIQUE
- `password` TEXT
- `join_date` TIMESTAMP
- `role` VARCHAR(20) DEFAULT `'student'` — `student` / `instructor` / `org-admin` (self-serve at registration; `org-admin` is not self-servable)

### course
- `course_id` SERIAL PRIMARY KEY
- `title` VARCHAR(255)
- `description` TEXT
- `duration_weeks` INT
- `instructor_id` REFERENCES `instructor`
- `category` VARCHAR(50) — indexed, filterable via `GET /courses?category=`

### instructor
- `instructor_id` SERIAL PRIMARY KEY
- `name` VARCHAR(100)
- `bio` TEXT
- `org_id` REFERENCES `organization`
- `user_id` UNIQUE REFERENCES `users` — links an instructor row to the login-capable user who owns it, for RBAC ownership checks

### organization
- `org_id` SERIAL PRIMARY KEY
- `name` VARCHAR(100)
- `location` VARCHAR(255)

### module
- `module_id` SERIAL PRIMARY KEY
- `course_id` REFERENCES `course` — indexed (`idx_module_course_id`), see [Query Performance](#query-performance)
- `title` VARCHAR(255)
- `duration_minutes` INT

### enrollment
- `enrollment_id` SERIAL PRIMARY KEY
- `user_id` REFERENCES `users`
- `course_id` REFERENCES `course`
- `enrollment_date` TIMESTAMP
- `progress_percent` INT
- `UNIQUE (user_id, course_id)` — a user can only enroll in a given course once

---

## Backend API Endpoints

All protected routes expect `Authorization: Bearer <token>`, where `<token>` is the JWT returned by `/register` or `/login`.

### Authentication
- `POST /register` — Register a new user. Body: `{ name, email, password, role? }` (`role` defaults to `student`; only `student`/`instructor` are self-servable). Returns `{ token, user }` — never the password hash.
- `POST /login` — Login. Returns `{ token, user }`.
- `GET /me` — *(auth required)* Returns the current user's fresh profile (name/email/role) for the given token.

### Courses
- `GET /courses` — Public. Query params: `category` (filter), `page`, `limit` (pagination, default `limit=10`, max `50`). Returns `{ courses, pagination: { page, limit, total, totalPages } }`, each course including a real `lessons_count` (from `module`).
- `GET /recommended-courses` — *(auth required)* Courses the user isn't enrolled in yet, prioritizing categories they're already enrolled in, capped at 4.
- `POST /courses` — *(auth required, role: `instructor`/`org-admin`)* Create a course. Body: `{ title, description?, duration_weeks?, category? }`.
- `PATCH /courses/:id` — *(auth required, role: `instructor`/`org-admin`, and ownership: only the course's own instructor)* Update a course.

### Enrollment
- `POST /enroll` — *(auth required)* Body: `{ course_id }`. `409` if already enrolled, `404` if the course doesn't exist.
- `GET /my-courses` — *(auth required)* The logged-in user's enrolled courses, joined with real progress.
- `PATCH /enrollments/:id/progress` — *(auth required, ownership: only the enrollment's own user)* Body: `{ progress_percent }` (0–100).

---

## Backend Setup

Open a terminal, change into the `backend` folder, install dependencies, configure your environment, create the database, and start the server:

```powershell
cd backend
npm install
copy .env.example .env   # then fill in your local DB credentials

# create the database and apply schema + sample data
psql -U postgres -h localhost -c "CREATE DATABASE elearning;"
psql -U postgres -h localhost -d elearning -f db/schema.sql
psql -U postgres -h localhost -d elearning -f db/seed.sql

node index.js
```

`db/schema.sql` is the current schema for fresh installs. `db/migrations/` holds the incremental changes made along the way (role column, instructor↔user link, category column, indexes, enrollment uniqueness) — only relevant if you're upgrading an existing database instead of creating a fresh one.

By default the backend runs at: `http://localhost:5000`

### Running tests

```powershell
cd backend
npm test
```

Runs `jest` + `supertest` against the real local database configured in `.env` (register/login happy + failure paths, one RBAC-denied case). Safe to re-run — each run generates unique test emails.

---

## Query Performance

`getAllCourses`, `getRecommendedCourses`, and `getMyCourses` each `LEFT JOIN module ON module.course_id = course.course_id` to compute a real `lessons_count`. That join column had no index — only `course.category` and `course.instructor_id` did (migration `005`). At real seed-data scale (a handful of rows) this is invisible; it isn't at a few thousand.

**Measured, not estimated.** `backend/benchmark/` seeds 3,000 courses / 250 instructors / ~21,000 modules, then benchmarks the exact SQL from `getAllCourses` two ways — `EXPLAIN ANALYZE` (pure DB execution time) and an end-to-end call through the real service function (`performance.now()`, including the Postgres round trip) — 1 warm-up + 10 timed runs each, before and after `CREATE INDEX idx_module_course_id ON module(course_id)`:

| Measurement | Before | After | Improvement |
|---|---|---|---|
| DB-level (`EXPLAIN ANALYZE`, avg of 10) | 22.94 ms | 0.09 ms | 99.6% |
| App-level (service call, avg of 10) | 12.30 ms | 1.18 ms | 90.4% |

Why: without the index, Postgres materializes the full `module` table and nested-loop-joins it against every course row, discarding 231,125 non-matching pairs per query (`Seq Scan on module`, confirmed via the actual query plan). With the index, it does one targeted index probe per course instead of scanning the whole table.

One honest caveat: the DB-level number is *higher* than the app-level number in the "before" row, which looks backwards at first glance. That's `EXPLAIN ANALYZE`'s own per-node timing instrumentation adding overhead on a plan with many loop iterations — not a sign the numbers are wrong. The app-level number is the one that reflects what a real request actually experiences.

To reproduce (adds and removes its own clearly-namespaced rows, doesn't touch real data):

```powershell
cd backend
node benchmark/seed.js              # seeds 3,000 benchmark courses (skips if already seeded)
node benchmark/queryBenchmark.js    # prints before/after timings, adds the index permanently
node benchmark/seed.js --clean      # removes benchmark rows only, no re-seed (index stays)
```

The index itself is now permanent — `db/migrations/006_add_module_course_id_index.sql` and `db/schema.sql` both include it, independent of whether you ever run the benchmark.

---

## Frontend Setup

From the repository root install dependencies and start the Vite dev server:

```powershell
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

### Running tests

```powershell
npm test
```

Runs `vitest` (React Testing Library) over `src/**/*.test.jsx` — `CourseCard` rendering/interaction, `AuthContext` login/logout/session-validation, and `PrivateRoute` redirect behavior. Fully isolated from the network (`fetch` is mocked), so no backend or database needed.

---

## Authentication Flow

1. User registers or logs in → password hashed/verified with `bcrypt`.
2. On success, the backend signs a JWT containing only `{ user_id, role }` and returns it alongside a `user` object that never includes the password hash.
3. The frontend's `AuthContext` stores the token (and user) in `localStorage`, sends it as `Authorization: Bearer <token>` on subsequent requests, and validates it against `GET /me` once on load.
4. `<PrivateRoute>` (React Router) gates `/dashboard` — no authenticated user means an immediate redirect to `/login`, no imperative page reload.
5. Protected backend routes use `requireAuth` (verifies the JWT, sets `req.user`), and mutating course/enrollment routes add `requireRole`/`requireOwnership` on top, checked as separate, composable steps.

---

## Tech Stack

- **Frontend:** React.js, Vite, React Router
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Auth:** bcrypt, JSON Web Tokens
- **API:** REST
- **Testing:** jest + supertest (backend), vitest + React Testing Library (frontend)


---

## Contributing

Star the repo and feel free to contribute via issues or pull requests. Add a brief description of changes and include any migration or setup steps in your PR.

---

Thank you for checking out the project — happy coding!