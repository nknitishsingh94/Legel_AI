import React, { useState } from 'react';
import { supabase } from '../supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const FeedbackModal = ({ isOpen, onClose, user }) => {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit feedback.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const { error: submitError } = await supabase.from('feedbacks').insert([{
        user_id: user.id,
        name: name,
        role: user?.user_metadata?.full_name ? 'User' : 'Advocate', // simplified role logic
        text: text,
        rating: rating
      }]);

      if (submitError) throw submitError;

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.text) {
        setText(data.text);
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
      setError("Failed to generate AI feedback. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="animate-fade-in" style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ background: '#d1fae5', color: '#059669', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>Thank You!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Submit Feedback</h2>
              <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star} 
                      onClick={() => setRating(star)}
                      width="32" height="32" viewBox="0 0 24 24" 
                      fill={star <= rating ? "#FFC107" : "none"} 
                      stroke={star <= rating ? "#FFC107" : "#d1d5db"} 
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ cursor: 'pointer' }}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Your Name / Firm</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Adv. Rajesh Kumar" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1rem', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', margin: 0 }}>Your Feedback</label>
                  <button 
                    type="button" 
                    onClick={handleAIGenerate} 
                    disabled={isGenerating}
                    style={{ background: 'var(--accent-main)', color: '#fff', border: 'none', borderRadius: '20px', padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: isGenerating ? 0.7 : 1 }}
                  >
                    {isGenerating ? 'Generating...' : '✨ AI Support'}
                  </button>
                </div>
                <textarea 
                  required 
                  rows="4" 
                  placeholder="How has Wakalat AI helped your practice?" 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }}
                ></textarea>
              </div>

              {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

              <button type="submit" disabled={isSubmitting} style={{ width: '100%', background: 'var(--accent-main)', color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
