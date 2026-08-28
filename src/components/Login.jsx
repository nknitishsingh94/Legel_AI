import React, { useState } from 'react';
import { Scale, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

const Login = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      let data, error;
      if (isLoginMode) {
        ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
      } else {
        ({ data, error } = await supabase.auth.signUp({ email, password }));
        if (!error && data.user) {
          // Signup successful, usually Supabase will auto login or require email confirm
          setErrorMsg("Account created! Logging you in...");
        }
      }

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user) {
        onLogin();
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2B2D31' }} className="animate-fade-in">
      <div style={{ display: 'flex', width: '75vw', height: '80vh', maxWidth: '1200px', maxHeight: '800px', minHeight: '600px', background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        {/* Left Pane - Image/Gradient */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #052e16 0%, #065f46 100%)', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRight: '1px solid rgba(0,0,0,0.1)'
      }}>
        {/* Simple decorative elements for the left side */}
        <div style={{ width: '150%', height: '150%', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 60%)', position: 'absolute', top: '-25%', left: '-25%' }}></div>
        <div style={{ color: '#fff', textAlign: 'center', zIndex: 1, padding: '2rem' }}>
           <Scale size={80} color="rgba(255,255,255,0.8)" style={{ marginBottom: '1rem' }} />
           <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Wakalat AI</h1>
           <p style={{ fontSize: '1.25rem', opacity: 0.8 }}>The next generation of legal research.</p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflowY: 'auto', padding: '2rem 0' }}>
        <button onClick={onBack} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 600 }}>
          &larr; Back
        </button>
        
        <div style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="sidebar-logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Scale size={32} color="#111827" />
              <div style={{ fontSize: '1.5rem', color: '#111827', letterSpacing: '0.1em', fontWeight: 800 }}>WAKALAT<span style={{ color: '#a3a3a3', fontWeight: 400 }}>AI</span></div>
            </div>
            <h2 style={{ color: '#111827', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {isLoginMode ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {isLoginMode ? 'Sign in to access your workspace' : 'Sign up to start your free trial'}
            </p>
          </div>

          <button className="login-google-btn" onClick={handleGoogleLogin}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-secondary)' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            <span style={{ padding: '0 1rem', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.95rem', background: '#f8fafc', outline: 'none' }}
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.95rem', background: '#f8fafc', outline: 'none' }}
              />
            </div>

            {errorMsg && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <input type="checkbox" style={{ accentColor: 'var(--accent-main)', width: '16px', height: '16px' }} /> Remember me
              </label>
              {isLoginMode && <a href="#" className="login-forgot-link">Forgot password?</a>}
            </div>

            <button type="submit" className="login-btn-submit" disabled={isLoading} style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoginMode ? 'Sign In' : 'Sign Up'}
            </button>
            
            <p style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginMode(!isLoginMode); setErrorMsg(''); }} style={{ color: 'var(--accent-main)', fontWeight: 600, textDecoration: 'none' }}>
                {isLoginMode ? 'Sign up' : 'Sign in'}
              </a>
            </p>
          </form>

        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
