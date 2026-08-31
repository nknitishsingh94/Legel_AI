import React from 'react';
import { Scale, ArrowLeft } from 'lucide-react';
import Footer from './Footer';

const StaticPageLayout = ({ title, children, onBack, onGetStarted, onNavigate }) => {
  return (
    <div className="landing-page animate-fade-in" style={{ background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar for Static Pages */}
      <nav className="navbar" style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 100 }}>
        <div className="sidebar-logo" style={{ marginBottom: 0, cursor: 'pointer' }} onClick={onBack}>
          <Scale size={28} color="var(--accent-main)" />
          <div>Wakalat<span>AI</span></div>
        </div>
        <div className="nav-links" style={{ background: 'transparent' }}>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={18} /> Back to Home
          </button>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div style={{ flex: 1, width: '100%', maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>{title}</h1>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.8 }}>
          {children}
        </div>
      </div>

      <Footer onGetStarted={onGetStarted} onNavigate={onNavigate} hideCTA={true} />
    </div>
  );
};

export default StaticPageLayout;
