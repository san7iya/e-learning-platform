import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/auth/auth";
import LandingPage from "./components/landing/LandingPage";
import Dashboard from "./components/courses/Dashboard";
import AllCourses from "./components/courses/AllCourses";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login initialMode="login" />} />
        <Route path="/register" element={<Login initialMode="register" />} />
        <Route path = "/dashboard" element = {<Dashboard />} />
        <Route path="/courses" element={<AllCourses />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
