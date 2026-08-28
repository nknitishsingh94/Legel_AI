import React, { useState } from 'react';
import { Scale, Briefcase, ShieldAlert, Users, Building, FileText, ChevronRight } from 'lucide-react';

const useCases = [
  {
    id: 1,
    title: "Corporate & M&A",
    icon: <Briefcase size={32} />,
    description: "Analyze complex Mergers & Acquisitions contracts. Wakalat AI instantly extracts termination clauses, indemnity limits, and regulatory compliance risks across thousands of pages.",
    color: "#3b82f6" // blue
  },
  {
    id: 2,
    title: "Criminal Defense",
    icon: <ShieldAlert size={32} />,
    description: "Draft airtight bail applications in seconds. The AI automatically finds the latest Supreme Court and High Court precedents relevant to the specific sections of the BNS/IPC invoked.",
    color: "#ef4444" // red
  },
  {
    id: 3,
    title: "Family Law",
    icon: <Users size={32} />,
    description: "Navigate sensitive divorce, alimony, and custody disputes. Wakalat AI helps draft mutually agreeable settlement terms based on recent Family Court judgements.",
    color: "#ec4899" // pink
  },
  {
    id: 4,
    title: "Property & Real Estate",
    icon: <Building size={32} />,
    description: "Automate title searches and lease agreement reviews. Identify hidden liabilities or non-standard clauses in commercial real estate contracts before signing.",
    color: "#10b981" // green
  },
  {
    id: 5,
    title: "Civil Litigation",
    icon: <Scale size={32} />,
    description: "Prepare comprehensive written statements and counter-claims. Upload the plaintiff's notice and let Wakalat AI draft a point-by-point legal rebuttal.",
    color: "#f59e0b" // amber
  },
  {
    id: 6,
    title: "Intellectual Property",
    icon: <FileText size={32} />,
    description: "Cross-reference patent claims and trademark infringement cases globally. Draft cease and desist notices tailored precisely to Indian IP law.",
    color: "#8b5cf6" // purple
  }
];

const UseCasesSection = () => {
  const [activeCase, setActiveCase] = useState(null);

  return (
    <section id="use-cases" className="use-cases-section">
      <div className="use-cases-container">
        
        <div className="use-cases-header">
          <h2 style={{ fontSize: '3.5rem', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: '#ffffff' }}>
            <span style={{ fontWeight: 800, display: 'block' }}>Specialized Solutions <span style={{ fontWeight: 400 }}>for</span></span>
            <span style={{ fontWeight: 400, display: 'block', color: 'var(--accent-gold)' }}>Every Practice Area.</span>
          </h2>
          <p>
            From high-stakes corporate mergers to individual criminal defense, Wakalat AI adapts to the unique demands of your specific legal field.
          </p>
        </div>

        <div className="use-cases-grid">
          {useCases.map((uc) => (
            <div 
              key={uc.id} 
              className={`use-case-card ${activeCase === uc.id ? 'active' : ''}`}
              onMouseEnter={() => setActiveCase(uc.id)}
              onMouseLeave={() => setActiveCase(null)}
              style={{ '--hover-color': uc.color }}
            >
              <div className="use-case-icon-wrapper">
                {uc.icon}
              </div>
              <h3 className="use-case-title">{uc.title}</h3>
              <p className="use-case-desc">{uc.description}</p>
              
              <div className="use-case-action">
                <span>See Example</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default UseCasesSection;
