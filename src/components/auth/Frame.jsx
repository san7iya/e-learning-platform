import React from "react";
import "./style.css";

export const Frame = ({ mode, setMode }) => {
  return (
    <div className="auth-frame">
      <div className={`div ${mode === "register" ? "right-active" : ""}`} aria-hidden="true" />

      <button
        className={mode === "login" ? "active" : ""}
        onClick={() => setMode("login")}
        type="button"
      >
        <div className="text-wrapper">Login</div>
      </button>

      <button
        className={mode === "register" ? "active" : ""}
        onClick={() => setMode("register")}
        type="button"
      >
        <div className="text-wrapper-2">Register</div>
      </button>
    </div>
  );
};
