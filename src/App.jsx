import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/routing/PrivateRoute";
import { Login } from "./components/auth/auth";
import LandingPage from "./components/landing/LandingPage";
import Dashboard from "./components/courses/Dashboard";
import AllCourses from "./components/courses/AllCourses";

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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
