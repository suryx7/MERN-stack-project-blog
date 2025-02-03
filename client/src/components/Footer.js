import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>AnalyzedByIITIANS is dedicated to providing top-notch courses and analysis for learners by IITians.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/services">Services</Link></li> {/* New Link */}
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@analyzedbyiitians.com</p>
            <p>Phone: +91-123-456-7890</p>
            <p>Address: IIT Campus, India</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <ul className="social-links">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 AnalyzedByIITIANS. All Rights Reserved.</p>
        </div>
      </footer>
  )
}
