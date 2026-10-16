import React, { useState, useEffect, useRef } from 'react';
import { 
  MoreVertical, Search, Edit, Folder, FileText, 
  Files, FilePlus, ChevronDown, Plus, Sparkles, User, LayoutDashboard, 
  Settings, Trash2, MessageSquare, PenTool, ShieldCheck, Briefcase, 
  Check, X, ExternalLink, LogOut, CreditCard, Layers, Building
} from 'lucide-react';
import { supabase } from '../supabase';
import './AppSidebar.css';

const DEFAULT_WORKSPACES = [
  { id: 'ws-1', name: 'Legal AI Chambers', type: 'Primary Chambers', initials: 'LC' },
  { id: 'ws-2', name: 'Delhi High Court Practice', type: 'Litigation Chambers', initials: 'HC' },
  { id: 'ws-3', name: 'Corporate Advisory', type: 'Contracts & Advisory', initials: 'CA' }
];

const DEFAULT_CASES = [
  { id: 'case-1', title: 'Sharma v. State (Bail Appeal)', forum: 'Delhi High Court', type: 'Criminal / Bail', status: 'Hearing' },
  { id: 'case-2', title: 'Apex Logistics vs. TransGlobal', forum: 'Tis Hazari District Court', type: 'Civil Recovery', status: 'Active' },
  { id: 'case-3', title: 'Cheque Bounce Sec 138 Notice', forum: 'Patiala House Court', type: 'NI Act 1881', status: 'Notice' }
];

