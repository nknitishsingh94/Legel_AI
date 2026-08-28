import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const MegaMenu = ({ title }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="mega-menu-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <a href="#features" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {title} <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
      </a>
      
      <div className={`mega-menu-dropdown ${isOpen ? 'active' : ''}`}>
        <div className="mega-menu-content">
          
          <div className="mega-menu-left">
            <div className="mega-menu-grid">
              {/* Column 1 */}
              <div className="mega-menu-col">
                <div className="mega-item">
                  <h4>Case Management System</h4>
                  <p>Track all your cases across Supreme Court, High Court, District Courts, and Tribunals.</p>
                </div>
                <div className="mega-item">
                  <h4>Drafting</h4>
                  <p>Draft Gen — AI-powered legal drafting tool. Create professional drafts in seconds.</p>
                </div>
              </div>
              
              {/* Column 2 */}
              <div className="mega-menu-col">
                <div className="mega-item">
                  <h4>AI Research</h4>
                  <p>Vakai — a pure legal AI trained exclusively on Supreme Court judgements, High Courts judgements, and Bare Acts.</p>
                </div>
                <div className="mega-item">
                  <h4>Judgement Search</h4>
                  <p>Search judgements by keywords or case title. Get AI-powered summaries and download PDFs.</p>
                </div>
              </div>
            </div>

            <div className="mega-menu-footer">
              <a href="#features" className="view-all-link">
                View all features <ArrowRight size={14} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
