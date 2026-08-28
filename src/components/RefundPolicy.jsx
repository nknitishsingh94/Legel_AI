import React from 'react';
import StaticPageLayout from './StaticPageLayout';

const RefundPolicy = (props) => {
  return (
    <StaticPageLayout title="Refund Policy" {...props}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Last updated: August 28, 2026
      </p>

      <p style={{ marginBottom: '1.5rem' }}>
        We strive to ensure complete satisfaction with Wakalat AI. If you are not entirely satisfied with your subscription, we are here to help.
      </p>

      <h3 style={{ fontSize: '1.5rem', color: '#111827', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>14-Day Money-Back Guarantee</h3>
      <p style={{ marginBottom: '1.5rem' }}>
        For all new subscriptions, we offer a 14-day money-back guarantee. If you decide that Wakalat AI isn't right for your practice within the first 14 days of your initial purchase, you may request a full refund.
      </p>

      <h3 style={{ fontSize: '1.5rem', color: '#111827', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>How to Request a Refund</h3>
      <p style={{ marginBottom: '1.5rem' }}>
        To request a refund, please contact our support team at <strong>contact@wakalatai.com</strong> with your account details. Refunds will be processed to the original method of payment within 5-7 business days.
      </p>

      <h3 style={{ fontSize: '1.5rem', color: '#111827', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 700 }}>Exceptions</h3>
      <p style={{ marginBottom: '1.5rem' }}>
        Refunds are not granted for partial months of service on monthly plans after the initial 14-day period, or for enterprise plans with custom setup fees unless explicitly stated in your contract.
      </p>
    </StaticPageLayout>
  );
};

export default RefundPolicy;