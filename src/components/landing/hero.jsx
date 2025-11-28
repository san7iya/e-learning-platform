import React from 'react';
import { Play, BookOpen, Award } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="hero-section">
      <div className="hero-container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">
              Studying Online is now much easier
            </h1>
            <p className="hero-subtitle">
              Brainy is an interesting platform that will teach you in more an interactive way
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Join for free</button>
              <button className="btn-secondary">
                <Play size={20} />
                <span>Watch how it works</span>
              </button>
            </div>
          </div>

          <div className="stats-section">
            <div className="stat-card stat-card-1">
              <div className="stat-icon stat-icon-purple">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="stat-number">250k</p>
                <p className="stat-label">Assisted Students</p>
              </div>
            </div>
            
            <div className="stat-card stat-card-2">
              <div className="stat-icon stat-icon-pink">
                <Award size={20} />
              </div>
              <div>
                <p className="stat-title">Congratulations</p>
                <p className="stat-subtitle">Your admission completed</p>
              </div>
            </div>

            <div className="stat-card stat-card-3">
              <div className="stat-avatar"></div>
              <div>
                <p className="stat-title">User Experience Class</p>
                <p className="stat-subtitle">Today at 12.00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wave-divider">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L1440 120L1440 0C1440 0 1080 100 720 100C360 100 0 0 0 0L0 120Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
}