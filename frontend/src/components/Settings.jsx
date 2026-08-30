import React, { useState } from 'react';
import { User, CreditCard, Shield, Lock, CheckCircle, AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';
import './Settings.css';

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteStep, setDeleteStep] = useState('');

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    if (!user) return;

    setIsDeleting(true);
    setDeleteError('');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

    try {
      // Step 1: Call backend to delete all data + auth user permanently
      setDeleteStep('Deleting your account and all data...');
      
      const response = await fetch(`${API_BASE_URL}/account/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to delete account');
      }

      // Step 2: Sign out locally
      setDeleteStep('Signing you out...');
      await supabase.auth.signOut();

      // Reload the page to reset all state
      window.location.reload();

    } catch (error) {
      console.error('Delete account error:', error);
      setDeleteError(error.message || 'Something went wrong while deleting your account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="settings-container animate-fade-in">
      <div className="settings-sidebar">
        <h2 className="settings-title">Settings</h2>
        <nav className="settings-nav">
          <button 
            className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile</span>
          </button>
          <button 
            className={`settings-nav-item ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            <CreditCard size={18} />
            <span>Billing</span>
          </button>
          <button 
            className={`settings-nav-item ${activeTab === 'security_privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('security_privacy')}
          >
            <Shield size={18} />
            <span>Security & Privacy</span>
          </button>
        </nav>
      </div>

      <div className="settings-content">
        {activeTab === 'profile' && (
          <div className="settings-section animate-fade-in">
            <div className="section-header">
              <h2>Profile Information</h2>
              <p>Update your account details and public profile.</p>
            </div>
            
            <div className="profile-form">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                  <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Advocate')}&background=0d9488&color=fff&size=128`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Profile Photo</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>Upload New</button>
                    <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px', color: '#ef4444', borderColor: '#fca5a5', background: '#fef2f2' }}>Remove</button>
                  </div>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" defaultValue={user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Advocate'} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" defaultValue={user?.email || ''} readOnly />
              </div>
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" className="form-control" defaultValue="+91 98765 43210" />
              </div>

              <div className="form-group">
                <label>Role / Job Title</label>
                <input type="text" className="form-control" defaultValue="Senior Advocate" />
              </div>

              <div className="form-group">
                <label>Bar Council Enrollment Number</label>
                <input type="text" className="form-control" defaultValue="D/1234/2015" />
              </div>

              <div className="account-status">
                <CheckCircle size={20} color="#10b981" />
                <div>
                  <h4>Account Verified</h4>
                  <p>Your identity and legal credentials have been verified successfully. No fraud detected.</p>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="settings-section animate-fade-in">
            <div className="section-header">
              <h2>Billing & Subscription</h2>
              <p>Manage your billing information and view invoices.</p>
            </div>
            <div className="placeholder-card">
              <CreditCard size={32} className="text-gray-400" />
              <h3>Current Plan: Free</h3>
              <p>You are currently on the Free plan. Upgrade to Pro for unlimited AI legal analysis.</p>
              <button className="btn-primary" style={{ marginTop: '16px' }}>Upgrade to Pro</button>
            </div>
          </div>
        )}

        {activeTab === 'security_privacy' && (
          <div className="settings-section animate-fade-in">
            <div className="section-header">
              <h2>Security & Privacy</h2>
              <p>Update your password, secure your account, and manage data sharing preferences.</p>
            </div>
            
            <div className="placeholder-card" style={{ marginBottom: '24px' }}>
              <Shield size={32} className="text-gray-400" />
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account.</p>
              <button className="btn-secondary" style={{ marginTop: '16px' }}>Enable 2FA</button>
            </div>

            <div className="delete-account-card">
              <div className="delete-account-header">
                <Trash2 size={24} color="#ef4444" />
                <div>
                  <h3>Delete Account Permanently</h3>
                  <p>Once you delete your account, all your data including chats, documents, and agreements will be permanently removed. This action cannot be undone.</p>
                </div>
              </div>
              <button className="btn-danger" onClick={() => setShowDeleteModal(true)}>
                <Trash2 size={16} />
                Delete Account Permanently
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay" onClick={() => !isDeleting && setShowDeleteModal(false)}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <AlertTriangle size={48} color="#ef4444" />
            </div>
            <h2>Are you sure?</h2>
            <p className="delete-modal-desc">
              This will <strong>permanently delete</strong> your account and all associated data:
            </p>
            <ul className="delete-data-list">
              <li>🗨️ All your chat conversations & messages</li>
              <li>📄 All uploaded documents & agreements</li>
              <li>⚙️ All your settings & preferences</li>
              <li>👤 Your account & login credentials</li>
            </ul>
            <p className="delete-modal-warning">
              ⚠️ This action is <strong>irreversible</strong>. You will NOT be able to recover your data.
            </p>
            <div className="delete-confirm-input">
              <label>Type <strong>DELETE</strong> to confirm:</label>
              <input 
                type="text" 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE here"
                disabled={isDeleting}
                autoFocus
              />
            </div>
            {deleteError && (
              <p className="delete-error">{deleteError}</p>
            )}
            {isDeleting && deleteStep && (
              <p className="delete-step-status">
                <Loader2 size={14} className="spin-icon" /> {deleteStep}
              </p>
            )}
            <div className="delete-modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); setDeleteError(''); }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn-danger-solid"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || isDeleting}
              >
                {isDeleting ? (
                  <><Loader2 size={16} className="spin-icon" /> Deleting...</>
                ) : (
                  <><Trash2 size={16} /> Delete Everything</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
