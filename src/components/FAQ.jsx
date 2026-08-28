import React from 'react';
import StaticPageLayout from './StaticPageLayout';

const FAQ = (props) => {
  return (
    <StaticPageLayout title="Frequently Asked Questions" {...props}>
      <p style={{ fontSize: '1.25rem', color: 'var(--accent-main)', fontWeight: 600, marginBottom: '3rem' }}>
        Everything you need to know about Wakalat AI.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1.25rem', color: '#111827', fontWeight: 700, marginBottom: '0.5rem' }}>Is my data secure?</h4>
        <p>Yes. We use bank-grade AES-256 encryption for all data at rest and in transit. Your uploaded case files are strictly siloed and are never used to train our base AI models without explicit opt-in.</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1.25rem', color: '#111827', fontWeight: 700, marginBottom: '0.5rem' }}>Which jurisdictions does the AI cover?</h4>
        <p>Wakalat AI currently covers the Supreme Court of India, all High Courts, and major tribunals (NCLT, ITAT, etc.). We are constantly expanding our database.</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1.25rem', color: '#111827', fontWeight: 700, marginBottom: '0.5rem' }}>Can I cancel my subscription?</h4>
        <p>Absolutely. You can cancel or pause your subscription at any time from your billing dashboard. There are no hidden cancellation fees.</p>
      </div>
    </StaticPageLayout>
  );
};

export default FAQ;
