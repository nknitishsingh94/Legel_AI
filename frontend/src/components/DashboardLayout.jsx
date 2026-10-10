import React, { useState } from 'react';
import AppSidebar from './AppSidebar';
import AppNavbar from './AppNavbar';
import PaymentModal from './PaymentModal';

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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
          onSelectChat={(id) => {
            if (onSelectChat) onSelectChat(id);
            closeSidebar();
          }}
          onDeleteChat={onDeleteChat}
          onNewChat={() => {
            if (onNewChat) onNewChat();
            closeSidebar();
          }}
          usageCount={usageCount}
          onUpgrade={() => setIsPaymentModalOpen(true)}
        />
      </div>

      <div className="dashboard-main">
        <AppNavbar 
          onToggleSidebar={toggleSidebar} 
          user={user} 
          onNavigate={onNavigate} 
          chats={chats}
          onSelectChat={onSelectChat}
        />
        <div className="dashboard-content">
          {children}
        </div>
      </div>

      {/* Payment Modal for Pro Upgrades */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={{ id: 'pro', name: 'Advocate Pro' }}
        billingCycle="monthly"
        user={user}
        onPaymentSuccess={(details) => {
          console.log("Upgraded to Pro:", details);
        }}
      />
    </div>
  );
};

export default DashboardLayout;
