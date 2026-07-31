import React from "react";
import "./style.css";

export const Toggle = ({ options, value, onChange }) => {
  return (
    <div className="auth-toggle">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={value === opt.value ? "active" : ""}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
