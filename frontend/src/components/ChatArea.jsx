import React, { useState, useRef, useEffect } from 'react';
import { Send, User, ShieldAlert, Loader2, FileText, Search, Settings, ArrowRight } from 'lucide-react';
import { supabase } from '../supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const ChatArea = ({ user, chats, setChats, activeChatId, setActiveChatId, usageCount, setUsageCount }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef(null);

  // Load active chat when it changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeChatId) {
        setIsChatting(true);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', activeChatId)
          .order('created_at', { ascending: true });
        
        if (data) setMessages(data);
      } else {
        setMessages([]);
        setIsChatting(false);
      }
    };
    fetchMessages();
  }, [activeChatId]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const streamText = async (aiMsgId, fullText, currentChatId) => {
    let i = 0;
    const streamInterval = setInterval(() => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === aiMsgId) {
          return { ...msg, text: fullText.slice(0, i + 4) };
        }
        return msg;
      }));
      i += 4;
      if (i >= fullText.length) {
        clearInterval(streamInterval);
        setIsLoading(false);
        // Save the AI message to Supabase once finished streaming
        if (user) {
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
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    if (usageCount >= 50) {
      alert("You have reached your free limit of 50 AI legal research queries for this month. Please upgrade to Pro to continue.");
      return;
    }

    const userMsgId = Date.now().toString();
    const userMsg = { id: userMsgId, sender: 'user', text: textToSend };
    
    let currentChatId = activeChatId;

    // Create new chat if none is active
    if (!currentChatId && user) {
      currentChatId = Date.now().toString();
      const newTitle = textToSend.length > 25 ? textToSend.substring(0, 25) + '...' : textToSend;
      
      const newChatObj = { id: currentChatId, user_id: user.id, title: newTitle };
      
      // Save chat to Supabase safely
      try {
        await supabase.from('chats').insert([newChatObj]);
      } catch (err) {
        console.error("Error creating chat:", err);
      }
      
      setChats(prev => [newChatObj, ...prev]);
      setActiveChatId(currentChatId);
      setIsChatting(true);
      setMessages([userMsg]);
    } else {
      setMessages(prev => [...prev, userMsg]);
    }

    // Save User message to Supabase safely
    if (user) {
      try {
        await supabase.from('messages').insert([{
          id: userMsgId,
          chat_id: currentChatId,
          sender: 'user',
          text: textToSend
        }]);
      } catch (err) {
        console.error("Error saving user message:", err);
      }
    }

    const isVip = user?.email === 'nknitishsingh94@gmail.com';

    if (setUsageCount && !isVip) {
      setUsageCount(prev => {
        const newCount = prev + 1;
        if (newCount === 45) {
          // Wrap in timeout so it doesn't block the UI update immediately
          setTimeout(() => {
            alert("⚠️ Warning: You have used 45 queries. Only 5 left in your free plan. Please consider upgrading to Pro to avoid interruption.");
          }, 500);
        }
        return newCount;
      });
    }

    setInput('');
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '' }]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, userId: user?.id, userEmail: user?.email }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      let fullResponse = 'No response received.';
      
      if (data.structured_response) {
        fullResponse = `**Summary:**\n${data.structured_response.summary}\n\n**Legal Explanation:**\n${data.structured_response.legal_explanation}\n\n**Action Steps:**\n${data.structured_response.action_steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
      } else if (data.reply) {
        fullResponse = data.reply;
      }
      
      streamText(aiMsgId, fullResponse, currentChatId);
    } catch (error) {
      const errorText = 'Sorry, I could not connect to the server right now. Please make sure the backend is running on port 8000 and try again.';
      streamText(aiMsgId, errorText, currentChatId);
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
            {/* Top Row: Moves Right to Left (Anti-Clockwise relative) */}
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

            {/* Bottom Row: Moves Left to Right (Clockwise relative) */}
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
                {msg.text.split('**').map((part, index) =>
                  index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                )}
                {msg.sender === 'ai' && msg.text === '' && isLoading && (
                  <span className="typing-indicator">
                    <Loader2 size={16} className="spin-icon" /> Thinking...
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Floating or Docked Input Area */}
      <div className={!isChatting ? "floating-input-area" : "input-area docked-input-area"}>
        <div className="input-box" style={{ flex: 1, border: 'none', background: 'transparent' }}>
          <input
            type="text"
            placeholder="Ask anything"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            style={{ width: '100%' }}
          />
        </div>
        <div className="floating-input-actions">
          <span style={{ fontSize: '12px', color: '#9ca3af', marginRight: '8px' }}>Ctrl+Y</span>
          <button className="send-btn" onClick={() => handleSend()} disabled={isLoading} style={{ width: '36px', height: '36px', borderRadius: '50%' }}>
            {isLoading ? <Loader2 size={16} className="spin-icon" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
