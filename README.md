📘 E-Learning Platform (React + Node.js + PostgreSQL)

A full-stack E-Learning Platform inspired by Coursera.
Users can register, log in, browse courses, and access a personalized dashboard with progress tracking — all powered through a PostgreSQL backend.

🚀 Features
🔐 Authentication

Register & Login with email + password

Passwords securely hashed using bcrypt

User stored in localStorage for session persistence

🎓 Course Management

Fetch courses dynamically from PostgreSQL

Instructor + Duration displayed

Courses shown on Landing Page and Dashboard

📊 User Dashboard

Personalized welcome message

In-progress courses section

Recommended courses

Course category cards

🎨 UI / Frontend

React.js + Vite

Fully responsive

Modern components (Course Cards, Header, Dashboard layout)

🗄️ Backend

Express.js API

PostgreSQL connection using pg

CORS enabled

REST API for courses + authentication

📁 Project Structure
e-learning-platform/
│
├── backend/
│   ├── index.js           # API routes + DB connection
│   ├── package.json
|   ├── package-lock.json 
│   └── node_modules/
│
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── landing/
│   │   ├── login/
│   │   ├── header/
│   │   ├── courses/
│   │   └── common/
│   ├── index.css
│   └── main.jsx
│
|
├── package.json
├── package-lock.json
└── README.md

🛢️ Database Schema (PostgreSQL)
users
user_id SERIAL PRIMARY KEY
name VARCHAR(100)
email VARCHAR(100) UNIQUE
password TEXT
join_date TIMESTAMP

course
course_id SERIAL PRIMARY KEY
title VARCHAR(255)
description TEXT
duration_weeks INT
instructor_id INT REFERENCES instructor(instructor_id)

instructor
instructor_id SERIAL PRIMARY KEY
name VARCHAR(100)
bio TEXT
org_id INT REFERENCES organization(org_id)

organization
org_id SERIAL PRIMARY KEY
name VARCHAR(100)
location VARCHAR(255)

module
module_id SERIAL PRIMARY KEY
course_id INT REFERENCES course(course_id)
title VARCHAR(255)
duration_minutes INT

enrollment
enrollment_id SERIAL PRIMARY KEY
user_id INT REFERENCES users(user_id)
course_id INT REFERENCES course(course_id)
enrollment_date TIMESTAMP
progress_percent INT

🔗 Backend API Endpoints
🔐 Authentication
Method	Route	Description
POST	/register	Register new user
POST	/login	Login existing user
📚 Course APIs
Method	Route	Description
GET	/courses	Fetch all courses
POST	/add-course	Add test course (dev only)
🖥️ Backend Setup
Install dependencies
cd backend
npm install

Run backend
node index.js


Backend runs on:
👉 http://localhost:5000

🌐 Frontend Setup
Install dependencies
npm install

Run frontend
npm run dev


Frontend runs on:
👉 http://localhost:5173

🔐 Authentication Flow (Simplified)

User registers → password hashed via bcrypt

Login → bcrypt.compare() checks password

On success → user stored in localStorage

Dashboard checks for localStorage user → else redirect to login

📸 Screenshots (Optional for GitHub)

You can add images later like this:

![Alt Text](./screenshots/login.png)

🛠️ Tech Stack
Layer	Technology
Frontend	React.js, Vite, CSS
Backend	Node.js, Express.js
Database	PostgreSQL
Auth	bcrypt
API	REST
🧑‍💻 Author

Saniya Goyal
23BCE2126 – DBMS Project
Vellore Institute of Technology

⭐ If you like this project

Feel free to star ⭐ the repository and contribute!