import React, { useState } from "react";
import "./style.css";
import { Frame } from "./Frame";
import { useNavigate } from "react-router-dom";

export const Login = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // added email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (mode === "register") {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: username, email, password })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } else {
      alert(data.message || "Registration failed");
    }
  } else {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  }
};

  return (
    <div className="login">
      <div className="frame"></div>

      <div className="frame-2">
        <div className="text-wrapper-3">
          {mode === "login" ? "Welcome back!" : "Create an account"}
        </div>

        <Frame mode={mode} setMode={setMode} />

        <form className="frame-5" onSubmit={handleSubmit}>

          {/* LOGIN FORM */}
          {mode === "login" && (
            <div className="form-wrapper active">
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              <div className="forgot-pw">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  Remember me
                </label>
                <div className="text-wrapper-11">Forgot Password?</div>
              </div>
            </div>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <div className="form-wrapper active">
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
          )}

          <button type="submit" className="div-wrapper">
            <div className="text-wrapper-12">
              {mode === "login" ? "Login" : "Register"}
            </div>
          </button>

        </form>
      </div>
    </div>
  );
};
