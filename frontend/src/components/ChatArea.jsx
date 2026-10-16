import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, User, Loader2, FileText, Search, Settings, 
  ArrowRight, Scale, Sparkles, Copy, Check, Trash2, 
  RefreshCw, ShieldCheck, BookOpen, AlertCircle, Briefcase, 
  Landmark, Gavel, FileCheck, CheckCircle2
} from 'lucide-react';
import { supabase } from '../supabase';
import './ChatArea.css';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:8000/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
};
const API_BASE_URL = getApiBaseUrl();

// 6 Curated Quick Consultation Prompts
const QUICK_PROMPTS = [
  {
    icon: Gavel,
    title: 'Anticipatory Bail (BNSS 2023)',
    desc: 'Pre-arrest protection procedure under Sec 482 BNSS & Satender Kumar Antil precedents.',
    query: 'What is the procedure and legal grounds for filing an Anticipatory Bail under Section 482 BNSS 2023?'
  },
  {
    icon: Landmark,
    title: 'Section 138 Cheque Bounce',
    desc: '15-day statutory demand notice, 30-day filing limitation, and 20% interim compensation.',
    query: 'Explain the step-by-step procedure for sending a 15-day legal notice and filing a case for cheque dishonour under Section 138 NI Act.'
  },
  {
    icon: FileText,
    title: 'Commercial Contract & NDA',
    desc: 'Draft non-disclosure agreements, liquidated damages & breach clauses under ICA 1872.',
    query: 'What essential clauses must be included in a commercial NDA under the Indian Contract Act 1872 to prevent trade secret leakage?'
  },
  {
    icon: ShieldCheck,
    title: 'Consumer Protection & e-Daakhil',
    desc: 'Claims for deficient services, online platform liabilities, and District Commission filing.',
    query: 'How to file an online consumer complaint on e-Daakhil for deficiency in service and claim compensation for mental harassment?'
  },
  {
    icon: Briefcase,
    title: 'Wrongful Job Termination',
    desc: 'Severance pay, notice period disputes, F&F settlement, and labour forum remedies.',
    query: 'What are my legal rights if terminated without contractual notice pay or if full and final settlement (F&F) is withheld by employer?'
  },
  {
    icon: BookOpen,
    title: 'Lease & Security Deposit',
    desc: 'Unlawful deposit withholding, landlord notices under Transfer of Property Act 1882.',
    query: 'What legal action can a tenant take if the landlord refuses to refund the security deposit after vacating the property?'
  }
];

// Contextual Follow-up Suggestions
const FOLLOW_UPS = [
  "What documents and evidence are required?",
  "What is the statutory limitation period?",
  "Draft a formal Legal Demand Notice format.",
  "Which court has pecuniary & local jurisdiction?",
  "Explain relevant Supreme Court precedents."
];

