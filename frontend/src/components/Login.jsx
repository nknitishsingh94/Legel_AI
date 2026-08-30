import React, { useState } from 'react';
import { Scale, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

const Login = ({ onLogin, onBack, initialViewMode = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [viewMode, setViewMode] = useState(initialViewMode); // 'login', 'signup', 'forgot', 'update-password'
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    if (viewMode === 'signup' && !fullName) {
      setErrorMsg('Please enter your full name');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let data, error;
      if (viewMode === 'login') {
        ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
      } else {
        ({ data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        }));
      }

      if (error) {
        setErrorMsg(error.message);
      } else if (data.user && !data.session && viewMode === 'signup') {
        setSuccessMsg("Account created! Please check your email for the confirmation link.");
      } else if (data.user) {
        onLogin();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(`Unexpected Error: ${err.message || 'Check console'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Password reset link sent! Check your email.');
      }
    } catch (err) {
      setErrorMsg(`Unexpected Error: ${err.message || 'Check console'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Please enter a new password');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Password updated successfully! Logging you in...');
        setTimeout(() => {
          onLogin();
        }, 1500);
      }
    } catch (err) {
      setErrorMsg(`Unexpected Error: ${err.message || 'Check console'}`);
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
      <div className="login-box" style={{ display: 'flex', width: '75vw', height: '80vh', maxWidth: '1200px', maxHeight: '800px', minHeight: '600px', background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        {/* Left Pane - Image/Gradient */}
      <div className="hide-on-mobile" style={{ 
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
      <div className="login-form-pane" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflowY: 'auto', padding: '2rem 0' }}>
        <button onClick={onBack} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 600 }}>
          &larr; Back
        </button>
        
        <div className="login-form-inner" style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="sidebar-logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Scale size={32} color="#111827" />
              <div style={{ fontSize: '1.5rem', color: '#111827', letterSpacing: '0.1em', fontWeight: 800 }}>WAKALAT<span style={{ color: '#a3a3a3', fontWeight: 400 }}>AI</span></div>
            </div>
            <h2 style={{ color: '#111827', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {viewMode === 'login' ? 'Welcome Back' : viewMode === 'signup' ? 'Create Account' : viewMode === 'update-password' ? 'Set New Password' : 'Reset Password'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {viewMode === 'login' ? 'Sign in to access your workspace' : viewMode === 'signup' ? 'Sign up to start your free trial' : viewMode === 'update-password' ? 'Enter your new password below' : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {viewMode !== 'forgot' && viewMode !== 'update-password' && (
            <>
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
            </>
          )}

          <form onSubmit={viewMode === 'forgot' ? handleResetPassword : viewMode === 'update-password' ? handleUpdatePassword : handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {viewMode === 'signup' && (
              <div>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.95rem', background: '#f8fafc', outline: 'none' }}
                />
              </div>
            )}
            
            {viewMode !== 'update-password' && (
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
            )}
            
            {viewMode !== 'forgot' && (
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
            )}

            {errorMsg && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center', padding: '0.5rem', background: '#fef2f2', borderRadius: '6px' }}>
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ color: '#10b981', fontSize: '0.875rem', textAlign: 'center', padding: '0.5rem', background: '#ecfdf5', borderRadius: '6px' }}>
                {successMsg}
              </div>
            )}

            {viewMode === 'login' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--accent-main)', width: '16px', height: '16px' }} /> Remember me
                </label>
                <a href="#" className="login-forgot-link" onClick={(e) => { e.preventDefault(); setViewMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}>
                  Forgot password?
                </a>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
              style={{ padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isLoading ? <Loader2 className="spinner" size={20} /> : viewMode === 'login' ? 'Sign In' : viewMode === 'signup' ? 'Create Account' : viewMode === 'update-password' ? 'Update Password' : 'Send Reset Link'}
            </button>
            
            {viewMode === 'forgot' ? (
              <p style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); setViewMode('login'); setErrorMsg(''); setSuccessMsg(''); }} style={{ color: 'var(--accent-main)', fontWeight: 600, textDecoration: 'none' }}>
                  &larr; Back to sign in
                </a>
              </p>
            ) : (
              <p style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                {viewMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <a href="#" onClick={(e) => { e.preventDefault(); setViewMode(viewMode === 'login' ? 'signup' : 'login'); setErrorMsg(''); setSuccessMsg(''); }} style={{ color: 'var(--accent-main)', fontWeight: 600, textDecoration: 'none' }}>
                  {viewMode === 'login' ? 'Sign up' : 'Sign in'}
                </a>
              </p>
            )}
          </form>

        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
