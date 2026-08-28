import React from 'react';
import { Scale, Mail, MapPin } from 'lucide-react';

const Footer = ({ onGetStarted, onNavigate, hideCTA = false }) => {
  return (
    <footer className="dark-footer">
      {!hideCTA && (
        <>
          <div className="footer-cta">
            <h2 className="cta-heading">Make Legal Work Simpler<br/>with Wakalat AI</h2>
            <button className="cta-button" onClick={onGetStarted}>Sign In</button>
          </div>
          <div className="footer-divider"></div>
        </>
      )}

      <div className="footer-grid">
        {/* Column 1: Brand & Socials */}
        <div className="footer-col brand-col">
          <div className="sidebar-logo" style={{ marginBottom: '1.5rem', color: '#fff' }}>
            <Scale size={24} color="#fff" />
            <div style={{ fontSize: '1.25rem', letterSpacing: '0.1em' }}>WAKALAT AI</div>
          </div>
          <p className="brand-desc">Making Legal simple for legal<br/>professionals.</p>
          <div className="social-links">
            <a href="#" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Company */}
        <div className="footer-col">
          <h4 className="col-heading">COMPANY</h4>
          <a href="#pricing" className="footer-link">Pricing & Plans</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>About us</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onNavigate('careers'); }}>Careers</a>
        </div>

        {/* Column 3: Resources */}
        <div className="footer-col">
          <h4 className="col-heading">RESOURCES</h4>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onNavigate('academy'); }}>Wakalat AI academy</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onNavigate('blog'); }}>Blog</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onNavigate('faq'); }}>FAQ</a>
        </div>

        {/* Column 4: Legal */}
        <div className="footer-col">
          <h4 className="col-heading">LEGAL</h4>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}>Privacy Policy</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}>Terms of Service</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); onNavigate('refund'); }}>Refund Policy</a>
        </div>

        {/* Column 5: Contact Us */}
        <div className="footer-col contact-col">
          <h4 className="col-heading">CONTACT US</h4>
          <div className="contact-item">
            <Mail size={16} />
            <a href="mailto:contact@wakalatai.com" className="footer-link">contact@wakalatai.com</a>
          </div>
          <div className="contact-item">
            <MapPin size={16} />
            <span className="footer-text">Lucknow , UttarPardesh India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
