import React, { useState } from "react";
import "./style.css";
import { Frame } from "./Frame";

export const Login = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "register") {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      alert(`Registered: ${username}`);
    } else {
      alert(`Username: ${username}\nPassword: ${password}\nRemember Me: ${rememberMe}`);
    }
  };

  return (
    <div className="login">
      {/* Left Panel */}
      <div className="frame"></div>

      {/* Right Panel */}
      <div className="frame-2">
        <div className="text-wrapper-3">
          {mode === "login" ? "Welcome back!" : "Create an account"}
        </div>

        {/* Toggle */}
        <Frame mode={mode} setMode={setMode} />

        {/* Forms Container */}
        <form className="frame-5" onSubmit={handleSubmit}>
          {/* Login Form */}
          <div className={`form-wrapper ${mode === "login" ? "active" : ""}`}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Register Form */}
          <div className={`form-wrapper ${mode === "register" ? "active" : ""}`}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Checkbox & Forgot Password */}
          <div className="frame-9">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />{" "}
              Remember me
            </label>
            <div className="text-wrapper-11">Forgot Password ?</div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="div-wrapper">
            <div className="text-wrapper-12">{mode === "login" ? "Login" : "Register"}</div>
          </button>
        </form>
      </div>
    </div>
  );
};


