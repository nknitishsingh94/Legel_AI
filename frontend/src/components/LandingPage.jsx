import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Menu, X, Sparkles } from 'lucide-react';
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

const LandingPage = ({ onGetStarted, onLoginClick, onAboutClick, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page animate-fade-in">
      {/* Slow Color-Shifting Hazy Atmospheric Background */}
      <AnimatedBackground preset="emerald" showControls={false} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {/* Modern Sticky Glass Navbar */}
        <nav className="navbar">
          <div className="sidebar-logo" style={{ marginBottom: 0 }}>
            <img 
              src="/logo.jpg" 
              alt="Wakalat AI Logo" 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '10px', 
                objectFit: 'cover', 
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.2)' 
              }} 
            />
            <div className="brand-name">
              Wakalat<span style={{ color: '#10b981' }}>AI</span>
            </div>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="nav-links hide-on-mobile">
            <MegaMenu title="Products" />
            <a href="#learn" className="nav-item">
              Learn <ChevronDown size={14} style={{ opacity: 0.7 }} />
            </a>
            <a href="#pricing" className="nav-item">
              Pricing
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="nav-item">
              About Us <ChevronDown size={14} style={{ opacity: 0.7 }} />
            </a>
          </div>
          
          {/* Action Buttons */}
          <div className="nav-actions hide-on-mobile">
            <button className="nav-btn-signin" onClick={onLoginClick}>
              Sign In
            </button>
            <button className="nav-btn-getstarted" onClick={onGetStarted}>
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle show-on-mobile" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} color="#0f172a" /> : <Menu size={24} color="#0f172a" />}
          </button>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="mobile-dropdown-menu animate-fade-in">
              <a href="#learn" onClick={() => setIsMobileMenuOpen(false)}>Learn</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onAboutClick(); setIsMobileMenuOpen(false); }}>About Us</a>
              <hr style={{ margin: '14px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <button className="nav-btn-signin" style={{ width: '100%', marginBottom: '10px' }} onClick={onLoginClick}>
                Sign In
              </button>
              <button className="nav-btn-getstarted" style={{ width: '100%' }} onClick={onGetStarted}>
                Get Started
              </button>
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
