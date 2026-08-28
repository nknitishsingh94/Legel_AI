import React, { useState } from 'react';
import { Check, Zap, Sparkles, Shield, Building2, HelpCircle, ArrowRight } from 'lucide-react';
import '../pricing.css';

const PricingSection = ({ onGetStarted }) => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      tagline: 'Ideal for independent advocates and law students getting started.',
      icon: <Zap size={22} className="plan-icon" />,
      monthlyPrice: '₹0',
      yearlyPrice: '₹0',
      period: 'Forever free',
      buttonText: 'Get Started Free',
      buttonVariant: 'secondary',
      popular: false,
      features: [
        '50 AI legal research queries/month',
        'Basic contract & notice drafting',
        'Access to Supreme Court landmark cases',
        'Standard response speed',
        'Single user access',
        'Community support'
      ],
      unavailableFeatures: [
        'High Court & Tribunals full database',
        'Unlimited AI document analysis',
        'BNS / BNSS reform mapping',
        'Priority 24/7 legal tech support'
      ]
    },
    {
      id: 'pro',
      name: 'Advocate Pro',
      tagline: 'Most popular for practicing lawyers, legal consultants & boutique firms.',
      icon: <Sparkles size={22} className="plan-icon gold" />,
      monthlyPrice: '₹1,999',
      yearlyPrice: '₹1,599',
      period: 'per month, billed annually',
      monthlySubtext: 'per month, billed monthly',
      buttonText: 'Start 14-Day Free Trial',
      buttonVariant: 'primary',
      popular: true,
      popularBadge: 'MOST POPULAR',
      features: [
        'Unlimited AI legal research queries',
        'Deep RAG Indian Legal Database (SC & all HCs)',
        'Full BNS, BNSS & BSA 2023 converter tool',
        'Draft court-ready petitions, SLPs, bail drafts',
        'Upload & analyze up to 500-page PDF case files',
        'Instant citation cross-verification',
        'Export to Word & formatted PDF',
        'Priority email & chat support'
      ],
      unavailableFeatures: []
    },
    {
      id: 'enterprise',
      name: 'Firm & Enterprise',
      tagline: 'Custom AI infrastructure for large law firms, corporate legal teams & universities.',
      icon: <Building2 size={22} className="plan-icon" />,
      monthlyPrice: 'Custom',
      yearlyPrice: 'Custom',
      period: 'tailored to your team',
      buttonText: 'Contact Sales',
      buttonVariant: 'dark',
      popular: false,
      features: [
        'Everything in Advocate Pro',
        'Unlimited multi-seat team collaboration',
        'Custom private legal database integration',
        'Firm-specific templates & style enforcement',
        'Dedicated account manager & legal trainer',
        'Enterprise SSO & custom roles / permissions',
        'SOC2 Type II & Bank-grade data encryption',
        '99.9% SLA & API integrations'
      ],
      unavailableFeatures: []
    }
  ];

  return (
    <section id="pricing" className="pricing-section">
      <div className="pricing-container">
        
        {/* Header */}
        <div className="pricing-header">
          <div className="pricing-badge">
            <Sparkles size={14} /> TRANSPARENT PRICING
          </div>
          <h2 className="pricing-title">
            Simple, Predictable Plans for <span className="highlight-gold">Legal Excellence</span>
          </h2>
          <p className="pricing-subtitle">
            Choose the plan that fits your legal practice. Scale up or down anytime with zero hidden fees.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pricing-toggle-wrapper">
            <button
              className={`pricing-toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly Billing
            </button>
            <button
              className={`pricing-toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              Annual Billing
              <span className="discount-pill">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="pricing-cards-grid">
          {plans.map((plan) => {
            const isYearly = billingCycle === 'yearly';
            const displayPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const subtext = isYearly ? plan.period : (plan.monthlySubtext || plan.period);

            return (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.popular ? 'popular-card' : ''}`}
              >
                {plan.popular && (
                  <div className="popular-ribbon">
                    <Sparkles size={12} /> {plan.popularBadge}
                  </div>
                )}

                <div className="pricing-card-header">
                  <div className="plan-icon-wrapper">
                    {plan.icon}
                  </div>
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-tagline">{plan.tagline}</p>
                </div>

                <div className="pricing-price-box">
                  <div className="price-amount-wrapper">
                    <span className="price-amount">{displayPrice}</span>
                    {displayPrice !== 'Custom' && displayPrice !== '₹0' && (
                      <span className="price-period">/ mo</span>
                    )}
                  </div>
                  <div className="price-subtext">{subtext}</div>
                </div>

                <button 
                  className={`pricing-action-btn ${plan.buttonVariant}`}
                  onClick={onGetStarted}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight size={16} />
                </button>

                <div className="pricing-features-divider" />

                <div className="pricing-features-list">
                  <div className="features-title">What's included:</div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="feature-item included">
                      <div className="feature-check-icon">
                        <Check size={14} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}

                  {plan.unavailableFeatures.map((feat, idx) => (
                    <div key={idx} className="feature-item excluded">
                      <div className="feature-cross-icon">✕</div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & Security Banner */}
        <div className="pricing-trust-banner">
          <div className="trust-item">
            <Shield size={20} className="trust-icon" />
            <div>
              <strong>Confidential & Secure</strong>
              <p>Strict lawyer-client privilege compliance and 256-bit encryption.</p>
            </div>
          </div>
          <div className="trust-item">
            <Zap size={20} className="trust-icon" />
            <div>
              <strong>Cancel Anytime</strong>
              <p>No long-term locks. Switch plans or cancel whenever you want.</p>
            </div>
          </div>
          <div className="trust-item">
            <HelpCircle size={20} className="trust-icon" />
            <div>
              <strong>Need a custom quote?</strong>
              <p>Contact our legal tech specialists for personalized firm deployments.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
