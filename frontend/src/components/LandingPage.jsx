import React, { useState } from 'react';
import { Scale, ChevronRight, ChevronDown, Menu, X } from 'lucide-react';
import InteractiveFeatures from './InteractiveFeatures';
import UseCasesSection from './UseCasesSection';
import ArticlesSection from './ArticlesSection';
import PricingSection from './PricingSection';
import Testimonials from './Testimonials';
import MegaMenu from './MegaMenu';
import CTALeadForm from './CTALeadForm';
import Footer from './Footer';

const LandingPage = ({ onGetStarted, onLoginClick, onAboutClick, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="landing-page animate-fade-in">
      {/* Navbar */}
      <nav className="navbar">
        <div className="sidebar-logo" style={{ marginBottom: 0 }}>
          <Scale size={28} color="var(--accent-gold)" />
          <div style={{ color: '#111827' }}>Wakalat<span style={{ color: 'var(--accent-gold)' }}>AI</span></div>
        </div>
        
        {/* Desktop Links */}
        <div className="nav-links hide-on-mobile" style={{ background: 'transparent', padding: 0, gap: '2rem' }}>
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
      <header className="hero-section animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontWeight: 800, color: '#1f2937', display: 'block' }}>The Future of <span style={{ fontWeight: 400, color: '#1f2937' }}>Legal</span></span>
          <span style={{ fontWeight: 400, color: '#4b5563', display: 'block' }}>Research is Here.</span>
        </h1>
        <p className="hero-subtitle">
          Wakalat AI is an advanced operating system for legal professionals. Draft court-ready documents, analyze contracts, and find precedents in seconds.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={onGetStarted}>
            Get Started for Free <ChevronRight size={20} />
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" style={{ width: '100%', padding: '6rem 2rem', background: '#f8fafc', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
          <InteractiveFeatures />
        </div>
      </section>

      {/* Use Cases / Practice Areas */}
      <UseCasesSection />

      {/* Pricing / Billing Plans */}
      <PricingSection onGetStarted={onGetStarted} />

      {/* CTA Section */}
      <CTALeadForm />

      {/* Articles / Insights */}
      <ArticlesSection />

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer onGetStarted={onGetStarted} onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
