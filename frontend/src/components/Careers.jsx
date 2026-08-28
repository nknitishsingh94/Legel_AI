import React from 'react';
import StaticPageLayout from './StaticPageLayout';

const Careers = (props) => {
  return (
    <StaticPageLayout title="Careers at Wakalat AI" {...props}>
      <p style={{ fontSize: '1.25rem', color: 'var(--accent-main)', fontWeight: 600, marginBottom: '2rem' }}>
        Join the team that is redefining legal research in India.
      </p>
      
      <p style={{ marginBottom: '1.5rem' }}>
        At Wakalat AI, we are building the next-generation operating system for legal professionals. We are always looking for passionate engineers, legal researchers, and product designers to join our mission.
      </p>

      <h3 style={{ fontSize: '1.5rem', color: '#111827', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>Open Positions</h3>
      
      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1.2rem', color: '#111827', fontWeight: 700, margin: 0 }}>Senior Full Stack Engineer</h4>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Engineering &bull; Remote (India)</span>
        </div>
        <button className="nav-btn-signin">Apply</button>
      </div>

      <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1.2rem', color: '#111827', fontWeight: 700, margin: 0 }}>Legal AI Data Specialist</h4>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Product &bull; New Delhi</span>
        </div>
        <button className="nav-btn-signin">Apply</button>
      </div>

    </StaticPageLayout>
  );
};

export default Careers;
