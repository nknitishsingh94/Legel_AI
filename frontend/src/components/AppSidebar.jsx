import React, { useState } from 'react';
import { 
  MoreVertical, Search, Edit3, Folder, FileText, 
  Files, FilePlus, ChevronDown, Plus, Sparkles, User, LayoutDashboard, 
  Settings, Trash2, MessageSquare, Zap, Scale, ShieldCheck, LogOut,
  Compass, Award, ChevronRight, FileSearch
} from 'lucide-react';
import { supabase } from '../supabase';
import './AppSidebar.css';

const AppSidebar = ({ 
  activeView, 
  onNavigate, 
  chats = [], 
  activeChatId, 
  onSelectChat, 
  onDeleteChat, 
  onNewChat, 
  user, 
  usageCount = 0,
  onUpgrade
}) => {
  const [openChats, setOpenChats] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isVip = user?.email === 'nknitishsingh94@gmail.com';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Advocate';
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=10b981&color=fff&bold=true`;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDefaultUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      if (onNavigate) onNavigate('settings');
    }
  };

  const limit = 50;
  const usagePercentage = Math.min((usageCount / limit) * 100, 100);

  const handleCreateWorkspace = () => {
    if (isVip) {
      alert("VIP Access: Custom chamber workspace initialized!");
    } else {
      handleDefaultUpgrade();
    }
    setWorkspaceMenuOpen(false);
  };

  // Sample quick templates when user has no chats yet
  const quickTemplates = [
    { id: 'tmpl-1', title: 'Legal Notice Draft (Sec 138)', icon: FileSearch },
    { id: 'tmpl-2', title: 'Commercial Agreement Review', icon: FileText },
    { id: 'tmpl-3', title: 'Anticipatory Bail Application', icon: ShieldCheck }
  ];

  return (
    <aside className="ai-lawyer-sidebar">
      
      {/* 3D Atmospheric Background Layers */}
      <div className="sidebar-ambient-glow top" />
      <div className="sidebar-ambient-glow middle" />
      <div className="sidebar-ambient-glow bottom" />

      {/* Brand Header with 3D Emblem */}
      <div className="sidebar-brand-header">
        <div className="brand-logo-cluster">
          <div className="brand-emblem-projected">
            <Scale size={20} className="emblem-scale-icon" />
            <div className="emblem-ring" />
          </div>
          <div className="brand-meta">
            <div className="brand-name">
              <span>WAKALAT</span>
              <span className="brand-gold-text">AI</span>
            </div>
            <span className="brand-tagline">LEGAL INTELLIGENCE</span>
          </div>
        </div>
        <div className="brand-status-chip">
          <span className="status-ping" />
          <span>PRO</span>
        </div>
      </div>

      {/* 3D Elevated Workspace Selector */}
      <div 
        className="sidebar-workspace-card" 
        onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
        title="Active Chamber Workspace"
      >
        <div className="ws-card-glow" />
        <div className="workspace-avatar-cube">
          <Award size={16} />
        </div>
        <div className="workspace-info">
          <span className="workspace-label">ACTIVE CHAMBER</span>
          <span className="workspace-name">{userName}'s Practice</span>
        </div>
        <div className="workspace-chevron-btn">
          <ChevronDown size={14} className={`chevron-ws ${workspaceMenuOpen ? 'open' : ''}`} />
        </div>
        
        {workspaceMenuOpen && (
          <div className="dropdown-menu-workspace animate-projection-in" onClick={(e) => e.stopPropagation()}>
            <div className="dropdown-header">Chamber Environments</div>
            <button className="dropdown-ws-item active">
              <span className="check-dot">●</span>
              <span>Principal Chamber (Primary)</span>
            </button>
            <div className="dropdown-divider" />
            <button onClick={handleCreateWorkspace} className="dropdown-ws-item add-new">
              <Plus size={14} />
              <span>Add Sub-Chamber {isVip ? '' : '(Pro)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3D Projective Search Bar */}
      <div className="sidebar-search-container">
        <div className="sidebar-search-box">
          <Search size={15} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search cases, acts & precedents..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-shortcut-badge">⌘K</span>
        </div>
      </div>

      {/* Main Navigation with 3D Extrusion & Laser Edge */}
      <nav className="sidebar-nav-main">
        <a 
          href="#overview" 
          className={`nav-item-projected ${activeView === 'overview' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('overview'); }}
        >
          <div className="nav-laser-beam" />
          <div className="nav-icon-shell">
            <LayoutDashboard size={18} />
          </div>
          <span className="nav-label">Dashboard</span>
          {activeView === 'overview' && <div className="nav-active-pip" />}
        </a>

        {/* Highlighted 3D Quick Action: New AI Research */}
        <a 
          href="#chat" 
          className={`nav-item-projected action-highlight ${activeView === 'chat' && !activeChatId ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); if(onNewChat) onNewChat(); }}
        >
          <div className="nav-laser-beam" />
          <div className="nav-icon-shell ai-glow">
            <Sparkles size={18} />
          </div>
          <span className="nav-label">New AI Research</span>
          <span className="nav-badge-ai">PRO</span>
        </a>

        <a 
          href="#files" 
          className={`nav-item-projected ${activeView === 'files' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('files'); }}
        >
          <div className="nav-laser-beam" />
          <div className="nav-icon-shell">
            <Folder size={18} />
          </div>
          <span className="nav-label">Workspace Files</span>
          {activeView === 'files' && <div className="nav-active-pip" />}
        </a>

        <a 
          href="#summary" 
          className={`nav-item-projected ${activeView === 'summary' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('summary'); }}
        >
          <div className="nav-laser-beam" />
          <div className="nav-icon-shell">
            <FileText size={18} />
          </div>
          <span className="nav-label">Agreement Summary</span>
          {activeView === 'summary' && <div className="nav-active-pip" />}
        </a>

        <a 
          href="#compare" 
          className={`nav-item-projected ${activeView === 'compare' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('compare'); }}
        >
          <div className="nav-laser-beam" />
          <div className="nav-icon-shell">
            <Files size={18} />
          </div>
          <span className="nav-label">Compare Agreements</span>
          {activeView === 'compare' && <div className="nav-active-pip" />}
        </a>

        <a 
          href="#create" 
          className={`nav-item-projected ${activeView === 'create' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('create'); }}
        >
          <div className="nav-laser-beam" />
          <div className="nav-icon-shell">
            <FilePlus size={18} />
          </div>
          <span className="nav-label">Create Agreement</span>
          {activeView === 'create' && <div className="nav-active-pip" />}
        </a>

        <a 
          href="#drafting" 
          className={`nav-item-projected ${activeView === 'drafting' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('drafting'); }}
        >
          <div className="nav-laser-beam" />
          <div className="nav-icon-shell">
            <Edit3 size={18} />
          </div>
          <span className="nav-label">Drafting</span>
          {activeView === 'drafting' && <div className="nav-active-pip" />}
        </a>
      </nav>

      {/* Scrollable Research Sessions & Knowledge Base */}
      <div className="sidebar-scrollable-deck">
        <div className="sidebar-deck-section">
          <div className="deck-header" onClick={() => setOpenChats(!openChats)}>
            <div className="deck-title-group">
              <span className="deck-title">RECENT RESEARCH</span>
              <span className="deck-counter">{chats.length}</span>
            </div>
            <div className="deck-header-actions">
              <button 
                className="deck-icon-action" 
                title="Start new research"
                onClick={(e) => { e.stopPropagation(); if(onNewChat) onNewChat(); }}
              >
                <Plus size={14} />
              </button>
              <ChevronDown size={14} className={`deck-chevron ${openChats ? 'open' : ''}`} />
            </div>
          </div>

          {openChats && (
            <div className="deck-content-list">
              {chats.length === 0 ? (
                /* Dynamic Quick Starters so sidebar is NEVER blank or dull */
                <div className="quick-starters-group">
                  <span className="quick-starters-label">QUICK CONSULTATIONS</span>
                  {quickTemplates.map(tmpl => {
                    const TmplIcon = tmpl.icon;
                    return (
                      <div 
                        key={tmpl.id} 
                        className="quick-starter-tile"
                        onClick={() => { if(onNewChat) onNewChat(); }}
                      >
                        <TmplIcon size={14} className="quick-tile-icon" />
                        <span className="quick-tile-text">{tmpl.title}</span>
                        <ChevronRight size={12} className="quick-tile-arrow" />
                      </div>
                    );
                  })}
                </div>
              ) : chats.filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                <div className="empty-search-state">No matching research cases</div>
              ) : (
                chats.filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase())).map(chat => (
                  <div 
                    key={chat.id} 
                    className={`research-history-card ${activeChatId === chat.id ? 'active' : ''}`}
                    onClick={() => onSelectChat && onSelectChat(chat.id)}
                  >
                    <div className="research-status-pip" />
                    <MessageSquare size={14} className="research-item-icon" />
                    <span className="research-title">{chat.title}</span>
                    <button 
                      className="delete-research-btn" 
                      title="Delete query"
                      onClick={(e) => {
                        e.stopPropagation();
                        if(onDeleteChat) onDeleteChat(chat.id);
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3D Holographic Footer Card & Chamber Controls */}
      <div className="sidebar-projected-footer">
        
        {/* Holographic Pro Plan Upgrade Projection Card */}
        <div className="holographic-quota-card">
          <div className="card-specular-sheen" />
          <div className="quota-card-header">
            <div className="quota-plan-badge">
              <Sparkles size={13} className="sparkle-gold" />
              <span>PRO ADVOCATE</span>
            </div>
            <span className="quota-ratio">{usageCount}/{limit}</span>
          </div>
          
          <div className="quota-meter-track">
            <div 
              className="quota-meter-fill" 
              style={{ width: `${usagePercentage}%` }} 
            >
              <div className="meter-laser-tip" />
            </div>
          </div>

          <button className="quota-upgrade-trigger-btn" onClick={handleDefaultUpgrade}>
            <Zap size={14} className="zap-gold-icon" />
            <span>Unlock Unlimited</span>
          </button>
        </div>

        {/* Settings Action Link */}
        <a 
          href="#settings" 
          className={`nav-item-projected settings-action-bar ${activeView === 'settings' ? 'active' : ''}`} 
          onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('settings'); }}
        >
          <div className="nav-laser-beam" />
          <div className="nav-icon-shell">
            <Settings size={18} />
          </div>
          <span className="nav-label">Chamber Settings</span>
          {activeView === 'settings' && <div className="nav-active-pip" />}
        </a>

        {/* Elevated 3D User Card */}
        <div className="sidebar-user-pod" onClick={() => setUserMenuOpen(!userMenuOpen)}>
          <div className="user-pod-avatar-wrap">
            <img src={avatarUrl} alt="Avatar" className="user-pod-avatar" />
            <span className="user-live-indicator" />
          </div>
          <div className="user-pod-meta">
            <div className="user-pod-name">{userName}</div>
            <span className="user-pod-designation">
              {isVip ? '★ Senior Advocate' : 'Advocate on Record'}
            </span>
          </div>
          <button className="user-pod-action" aria-label="Profile actions">
            <MoreVertical size={16} />
          </button>

          {userMenuOpen && (
            <div className="user-popover-menu animate-projection-in" onClick={(e) => e.stopPropagation()}>
              <button onClick={handleDefaultUpgrade} className="popover-action upgrade">
                <Sparkles size={14} /> Upgrade Plan
              </button>
              <button onClick={handleLogout} className="popover-action logout">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>

    </aside>
  );
};

export default AppSidebar;