const AppSidebar = ({ 
  activeView, 
  onNavigate, 
  chats = [], 
  activeChatId, 
  onSelectChat, 
  onDeleteChat, 
  onNewChat, 
  user, 
  onUpgrade,
  onLogout 
}) => {
  // Navigation & UI states
  const [openCases, setOpenCases] = useState(true);
  const [openChats, setOpenChats] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Workspaces
  const [workspaces, setWorkspaces] = useState(() => {
    try {
      const saved = localStorage.getItem('vakeel_workspaces');
      return saved ? JSON.parse(saved) : DEFAULT_WORKSPACES;
    } catch (e) {
      return DEFAULT_WORKSPACES;
    }
  });
  const [activeWorkspace, setActiveWorkspace] = useState(() => {
    try {
      const savedId = localStorage.getItem('vakeel_active_workspace_id');
      return workspaces.find(w => w.id === savedId) || workspaces[0];
    } catch (e) {
      return workspaces[0];
    }
  });
  const [showAddWsInput, setShowAddWsInput] = useState(false);
  const [newWsName, setNewWsName] = useState('');

  // Cases Management
  const [cases, setCases] = useState(() => {
    try {
      const saved = localStorage.getItem('vakeel_cases');
      return saved ? JSON.parse(saved) : DEFAULT_CASES;
    } catch (e) {
      return DEFAULT_CASES;
    }
  });
  const [activeCaseId, setActiveCaseId] = useState(null);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseForm, setNewCaseForm] = useState({
    title: '',
    forum: 'Delhi High Court',
    type: 'Criminal / Bail',
    clientName: ''
  });

  const searchInputRef = useRef(null);
  const workspaceRef = useRef(null);
  const userMenuRef = useRef(null);

  // Global Keyboard Shortcuts (Ctrl+K for search, Ctrl+/ for new chat)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        if (onNewChat) onNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewChat]);

  // Click Outside Handlers for Dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target)) {
        setWorkspaceMenuOpen(false);
        setShowAddWsInput(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vakeel_workspaces', JSON.stringify(workspaces));
      localStorage.setItem('vakeel_active_workspace_id', activeWorkspace.id);
    } catch (e) {}
  }, [workspaces, activeWorkspace]);

  useEffect(() => {
    try {
      localStorage.setItem('vakeel_cases', JSON.stringify(cases));
    } catch (e) {}
  }, [cases]);

  // Workspace actions
  const handleSelectWorkspace = (ws) => {
    setActiveWorkspace(ws);
    setWorkspaceMenuOpen(false);
  };

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    const name = newWsName.trim();
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'WS';
    const newWs = {
      id: `ws-${Date.now()}`,
      name,
      type: 'Litigation Chambers',
      initials
    };
    const updated = [...workspaces, newWs];
    setWorkspaces(updated);
    setActiveWorkspace(newWs);
    setNewWsName('');
    setShowAddWsInput(false);
    setWorkspaceMenuOpen(false);
  };

  // Case actions
  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!newCaseForm.title.trim()) return;
    const newCase = {
      id: `case-${Date.now()}`,
      title: newCaseForm.title.trim(),
      forum: newCaseForm.forum || 'District Court',
      type: newCaseForm.type || 'Civil / Criminal',
      status: 'Active'
    };
    const updated = [newCase, ...cases];
    setCases(updated);
    setActiveCaseId(newCase.id);
    setShowNewCaseModal(false);
    setNewCaseForm({ title: '', forum: 'Delhi High Court', type: 'Criminal / Bail', clientName: '' });
  };

  const handleDeleteCase = (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this case file?")) return;
    setCases(prev => prev.filter(c => c.id !== id));
    if (activeCaseId === id) setActiveCaseId(null);
  };

  const handleSelectCase = (c) => {
    setActiveCaseId(c.id);
    // Navigate to drafting or chat with pre-filled context
    if (onNavigate) {
      onNavigate('drafting');
    }
  };

  // Full reliable Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("SignOut exception:", e);
    }
    try {
      localStorage.removeItem('sb-access-token');
      localStorage.removeItem('sb-refresh-token');
    } catch (e) {}

    if (onLogout) {
      onLogout();
    } else if (onNavigate) {
      onNavigate('landing');
    } else {
      window.location.href = '/';
    }
  };

  const handleUpgrade = () => {
    setUserMenuOpen(false);
    if (onUpgrade) onUpgrade();
    else if (onNavigate) onNavigate('settings');
  };

  // Nav Links with Real-Time Search Filter
  const q = searchQuery.toLowerCase().trim();
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'New chat', icon: Edit, shortcut: 'Ctrl+/' },
    { id: 'files', label: 'Workspace files', icon: Folder },
    { id: 'summary', label: 'Agreement summary', icon: FileText },
    { id: 'compare', label: 'Compare agreements', icon: Files },
    { id: 'create', label: 'Create agreement', icon: FilePlus },
    { id: 'drafting', label: 'Drafting', icon: PenTool },
    { id: 'cgpay', label: 'CGPay eSign Gateway', icon: ShieldCheck, isLive: true }
  ];

  const filteredNavItems = q ? navItems.filter(item => item.label.toLowerCase().includes(q)) : navItems;
  const filteredCases = q ? cases.filter(c => c.title.toLowerCase().includes(q) || c.forum.toLowerCase().includes(q)) : cases;
  const filteredChats = q ? chats.filter(c => c.title.toLowerCase().includes(q)) : chats;

  return (
    <aside className="ai-lawyer-sidebar">
      
      {/* Workspace Selector Dropdown */}
      <div className="sidebar-workspace-container" ref={workspaceRef} style={{ position: 'relative' }}>
        <div 
          className="sidebar-workspace" 
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          title="Click to switch or manage workspace"
        >
          <div className="workspace-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.78rem', color: '#047857', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            {activeWorkspace.initials || 'LC'}
          </div>
          <div className="workspace-info">
            <span className="workspace-label">Workspace</span>
            <span className="workspace-name">{activeWorkspace.name}</span>
          </div>
          <button 
            type="button"
            className="icon-btn" 
            onClick={(e) => { e.stopPropagation(); setWorkspaceMenuOpen(!workspaceMenuOpen); }}
            title="Workspace Options"
          >
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Workspace Dropdown Menu */}
        {workspaceMenuOpen && (
          <div className="workspace-dropdown-menu animate-fade-in" style={{
            position: 'absolute', top: '100%', left: 0, width: '100%', minWidth: '240px',
            background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)', padding: '6px', zIndex: 1100,
            marginTop: '4px'
          }}>
            <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Switch Workspace
            </div>
            {workspaces.map(ws => (
              <button
                key={ws.id}
                type="button"
                onClick={() => handleSelectWorkspace(ws)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 10px', background: activeWorkspace.id === ws.id ? '#f3f4f6' : 'transparent',
                  border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left',
                  fontSize: '13px', fontWeight: activeWorkspace.id === ws.id ? 700 : 500, color: '#1f2937'
                }}
              >
                <Building size={14} color={activeWorkspace.id === ws.id ? '#10b981' : '#6b7280'} />
                <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ws.name}</span>
                {activeWorkspace.id === ws.id && <Check size={14} color="#10b981" />}
              </button>
            ))}

            <div style={{ height: '1px', background: '#f3f4f6', margin: '4px 0' }}></div>

            {showAddWsInput ? (
              <form onSubmit={handleCreateWorkspace} style={{ padding: '6px 8px' }}>
                <input 
                  type="text" 
                  placeholder="Workspace Name..."
                  value={newWsName}
                  onChange={e => setNewWsName(e.target.value)}
                  autoFocus
                  style={{ width: '100%', padding: '6px 8px', fontSize: '12px', border: '1px solid #10b981', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                  <button type="submit" style={{ flex: 1, padding: '4px', fontSize: '11px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>Create</button>
                  <button type="button" onClick={() => setShowAddWsInput(false)} style={{ padding: '4px 8px', fontSize: '11px', background: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddWsInput(true)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#059669' }}
              >
                <Plus size={14} /> + Create New Workspace
              </button>
            )}

            <button
              type="button"
              onClick={() => { setWorkspaceMenuOpen(false); if (onNavigate) onNavigate('files'); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', color: '#4b5563' }}
            >
              <Folder size={14} /> Open Workspace Files
            </button>
            <button
              type="button"
              onClick={() => { setWorkspaceMenuOpen(false); if (onNavigate) onNavigate('settings'); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 10px', background: 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', color: '#4b5563' }}
            >
              <Settings size={14} /> Workspace Settings
            </button>
          </div>
        )}
      </div>

      {/* Search Input with Ctrl+K focus and clear */}
      <div className="sidebar-search" onClick={() => searchInputRef.current?.focus()}>
        <Search size={16} className="search-icon" />
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button 
            type="button" 
            onClick={() => setSearchQuery('')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#9ca3af' }}
          >
            <X size={13} />
          </button>
        ) : (
          <span className="shortcut" title="Press Ctrl+K to search">Ctrl+K</span>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="sidebar-nav-main">
        {filteredNavItems.map(item => {
          const Icon = item.icon;
          const isAct = item.id === 'chat' ? (activeView === 'chat' && !activeChatId) : (activeView === item.id);
          return (
            <a 
              key={item.id}
              href={`#${item.id}`} 
              className={`nav-item-link ${isAct ? 'active' : ''}`} 
              onClick={(e) => { 
                e.preventDefault(); 
                if (item.id === 'chat') {
                  if (onNewChat) onNewChat();
                } else if (onNavigate) {
                  onNavigate(item.id); 
                }
              }}
              title={item.label}
            >
              <Icon size={18} color={item.id === 'cgpay' ? '#059669' : undefined} />
              <span>{item.label}</span>
              {item.isLive && (
                <span style={{ fontSize: '0.62rem', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '100px', fontWeight: 800, marginLeft: 'auto' }}>
                  LIVE
                </span>
              )}
              {item.shortcut && !item.isLive && (
                <span className="shortcut-badge">{item.shortcut}</span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Scrollable Center: Cases & Recent Chats */}
      <div className="sidebar-scrollable">
        
        {/* Cases Section */}
        <div className="sidebar-section">
          <div className="section-header" onClick={() => setOpenCases(!openCases)}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={13} /> Cases ({cases.length})
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ChevronDown size={14} className={`chevron ${openCases ? 'open' : ''}`} />
              <button 
                type="button"
                className="icon-btn-small" 
                onClick={(e) => { e.stopPropagation(); setShowNewCaseModal(true); }}
                title="Add New Case"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {openCases && (
            <div className="section-content">
              <button 
                type="button" 
                className="new-case-btn" 
                onClick={() => setShowNewCaseModal(true)}
                title="Create a new legal case file"
              >
                <Plus size={14} /> New case
              </button>

              {filteredCases.length === 0 ? (
                <div style={{ padding: '8px 4px', fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
                  {q ? 'No matching cases' : 'No active cases'}
                </div>
              ) : (
                filteredCases.map(c => (
                  <div 
                    key={c.id} 
                    className={`chat-history-item ${activeCaseId === c.id ? 'active' : ''}`}
                    onClick={() => handleSelectCase(c)}
                    title={`${c.title} — ${c.forum}`}
                  >
                    <Briefcase size={14} color="#0284c7" />
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                      <span className="chat-title" style={{ fontWeight: 600, fontSize: '12.5px' }}>{c.title}</span>
                      <span style={{ fontSize: '10.5px', color: '#64748b' }}>{c.forum}</span>
                    </div>
                    <span style={{ 
                      fontSize: '9.5px', padding: '1px 5px', borderRadius: '4px',
                      background: c.status === 'Hearing' ? '#fef3c7' : '#e0f2fe',
                      color: c.status === 'Hearing' ? '#b45309' : '#0369a1',
                      fontWeight: 700 
                    }}>
                      {c.status}
                    </span>
                    <button 
                      type="button"
                      className="delete-chat-btn" 
                      onClick={(e) => handleDeleteCase(c.id, e)}
                      title="Delete Case"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Chats Section */}
        <div className="sidebar-section">
          <div className="section-header" onClick={() => setOpenChats(!openChats)}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={13} /> Chats ({chats.length})
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ChevronDown size={14} className={`chevron ${openChats ? 'open' : ''}`} />
              <button 
                type="button"
                className="icon-btn-small" 
                onClick={(e) => { e.stopPropagation(); if (onNewChat) onNewChat(); }}
                title="Start New Chat"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {openChats && (
            <div className="section-content chat-list">
              {filteredChats.length === 0 ? (
                <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  {q ? 'No matching chats' : 'No recent chats'}
                </div>
              ) : (
                filteredChats.map(chat => (
                  <div 
                    key={chat.id} 
                    className={`chat-history-item ${activeChatId === chat.id ? 'active' : ''}`}
                    onClick={() => onSelectChat && onSelectChat(chat.id)}
                    title={chat.title}
                  >
                    <MessageSquare size={14} color="#6b7280" />
                    <span className="chat-title">{chat.title}</span>
                    <button 
                      type="button"
                      className="delete-chat-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteChat) onDeleteChat(chat.id);
                      }}
                      title="Delete chat"
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

      {/* Footer: User Profile & Quick Settings */}
      <div className="sidebar-footer-fixed">
        
        {/* User Profile Bar with Dropdown Menu & Quick Settings Icon */}
        <div className="sidebar-user-profile-wrap" ref={userMenuRef} style={{ position: 'relative' }}>
          <div 
            className="sidebar-user-profile" 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            title="User Profile & Logout Options"
          >
            <div className="user-avatar-circle" style={{ background: '#059669', color: '#ffffff', fontWeight: 700, fontSize: '0.85rem' }}>
              {(user?.user_metadata?.full_name || user?.email || 'A')[0].toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">
                {user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'Advocate')}
              </span>
              <span className="user-plan">
                {user?.app_metadata?.plan || 'Advocate Plan'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <button 
                type="button"
                className={`icon-btn ${activeView === 'settings' ? 'active' : ''}`} 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (onNavigate) onNavigate('settings'); 
                }}
                title="Chambers & System Settings"
                style={{ 
                  color: activeView === 'settings' ? '#059669' : '#6b7280',
                  background: activeView === 'settings' ? '#ecfdf5' : 'transparent',
                  padding: '5px',
                  borderRadius: '6px'
                }}
              >
                <Settings size={16} />
              </button>
              <button 
                type="button"
                className="icon-btn" 
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                title="More user options"
                style={{ padding: '5px' }}
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* User Dropdown with Upgrade & Clean Logout */}
          {userMenuOpen && (
            <div className="user-dropdown-menu animate-fade-in" style={{
              position: 'absolute', bottom: '110%', right: 0, width: '100%', minWidth: '200px',
              background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)', padding: '6px', zIndex: 1200,
              display: 'flex', flexDirection: 'column', gap: '2px'
            }}>
              <div style={{ padding: '6px 10px', fontSize: '11px', color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>
                Signed in as <strong style={{ color: '#111827' }}>{user?.email || 'Advocate User'}</strong>
              </div>
              <button 
                type="button"
                onClick={() => { setUserMenuOpen(false); if (onNavigate) onNavigate('settings'); }} 
                className="dropdown-item"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <User size={15} /> Account Settings
              </button>
              <button 
                type="button"
                onClick={handleUpgrade} 
                className="dropdown-item upgrade"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 600 }}
              >
                <Sparkles size={15} /> Upgrade to Pro
              </button>
              <button 
                type="button"
                onClick={() => { setUserMenuOpen(false); if (onNavigate) onNavigate('files'); }} 
                className="dropdown-item"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Folder size={15} /> Workspace Documents
              </button>
              <div style={{ height: '1px', background: '#f3f4f6', margin: '2px 0' }}></div>
              <button 
                type="button"
                onClick={handleLogout} 
                className="dropdown-item logout"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 600 }}
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          )}
        </div>

      </div>

      {/* New Case Creation Modal */}
      {showNewCaseModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowNewCaseModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 99999, padding: '1rem'
          }}
        >
          <div 
            className="modal-card animate-fade-in" 
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff', borderRadius: '14px', width: '100%', maxWidth: '440px',
              padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={20} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>New Case File</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowNewCaseModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCase} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Court / Forum / Jurisdiction
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Delhi High Court / Tis Hazari Sessions" 
                  value={newCaseForm.forum}
                  onChange={e => setNewCaseForm({ ...newCaseForm, forum: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Case Category
                </label>
                <select 
                  value={newCaseForm.type}
                  onChange={e => setNewCaseForm({ ...newCaseForm, type: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                >
                  <option value="Criminal / Bail">Criminal Appeal & Bail (BNSS / CrPC)</option>
                  <option value="NI Act 1881">Section 138 Cheque Dishonour</option>
                  <option value="Civil Recovery">Civil Recovery Suit & Injunction</option>
                  <option value="Corporate / Contracts">Commercial Contract & Arbitration</option>
                  <option value="Family / Matrimonial">Matrimonial & Maintenance</option>
                  <option value="Consumer Forum">Consumer Protection Forum</option>
                </select>
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

    </aside>
  );
};

export default AppSidebar;
