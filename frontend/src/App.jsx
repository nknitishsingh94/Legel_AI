import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'
import LandingPage from './components/LandingPage'
import DashboardLayout from './components/DashboardLayout'
import Login from './components/Login'
import AboutUs from './components/AboutUs'
import Careers from './components/Careers'
import Academy from './components/Academy'
import Blog from './components/Blog'
import FAQ from './components/FAQ'
import PrivacyPolicy from './components/PrivacyPage'
import TermsOfService from './components/TermsOfService'
import RefundPolicy from './components/RefundPolicy'
import DashboardOverview from './components/DashboardOverview'
import CompareAgreements from './components/CompareAgreements'
import ChatArea from './components/ChatArea'
import WorkspaceFiles from './components/WorkspaceFiles'
import AgreementSummary from './components/AgreementSummary'
import CreateAgreement from './components/CreateAgreement'
import Settings from './components/Settings'
import SigningPortal from './components/SigningPortal'

function App() {
  const [isSigningRoute, setIsSigningRoute] = useState(false);
  const [view, setView] = useState('landing'); // 'landing', 'login', 'app'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardView, setDashboardView] = useState('overview'); // 'overview', 'compare', 'chat', etc.

  useEffect(() => {
    if (window.location.pathname.startsWith('/sign/')) {
      setIsSigningRoute(true);
    }
  }, []);

  // --- Chat History Management (Supabase) ---
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check initial auth state
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          setIsLoggedIn(true);
          setView('app');
        }

        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            setView('update-password');
          } else if (session) {
            setUser(session.user);
            setIsLoggedIn(true);
            setView(prev => prev === 'update-password' ? 'update-password' : 'app');
          } else {
            setUser(null);
            setIsLoggedIn(false);
            setView('landing');
          }
        });
      } catch (e) {
        console.error("Supabase Auth Error", e);
      }
    };
    checkUser();
  }, []);

  const [usageCount, setUsageCount] = useState(0);

  // Fetch initial chats from Supabase when user logs in
  useEffect(() => {
    const fetchChatsAndUsage = async () => {
      if (!user) return;
      try {
        const { data: chatsData, error: chatsError } = await supabase
          .from('chats')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (chatsData && !chatsError) {
          setChats(chatsData);

          // Calculate usage for current month
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);

          if (chatsData.length > 0) {
            const chatIds = chatsData.map(c => c.id);
            const { count, error: countError } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('sender', 'user')
              .in('chat_id', chatIds)
              .gte('created_at', startOfMonth.toISOString());
            
            if (!countError && count !== null) {
              setUsageCount(count);
            }
          }
        }
      } catch (e) {
        console.error("Supabase not fully setup yet.", e);
      }
    };
    fetchChatsAndUsage();
  }, [user]);

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    setDashboardView('chat');
  };

  const handleDeleteChat = async (id) => {
    try {
      // First delete all messages associated with this chat (if no CASCADE is set in DB)
      await supabase.from('messages').delete().eq('chat_id', id);
      // Then delete the chat itself
      await supabase.from('chats').delete().eq('id', id);
      
      setChats(prev => prev.filter(c => c.id !== id));
      if (activeChatId === id) {
        setActiveChatId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setDashboardView('chat');
  };
  // ---------------------------------

  const handleGetStarted = () => {
    if (isLoggedIn) {
      setView('app');
    } else {
      setView('login');
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView('app');
  };

  if (isSigningRoute) return <SigningPortal />;
  if (view === 'landing') return <LandingPage onGetStarted={handleGetStarted} onLoginClick={() => setView('login')} onAboutClick={() => setView('about')} onNavigate={setView} />;
  if (view === 'about') return <AboutUs onBack={() => setView('landing')} onGetStarted={handleGetStarted} onNavigate={setView} />;
  if (view === 'careers') return <Careers onBack={() => setView('landing')} onGetStarted={handleGetStarted} onNavigate={setView} />;
  if (view === 'academy') return <Academy onBack={() => setView('landing')} onGetStarted={handleGetStarted} onNavigate={setView} />;
  if (view === 'blog') return <Blog onBack={() => setView('landing')} onGetStarted={handleGetStarted} onNavigate={setView} />;
  if (view === 'faq') return <FAQ onBack={() => setView('landing')} onGetStarted={handleGetStarted} onNavigate={setView} />;
  if (view === 'privacy') return <PrivacyPolicy onBack={() => setView('landing')} onGetStarted={handleGetStarted} onNavigate={setView} />;
  if (view === 'terms') return <TermsOfService onBack={() => setView('landing')} onGetStarted={handleGetStarted} onNavigate={setView} />;
  if (view === 'refund') return <RefundPolicy onBack={() => setView('landing')} onGetStarted={handleGetStarted} onNavigate={setView} />;
  if (view === 'login') return <Login onLogin={handleLogin} onBack={() => setView('landing')} />;
  if (view === 'update-password') return <Login onLogin={handleLogin} onBack={() => setView('landing')} initialViewMode="update-password" />;

  return (
    <DashboardLayout 
      user={user}
      activeView={dashboardView} 
      onNavigate={setDashboardView}
      chats={chats}
      activeChatId={activeChatId}
      onSelectChat={handleSelectChat}
      onDeleteChat={handleDeleteChat}
      onNewChat={handleNewChat}
      usageCount={usageCount}
    >
      {dashboardView === 'compare' ? (
        <CompareAgreements />
      ) : dashboardView === 'chat' ? (
        <ChatArea 
          user={user}
          chats={chats} 
          setChats={setChats} 
          activeChatId={activeChatId} 
          setActiveChatId={setActiveChatId} 
          usageCount={usageCount}
          setUsageCount={setUsageCount}
        />
      ) : dashboardView === 'files' ? (
        <WorkspaceFiles user={user} />
      ) : dashboardView === 'summary' ? (
        <AgreementSummary />
      ) : dashboardView === 'create' ? (
        <CreateAgreement user={user} onNavigate={setDashboardView} />
      ) : dashboardView === 'settings' ? (
        <Settings user={user} />
      ) : (
        <DashboardOverview usageCount={usageCount} user={user} />
      )}
    </DashboardLayout>
  )
}

export default App
