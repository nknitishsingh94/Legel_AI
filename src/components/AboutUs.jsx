import React from 'react';
import StaticPageLayout from './StaticPageLayout';
import { Target, Zap, ShieldCheck, Scale, Cpu, Globe } from 'lucide-react';

const AboutUs = (props) => {
  return (
    <StaticPageLayout title="About Wakalat AI" {...props}>
      <div className="about-hero animate-slide-up">
        <h2 className="about-hero-title" style={{ fontSize: '4.5rem', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          <span style={{ fontWeight: 800, color: '#1f2937', display: 'block' }}>Revolutionizing <span style={{ fontWeight: 400, color: '#1f2937' }}>Indian</span></span>
          <span style={{ fontWeight: 400, color: '#4b5563', display: 'block' }}>Jurisprudence.</span>
        </h2>
        <p className="about-hero-subtitle">
          Empowering law firms, independent chambers, and legal professionals with next-generation artificial intelligence.
        </p>
      </div>

      <div className="about-problem-solution">
        <div className="about-card problem animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3>The Problem</h3>
          <p>
            The practice of law today is bogged down by endless paperwork, manual research, and thousands of pages of case files. Lawyers spend 70% of their time researching and formatting, leaving less time for strategy, advocacy, and actual justice.
          </p>
        </div>
        
        <div className="about-card solution animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3>The Wakalat Solution</h3>
          <p>
            Wakalat AI acts as the ultimate operating system for the modern legal mind. By combining state-of-the-art AI with deep Indian legal domain expertise, we provide tools that instantly analyze case files, draft error-free documents, and surface exact precedents.
          </p>
        </div>
      </div>

      <div className="about-pillars animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <h3 className="pillars-header">Our Core Pillars</h3>
        <div className="pillars-grid">
          
          <div className="pillar-card">
            <div className="pillar-icon"><Scale size={28} /></div>
            <h4>Trained on Indian Laws</h4>
            <p>Our foundation models are fine-tuned specifically on the BNS, IPC, Hindu Marriage Act, and Supreme Court judgments.</p>
          </div>
          
          <div className="pillar-card">
            <div className="pillar-icon"><ShieldCheck size={28} /></div>
            <h4>Absolute Privacy</h4>
            <p>Your client data is sacred. We employ military-grade encryption and strict zero-retention policies for all uploaded case files.</p>
          </div>
          
          <div className="pillar-card">
            <div className="pillar-icon"><Zap size={28} /></div>
            <h4>Instant Accuracy</h4>
            <p>Reduce weeks of discovery and research into seconds. Get exact citations and sections immediately to build stronger arguments.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon"><Target size={28} /></div>
            <h4>Drafting Precision</h4>
            <p>Generate NDAs, Bail Applications, and Written Statements that strictly adhere to formatting rules and current precedents.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon"><Cpu size={28} /></div>
            <h4>Agentic AI</h4>
            <p>Not just a chatbot. Wakalat AI actively searches, reads PDFs, and synthesizes complex arguments on your behalf.</p>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon"><Globe size={28} /></div>
            <h4>Accessible Anywhere</h4>
            <p>Whether you're in the courtroom or at your desk, Wakalat AI is available 24/7 across all devices as your silent partner.</p>
          </div>

        </div>
      </div>

      <div className="about-conclusion animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <p>
          Whether you are a solo practitioner looking to scale your practice or a large firm aiming for unparalleled efficiency, Wakalat AI is designed to be your most reliable, intelligent partner in the legal field.
        </p>
      </div>

    </StaticPageLayout>
  );
};

export default AboutUs;
