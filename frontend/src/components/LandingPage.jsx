import React, { useState } from 'react';
import { Scale, ChevronRight, ChevronDown, Menu, X, Sparkles, Shield, Award } from 'lucide-react';
import InteractiveFeatures from './InteractiveFeatures';
import UseCasesSection from './UseCasesSection';
import ArticlesSection from './ArticlesSection';
import PricingSection from './PricingSection';
import Testimonials from './Testimonials';
import MegaMenu from './MegaMenu';
import CTALeadForm from './CTALeadForm';
import Footer from './Footer';
import AnimatedActivityList from './AnimatedActivityList';
import AnimatedBackground from './AnimatedBackground';
import HazyGradientShowcase from './HazyGradientShowcase';

const LandingPage = ({ onGetStarted, onLoginClick, onAboutClick, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [landingPreset, setLandingPreset] = useState('emerald');

  return (
    <div className="landing-page animate-fade-in">
      {/* Animated Hazy Atmospheric Glowing Canvas Background */}
      <AnimatedBackground preset={landingPreset} showControls={true} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* Full Desktop Edge-to-Edge Sticky Glass Navbar */}
        <nav className="navbar">
          <div className="sidebar-logo" style={{ marginBottom: 0 }}>
            <img src="/logo.jpg" alt="Wakalat AI Logo" style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
            <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>
              Wakalat<span style={{ color: '#10b981' }}>AI</span>
            </div>
          </div>
          
          {/* Desktop Links */}
          <div className="nav-links hide-on-mobile" style={{ background: 'transparent', padding: 0, gap: '2.2rem' }}>
            <MegaMenu title="Products" />
            <a href="#learn" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Learn <ChevronDown size={14} /></a>
            <a href="#pricing" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>Pricing</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); setIsMobileMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>About Us <ChevronDown size={14} /></a>
          </div>
          
          <div className="nav-actions hide-on-mobile" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="nav-btn-signin" onClick={onLoginClick}>Sign In</button>
            <button className="nav-btn-getstarted" onClick={onGetStarted}>Get Started</button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle show-on-mobile" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
            {isMobileMenuOpen ? <X size={24} color="#111827" /> : <Menu size={24} color="#111827" />}
          </button>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="mobile-dropdown-menu">
              <a href="#learn" onClick={() => setIsMobileMenuOpen(false)}>Learn</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); setIsMobileMenuOpen(false); }}>About Us</a>
              <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <button className="nav-btn-signin" style={{ width: '100%', marginBottom: '12px' }} onClick={onLoginClick}>Sign In</button>
              <button className="nav-btn-getstarted" style={{ width: '100%' }} onClick={onGetStarted}>Get Started</button>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <header className="hero-section animate-slide-up">
          <div className="hero-layout-grid">
            <div className="hero-left-content">
              {/* Feature Badge */}
              <div className="hero-badge animate-fade-in">
                <span className="badge-sparkle"><Sparkles size={14} color="#10b981" /></span>
                <span>AI Operating System for Legal Professionals</span>
                <ChevronRight size={14} style={{ opacity: 0.6 }} />
              </div>

              <h1 className="hero-title">
                <span className="hero-title-gradient">The Future of</span>{' '}
                <span className="hero-title-dark">Legal Research is Here.</span>
              </h1>

              <p className="hero-subtitle">
                Wakalat AI empowers advocates, legal teams, and law firms to draft court-ready petitions, analyze complex judgements, and verify precedents in seconds.
              </p>

              <div className="hero-buttons">
                <button className="btn-primary hero-btn-main" onClick={onGetStarted}>
                  <span>Get Started for Free</span>
                  <ChevronRight size={18} />
                </button>
                <a href="#features" className="btn-outline hero-btn-sub">
                  Explore Platform
                </a>
              </div>

              {/* Trust Metrics Bar */}
              <div className="hero-metrics-bar">
                <div className="metric-box">
                  <div className="metric-value">10,000+</div>
                  <div className="metric-label">Judgements Indexed</div>
                </div>
                <div className="metric-divider" />
                <div className="metric-box">
                  <div className="metric-value">99.4%</div>
                  <div className="metric-label">Precedent Accuracy</div>
                </div>
                <div className="metric-divider" />
                <div className="metric-box">
                  <div className="metric-value">BNS / BNSS</div>
                  <div className="metric-label">New Codes Ready</div>
                </div>
              </div>
            </div>

            {/* Live Activity Stream Showcase */}
            <div className="hero-right-content">
              <AnimatedActivityList />
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section id="features" className="landing-section-wrapper">
          <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
            <InteractiveFeatures />
          </div>
        </section>

        {/* Hazy Atmospheric Gradient Visual Showcase */}
        <section className="landing-section-wrapperAlt" style={{ background: 'transparent' }}>
          <HazyGradientShowcase onSelectTheme={(presetId) => setLandingPreset(presetId)} />
        </section>

        {/* Use Cases / Practice Areas */}
        <section className="landing-section-wrapperAlt">
          <UseCasesSection />
        </section>

        {/* Pricing / Billing Plans */}
        <section id="pricing" className="landing-section-wrapper">
          <PricingSection onGetStarted={onGetStarted} />
        </section>

        {/* CTA Lead Form */}
        <CTALeadForm onGetStarted={onGetStarted} />

        {/* Articles / Insights */}
        <ArticlesSection />

        {/* Testimonials */}
        <Testimonials />

        {/* Footer */}
        <Footer onGetStarted={onGetStarted} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default LandingPage;
