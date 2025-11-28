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
              <li><a href="#">About us</a></li>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">News & Press</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Essentials</h4>
            <ul className="footer-links">
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Reviews</a></li>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">User Agreement</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Follow us</h4>
            <ul className="footer-links">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Newsletter</a></li>
              <li><a href="#">LinkedIn</a></li>
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