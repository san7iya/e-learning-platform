import React from "react";
import { BookOpen, Github } from "lucide-react";
import { Link } from "react-router-dom";
import "./style.css";

const REPO_URL = "https://github.com/san7iya/e-learning-platform";

export default function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/" className="footer-logo">
        <div className="logo-mark">
          <BookOpen size={18} />
        </div>
        <span className="logo-text">Brainy</span>
      </Link>

      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="footer-repo-link"
      >
        <Github size={16} />
        <span>Source on GitHub</span>
      </a>

      <p className="footer-attribution">
        &copy; {new Date().getFullYear()} Brainy. All rights reserved.
      </p>
    </footer>
  );
}
