import React, { useState } from 'react';
import { 
  MoreVertical, Search, Edit, Folder, FileText, 
  Files, FilePlus, ChevronDown, Plus, Sparkles, User, LayoutDashboard, Settings, Trash2, MessageSquare, Zap
} from 'lucide-react';
import { supabase } from '../supabase';
import './AppSidebar.css';

const AppSidebar = ({ activeView, onNavigate, chats = [], activeChatId, onSelectChat, onDeleteChat, onNewChat, user, usageCount = 0 }) => {
  const [openChats, setOpenChats] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isVip = user?.email === 'nknitishsingh94@gmail.com';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Advocate';
  const avatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0d9488&color=fff`;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleUpgrade = () => {
    alert("Plan upgrade feature coming soon!");
  };

  const limit = 50;
  const usagePercentage = Math.min((usageCount / limit) * 100, 100);
  const isLimitReached = usageCount >= limit;

  const handleCreateWorkspace = () => {
    if (isVip) {
      alert("VIP Access: Workspace created successfully!");
    } else {
      alert("This is a Pro feature. Please upgrade to Pro to create multiple workspaces.");
    }
    setWorkspaceMenuOpen(false);
  };

  return (
    <aside className="ai-lawyer-sidebar">
      {/* Workspace Selector */}
      <div className="sidebar-workspace" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}>
        <div className="workspace-icon"></div>
        <div className="workspace-info">
          <span className="workspace-label">Workspace</span>
          <span className="workspace-name">Personal Workspace</span>
        </div>
        <button className="icon-btn" style={{ pointerEvents: 'none' }}><MoreVertical size={16} /></button>
        
        {workspaceMenuOpen && (
          <div className="dropdown-menu animate-fade-in" style={{ position: 'absolute', top: '100%', left: '0', width: '100%', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', zIndex: 100, marginTop: '4px' }}>
            <button style={{ width: '100%', padding: '10px 12px', textAlign: 'left', background: '#f8fafc', border: 'none', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              ✓ Personal Workspace
            </button>
            <button onClick={handleCreateWorkspace} style={{ width: '100%', padding: '10px 12px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: isVip ? 'var(--accent-main)' : 'var(--text-secondary)' }} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              + Create New Workspace {isVip ? '' : '(Pro)'}
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <Search size={16} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search chats..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              ) : chats.filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--text-tertiary)' }}>No matching chats</div>
              ) : (
                chats.filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase())).map(chat => (
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
          <div className="user-avatar-circle" style={{ overflow: 'hidden', padding: 0, border: 'none', background: 'transparent' }}>
            <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="user-details">
            <span className="user-name">
              {userName}
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
