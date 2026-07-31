import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/routing/PrivateRoute";
import RoleRoute from "./components/routing/RoleRoute";
import { Login } from "./components/auth/auth";
import LandingPage from "./components/landing/LandingPage";
import Dashboard from "./components/courses/Dashboard";
import AllCourses from "./components/courses/AllCourses";
import CourseDetail from "./components/courses/CourseDetail";
import MyProgress from "./components/courses/MyProgress";
import CreateCourse from "./components/courses/CreateCourse";
import EditCourse from "./components/courses/EditCourse";
import Profile from "./components/profile/Profile";

const INSTRUCTOR_ROLES = ["instructor", "org-admin"];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login initialMode="login" />} />
          <Route path="/register" element={<Login initialMode="register" />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/courses" element={<AllCourses />} />
          <Route
            path="/courses/new"
            element={<RoleRoute roles={INSTRUCTOR_ROLES}><CreateCourse /></RoleRoute>}
          />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route
            path="/courses/:id/edit"
            element={<RoleRoute roles={INSTRUCTOR_ROLES}><EditCourse /></RoleRoute>}
          />
          <Route path="/progress" element={<RoleRoute roles={["student"]}><MyProgress /></RoleRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
