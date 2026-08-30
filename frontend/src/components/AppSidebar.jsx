import React, { useState } from 'react';
import { 
  MoreVertical, Search, Edit, Folder, FileText, 
  Files, FilePlus, ChevronDown, Plus, Sparkles, User, LayoutDashboard, Settings, Trash2, MessageSquare, Zap
} from 'lucide-react';
import { supabase } from '../supabase';
import './AppSidebar.css';

const AppSidebar = ({ activeView, onNavigate, chats = [], activeChatId, onSelectChat, onDeleteChat, onNewChat, user, usageCount = 0 }) => {
  const [openCases, setOpenCases] = useState(true);
  const [openChats, setOpenChats] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleUpgrade = () => {
    alert("Plan upgrade feature coming soon!");
  };

  const limit = 50;
  const usagePercentage = Math.min((usageCount / limit) * 100, 100);
  const isLimitReached = usageCount >= limit;

  return (
    <aside className="ai-lawyer-sidebar">
      {/* Workspace Selector */}
      <div className="sidebar-workspace">
        <div className="workspace-icon"></div>
        <div className="workspace-info">
          <span className="workspace-label">Workspace</span>
          <span className="workspace-name">New Workspace</span>
        </div>
        <button className="icon-btn"><MoreVertical size={16} /></button>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <Search size={16} className="search-icon" />
        <input type="text" placeholder="Search" />
        <span className="shortcut">Ctrl+K</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav-main">
        <a href="#" className={`nav-item-link ${activeView === 'overview' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('overview'); }}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </a>
        <a href="#" className={`nav-item-link ${activeView === 'chat' && !activeChatId ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); if(onNewChat) onNewChat(); }}>
          <Edit size={18} />
          <span>New chat</span>
          <span className="shortcut-badge">Ctrl+/</span>
        </a>
        <a href="#" className={`nav-item-link ${activeView === 'files' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('files'); }}>
          <Folder size={18} />
          <span>Workspace files</span>
        </a>
        <a href="#" className={`nav-item-link ${activeView === 'summary' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('summary'); }}>
          <FileText size={18} />
          <span>Agreement summary</span>
        </a>
        <a href="#" className={`nav-item-link ${activeView === 'compare' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('compare'); }}>
          <Files size={18} />
          <span>Compare agreements</span>
        </a>
        <a href="#" className={`nav-item-link ${activeView === 'create' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('create'); }}>
          <FilePlus size={18} />
          <span>Create agreement</span>
        </a>
      </nav>

      <div className="sidebar-scrollable">
        {/* Cases Section */}
        <div className="sidebar-section">
          <div className="section-header" onClick={() => setOpenCases(!openCases)}>
            <span>Cases</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ChevronDown size={14} className={`chevron ${openCases ? 'open' : ''}`} />
              <button className="icon-btn-small" onClick={(e) => { e.stopPropagation(); }}><Plus size={14} /></button>
            </div>
          </div>
          {openCases && (
            <div className="section-content">
              <button className="new-case-btn">
                <Plus size={14} /> New case
              </button>
            </div>
          )}
        </div>

        {/* Chats Section */}
        <div className="sidebar-section">
          <div className="section-header" onClick={() => setOpenChats(!openChats)}>
            <span>Chats</span>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ChevronDown size={14} className={`chevron ${openChats ? 'open' : ''}`} />
              <button className="icon-btn-small" onClick={(e) => { e.stopPropagation(); if(onNewChat) onNewChat(); }}><Plus size={14} /></button>
            </div>
          </div>
          {openChats && (
            <div className="section-content chat-list">
              {chats.length === 0 ? (
                <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--text-tertiary)' }}>No recent chats</div>
              ) : (
                chats.map(chat => (
                  <div 
                    key={chat.id} 
                    className={`chat-history-item ${activeChatId === chat.id ? 'active' : ''}`}
                    onClick={() => onSelectChat && onSelectChat(chat.id)}
                  >
                    <MessageSquare size={14} />
                    <span className="chat-title">{chat.title}</span>
                    <button 
                      className="delete-chat-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if(onDeleteChat) onDeleteChat(chat.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer (Pro + User) */}
      <div className="sidebar-footer-fixed">
        <button className={`nav-item-link ${activeView === 'settings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); if(onNavigate) onNavigate('settings'); }} style={{ width: '100%', marginBottom: '12px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '6px', color: 'var(--text-secondary)' }}>
          <Settings size={18} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Settings</span>
        </button>

        <div className="sidebar-user-profile" style={{ position: 'relative' }}>
          <div className="user-avatar-circle">
            <User size={18} />
          </div>
          <div className="user-details">
            <span className="user-name">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Advocate'}
            </span>
            <span className="user-plan">
              {user?.app_metadata?.plan || 'Free plan'}
            </span>
          </div>
          <button className="icon-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <MoreVertical size={16} />
          </button>

          {userMenuOpen && (
            <div className="user-dropdown-menu">
              <button onClick={handleUpgrade} className="dropdown-item upgrade">
                Upgrade Plan
              </button>
              <button onClick={handleLogout} className="dropdown-item logout">
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
