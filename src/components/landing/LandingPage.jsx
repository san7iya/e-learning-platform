import React from "react";
import Header from "../header/Header";
import HeroSection from "./hero";
import CoursesSection from "./coursessection";
import TestimonialsSection from "./testimonials";
import Footer from "./footer";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <HeroSection />
      <CoursesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}