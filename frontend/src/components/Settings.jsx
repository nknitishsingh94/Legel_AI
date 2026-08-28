import React, { useState } from 'react';
import { User, CreditCard, Shield, Lock, CheckCircle } from 'lucide-react';
import './Settings.css';

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile'); // profile, billing, security, privacy

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

            <div className="placeholder-card">
              <Lock size={32} className="text-gray-400" />
              <h3>Data Management</h3>
              <p>Download or delete your account data permanently.</p>
              <button className="btn-danger" style={{ marginTop: '16px' }}>Delete Account</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
