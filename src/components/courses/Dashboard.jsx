import React from "react";
import CourseCard from "./CourseCard";
import "./Dashboard.css";
import { Header } from "../header/Header";

export default function Dashboard() {
  return (
    <>
      <Header />

      <div className="dashboard">
        <div className="content">
          <div className="header">
            <h1 title="Welcome back, ready for your next lesson?">Welcome back, ready for your next lesson?</h1>
            <span className="history">View history</span>
          </div>

          <div className="cards-wrapper">
            <CourseCard title="Python for Everybody" author="Dr. Charles" progress={70} />
            <CourseCard title="Machine Learning Foundations" author="Andrew Ng" progress={60} />
            <CourseCard title="Full-Stack Web Development" author="Jose Portilla" progress={40} />
            <CourseCard title="AWS Cloud Practitioner Essentials" author="Stephane Maarek" progress={90} />
          </div>

          <div className="pagination">
            <button>{"<"}</button>
            <button>{">"}</button>
          </div>
        </div>
      </div>
    </>
  );
}
