import React, { useState, useEffect } from 'react';

const featuresData = [
  {
    id: 'case-management',
    label: 'Case Management System',
    title: 'Streamline your legal practice.',
    desc: 'Manage clients, hearings, case files, and documents in one unified platform built specifically for Indian law firms.'
  },
  {
    id: 'ai-research',
    label: 'AI Research',
    title: 'Find precedents instantly.',
    desc: 'Our AI understands the legal context, not just keywords, to find the exact case laws and statutes you need across all jurisdictions.'
  },
  {
    id: 'drafting',
    label: 'Drafting',
    title: 'Automated legal drafting.',
    desc: 'Generate error-free NDAs, employment contracts, notices, and pleadings in minutes with our intelligent drafting assistant.'
  },
  {
    id: 'case-analysis',
    label: 'Case File Analysis',
    title: 'Understand complex cases fast.',
    desc: 'Upload lengthy court documents and get instant, accurate summaries highlighting the most critical arguments and liabilities.'
  },
  {
    id: 'judgement-search',
    label: 'Judgement Search',
    title: 'Comprehensive judgement database.',
    desc: 'Access an exhaustive, constantly updated database of Supreme Court and High Court judgements with AI-powered search.'
  },
  {
    id: 'pdf-tools',
    label: 'PDF Tools',
    title: 'Smart PDF management.',
    desc: 'Extract text, merge, split, and analyze legal PDFs with built-in OCR and natural language processing capabilities.'
  },
  {
    id: 'internship-portal',
    label: 'Internship Portal',
    title: 'A pipeline for the next generation.',
    desc: 'Post openings, review applicants, and manage interns from a single dashboard built for chambers and firms.'
  }
];

const InteractiveFeatures = () => {
  const [activeTab, setActiveTab] = useState(featuresData[0].id); // Default to first tab
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = featuresData.findIndex((f) => f.id === prev);
        const nextIndex = (currentIndex + 1) % featuresData.length;
        return featuresData[nextIndex].id;
      });
    }, 3000); // Change tab every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const activeFeature = featuresData.find((f) => f.id === activeTab);

  return (
    <div 
      className="interactive-features-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="interactive-layout">
        
        {/* Left Column: Heading & Tabs */}
        <div className="tabs-column">
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '3.5rem', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              <span style={{ fontWeight: 800, color: '#1f2937', display: 'block' }}>One platform <span style={{ fontWeight: 400, color: '#1f2937' }}>to</span></span>
              <span style={{ fontWeight: 400, color: '#4b5563', display: 'block' }}>incorporate all your</span>
              <span style={{ fontWeight: 400, color: '#4b5563', display: 'block' }}>legal needs</span>
            </h2>
          </div>

          <div className="tabs-list">
            {featuresData.map((feature) => (
            <button
              key={feature.id}
              className={`feature-tab ${activeTab === feature.id ? 'active' : ''}`}
              onClick={() => setActiveTab(feature.id)}
              onMouseEnter={() => setActiveTab(feature.id)}
            >
              {feature.label}
            </button>
            ))}
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="content-column">
          {/* We use key={activeTab} to force a re-mount and trigger CSS animations on change */}
          <div key={activeTab} className="feature-content animate-slide-up">
            <h2 className="content-title">{activeFeature.title}</h2>
            <p className="content-desc">{activeFeature.desc}</p>
            <a href="#" className="explore-link">Explore more &gt;</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InteractiveFeatures;
