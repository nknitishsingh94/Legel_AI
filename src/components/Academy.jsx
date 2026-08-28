import React from 'react';
import StaticPageLayout from './StaticPageLayout';

const Academy = (props) => {
  return (
    <StaticPageLayout title="Wakalat AI Academy" {...props}>
      <p style={{ fontSize: '1.25rem', color: 'var(--accent-main)', fontWeight: 600, marginBottom: '2rem' }}>
        Master the art of AI-assisted legal research.
      </p>
      
      <p style={{ marginBottom: '1.5rem' }}>
        Welcome to the Wakalat AI Academy. Here you will find tutorials, video guides, and certification courses to help you maximize your productivity using our platform.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '3rem' }}>
        <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '1.25rem', color: '#111827', fontWeight: 700, marginBottom: '0.5rem' }}>Getting Started</h4>
          <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>Learn the basics of navigating Wakalat AI and setting up your first workspace.</p>
          <a href="#" style={{ color: 'var(--accent-main)', fontWeight: 600, textDecoration: 'none' }}>Watch Video &rarr;</a>
        </div>
        <div style={{ background: '#f9fafb', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontSize: '1.25rem', color: '#111827', fontWeight: 700, marginBottom: '0.5rem' }}>Advanced Prompts</h4>
          <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>Discover how to write the perfect prompts to extract specific case precedents.</p>
          <a href="#" style={{ color: 'var(--accent-main)', fontWeight: 600, textDecoration: 'none' }}>Read Guide &rarr;</a>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default Academy;
