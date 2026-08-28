import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

const AppNavbar = ({ onToggleSidebar }) => {
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

      <div className="app-navbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <button className="profile-btn">
          <User size={20} />
          <span className="hide-on-mobile">Advocate Profile</span>
        </button>
      </div>
    </header>
  );
};

export default AppNavbar;
