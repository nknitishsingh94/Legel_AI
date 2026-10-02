import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

const CTALeadForm = ({ onGetStarted }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    firmName: '',
    phone: '',
    countryCode: '🇮🇳 +91',
    teamSize: '1-5'
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMessage('Name and Email are required.');
      return;
    }
    
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const { error } = await supabase
        .from('demo_requests')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            firm_name: formData.firmName,
            phone: `${formData.countryCode} ${formData.phone}`,
            team_size: formData.teamSize
          }
        ]);
        
      if (error) throw error;
      
      setStatus('success');
      setFormData({ name: '', email: '', firmName: '', phone: '', countryCode: '🇮🇳 +91', teamSize: '1-5' });
    } catch (err) {
      console.error('Error submitting form:', err);
      setStatus('error');
      setErrorMessage('Failed to submit request. Please ensure the "demo_requests" table exists in Supabase.');
    }
  };

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
          font-size: 2.5rem;
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

        .cta-btn-outline {
          background: transparent;
          color: #0f172a;
          border: 2px solid #0f172a;
          padding: 0.8rem 2rem;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cta-btn-outline:hover {
          background: #0f172a;
          color: #ffffff;
          transform: translateY(-2px);
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
          box-sizing: border-box;
        }

        .cta-form-group input::placeholder {
          color: #94a3b8;
          opacity: 1;
          font-weight: 400;
        }

        .cta-team-size-select {
          appearance: none;
          background: #ffffff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 1rem center;
        }

        .cta-form-group input:focus, 
        .cta-team-size-select:focus,
        .cta-country-code:focus {
          outline: none;
          border-color: #b8860b;
        }

        .cta-phone-input-group {
          display: flex;
          gap: 0;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          overflow: hidden;
        }

        .cta-phone-input-group .cta-country-code {
          width: 110px;
          border: none;
          border-right: 1px solid #cbd5e1;
          border-radius: 0;
          background-color: #f8fafc;
          appearance: none;
          padding: 0.75rem 0.5rem 0.75rem 1rem;
        }

        .cta-phone-input-group input {
          border: none;
          border-radius: 0;
          flex: 1;
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
            font-size: 2.2rem;
          }
          .cta-lead-form-wrapper {
            justify-content: center;
          }
        }
        
        @media (max-width: 768px) {
          .cta-lead-title {
            font-size: 2.2rem;
            text-align: center;
          }
          .cta-lead-desc {
            text-align: center;
            margin: 0 auto 2rem auto;
          }
          .cta-lead-content {
            align-items: center;
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
              <CheckCircle2 size={18} color="#b8860b" style={{ flexShrink: 0 }} />
              <span>AI-powered drafting across Indian laws</span>
            </li>
            <li>
              <CheckCircle2 size={18} color="#b8860b" style={{ flexShrink: 0 }} />
              <span>90% faster case preparation with Wakalat AI</span>
            </li>
          </ul>
          
          <button className="cta-btn-outline" onClick={onGetStarted}>Start Free Trial</button>
        </div>

        {/* Right Side: Form Card */}
        <div className="cta-lead-form-wrapper">
          <div className="cta-lead-form-card">
            <h3>Get Started Today</h3>
            
            <form className="cta-form" onSubmit={handleSubmit}>
              <div className="cta-form-group">
                <label htmlFor="user-name">Your Name</label>
                <input id="user-name" type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Smith" required />
              </div>
              
              <div className="cta-form-group">
                <label htmlFor="user-email">Work Email</label>
                <input id="user-email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@yourlawfirm.com" required />
              </div>
              
              <div className="cta-form-group">
                <label htmlFor="user-firm">Law Firm Name</label>
                <input id="user-firm" type="text" name="firmName" value={formData.firmName} onChange={handleInputChange} placeholder="Your law firm name" />
              </div>
              
              <div className="cta-form-group">
                <label htmlFor="user-phone">Phone Number</label>
                <div className="cta-phone-input-group">
                  <select name="countryCode" value={formData.countryCode} onChange={handleInputChange} className="cta-country-code" aria-label="Country code">
                    <option>🇮🇳 +91</option>
                    <option>🇺🇸 +1</option>
                    <option>🇬🇧 +44</option>
                  </select>
                  <input id="user-phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="555-123-4567" />
                </div>
              </div>
              
              <div className="cta-form-group">
                <label htmlFor="user-team">Team Size</label>
                <select id="user-team" name="teamSize" value={formData.teamSize} onChange={handleInputChange} className="cta-team-size-select">
                  <option>1-5</option>
                  <option>6-20</option>
                  <option>21-50</option>
                  <option>50+</option>
                </select>
              </div>
              
              {status === 'error' && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem' }}>{errorMessage}</div>}
              {status === 'success' && <div style={{ color: '#10b981', fontSize: '0.875rem', marginBottom: '1rem', padding: '0.5rem', background: '#d1fae5', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} /> Thank you! Our team will contact you shortly.</div>}
              
              <button type="submit" className="cta-submit-btn" disabled={status === 'loading'}>
                {status === 'loading' ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Loader2 size={18} className="animate-spin" /> Submitting...</span> : 'Schedule Demo'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
    </>
  );
};

export default CTALeadForm;
