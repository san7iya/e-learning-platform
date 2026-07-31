import React, { useEffect, useState } from "react";
import "./style.css";
import { Toggle } from "./Toggle";
import { useNavigate } from "react-router-dom";
import Header from "../header/Header";
import { API_BASE } from "../../config";
import { useAuth } from "../../context/AuthContext";

export const Login = ({ initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [orgName, setOrgName] = useState("");
  const [orgLocation, setOrgLocation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // /login and /register render this same component instance without
  // remounting (React Router reuses it across sibling routes), so the mode
  // has to be re-synced whenever the route's initialMode prop changes.
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleModeChange = (nextMode) => {
    setError("");
    navigate(nextMode === "login" ? "/login" : "/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (role === "org-admin" && !orgName.trim()) {
        setError("Organization name is required.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
            ...(role === "org-admin" && { org_name: orgName, org_location: orgLocation })
          })
        });

        const data = await response.json();

        if (data.success) {
          login(data.user, data.token);
          navigate("/dashboard");
        } else {
          setError(data.message || "Registration failed. Please try again.");
        }
      } catch (err) {
        setError("Couldn't reach the server — check your connection and try again.");
      }
    } else {
      try {
        const response = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
          login(data.user, data.token);
          navigate("/dashboard");
        } else {
          setError(data.message || "Login failed. Check your email and password and try again.");
        }
      } catch (err) {
        setError("Couldn't reach the server — check your connection and try again.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="auth-wrap">
        <div className="auth-card">
          <Toggle
            options={[
              { value: "login", label: "Login" },
              { value: "register", label: "Register" }
            ]}
            value={mode}
            onChange={handleModeChange}
          />

          <h1 className="auth-title">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>

          {error && <p className="error-banner">{error}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === "register" && (
              <>
                <div className="input-group">
                  <label>Confirm password</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>I am a</label>
                  <Toggle
                    options={[
                      { value: "student", label: "Student" },
                      { value: "instructor", label: "Instructor" },
                      { value: "org-admin", label: "Org Admin" }
                    ]}
                    value={role}
                    onChange={setRole}
                  />
                </div>

                {role === "org-admin" && (
                  <>
                    <div className="input-group">
                      <label>Organization name</label>
                      <input
                        type="text"
                        placeholder="Enter your organization's name"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Organization location (optional)</label>
                      <input
                        type="text"
                        placeholder="City, country"
                        value={orgLocation}
                        onChange={(e) => setOrgLocation(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <button type="submit" className="auth-submit">
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
