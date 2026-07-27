import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-brand">Brainy.</h3>
            <p className="footer-tagline">Learning Reinvented</p>
          </div>
          
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              <li>About us</li>
              <li>Contact us</li>
              <li>News & Press</li>
              <li>Careers</li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Essentials</h4>
            <ul className="footer-links">
              <li>Pricing</li>
              <li>Reviews</li>
              <li>Privacy policy</li>
              <li>User Agreement</li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Follow us</h4>
            <ul className="footer-links">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Newsletter</li>
              <li>LinkedIn</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Brainy. Copyright ©2023 . All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}