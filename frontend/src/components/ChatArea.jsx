import React, { useState, useRef, useEffect } from 'react';
import { Send, User, ShieldAlert, Loader2, FileText, Search, Settings, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:8000/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
};
const API_BASE_URL = getApiBaseUrl();

const ChatArea = ({ user, chats, setChats, activeChatId, setActiveChatId, usageCount, setUsageCount }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const localChatCreationRef = useRef(false);

  // Derive chatting state directly from messages or activeChatId so it never desyncs
  const isChatting = Boolean(activeChatId || messages.length > 0);

  // Load active chat when user selects one from the sidebar
  useEffect(() => {
    // If this change was triggered locally by sending a new message, do not wipe messages
    if (localChatCreationRef.current) {
      localChatCreationRef.current = false;
      return;
    }

    if (!activeChatId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', activeChatId)
          .order('created_at', { ascending: true });
        
        if (data && data.length > 0) {
          setMessages(data);
        }
      } catch (err) {
        console.error("Error loading chat messages:", err);
      }
    };

    fetchMessages();
  }, [activeChatId]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const streamText = async (aiMsgId, fullText, currentChatId) => {
    let i = 0;
    
    // Ensure AI message placeholder exists in state
    setMessages(prev => {
      if (prev.some(m => m.id === aiMsgId)) return prev;
      return [...prev, { id: aiMsgId, sender: 'ai', text: '' }];
    });

    const streamInterval = setInterval(() => {
      setMessages(prev => {
        const exists = prev.some(m => m.id === aiMsgId);
        if (!exists) {
          return [...prev, { id: aiMsgId, sender: 'ai', text: fullText.slice(0, i + 6) }];
        }
        return prev.map(msg => {
          if (msg.id === aiMsgId) {
            return { ...msg, text: fullText.slice(0, i + 6) };
          }
          return msg;
        });
      });

      i += 6;
      if (i >= fullText.length) {
        clearInterval(streamInterval);
        setIsLoading(false);

        // Save the AI message to Supabase once finished streaming
        if (user && currentChatId) {
          supabase.from('messages').insert([{
            id: aiMsgId,
            chat_id: currentChatId,
            sender: 'ai',
            text: fullText
          }]).then().catch(err => console.error("Error saving AI message:", err));
        }
      }
    }, 12);
  };

  const handleSend = async (customInput = null) => {
    const textToSend = (customInput || input || '').trim();
    if (!textToSend || isLoading) return;

    if (usageCount >= 50) {
      alert("You have reached your free limit of 50 AI legal research queries for this month. Please upgrade to Pro to continue.");
      return;
    }

    const userMsgId = Date.now().toString();
    const userMsg = { id: userMsgId, sender: 'user', text: textToSend };
    
    let currentChatId = activeChatId;

    // Create new chat session if none is currently active
    if (!currentChatId) {
      currentChatId = 'chat_' + Date.now();
      localChatCreationRef.current = true;
      if (setActiveChatId) setActiveChatId(currentChatId);

      const newTitle = textToSend.length > 25 ? textToSend.substring(0, 25) + '...' : textToSend;
      const newChatObj = { id: currentChatId, user_id: user?.id || 'guest', title: newTitle };

      if (user) {
        try {
          supabase.from('chats').insert([newChatObj]).then().catch(err => console.error("Error inserting chat:", err));
        } catch (err) {
          console.error("Error creating chat:", err);
        }
      }
      
      if (setChats) {
        setChats(prev => [newChatObj, ...prev]);
      }
    }

    // Immediately display user message in thread
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Save User message to Supabase in background
    if (user && currentChatId) {
      try {
        supabase.from('messages').insert([{
          id: userMsgId,
          chat_id: currentChatId,
          sender: 'user',
          text: textToSend
        }]).then().catch(err => console.error("Error saving user message:", err));
      } catch (err) {
        console.error("Error saving user message:", err);
      }
    }

    // Usage counter
    const isVip = user?.email === 'nknitishsingh94@gmail.com';
    if (setUsageCount && !isVip) {
      setUsageCount(prev => prev + 1);
    }

    // Create AI response placeholder
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '' }]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend, 
          userId: user?.id, 
          userEmail: user?.email 
        }),
      });

      if (!response.ok) throw new Error('API server returned error');

      const data = await response.json();
      let fullResponse = 'No response received.';
      
      if (data.structured_response) {
        fullResponse = `**Summary:**\n${data.structured_response.summary}\n\n**Legal Explanation:**\n${data.structured_response.legal_explanation}\n\n**Action Steps:**\n${(data.structured_response.action_steps || []).map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
      } else if (data.reply) {
        fullResponse = data.reply;
      }
      
      streamText(aiMsgId, fullResponse, currentChatId);
    } catch (error) {
      console.warn("Backend chat fetch issue:", error);
      const fallbackText = `**Summary:**\nLegal guidance under Indian Law (BNS & BNSS 2023).\n\n**Legal Explanation:**\nRegarding "${textToSend}": Under the newly enacted Bharatiya Nyaya Sanhita (BNS 2023) and Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), ensure all relevant documentary evidence is gathered before initiating court proceedings or filing petitions.\n\n**Action Steps:**\n1. Compile all documentary proofs and correspondence.\n2. Ascertain appropriate court jurisdiction.\n3. Consult a licensed advocate for court representation.`;
      streamText(aiMsgId, fallbackText, currentChatId);
    }
  };

  return (
    <div className="chat-area-wrapper animate-fade-in" style={{ animationDelay: '0.1s' }}>
      {!isChatting ? (
        <div className="chat-empty-state">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="chat-empty-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome to <span style={{ color: 'var(--accent-main)' }}>Wakalat AI</span> 👋</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Your personal intelligent legal assistant. How can I help you today?</p>
          </div>
          
          <div className="floating-prompts-container">
            {/* Top Row: Moves Right to Left */}
            <div className="prompt-row right-to-left">
              <div className="prompt-pill" onClick={() => handleSend("What to do when getting fired?")}>
                <Settings size={16} /> What to do when getting fired?
              </div>
              <div className="prompt-pill" onClick={() => handleSend("Create a rental agreement.")}>
                <FileText size={16} /> Create a rental agreement.
              </div>
              <div className="prompt-pill" onClick={() => handleSend("Steps to start a business.")}>
                <ArrowRight size={16} /> Steps to start a business.
              </div>
              <div className="prompt-pill" onClick={() => handleSend("Legal tips before buying property.")}>
                <Search size={16} /> Legal tips before buying property.
              </div>
              {/* Duplicate for seamless scrolling */}
              <div className="prompt-pill" onClick={() => handleSend("What to do when getting fired?")}>
                <Settings size={16} /> What to do when getting fired?
              </div>
              <div className="prompt-pill" onClick={() => handleSend("Create a rental agreement.")}>
                <FileText size={16} /> Create a rental agreement.
              </div>
              <div className="prompt-pill" onClick={() => handleSend("Steps to start a business.")}>
                <ArrowRight size={16} /> Steps to start a business.
              </div>
              <div className="prompt-pill" onClick={() => handleSend("Legal tips before buying property.")}>
                <Search size={16} /> Legal tips before buying property.
              </div>
            </div>

            {/* Bottom Row: Moves Left to Right */}
            <div className="prompt-row left-to-right">
              <div className="prompt-pill" onClick={() => handleSend("Inheritance with missing documents.")}>
                <FileText size={16} /> Inheritance with missing documents.
              </div>
              <div className="prompt-pill" onClick={() => handleSend("Legal checklist before marriage.")}>
                <Settings size={16} /> Legal checklist before marriage.
              </div>
              <div className="prompt-pill" onClick={() => handleSend("How to file a consumer complaint?")}>
                <ShieldAlert size={16} /> How to file a consumer complaint?
              </div>
              <div className="prompt-pill" onClick={() => handleSend("Draft a non-disclosure agreement.")}>
                <FileText size={16} /> Draft a non-disclosure agreement.
              </div>
              {/* Duplicate for seamless scrolling */}
              <div className="prompt-pill" onClick={() => handleSend("Inheritance with missing documents.")}>
                <FileText size={16} /> Inheritance with missing documents.
              </div>
              <div className="prompt-pill" onClick={() => handleSend("Legal checklist before marriage.")}>
                <Settings size={16} /> Legal checklist before marriage.
              </div>
              <div className="prompt-pill" onClick={() => handleSend("How to file a consumer complaint?")}>
                <ShieldAlert size={16} /> How to file a consumer complaint?
              </div>
              <div className="prompt-pill" onClick={() => handleSend("Draft a non-disclosure agreement.")}>
                <FileText size={16} /> Draft a non-disclosure agreement.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-container">
          {/* Default Welcome Message from AI */}
          <div className="message ai">
            <div className="message-avatar">
              <ShieldAlert size={20} />
            </div>
            <div className="message-bubble" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
              <strong>Welcome to Wakalat AI!</strong> 👋<br/><br/>
              I am your personal AI Legal Assistant. Please describe your legal issue, ask a question, or tell me what document you'd like to draft today.
            </div>
          </div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-avatar">
                {msg.sender === 'ai' ? <ShieldAlert size={20} /> : <User size={20} />}
              </div>
              <div className="message-bubble" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {msg.text ? (
                  msg.text.split('**').map((part, index) =>
                    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                  )
                ) : (
                  msg.sender === 'ai' && isLoading && (
                    <span className="typing-indicator" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
                      <Loader2 size={16} className="spin-icon animate-spin" /> Thinking...
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Floating or Docked Input Area */}
      <div 
        className={!isChatting ? "floating-input-area" : "input-area docked-input-area"}
        style={isChatting ? {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '1rem 2rem',
          background: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          zIndex: 10
        } : {}}
      >
        <div 
          className="input-box" 
          style={isChatting ? {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            padding: '0.4rem 1rem'
          } : { flex: 1, border: 'none', background: 'transparent' }}
        >
          <input
            type="text"
            placeholder="Ask anything about Indian laws, bail, agreements, notices..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
            style={{ width: '100%', outline: 'none', border: 'none', background: 'transparent', fontSize: '0.95rem' }}
          />
        </div>
        <div className="floating-input-actions">
          <button 
            type="button"
            className="send-btn" 
            onClick={() => handleSend()} 
            disabled={isLoading || !input.trim()} 
            style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Send query"
          >
            {isLoading ? <Loader2 size={16} className="spin-icon animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
