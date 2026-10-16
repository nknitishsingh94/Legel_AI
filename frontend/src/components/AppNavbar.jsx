import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, User, Menu, Settings, CreditCard, LogOut, CheckCircle, 
  AlertTriangle, FileText, MessageSquare, LayoutDashboard, FilePlus, 
  PenTool, Folder, Files, ShieldCheck, Sparkles, Scale, ExternalLink
} from 'lucide-react';
import { supabase } from '../supabase';

const PAGE_METADATA = {
  overview: {
    title: 'Dashboard Overview',
    subtitle: 'Legal intelligence & chambers analytics',
    badge: 'Live',
    icon: LayoutDashboard
  },
  create: {
    title: 'Create Legal Agreement & Contract',
    subtitle: 'Indian Contract Act 1872 & BNS 2023 compliant',
    badge: 'AI Drafter',
    icon: FilePlus
  },
  drafting: {
    title: 'Legal Drafting Studio',
    subtitle: 'Court petitions, statutory notices & bail • BNSS & BSA 2023',
    badge: 'BNS 2023 Ready',
    icon: PenTool
  },
  files: {
    title: 'Workspace Documents & Files',
    subtitle: 'Client briefs, generated agreements & signed drafts',
    badge: 'Vault',
    icon: Folder
  },
  summary: {
    title: 'Agreement Summary & Review',
    subtitle: 'Automatic contractual liability & risk extraction',
    badge: 'Statutory Audit',
    icon: FileText
  },
  compare: {
    title: 'Compare Legal Agreements',
    subtitle: 'Side-by-side redline & clause deviation audit',
    badge: 'Version Delta',
    icon: Files
  },
  chat: {
    title: 'AI Legal Counsel Consultation',
    subtitle: 'Indian jurisprudence, statutory reasoning & citations',
    badge: 'Legal AI',
    icon: MessageSquare
  },
  cgpay: {
    title: 'CGPay Legal eSign Gateway',
    subtitle: 'Aadhaar OTP, DigiLocker & OKYC electronic signing',
    badge: 'LIVE Gateway',
    icon: ShieldCheck
  },
  settings: {
    title: 'Chambers & Account Settings',
    subtitle: 'Manage practice credentials, subscription & security',
    badge: 'Verified',
    icon: Settings
  }
};

const AppNavbar = ({ onToggleSidebar, user, onNavigate, onLogout, activeView = 'overview' }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out error in navbar:", e);
    }
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/';
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Advocate';
  const planName = user?.app_metadata?.plan || 'Advocate Plan';

  const meta = PAGE_METADATA[activeView] || PAGE_METADATA.overview;
  const PageIcon = meta.icon;

  return (
    <header className="app-navbar">
      {/* Left Side: Mobile toggle + Compact fixed page title & subtitle */}
      <div className="app-navbar-left">
        <button 
          type="button"
          className="mobile-menu-btn" 
          onClick={onToggleSidebar}
          title="Toggle Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <div className="app-navbar-page-meta">
          <div className="app-navbar-icon-chip">
            <PageIcon size={18} color="#059669" />
          </div>
          <div className="app-navbar-title-column">
            <div className="app-navbar-title-row">
              <h2 className="app-navbar-page-title">{meta.title}</h2>
              {meta.badge && (
                <span className="app-navbar-badge-pill">{meta.badge}</span>
              )}
            </div>
            <p className="app-navbar-page-desc">{meta.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Right Side: Settings Icon, Bell Icon & Advocate Profile Dropdown */}
      <div className="app-navbar-actions">
        
        {/* Chambers & Account Settings Icon */}
        <button 
          type="button"
          className={`icon-btn ${activeView === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate && onNavigate('settings')}
          title="Chambers & System Settings"
          style={{ 
            color: activeView === 'settings' ? '#059669' : '#64748b',
            background: activeView === 'settings' ? '#ecfdf5' : 'transparent',
            borderRadius: '50%'
          }}
        >
          <Settings size={19} />
        </button>

        {/* Notifications Bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button 
            type="button"
            className="icon-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={19} />
            <span style={{ position: 'absolute', top: '7px', right: '7px', width: '7px', height: '7px', background: '#ef4444', borderRadius: '50%' }}></span>
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu animate-fade-in" style={{ 
              position: 'absolute', top: '120%', right: '0', width: '310px', 
              background: '#fff', borderRadius: '12px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb', 
              zIndex: 1000, overflow: 'hidden' 
            }}>
              <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f3f4f6', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                Notifications
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#ecfdf5', padding: '0.45rem', borderRadius: '50%', flexShrink: 0 }}>
                    <CheckCircle size={16} color="#059669" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.84rem', color: '#111827', fontWeight: 600 }}>System Live & BNS Ready</h4>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: '#64748b' }}>All Indian criminal codes & statutory drafting databases are synchronized.</p>
                  </div>
                </div>
                <div style={{ padding: '0.85rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#ecfdf5', padding: '0.45rem', borderRadius: '50%', flexShrink: 0 }}>
                    <ShieldCheck size={16} color="#059669" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.84rem', color: '#111827', fontWeight: 600 }}>CGPay eSign Gateway Live</h4>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: '#64748b' }}>Aadhaar OTP & DigiLocker multi-party signing available for immediate execution.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advocate Profile & Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div 
            className="app-navbar-user-chip" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="Account Menu"
          >
            <div className="app-navbar-user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="app-navbar-user-name hide-on-mobile">{userName}</span>
            <span className="app-navbar-user-badge hide-on-mobile">{planName}</span>
          </div>

          {showProfileMenu && (
            <div className="dropdown-menu animate-fade-in" style={{ 
              position: 'absolute', top: '120%', right: '0', width: '220px', 
              background: '#fff', borderRadius: '12px', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb', 
              zIndex: 1000, overflow: 'hidden', padding: '6px' 
            }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6', fontSize: '0.8rem', color: '#64748b' }}>
                Signed in as <strong style={{ color: '#0f172a' }}>{user?.email || 'Advocate'}</strong>
              </div>
              <button 
                type="button"
                onClick={() => { setShowProfileMenu(false); if (onNavigate) onNavigate('settings'); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.84rem', color: '#334155' }}
              >
                <Settings size={15} /> Account Settings
              </button>
              <button 
                type="button"
                onClick={() => { setShowProfileMenu(false); if (onNavigate) onNavigate('files'); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.84rem', color: '#334155' }}
              >
                <Folder size={15} /> Workspace Documents
              </button>
              <div style={{ height: '1px', background: '#f3f4f6', margin: '4px 0' }}></div>
              <button 
                type="button"
                onClick={handleSignOut}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.84rem', color: '#dc2626', fontWeight: 600 }}
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default AppNavbar;
