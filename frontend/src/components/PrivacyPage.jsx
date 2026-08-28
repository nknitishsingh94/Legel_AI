import React from 'react';
import StaticPageLayout from './StaticPageLayout';

const PrivacyPolicy = (props) => {
  return (
    <StaticPageLayout title="Privacy Policy" {...props}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Last updated: August 28, 2026
      </p>

      <p style={{ marginBottom: '1.5rem' }}>
        At Wakalat AI, protecting your privacy and the confidentiality of your legal data is our highest priority. This Privacy Policy outlines how we collect, use, and safeguard your information.
      </p>

      <h3 style={{ fontSize: '1.5rem', color: '#111827', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>1. Information We Collect</h3>
      <p style={{ marginBottom: '1.5rem' }}>
        We collect information you provide directly to us, such as when you create an account, upload case files, or communicate with us. This may include personal identifiers, payment information, and proprietary legal documents.
      </p>

      <h3 style={{ fontSize: '1.5rem', color: '#111827', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>2. How We Use Information</h3>
      <p style={{ marginBottom: '1.5rem' }}>
        We use the information we collect to operate, maintain, and provide the features and functionality of the Wakalat AI service. **Your uploaded documents are processed ephemerally for the purpose of your queries and are not used to train our AI models.**
      </p>

      <h3 style={{ fontSize: '1.5rem', color: '#111827', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>3. Data Security</h3>
      <p style={{ marginBottom: '1.5rem' }}>
        We implement commercially reasonable technical, administrative, and organizational measures to protect your data, including end-to-end encryption.
      </p>
    </StaticPageLayout>
  );
};

export default PrivacyPolicy;
