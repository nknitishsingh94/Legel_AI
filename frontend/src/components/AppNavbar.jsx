import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, Settings, CreditCard, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabase';

const AppNavbar = ({ onToggleSidebar, user, onNavigate }) => {
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
    await supabase.auth.signOut();
  };
  return (
    <header className="app-navbar">
      <div className="app-navbar-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="app-navbar-search hide-on-mobile">
          <Search size={18} color="var(--text-secondary)" />
          <input type="text" placeholder="Search chats, documents, or settings..." />
        </div>
      </div>

      <div className="app-navbar-actions" style={{ position: 'relative' }}>
        
        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>
          </button>
          
          {showNotifications && (
            <div className="dropdown-menu animate-fade-in" style={{ position: 'absolute', top: '120%', right: '0', width: '320px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', zIndex: 100, overflow: 'hidden' }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: '1rem' }}>
                Notifications
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '50%' }}>
                    <AlertTriangle size={18} color="#f59e0b" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#111827' }}>Payment Reminder</h4>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>You are approaching your 50 queries free limit. Upgrade to Pro for unlimited access.</p>
                  </div>
                </div>
                <div style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#d1fae5', padding: '0.5rem', borderRadius: '50%' }}>
                    <CheckCircle size={18} color="#10b981" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#111827' }}>Welcome to Wakalat AI</h4>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Your account has been successfully verified.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button className="profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <User size={20} />
            <span className="hide-on-mobile">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Advocate Profile'}</span>
          </button>

          {showProfileMenu && (
            <div className="dropdown-menu animate-fade-in" style={{ position: 'absolute', top: '120%', right: '0', width: '240px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', zIndex: 100, padding: '0.5rem' }}>
              <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                <p style={{ margin: 0, fontWeight: 600, color: '#111827', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.user_metadata?.full_name || 'Advocate'}
                </p>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </p>
              </div>
              
              <button onClick={() => { setShowProfileMenu(false); if(onNavigate) onNavigate('settings'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '6px', color: '#374151', fontSize: '0.9rem', textAlign: 'left' }} onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <Settings size={16} /> Account Settings
              </button>
              
              <button onClick={() => { setShowProfileMenu(false); if(onNavigate) onNavigate('settings'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '6px', color: '#374151', fontSize: '0.9rem', textAlign: 'left' }} onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <CreditCard size={16} /> Billing & Plans
              </button>
              
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>
              
              <button onClick={handleSignOut} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '6px', color: '#ef4444', fontSize: '0.9rem', textAlign: 'left' }} onMouseOver={e => e.currentTarget.style.background = '#fef2f2'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
