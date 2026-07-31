import React from "react";
import Header from "../header/Header";
import HeroSection from "./hero";
import CoursesSection from "./coursessection";
import Footer from "../footer/Footer";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <HeroSection />
      <CoursesSection />
      <Footer />
    </div>
  );
}