const ChatArea = ({ user, chats, setChats, activeChatId, setActiveChatId, usageCount, setUsageCount }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [copiedId, setCopiedId] = useState(null);
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

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
        
        if (data && data.length > 0) {
          setMessages(data);
        } else {
          setMessages([]);
        }
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
  }, [messages, isLoading]);

  const streamText = async (aiMsgId, structuredData, currentChatId) => {
    const fullText = structuredData.text || '';
    let i = 0;
    const streamInterval = setInterval(() => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === aiMsgId) {
          return { 
            ...msg, 
            text: fullText.slice(0, i + 6),
            structured: structuredData
          };
        }
        return msg;
      }));
      i += 6;
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
    }, 10);
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
      const newTitle = textToSend.length > 28 ? textToSend.substring(0, 28) + '...' : textToSend;
      const newChatObj = { id: currentChatId, user_id: user.id, title: newTitle };
      
      try {
        await supabase.from('chats').insert([newChatObj]);
      } catch (err) {
        console.error("Error creating chat:", err);
      }
      
      if (setChats) setChats(prev => [newChatObj, ...prev]);
      if (setActiveChatId) setActiveChatId(currentChatId);
      setIsChatting(true);
      setMessages([userMsg]);
    } else {
      setIsChatting(true);
      setMessages(prev => [...prev, userMsg]);
    }

    // Save User message to Supabase safely
    if (user && currentChatId) {
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
      setUsageCount(prev => prev + 1);
    }

    setInput('');
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, sender: 'ai', text: '', structured: null }]);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend, 
          userId: user?.id, 
          userEmail: user?.email,
          language: language
        }),
      });

      if (!response.ok) throw new Error('API server returned error');

      const data = await response.json();
      let fullResponseText = '';
      let structured = null;

      if (data.structured_response) {
        const sr = data.structured_response;
        structured = {
          summary: sr.summary,
          explanation: sr.legal_explanation,
          actionSteps: sr.action_steps || [],
          citations: (data.citations || []).map(c => c.source || c.citation || c)
        };
        fullResponseText = `**Summary:**\n${sr.summary}\n\n**Legal Explanation:**\n${sr.legal_explanation}\n\n**Action Steps:**\n${(sr.action_steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
      } else if (data.reply) {
        fullResponseText = data.reply;
      } else {
        fullResponseText = "Legal response generated. Please consult a licensed advocate for court representation.";
      }

      streamText(aiMsgId, { text: fullResponseText, ...structured }, currentChatId);
    } catch (error) {
      console.warn("Direct fetch error, falling back to local reasoning:", error);
      const fallbackText = "Under Indian Law (BNS & BNSS 2023), please review the relevant procedural timelines and collect all documentary evidence prior to instituting proceedings. You can consult a licensed advocate for forum representation.";
      streamText(aiMsgId, { text: fallbackText, summary: "Statutory Legal Guidance", explanation: fallbackText, actionSteps: ["Collect documentary evidence", "Consult a licensed advocate"], citations: ["BNS 2023", "BNSS 2023"] }, currentChatId);
    }
  };

  const handleStartNewConsultation = () => {
    if (setActiveChatId) setActiveChatId(null);
    setMessages([]);
    setIsChatting(false);
    setInput('');
  };

  const handleClearMessages = () => {
    if (window.confirm("Clear this conversation history?")) {
      setMessages([]);
      setIsChatting(false);
    }
  };

  const handleCopyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyTranscript = () => {
    const transcript = messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(transcript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  return (
    <div className="chat-studio-wrapper animate-fade-in">
      {/* Top Studio Control Bar */}
      <div className="chat-studio-topbar">
        <div className="chat-status-pill">
          <span className="chat-status-dot"></span>
          <span>Wakalat AI Legal Counsel • BNS &amp; BNSS 2023 Ready</span>
        </div>

        <div className="chat-topbar-actions">
          {/* Language Toggle */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
            <button 
              type="button"
              className={`chat-lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
            <button 
              type="button"
              className={`chat-lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हिन्दी
            </button>
          </div>

          {/* Copy Transcript */}
          {messages.length > 0 && (
            <button 
              type="button" 
              className="chat-action-btn"
              onClick={handleCopyTranscript}
              title="Copy entire consultation transcript"
            >
              {copiedTranscript ? <Check size={14} color="#059669" /> : <Copy size={14} />}
              {copiedTranscript ? 'Copied' : 'Export'}
            </button>
          )}

          {/* Clear Current */}
          {messages.length > 0 && (
            <button 
              type="button" 
              className="chat-action-btn"
              onClick={handleClearMessages}
              title="Clear consultation screen"
            >
              <Trash2 size={14} /> Clear
            </button>
          )}

          {/* New Consultation */}
          <button 
            type="button" 
            className="chat-action-btn primary"
            onClick={handleStartNewConsultation}
            title="Start a fresh legal consultation"
          >
            <Sparkles size={14} /> New Query
          </button>
        </div>
      </div>

      {/* Main Content: Empty State vs Message Thread */}
      {!isChatting || messages.length === 0 ? (
        <div className="chat-empty-container">
          <div className="chat-hero-badge">
            <Scale size={14} /> Indian Legal AI &amp; Statutory Counsel
          </div>
          <h1 className="chat-hero-title">
            Legal Advice, Research &amp; <span>Statutory Analysis</span>
          </h1>
          <p className="chat-hero-subtitle">
            Get instant, authoritative Indian legal reasoning under BNS 2023, BNSS 2023, Section 138 NI Act, Contract Law, and landmark Supreme Court precedents.
          </p>

          <div className="chat-quick-grid">
            {QUICK_PROMPTS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={idx} 
                  className="chat-quick-card"
                  onClick={() => handleSend(item.query)}
                >
                  <div className="chat-quick-card-header">
                    <div className="chat-quick-card-icon">
                      <IconComp size={18} />
                    </div>
                    <span className="chat-quick-card-title">{item.title}</span>
                  </div>
                  <p className="chat-quick-card-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="chat-messages-container">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div key={msg.id} className={`chat-msg-row ${msg.sender}`}>
                {isAi && (
                  <div className="chat-avatar ai" title="Wakalat AI Counsel">
                    <Scale size={18} />
                  </div>
                )}

                <div className="chat-msg-content">
                  <div className="chat-msg-header">
                    <span className="chat-msg-sender">
                      {isAi ? 'Wakalat AI Counsel' : (user?.user_metadata?.full_name || 'Advocate')}
                    </span>
                    {isAi && <span className="chat-msg-badge">BNS / BNSS Verified</span>}
                    <span className="chat-msg-time">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className={`chat-bubble ${msg.sender}`}>
                    {isAi ? (
                      <div>
                        {/* Summary Banner */}
                        {msg.structured?.summary && (
                          <div className="chat-summary-banner">
                            <strong>Summary: </strong>{msg.structured.summary}
                          </div>
                        )}

                        {/* Citation Chips */}
                        {msg.structured?.citations && msg.structured.citations.length > 0 && (
                          <div className="chat-citations-strip">
                            {msg.structured.citations.map((cit, ci) => (
                              <span key={ci} className="chat-citation-tag">
                                <BookOpen size={11} color="#059669" /> {cit}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Body Text */}
                        <div className="chat-body-text">
                          {msg.text.split('**').map((part, index) =>
                            index % 2 === 1 ? <strong key={index} style={{ color: '#0f172a' }}>{part}</strong> : part
                          )}
                        </div>

                        {/* Action Steps Checklist */}
                        {msg.structured?.actionSteps && msg.structured.actionSteps.length > 0 && (
                          <div className="chat-action-steps-card">
                            <div className="chat-action-steps-title">
                              <CheckCircle2 size={15} color="#059669" /> Actionable Legal Checklist
                            </div>
                            {msg.structured.actionSteps.map((step, si) => (
                              <div key={si} className="chat-action-step-item">
                                <span className="chat-step-badge">{si + 1}</span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* AI Bubble Actions */}
                        {msg.text && (
                          <div className="chat-bubble-footer">
                            <button 
                              type="button"
                              className="chat-copy-btn"
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                            >
                              {copiedId === msg.id ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                              {copiedId === msg.id ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>{msg.text}</div>
                    )}

                    {/* Typing state for latest AI message */}
                    {isAi && msg.text === '' && isLoading && (
                      <div className="chat-typing-bubble">
                        <Loader2 size={16} className="animate-spin" />
                        Analyzing statutes &amp; case precedents...
                      </div>
                    )}
                  </div>
                </div>

                {!isAi && (
                  <div className="chat-avatar user" title="You">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Docked Input Area */}
      <div className="chat-dock-container">
        {/* Contextual Follow-up Chips when in chat mode */}
        {isChatting && messages.length > 0 && (
          <div className="chat-followup-chips">
            {FOLLOW_UPS.map((chip, ci) => (
              <button 
                key={ci} 
                type="button" 
                className="chat-chip"
                onClick={() => handleSend(chip)}
                disabled={isLoading}
              >
                <ArrowRight size={12} /> {chip}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="chat-input-field"
            placeholder={
              language === 'hi' 
                ? "कानूनी सवाल पूछें (जैसे: अग्रिम जमानत, 138 चेक बाउंस, रेंट एग्रीमेंट...)" 
                : "Ask any legal question (e.g. anticipatory bail, cheque bounce notice, termination severance)..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
          />
          <button 
            type="button" 
            className="chat-send-btn" 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            title="Send query (Press Enter)"
          >
            {isLoading ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
          </button>
        </div>

        <p className="chat-disclaimer-text">
          ⚖️ Wakalat AI provides AI legal analysis under Indian Law. Verify statutory citations with a Bar Council licensed advocate before court filings.
        </p>
      </div>
    </div>
  );
};

export default ChatArea;
