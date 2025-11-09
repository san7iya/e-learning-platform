import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/login/login";
import { LandingPage } from "./components/landing/LandingPage";
import Dashboard from "./components/courses/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login initialMode="login" />} />
        <Route path="/register" element={<Login initialMode="register" />} />
        <Route path = "/dashboard" element = {<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
