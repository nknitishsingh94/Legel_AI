import React, { useState } from 'react';
import { Scale, MessageSquare, FileText, Settings, History, PlusCircle, Star } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const Sidebar = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="sidebar glass-panel animate-fade-in">
      <div className="sidebar-logo" style={{ marginBottom: '2rem' }}>
        <Scale size={28} color="var(--accent-gold)" />
        <div style={{ color: '#111827' }}>Wakalat<span style={{ color: 'var(--accent-gold)' }}>AI</span></div>
      </div>

      <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', marginBottom: '1.5rem', background: '#111827' }}>
        <PlusCircle size={20} />
        New Consultation
      </button>
      
      <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Recent History
      </div>
      
      <div className="nav-item">
        <MessageSquare size={18} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>NDA Analysis for Tech Corp</span>
      </div>
      <div className="nav-item">
        <MessageSquare size={18} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Property Dispute Case #402</span>
      </div>
      <div className="nav-item">
        <MessageSquare size={18} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Drafting Employment Contract</span>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div className="nav-item">
          <FileText size={20} />
          <span>My Documents</span>
        </div>
        <div className="nav-item" onClick={() => setIsFeedbackOpen(true)}>
          <Star size={20} />
          <span>Submit Feedback</span>
        </div>
        <div className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
};

export default Sidebar;
