import React from "react";
import Header from "./headerLanding";
import HeroSection from "./hero";
import CoursesSection from "./coursessection";
import TestimonialsSection from "./testimonials";
import Footer from "./footer";
import "./LandingPage.css";

export default function LandingPage() {
  const handleNavigate = (path) => {
    // Add your navigation logic here
    console.log('Navigating to:', path);
  };

  return (
    <div className="landing-page">
      <Header onNavigate={handleNavigate} />
      <HeroSection />
      <CoursesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}