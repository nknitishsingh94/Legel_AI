import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const CTALeadForm = () => {
  return (
    <>
      <style>{`
        .cta-lead-section {
          padding: 6rem 2rem;
          background: #f8fafc;
          display: flex;
          justify-content: center;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .cta-lead-container {
          max-width: 1200px;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .cta-lead-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .cta-lead-title {
          font-size: 3.5rem;
          line-height: 1.1;
          color: #111827;
          margin-bottom: 1.5rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.03em;
        }

        .cta-lead-desc {
          font-size: 1.125rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 90%;
        }

        .cta-lead-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cta-lead-list li {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.05rem;
          color: #111827;
          font-weight: 500;
        }

        .gold-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #d1a084;
          box-shadow: 0 0 0 4px rgba(209, 160, 132, 0.2);
        }

        .cta-btn-dark {
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 0.8rem 2rem;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
        }

        .cta-btn-dark:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(15, 23, 42, 0.3);
        }

        .cta-lead-form-wrapper {
          display: flex;
          justify-content: flex-end;
        }

        .cta-lead-form-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2.5rem;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.02);
        }

        .cta-lead-form-card h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #111827;
          text-align: center;
          margin-bottom: 2rem;
        }

        .cta-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .cta-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cta-form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
        }

        .cta-form-group input, 
        .cta-team-size-select,
        .cta-country-code {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #111827;
          transition: border-color 0.2s;
          background: #ffffff;
        }

        .cta-form-group input:focus, 
        .cta-team-size-select:focus,
        .cta-country-code:focus {
          outline: none;
          border-color: #d1a084;
        }

        .cta-phone-input-group {
          display: flex;
          gap: 0.5rem;
        }

        .cta-submit-btn {
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 1rem;
          font-size: 1.05rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
        }

        .cta-submit-btn:hover {
          background: #1e293b;
        }

        @media (max-width: 968px) {
          .cta-lead-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .cta-lead-title {
            font-size: 2.8rem;
          }
          .cta-lead-form-wrapper {
            justify-content: center;
          }
        }
      `}</style>
    <section className="cta-lead-section">
      <div className="cta-lead-container">
        
        {/* Left Side: Content */}
        <div className="cta-lead-content">
          <h2 className="cta-lead-title">
            <span style={{ fontWeight: 800 }}>Ready to Transform</span><br />
            <span style={{ fontWeight: 400 }}>Your Legal Practice?</span>
          </h2>
          <p className="cta-lead-desc">
            Join lawyers and law firms who have streamlined their operations and increased productivity with Wakalat AI. From contract drafting to litigation prep — get more done in less time.
          </p>
          
          <ul className="cta-lead-list">
            <li>
              <div className="gold-dot"></div>
              <span>AI-powered drafting across Indian laws</span>
            </li>
            <li>
              <div className="gold-dot"></div>
              <span>90% faster case preparation with Wakalat AI</span>
            </li>
          </ul>
          
          <button className="cta-btn-dark">Start Free Trial</button>
        </div>

        {/* Right Side: Form Card */}
        <div className="cta-lead-form-wrapper">
          <div className="cta-lead-form-card">
            <h3>Get Started Today</h3>
            
            <form className="cta-form">
              <div className="cta-form-group">
                <label>Your Name</label>
                <input type="text" placeholder="John Smith" />
              </div>
              
              <div className="cta-form-group">
                <label>Work Email</label>
                <input type="email" placeholder="john@yourlawfirm.com" />
              </div>
              
              <div className="cta-form-group">
                <label>Law Firm Name</label>
                <input type="text" placeholder="Your law firm name" />
              </div>
              
              <div className="cta-form-group">
                <label>Phone Number</label>
                <div className="cta-phone-input-group">
                  <select className="cta-country-code" style={{ width: '120px' }}>
                    <option>🇮🇳 +91</option>
                    <option>🇺🇸 +1</option>
                    <option>🇬🇧 +44</option>
                  </select>
                  <input type="tel" placeholder="555-123-4567" />
                </div>
              </div>
              
              <div className="cta-form-group">
                <label>Team Size</label>
                <select className="cta-team-size-select">
                  <option>1-5</option>
                  <option>6-20</option>
                  <option>21-50</option>
                  <option>50+</option>
                </select>
              </div>
              
              <button type="button" className="cta-submit-btn">Schedule Demo</button>
            </form>
          </div>
        </div>

      </div>
    </section>
    </>
  );
};

export default CTALeadForm;
