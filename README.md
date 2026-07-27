# E-Learning Platform

> Full‑stack E‑Learning Platform (React + Vite frontend, Node.js + Express backend, PostgreSQL)

A Coursera‑inspired project where users can register, log in, browse courses, and access a personalized dashboard with progress tracking.

---

## Features

- **Authentication:** Register & login with email/password, passwords hashed with `bcrypt`, session persisted in `localStorage`. Input validation and rate limiting on auth routes.
- **Course Management:** Courses fetched from PostgreSQL; instructor and duration displayed; shown on the Landing Page and Dashboard.
- **User Dashboard:** Personalized welcome message, in‑progress courses, recommended courses, category cards.
- **Responsive Frontend:** Built with React + Vite and a modern component structure.
- **Backend API:** Express REST API split into routes/controllers/services layers, PostgreSQL (`pg`), CORS enabled, env-based config via `dotenv`.

---

## Project Structure

```
e-learning-platform/
│
├── backend/
│   ├── index.js        # App setup, middleware, route mounting
│   ├── routes/         # Express routers
│   ├── controllers/    # Request/response handling, validation
│   ├── services/       # DB access + business logic (incl. db.js pool)
│   ├── middleware/     # Rate limiting, etc.
│   ├── utils/          # Shared helpers (error handling, validation)
│   ├── db/             # schema.sql + seed.sql for local setup
│   ├── .env.example
│   └── package.json
│
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── config.js       # API_BASE constant
│   └── components/
│       ├── landing/
│       ├── auth/
│       ├── header/
│       └── courses/
│
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

### course
- `course_id` SERIAL PRIMARY KEY
- `title` VARCHAR(255)
- `description` TEXT
- `duration_weeks` INT
- `instructor_id` REFERENCES `instructor`

### instructor
- `instructor_id` SERIAL PRIMARY KEY
- `name` VARCHAR(100)
- `bio` TEXT
- `org_id` REFERENCES `organization`

### organization
- `org_id` SERIAL PRIMARY KEY
- `name` VARCHAR(100)
- `location` VARCHAR(255)

### module
- `module_id` SERIAL PRIMARY KEY
- `course_id` REFERENCES `course`
- `title` VARCHAR(255)
- `duration_minutes` INT

### enrollment
- `enrollment_id` SERIAL PRIMARY KEY
- `user_id` REFERENCES `users`
- `course_id` REFERENCES `course`
- `enrollment_date` TIMESTAMP
- `progress_percent` INT

---

## Backend API Endpoints

### Authentication
- `POST /register` — Register new user
- `POST /login` — Login existing user

### Courses
- `GET /courses` — Fetch all courses

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

By default the backend runs at: `http://localhost:5000`

---

## Frontend Setup

From the repository root install dependencies and start the Vite dev server:

```powershell
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

---

## Authentication Flow (Simplified)

1. User registers → password hashed using `bcrypt`.
2. Login → `bcrypt.compare()` validates password.
3. On success → user object saved to `localStorage`.
4. Dashboard checks `localStorage` for authenticated user; otherwise redirects to login.

---

## Tech Stack

- **Frontend:** React.js, Vite
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Auth:** bcrypt
- **API:** REST


---

## Contributing

Star the repo and feel free to contribute via issues or pull requests. Add a brief description of changes and include any migration or setup steps in your PR.

---

Thank you for checking out the project — happy coding!