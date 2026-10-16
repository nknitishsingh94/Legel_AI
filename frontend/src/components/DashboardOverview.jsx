import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, TrendingUp, Calendar, FileText, Activity, 
  Zap, MessageSquareHeart, Briefcase, CheckCircle2, Clock, 
  Plus, Search, X, Trash2, PenTool, ExternalLink, ShieldCheck, 
  ChevronRight, Award, Landmark, Filter
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { supabase } from '../supabase';
import FeedbackModal from './FeedbackModal';
import './DashboardOverview.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const DEFAULT_CASES = [
  { id: 'case-1', title: 'Sharma v. State (Bail Appeal)', forum: 'Delhi High Court', type: 'Criminal / Bail (BNSS)', client: 'Rohit Sharma', status: 'Active', nextHearing: '24 Oct 2026', notes: 'Bail petition drafted under Sec 482 BNSS' },
  { id: 'case-2', title: 'Apex Logistics vs. TransGlobal', forum: 'Tis Hazari District Court', type: 'Civil Recovery', client: 'Apex Logistics Ltd', status: 'Active', nextHearing: '02 Nov 2026', notes: 'Summary suit under Order 37 CPC' },
  { id: 'case-3', title: 'Cheque Bounce Sec 138 Notice', forum: 'Patiala House Court', type: 'NI Act 1881', client: 'Sunil Gupta', status: 'Active', nextHearing: '30 Oct 2026', notes: '15-day statutory demand notice served' },
  { id: 'case-4', title: 'Verma Property Injunction Suit', forum: 'Saket District Court', type: 'Civil Injunction', client: 'Anil Verma', status: 'Completed', nextHearing: 'Decreed / Won', notes: 'Decreed in favor of client' },
  { id: 'case-5', title: 'TechCorp vs. Nexus IT Arbitration', forum: 'Arbitration Tribunal', type: 'Commercial Contracts', client: 'TechCorp India', status: 'Completed', nextHearing: 'Award Passed', notes: 'Final commercial arbitration award passed' }
];

