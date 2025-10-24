import React from "react";
import "./LandingPage.css";
import { Frame } from "../header/Header"; // import header

export function LandingPage() {
  return (
    <div className="landing-page">
      <Frame /> {/* adds header */}
    </div>
  );
}