import React, { useState } from 'react';
import AppSidebar from './AppSidebar';
import AppNavbar from './AppNavbar';

const DashboardLayout = ({ 
  children, 
  user,
  activeView, 
  onNavigate,
  chats,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  usageCount
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="dashboard-layout">
      {isMobileSidebarOpen && (
        <div className="mobile-sidebar-overlay" onClick={closeSidebar}></div>
      )}
      
      <div className={`sidebar-wrapper ${isMobileSidebarOpen ? 'sidebar-open' : ''}`}>
        <AppSidebar 
          user={user}
          activeView={activeView} 
          onNavigate={(view) => {
            if (onNavigate) onNavigate(view);
            closeSidebar();
          }} 
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
          onNewChat={onNewChat}
          usageCount={usageCount}
        />
      </div>

      <div className="dashboard-main">
        <AppNavbar onToggleSidebar={toggleSidebar} />
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
