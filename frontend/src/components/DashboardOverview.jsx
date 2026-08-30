import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, TrendingUp, Calendar, 
  FileText, Activity, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const DashboardOverview = ({ usageCount = 0 }) => {
  const limit = 50;
  const usagePercentage = Math.min((usageCount / limit) * 100, 100);
  const isLimitReached = usageCount >= limit;

  const [stats, setStats] = useState({
    active_cases: 0,
    docs_analyzed: 0,
    hours_saved: 0,
    cpu_usage: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef(null);

  // Fetch live stats from backend
  const fetchLiveStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/live-stats`);
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setStats(data);
      setIsLive(true);

      // Add data point to chart (real-time)
      setChartData(prev => {
        const newPoint = { 
          name: data.timestamp, 
          cases: data.active_cases, 
          docs: Math.round(data.docs_analyzed / 100),
          load: data.cpu_usage 
        };
        const updated = [...prev, newPoint];
        // Keep last 20 data points for live chart
        return updated.length > 20 ? updated.slice(-20) : updated;
      });
    } catch (err) {
      setIsLive(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
    // Poll every 3 seconds for real-time updates
    intervalRef.current = setInterval(fetchLiveStats, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="dash-overview-container animate-fade-in">
      <div className="dash-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="dash-title">Dashboard Overview</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
          <span style={{ 
            width: 8, height: 8, borderRadius: '50%', 
            background: isLive ? '#10b981' : '#ef4444',
            display: 'inline-block',
            animation: isLive ? 'pulse 2s infinite' : 'none'
          }} />
          {isLive ? 'Live' : 'Offline'}
        </div>
      </div>

      {/* Usage Progress Card */}
      <div className="dash-card" style={{ maxWidth: '500px', marginBottom: '1.5rem', background: isLimitReached ? '#fef2f2' : '#f8fafc', border: isLimitReached ? '1px solid #fca5a5' : '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: isLimitReached ? '#ef4444' : 'var(--text-primary)' }}>
            <Zap size={18} color={isLimitReached ? '#ef4444' : 'var(--accent-main)'} />
            Free Plan Usage (AI Queries)
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isLimitReached ? '#ef4444' : 'var(--text-secondary)' }}>
            {usageCount} / {limit} Used
          </div>
        </div>
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
        <button onClick={() => alert("Upgrade features coming soon!")} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Upgrade to Pro
        </button>
      </div>

      {/* Metrics Row - Real-time */}
      <div className="dash-metrics-grid">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>ACTIVE CASES</h3>
            <button className="icon-btn-small"><MoreVertical size={16} /></button>
          </div>
          <div className="dash-metric-row">
            <span className="dash-metric-value">{stats.active_cases}</span>
            <span className="dash-trend-badge up">
              <Activity size={12} /> Live
            </span>
          </div>
          <div className="dash-card-footer">
            <span className="footer-item">Real-time data from server</span>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <h3>DOCUMENTS ANALYZED</h3>
            <button className="icon-btn-small"><MoreVertical size={16} /></button>
          </div>
          <div className="dash-metric-row">
            <span className="dash-metric-value">{stats.docs_analyzed.toLocaleString()}</span>
            <span className="dash-trend-badge up">
              <TrendingUp size={12} /> Live
            </span>
          </div>
          <div className="dash-card-footer">
            <span className="footer-item">Updates every 3 seconds</span>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <h3>HOURS SAVED</h3>
            <button className="icon-btn-small"><MoreVertical size={16} /></button>
          </div>
          <div className="dash-metric-row">
            <span className="dash-metric-value">{stats.hours_saved}</span>
            <span className="dash-trend-badge up">
              <TrendingUp size={12} /> Live
            </span>
          </div>
          <div className="dash-card-footer">
            <span className="footer-item">CPU Load: <strong>{stats.cpu_usage}%</strong></span>
          </div>
        </div>
      </div>

      {/* Chart Section - Real-time Live Data */}
      <div className="dash-card dash-chart-card">
        <div className="dash-card-header">
          <h3>REAL-TIME ACTIVITY MONITOR</h3>
          <div className="dash-select">
            <span>Live</span> <Activity size={14} />
          </div>
        </div>
        <div className="dash-chart-container" style={{ marginTop: '0.5rem' }}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b8860b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#b8860b" stopOpacity={0}/>
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
              <Area type="monotone" dataKey="cases" name="Active Cases" stroke="#b8860b" strokeWidth={2} fillOpacity={1} fill="url(#colorCases)" />
              <Area type="monotone" dataKey="load" name="CPU Load %" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lists Row - Empty until real data */}
      <div className="dash-lists-grid">
        <div className="dash-card dash-list-card">
          <div className="dash-card-header">
            <h3>RECENT LEGAL ACTIVITIES</h3>
          </div>
          <div className="dash-list">
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
              <Calendar size={32} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No activities yet</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Activities will appear here when cases are added</p>
            </div>
          </div>
        </div>

        <div className="dash-card dash-list-card">
          <div className="dash-card-header">
            <h3>RECENT DOCUMENTS</h3>
          </div>
          <div className="dash-list">
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
              <FileText size={32} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No documents yet</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Upload or analyze documents to see them here</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardOverview;