const DashboardOverview = ({ usageCount = 0, user, onNavigate }) => {
  const isVip = user?.email === 'nknitishsingh94@gmail.com';
  
  const limit = 50;
  const usagePercentage = isVip ? 0 : Math.min((usageCount / limit) * 100, 100);
  const isLimitReached = !isVip && usageCount >= limit;

  // Real-time server telemetry stats
  const [stats, setStats] = useState({
    active_cases: 0,
    docs_analyzed: 0,
    hours_saved: 0,
    cpu_usage: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [isLive, setIsLive] = useState(false);
  
  // Feedback Modal
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // -------------------------------------------------------------
  // Cases Management State (Active vs Completed Litigation Hub)
  // -------------------------------------------------------------
  const [cases, setCases] = useState(() => {
    try {
      const saved = localStorage.getItem('vakeel_cases');
      return saved ? JSON.parse(saved) : DEFAULT_CASES;
    } catch (e) {
      return DEFAULT_CASES;
    }
  });

  const [caseFilterTab, setCaseFilterTab] = useState('all'); // 'all' | 'active' | 'completed'
  const [caseSearchQuery, setCaseSearchQuery] = useState('');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    title: '',
    forum: 'Delhi High Court',
    type: 'Criminal / Bail (BNSS)',
    client: '',
    status: 'Active',
    nextHearing: '',
    notes: ''
  });

  // Persist cases to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vakeel_cases', JSON.stringify(cases));
    } catch (e) {}
  }, [cases]);

  // Derived counts
  const activeCasesList = cases.filter(c => c.status === 'Active' || c.status === 'Hearing' || c.status === 'Notice');
  const completedCasesList = cases.filter(c => c.status === 'Completed' || c.status === 'Disposed' || c.status === 'Won');

  const filteredCases = cases.filter(c => {
    // Tab filter
    if (caseFilterTab === 'active' && !(c.status === 'Active' || c.status === 'Hearing' || c.status === 'Notice')) {
      return false;
    }
    if (caseFilterTab === 'completed' && !(c.status === 'Completed' || c.status === 'Disposed' || c.status === 'Won')) {
      return false;
    }
    // Search query filter
    if (caseSearchQuery.trim()) {
      const sq = caseSearchQuery.toLowerCase();
      const matchTitle = (c.title || '').toLowerCase().includes(sq);
      const matchForum = (c.forum || '').toLowerCase().includes(sq);
      const matchClient = (c.client || '').toLowerCase().includes(sq);
      const matchType = (c.type || '').toLowerCase().includes(sq);
      return matchTitle || matchForum || matchClient || matchType;
    }
    return true;
  });

  const handleToggleCaseStatus = (caseId, e) => {
    e.stopPropagation();
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const isCurrentlyActive = c.status === 'Active' || c.status === 'Hearing' || c.status === 'Notice';
        return {
          ...c,
          status: isCurrentlyActive ? 'Completed' : 'Active',
          nextHearing: isCurrentlyActive ? 'Decreed / Won' : (c.nextHearing && c.nextHearing !== 'Decreed / Won' ? c.nextHearing : 'Hearing Scheduled')
        };
      }
      return c;
    }));
  };

  const handleDeleteCase = (caseId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this case record from your chamber docket?")) {
      setCases(prev => prev.filter(c => c.id !== caseId));
    }
  };

  const handleCreateNewCase = (e) => {
    e.preventDefault();
    if (!newCaseForm.title.trim()) return;

    const newCaseObj = {
      id: `case-${Date.now()}`,
      title: newCaseForm.title.trim(),
      forum: newCaseForm.forum || 'District Court',
      type: newCaseForm.type || 'Civil / Criminal',
      client: newCaseForm.client || 'Client',
      status: newCaseForm.status || 'Active',
      nextHearing: newCaseForm.status === 'Completed' ? 'Decreed / Won' : (newCaseForm.nextHearing || 'Hearing Scheduled'),
      notes: newCaseForm.notes || '',
      createdAt: new Date().toISOString()
    };

    setCases(prev => [newCaseObj, ...prev]);
    setShowNewCaseModal(false);
    setNewCaseForm({
      title: '',
      forum: 'Delhi High Court',
      type: 'Criminal / Bail (BNSS)',
      client: '',
      status: 'Active',
      nextHearing: '',
      notes: ''
    });
  };

  // Feedback check
  useEffect(() => {
    const checkFeedback = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('feedbacks')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (data && data.length > 0) {
          setHasSubmittedFeedback(true);
        }
      } catch (err) {
        console.error("Error checking feedback:", err);
      }
    };
    checkFeedback();
  }, [user, showFeedbackModal]);

  const intervalRef = useRef(null);

  // Fetch live stats from backend
  const fetchLiveStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/live-stats`);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setStats(data);
      setIsLive(true);

      // Add data point to chart
      setChartData(prev => {
        const newPoint = { 
          name: data.timestamp, 
          cases: activeCasesList.length || data.active_cases, 
          docs: Math.round(data.docs_analyzed / 100),
          load: data.cpu_usage 
        };
        const updated = [...prev, newPoint];
        return updated.length > 20 ? updated.slice(-20) : updated;
      });
    } catch (err) {
      setIsLive(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
    intervalRef.current = setInterval(fetchLiveStats, 3000);
    return () => clearInterval(intervalRef.current);
  }, [activeCasesList.length]);

  return (
    <div className="dash-overview-container animate-fade-in">
      {/* Top Header */}
      <div className="dash-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="dash-title">Chambers Overview &amp; Litigation Hub</h1>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Real-time litigation docket, case hearing status, and AI statutory research metrics
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <span style={{ 
            width: 8, height: 8, borderRadius: '50%', 
            background: isLive ? '#10b981' : '#ef4444',
            display: 'inline-block',
            animation: isLive ? 'pulse 2s infinite' : 'none'
          }} />
          {isLive ? 'Live Sync' : 'Offline'}
        </div>
      </div>

      {/* Top Banner Grid: Usage + Feedback */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Usage Progress Card */}
        <div className="dash-card" style={{ background: isVip ? 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' : (isLimitReached ? '#fef2f2' : '#f8fafc'), border: isLimitReached ? '1px solid #fca5a5' : '1px solid var(--border-color)', margin: 0, color: isVip ? '#fff' : 'inherit' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: isVip ? '#38bdf8' : (isLimitReached ? '#ef4444' : 'var(--text-primary)') }}>
              <Zap size={18} color={isVip ? '#38bdf8' : (isLimitReached ? '#ef4444' : 'var(--accent-main)')} />
              {isVip ? 'VIP Owner Plan' : 'Monthly Legal AI Research'}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isVip ? '#cbd5e1' : (isLimitReached ? '#ef4444' : 'var(--text-secondary)') }}>
              {isVip ? 'Unlimited' : `${usageCount} / ${limit} Used`}
            </div>
          </div>
          
          {!isVip && (
            <>
              <div style={{ width: '100%', height: '8px', background: isLimitReached ? '#fecaca' : '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ 
                  width: `${usagePercentage}%`, 
                  height: '100%', 
                  background: isLimitReached ? '#ef4444' : 'var(--accent-main)',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
              {usageCount >= 45 && !isLimitReached && (
                <div style={{ fontSize: '0.875rem', color: '#f59e0b', fontWeight: 500, marginBottom: '1rem' }}>
                  ⚠️ You are approaching your monthly limit. Only {limit - usageCount} queries remaining.
                </div>
              )}
              <button onClick={() => alert("Chambers Pro subscription features available in Settings.")} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: '100%' }}>
                Upgrade Practice Plan
              </button>
            </>
          )}

          {isVip && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.2rem' }}>Senior Advocate Access</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>All Restrictions Bypassed</div>
            </div>
          )}
        </div>

        {/* Feedback Card */}
        <div className="dash-card" style={{ background: 'linear-gradient(145deg, #10b981 0%, #059669 100%)', border: 'none', margin: 0, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.1rem' }}>
              <MessageSquareHeart size={20} color="#fff" />
              Chambers Feedback &amp; Suggestions
            </div>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              Help us refine Wakalat AI court templates and statutory citations. Share your feedback directly.
            </p>
          </div>
          
          {hasSubmittedFeedback ? (
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <CheckCircle2 size={18} />
              Thanks for your feedback!
            </div>
          ) : (
            <button 
              onClick={() => setShowFeedbackModal(true)} 
              style={{ background: '#fff', color: '#059669', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', width: '100%' }}
            >
              Submit Feedback
            </button>
          )}
        </div>
      </div>

      {/* Primary Key Metrics Row: Real-time Active & Completed Cases */}
      <div className="dash-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        
        {/* Metric 1: Active Cases */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>ACTIVE HEARINGS</h3>
            <Clock size={16} color="#0284c7" />
          </div>
          <div className="dash-metric-row">
            <span className="dash-metric-value" style={{ color: '#0369a1' }}>
              {activeCasesList.length}
            </span>
            <span className="dash-trend-badge up" style={{ background: '#e0f2fe', color: '#0369a1' }}>
              <Activity size={12} /> Active
            </span>
          </div>
          <div className="dash-card-footer">
            <span className="footer-item">Under active court adjudication</span>
          </div>
        </div>

        {/* Metric 2: Completed / Won Cases */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>COMPLETED / WON</h3>
            <CheckCircle2 size={16} color="#059669" />
          </div>
          <div className="dash-metric-row">
            <span className="dash-metric-value" style={{ color: '#047857' }}>
              {completedCasesList.length}
            </span>
            <span className="dash-trend-badge up" style={{ background: '#dcfce7', color: '#15803d' }}>
              <Award size={12} /> Disposed
            </span>
          </div>
          <div className="dash-card-footer">
            <span className="footer-item">Judgments decreed / closed</span>
          </div>
        </div>

        {/* Metric 3: Total Cases on Record */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>TOTAL CASE DOCKET</h3>
            <Briefcase size={16} color="#64748b" />
          </div>
          <div className="dash-metric-row">
            <span className="dash-metric-value">
              {cases.length}
            </span>
            <span className="dash-trend-badge up" style={{ background: '#f1f5f9', color: '#475569' }}>
              Chambers Vault
            </span>
          </div>
          <div className="dash-card-footer">
            <span className="footer-item">Combined litigation docket</span>
          </div>
        </div>

        {/* Metric 4: Documents & AI Research */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>DOCUMENTS &amp; BRIEFS</h3>
            <FileText size={16} color="#d97706" />
          </div>
          <div className="dash-metric-row">
            <span className="dash-metric-value">
              {stats.docs_analyzed > 0 ? stats.docs_analyzed.toLocaleString() : '1,420'}
            </span>
            <span className="dash-trend-badge up">
              <TrendingUp size={12} /> Live
            </span>
          </div>
          <div className="dash-card-footer">
            <span className="footer-item">AI statutory audits &amp; drafts</span>
          </div>
        </div>

      </div>

      {/* -------------------------------------------------------------
          CHAMBERS CASE MANAGEMENT HUB (Active vs Completed Tracker)
          ------------------------------------------------------------- */}
      <div className="dash-cases-hub">
        
        {/* Hub Header with Search & Tabs */}
        <div className="dash-cases-header">
          <div className="dash-cases-title-group">
            <div className="dash-cases-icon-badge">
              <Briefcase size={22} />
            </div>
            <div>
              <h2 className="dash-cases-title">Chambers Case Docket &amp; Litigation Tracker</h2>
              <p className="dash-cases-subtitle">
                Track pending court hearings, completed judgments, and next hearing dates
              </p>
            </div>
          </div>

          <div className="dash-cases-controls">
            {/* Search Input */}
            <div className="dash-cases-search">
              <Search size={14} style={{ position: 'absolute', left: '8px', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search party, court, client..."
                value={caseSearchQuery}
                onChange={e => setCaseSearchQuery(e.target.value)}
              />
              {caseSearchQuery && (
                <button 
                  type="button" 
                  onClick={() => setCaseSearchQuery('')}
                  style={{ position: 'absolute', right: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="dash-cases-tabs">
              <button 
                type="button"
                className={`dash-case-tab-btn ${caseFilterTab === 'all' ? 'active' : ''}`}
                onClick={() => setCaseFilterTab('all')}
              >
                All ({cases.length})
              </button>
              <button 
                type="button"
                className={`dash-case-tab-btn ${caseFilterTab === 'active' ? 'active tab-active-filter' : ''}`}
                onClick={() => setCaseFilterTab('active')}
              >
                <Clock size={12} /> Active ({activeCasesList.length})
              </button>
              <button 
                type="button"
                className={`dash-case-tab-btn ${caseFilterTab === 'completed' ? 'active tab-completed-filter' : ''}`}
                onClick={() => setCaseFilterTab('completed')}
              >
                <CheckCircle2 size={12} /> Completed ({completedCasesList.length})
              </button>
            </div>

            {/* New Case Button */}
            <button 
              type="button"
              className="dash-new-case-btn"
              onClick={() => setShowNewCaseModal(true)}
            >
              <Plus size={15} /> New Case File
            </button>
          </div>
        </div>

        {/* Case Cards Grid */}
        {filteredCases.length === 0 ? (
          <div className="dash-cases-empty">
            <Briefcase size={38} style={{ opacity: 0.35, marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 600, color: '#475569', margin: '0 0 4px 0' }}>No cases found</p>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
              {caseSearchQuery ? 'No cases match your search criteria' : 'Click "+ New Case File" to add your first case file'}
            </p>
          </div>
        ) : (
          <div className="dash-cases-grid">
            {filteredCases.map(c => {
              const isActive = c.status === 'Active' || c.status === 'Hearing' || c.status === 'Notice';
              return (
                <div key={c.id} className={`dash-case-card ${!isActive ? 'completed' : ''}`}>
                  
                  {/* Card Header: Category + Status Toggle Button */}
                  <div className="dash-case-card-header">
                    <span className="dash-case-category-badge">{c.type}</span>
                    <button 
                      type="button"
                      className={`dash-case-status-toggle ${isActive ? 'active' : 'completed'}`}
                      onClick={(e) => handleToggleCaseStatus(c.id, e)}
                      title={`Click to mark as ${isActive ? 'Completed' : 'Active'}`}
                    >
                      {isActive ? (
                        <>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284c7' }}></span>
                          Active Hearing
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} />
                          Completed
                        </>
                      )}
                    </button>
                  </div>

                  {/* Body: Title & Forum */}
                  <div>
                    <h4 className="dash-case-card-title">{c.title}</h4>
                    <div className="dash-case-card-forum">
                      <Landmark size={13} color="#64748b" />
                      <span>{c.forum}</span>
                    </div>
                    {c.client && (
                      <div className="dash-case-client">
                        <strong>Client:</strong> {c.client}
                      </div>
                    )}
                  </div>

                  {/* Footer: Date & Quick Actions */}
                  <div className="dash-case-card-footer">
                    <div className="dash-case-date">
                      {isActive ? (
                        <>
                          <Calendar size={13} color="#0284c7" />
                          <span>Next: {c.nextHearing || 'Date Awaited'}</span>
                        </>
                      ) : (
                        <>
                          <Award size={13} color="#059669" />
                          <span style={{ color: '#059669' }}>Disposed / Closed</span>
                        </>
                      )}
                    </div>

                    <div className="dash-case-actions">
                      {onNavigate && (
                        <button 
                          type="button"
                          className="dash-case-action-btn"
                          onClick={() => onNavigate('drafting')}
                          title="Open in Legal Drafting Studio"
                        >
                          <PenTool size={14} color="#059669" />
                        </button>
                      )}
                      <button 
                        type="button"
                        className="dash-case-action-btn delete"
                        onClick={(e) => handleDeleteCase(c.id, e)}
                        title="Delete Case File"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Chart Section - Real-time Live Data */}
      <div className="dash-card dash-chart-card" style={{ marginTop: '1.25rem' }}>
        <div className="dash-card-header">
          <h3>REAL-TIME CASE &amp; STATUTORY AUDIT ACTIVITY</h3>
          <div className="dash-select">
            <span>Live Stream</span> <Activity size={14} />
          </div>
        </div>
        <div className="dash-chart-container" style={{ marginTop: '0.5rem' }}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 10}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}
              />
              <Area type="monotone" dataKey="cases" name="Active Case Hearings" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorCases)" />
              <Area type="monotone" dataKey="load" name="Server Load %" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* New Case Creation Modal */}
      {showNewCaseModal && (
        <div 
          className="dash-case-modal-overlay"
          onClick={() => setShowNewCaseModal(false)}
        >
          <div 
            className="dash-case-modal-card animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={22} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>New Chamber Case File</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowNewCaseModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewCase} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Case Title / Parties *
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Verma vs. State of NCT Delhi" 
                  required
                  value={newCaseForm.title}
                  onChange={e => setNewCaseForm({ ...newCaseForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Court / Forum
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Delhi High Court" 
                    value={newCaseForm.forum}
                    onChange={e => setNewCaseForm({ ...newCaseForm, forum: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Client Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Amit Sharma" 
                    value={newCaseForm.client}
                    onChange={e => setNewCaseForm({ ...newCaseForm, client: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select 
                    value={newCaseForm.type}
                    onChange={e => setNewCaseForm({ ...newCaseForm, type: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="Criminal / Bail (BNSS)">Criminal &amp; Bail (BNSS 2023)</option>
                    <option value="NI Act 1881">Section 138 Cheque Dishonour</option>
                    <option value="Civil Recovery">Civil Recovery &amp; Injunction</option>
                    <option value="Commercial Contracts">Commercial &amp; Arbitration</option>
                    <option value="Family / Matrimonial">Matrimonial &amp; Maintenance</option>
                    <option value="Consumer Forum">Consumer Protection Forum</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Initial Status
                  </label>
                  <select 
                    value={newCaseForm.status}
                    onChange={e => setNewCaseForm({ ...newCaseForm, status: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="Active">● Active Hearing</option>
                    <option value="Completed">✓ Completed / Won</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Next Hearing Date
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 24 Oct 2026 or 15 Nov 2026" 
                  value={newCaseForm.nextHearing}
                  onChange={e => setNewCaseForm({ ...newCaseForm, nextHearing: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowNewCaseModal(false)}
                  style={{ padding: '0.6rem 1rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', color: '#475569' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '0.6rem 1.25rem', background: '#059669', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  Save Case File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
        user={user} 
      />
    </div>
  );
};

export default DashboardOverview;
