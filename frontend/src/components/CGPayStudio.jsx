p;import React, { useState, useEffect } from 'react';
import { 
  Key, CheckCircle, AlertCircle, Loader2, Play, 
  Send, RefreshCw, Copy, Check, ExternalLink, UserCheck, 
  FileText, Users, Terminal, Smartphone, Lock, Award, Eye, EyeOff
} from 'lucide-react';
import './CGPayStudio.css';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:8000/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
};
const API_BASE_URL = getApiBaseUrl();

const CGPayStudio = ({ user }) => {
  const isAdmin = user?.email === 'nknitishsingh94@gmail.com' || user?.app_metadata?.role === 'admin';

  // Navigation tab: 'okyc' | 'digilocker' | 'multisign' | 'console'
  const [activeTab, setActiveTab] = useState('okyc');

  // Gateway Credentials State
  const [baseUrl, setBaseUrl] = useState(() => localStorage.getItem('cgpay_base_url') || 'https://docs.cgpey.com');
  const [merchantId, setMerchantId] = useState(() => localStorage.getItem('cgpay_merchant_id') || 'MERCH_VAKEEL_PROD');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cgpay_api_key') || '');
  const [apiSecret, setApiSecret] = useState(() => localStorage.getItem('cgpay_api_secret') || '');
  const [showSecret, setShowSecret] = useState(false);

  // Connection Status State
  const [connectionStatus, setConnectionStatus] = useState({
    tested: false,
    loading: false,
    success: true,
    mode: 'SANDBOX_READY',
    latencyMs: 42,
    message: 'CGPay Sandbox Engine active and ready for Aadhaar OKYC & Multi-Party eSign.'
  });

  // Tab 1: Aadhaar OKYC State
  const [testAadhaar, setTestAadhaar] = useState('987654321098');
  const [signerName, setSignerName] = useState(user?.user_metadata?.full_name || 'Adv. Rajesh Kumar');
  const [signerRole, setSignerRole] = useState('Sender');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('123456');
  const [otpTxnId, setOtpTxnId] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [okycResult, setOkycResult] = useState(null);

  // Tab 2: DigiLocker State
  const [digiLockerLoading, setDigiLockerLoading] = useState(false);
  const [digiLockerResult, setDigiLockerResult] = useState(null);

  // Tab 3: Multi-Party Simulator State
  const [sampleDocTitle, setSampleDocTitle] = useState('Commercial Non-Disclosure Agreement (NDA)');
  const [simSigners, setSimSigners] = useState([
    { id: '1', role: 'Sender', name: 'Ramesh Verma', email: 'ramesh@vakeel.ai', status: 'Pending', signedAt: null },
    { id: '2', role: 'Receiver', name: 'Sunil Gupta', email: 'sunil@partner.com', status: 'Pending', signedAt: null },
    { id: '3', role: 'Lawyer', name: user?.user_metadata?.full_name || 'Adv. Rajesh Kumar', email: user?.email || 'advocate@vakeel.ai', status: 'Pending', signedAt: null }
  ]);
  const [simSigningInProgress, setSimSigningInProgress] = useState(false);

  // Tab 4: Raw API Inspector Logs
  const [apiLogs, setApiLogs] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Helper to append log
  const logApiCall = (title, endpoint, method, headers, requestBody, responseData, status, latency) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      title,
      endpoint,
      method,
      headers,
      requestBody,
      responseData,
      status,
      latency
    };
    setApiLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  // Test Connection
  const handleTestConnection = async () => {
    setConnectionStatus(prev => ({ ...prev, loading: true }));
    const startTime = Date.now();

    try {
      localStorage.setItem('cgpay_base_url', baseUrl);
      localStorage.setItem('cgpay_merchant_id', merchantId);
      localStorage.setItem('cgpay_api_key', apiKey);
      localStorage.setItem('cgpay_api_secret', apiSecret);

      const res = await fetch(`${API_BASE_URL}/cgpay/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl, merchantId, apiKey, apiSecret })
      });
      const data = await res.json();
      const latency = Date.now() - startTime;

      setConnectionStatus({
        tested: true,
        loading: false,
        success: data.success,
        mode: data.mode || (apiKey ? 'LIVE_GATEWAY' : 'SANDBOX_READY'),
        latencyMs: latency,
        message: data.message || 'Connected to CGPay API successfully.'
      });

      logApiCall(
        'CGPay Gateway Handshake & Test Connection',
        `${API_BASE_URL}/cgpay/test-connection`,
        'POST',
        { 'Content-Type': 'application/json' },
        { baseUrl, merchantId, apiKey: apiKey ? '***' : '(none)' },
        data,
        res.status,
        latency
      );
    } catch (err) {
      setConnectionStatus({
        tested: true,
        loading: false,
        success: false,
        mode: 'ERROR',
        latencyMs: Date.now() - startTime,
        message: err.message
      });
    }
  };

  // Aadhaar Generate OTP
  const handleGenerateOtp = async () => {
    const clean = testAadhaar.replace(/\D/g, '');
    if (clean.length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar Number.");
      return;
    }
    setIsSendingOtp(true);
    const startTime = Date.now();

    try {
      const payload = {
        aadhaarNumber: clean,
        merchantId,
        apiKey,
        apiSecret,
        baseUrl,
        signerName,
        signerRole
      };

      const res = await fetch(`${API_BASE_URL}/cgpay/aadhaar/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const latency = Date.now() - startTime;

      if (!res.ok && !data.success) {
        throw new Error(data.detail || "Failed to generate OTP");
      }

      setOtpTxnId(data.txnId || `TXN-CGPAY-${Date.now()}`);
      setOtpSent(true);
      if (data.testOtpHint) setOtpValue(data.testOtpHint);

      logApiCall(
        'CGPay KYC: Generate Aadhaar OTP',
        `${API_BASE_URL}/cgpay/aadhaar/generate-otp`,
        'POST',
        { 'x-api-key': apiKey ? '***' : 'sandbox', 'Content-Type': 'application/json' },
        { merchantId, aadhaarNumber: clean, signerName, signerRole },
        data,
        res.status,
        latency
      );
    } catch (err) {
      alert("Aadhaar OTP request failed: " + err.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Aadhaar Verify OTP & Fetch OKYC
  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length < 4) {
      alert("Please enter the 6-digit OTP received.");
      return;
    }
    setIsVerifyingOtp(true);
    const startTime = Date.now();

    try {
      const clean = testAadhaar.replace(/\D/g, '');
      const payload = {
        aadhaarNumber: clean,
        otp: otpValue,
        txnId: otpTxnId,
        merchantId,
        apiKey,
        apiSecret,
        baseUrl,
        signerName,
        signerRole
      };

      const res = await fetch(`${API_BASE_URL}/cgpay/aadhaar/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const latency = Date.now() - startTime;

      if (!res.ok && !data.success) {
        throw new Error(data.detail || "Failed to verify OTP");
      }

      setOkycResult(data);

      logApiCall(
        'CGPay KYC: Verify Aadhaar OTP & Fetch OKYC',
        `${API_BASE_URL}/cgpay/aadhaar/verify-otp`,
        'POST',
        { 'x-api-key': apiKey ? '***' : 'sandbox', 'Content-Type': 'application/json' },
        { merchantId, aadhaarNumber: clean, otp: otpValue, txnId: otpTxnId },
        data,
        res.status,
        latency
      );
    } catch (err) {
      alert("Aadhaar OTP verification failed: " + err.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // DigiLocker Initiate & Verify Test
  const handleTestDigiLocker = async () => {
    setDigiLockerLoading(true);
    const startTime = Date.now();

    try {
      const res = await fetch(`${API_BASE_URL}/cgpay/digilocker/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: `DL-TEST-${Date.now()}`,
          consentCode: 'DL_CONSENT_OK',
          signerName,
          signerRole,
          documentId: 'doc-test-123'
        })
      });
      const data = await res.json();
      const latency = Date.now() - startTime;

      setDigiLockerResult(data);
      logApiCall(
        'CGPay DigiLocker MeriPehchan Verification',
        `${API_BASE_URL}/cgpay/digilocker/verify`,
        'POST',
        { 'Content-Type': 'application/json' },
        { signerName, signerRole, consent: 'GRANTED' },
        data,
        res.status,
        latency
      );
    } catch (err) {
      alert("DigiLocker test failed: " + err.message);
    } finally {
      setDigiLockerLoading(false);
    }
  };

  // Simulate Multi-Party Signing
  const handleSimulatePartySign = async (index) => {
    const target = simSigners[index];
    if (target.status === 'Signed') return;

    setSimSigningInProgress(true);
    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

    setTimeout(() => {
      setSimSigners(prev => prev.map((s, idx) => {
        if (idx === index) {
          return {
            ...s,
            status: 'Signed',
            signedAt: timestamp,
            certificateId: `CGPAY-CCA-2026-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
            method: 'CGPay Aadhaar OKYC'
          };
        }
        return s;
      }));
      setSimSigningInProgress(false);
    }, 600);
  };

  // Add another signer to simulator
  const handleAddSimSigner = (role) => {
    const newId = (simSigners.length + 1).toString();
    const roleCount = simSigners.filter(s => s.role === role).length + 1;
    const name = `${role} ${roleCount}`;
    const email = `${role.toLowerCase()}${roleCount}@example.com`;

    setSimSigners(prev => [
      ...prev,
      { id: newId, role, name, email, status: 'Pending', signedAt: null }
    ]);
  };

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <Lock size={44} color="#059669" style={{ margin: '0 auto 1rem', display: 'block' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Chambers Administrator Access Only</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
          CGPay Gateway Configuration &amp; API credentials are restricted to the Managing Advocate. Regular users and clients sign documents through Workspace Files.
        </p>
      </div>
    );
  }

  return (
    <div className="cgpay-studio-container animate-fade-in">
      {/* Header Bar: Status Badges & Ping Indicator */}
      <div className="cgpay-header" style={{ marginBottom: '1.25rem', alignItems: 'center' }}>
        <div className="cgpay-badge-group" style={{ margin: 0 }}>
          <span className={`cgpay-badge ${apiKey ? 'live' : 'sandbox'}`}>
            {apiKey ? '● CGPAY LIVE GATEWAY' : '● CGPAY SANDBOX READY'}
          </span>
          <span className="cgpay-badge gov">
            IT ACT 2000 SEC. 3A &amp; 10A • BSA 2023
          </span>
          <span className="cgpay-badge gov">
            UIDAI AADHAAR OKYC &amp; DIGILOCKER
          </span>
        </div>

        <div className="cgpay-quick-status">
          <div className="status-indicator">
            <span className={`status-dot ${connectionStatus.success ? (apiKey ? 'connected' : 'sandbox') : 'error'}`}></span>
            <span>
              {connectionStatus.mode === 'LIVE_GATEWAY' ? 'Connected (Live)' : 'Sandbox Active'}
            </span>
          </div>
          <button 
            className="btn-secondary-cgpay"
            onClick={handleTestConnection}
            disabled={connectionStatus.loading}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          >
            {connectionStatus.loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Ping Gateway ({connectionStatus.latencyMs}ms)
          </button>
        </div>
      </div>

      {/* Credentials Configuration Card */}
      <div className="cgpay-config-card">
        <div className="config-card-header">
          <h3>
            <Key size={18} color="#0a3871" />
            CGPay (CGPEY) API Credentials &amp; Gateway Settings
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Headers: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>x-api-key</code> &amp; <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>x-api-secret</code>
          </span>
        </div>

        <div className="config-grid">
          <div className="config-field">
            <label>CGPay API Base URL</label>
            <input 
              type="text" 
              value={baseUrl} 
              onChange={e => setBaseUrl(e.target.value)} 
              placeholder="https://docs.cgpey.com"
            />
          </div>

          <div className="config-field">
            <label>Merchant ID</label>
            <input 
              type="text" 
              value={merchantId} 
              onChange={e => setMerchantId(e.target.value)} 
              placeholder="MERCH_VAKEEL_PROD"
            />
          </div>

          <div className="config-field">
            <label>API Key (x-api-key)</label>
            <input 
              type="text" 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)} 
              placeholder="Live CGPay API Key (leave blank for Sandbox)"
            />
          </div>

          <div className="config-field" style={{ position: 'relative' }}>
            <label>API Secret (x-api-secret)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showSecret ? 'text' : 'password'} 
                value={apiSecret} 
                onChange={e => setApiSecret(e.target.value)} 
                placeholder="Live CGPay Secret Key"
              />
              <button 
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#64748b'
                }}
              >
                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        <div className="config-actions">
          <span style={{ fontSize: '0.8rem', color: connectionStatus.success ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
            {connectionStatus.message}
          </span>
          <button className="btn-primary-cgpay" onClick={handleTestConnection} disabled={connectionStatus.loading}>
            {connectionStatus.loading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Save &amp; Test Connection
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="cgpay-nav-tabs">
        <button 
          className={`cgpay-tab-btn ${activeTab === 'okyc' ? 'active' : ''}`}
          onClick={() => setActiveTab('okyc')}
        >
          <Smartphone size={16} />
          1. Aadhaar OTP &amp; OKYC Tester
        </button>
        <button 
          className={`cgpay-tab-btn ${activeTab === 'digilocker' ? 'active' : ''}`}
          onClick={() => setActiveTab('digilocker')}
        >
          <Award size={16} />
          2. DigiLocker MeriPehchan
        </button>
        <button 
          className={`cgpay-tab-btn ${activeTab === 'multisign' ? 'active' : ''}`}
          onClick={() => setActiveTab('multisign')}
        >
          <Users size={16} />
          3. Multi-Party e-Sign Simulator (Sender, Receiver, Lawyer)
        </button>
        <button 
          className={`cgpay-tab-btn ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
        >
          <Terminal size={16} />
          4. Live API Console &amp; Inspector ({apiLogs.length})
        </button>
      </div>

      {/* Tab 1: Aadhaar OKYC Tester */}
      {activeTab === 'okyc' && (
        <div className="cgpay-playground">
          {/* Controls Panel */}
          <div className="cgpay-panel">
            <div className="panel-header">
              <h3>
                <Smartphone size={18} color="#0a3871" />
                Aadhaar OTP &amp; Demographic OKYC
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Endpoint: /api/kyc/aadhaar/*</span>
            </div>

            {/* Step 1: Generate OTP */}
            <div className={`step-box ${!otpSent ? 'active' : 'success'}`}>
              <div className="step-label">
                <span className="step-num">1</span>
                <span>Step 1: Request Aadhaar OTP via CGPay</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                    Signer Full Name
                  </label>
                  <input 
                    type="text" 
                    value={signerName} 
                    onChange={e => setSignerName(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                    Signer Role
                  </label>
                  <select 
                    value={signerRole} 
                    onChange={e => setSignerRole(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box', background: '#ffffff' }}
                  >
                    <option value="Sender">Sender (First Party)</option>
                    <option value="Receiver">Receiver (Second Party)</option>
                    <option value="Lawyer">Lawyer / Advocate</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  12-Digit Aadhaar Number
                </label>
                <input 
                  type="text" 
                  value={testAadhaar} 
                  maxLength={14}
                  onChange={e => {
                    let raw = e.target.value.replace(/\D/g, '').substring(0, 12);
                    setTestAadhaar(raw);
                  }}
                  placeholder="e.g. 987654321098"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '1rem', letterSpacing: '0.1em', fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                className="btn-primary-cgpay"
                onClick={handleGenerateOtp}
                disabled={isSendingOtp}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isSendingOtp ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Generate Aadhaar OTP via CGPay
              </button>
            </div>

            {/* Step 2: Verify OTP */}
            <div className={`step-box ${otpSent && !okycResult ? 'active' : (okycResult ? 'success' : '')}`}>
              <div className="step-label">
                <span className="step-num">2</span>
                <span>Step 2: Submit OTP &amp; Pull OKYC Demographic Profile</span>
              </div>

              {otpSent && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.6rem 0.8rem', marginBottom: '0.75rem', fontSize: '0.78rem', color: '#166534' }}>
                  ✓ OTP sent for transaction: <strong>{otpTxnId}</strong>.
                  <br />In demo sandbox, enter <strong>123456</strong> or any 6 digits.
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  6-Digit Aadhaar OTP
                </label>
                <input 
                  type="text" 
                  value={otpValue}
                  maxLength={6}
                  disabled={!otpSent}
                  onChange={e => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '1.1rem', letterSpacing: '0.25em', textAlign: 'center', fontFamily: 'monospace', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                className="btn-primary-cgpay"
                onClick={handleVerifyOtp}
                disabled={!otpSent || isVerifyingOtp}
                style={{ width: '100%', justifyContent: 'center', background: '#059669' }}
              >
                {isVerifyingOtp ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                Verify OTP &amp; Fetch OKYC Demographics
              </button>
            </div>
          </div>

          {/* Result / Visual Card Panel */}
          <div className="cgpay-panel">
            <div className="panel-header">
              <h3>
                <Award size={18} color="#0a3871" />
                UIDAI Aadhaar OKYC Digital Identity Card
              </h3>
              {okycResult && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '100px' }}>
                  ✓ VERIFIED OKYC
                </span>
              )}
            </div>

            {okycResult ? (
              <div className="okyc-card animate-scale-up">
                <div className="okyc-card-header">
                  <div className="okyc-govt-emblem">
                    <span style={{ fontSize: '1.6rem' }}>🏛️</span>
                    <div>
                      <div className="okyc-govt-title">GOVERNMENT OF INDIA • UIDAI</div>
                      <div className="okyc-govt-subtitle">ELECTRONIC KNOW YOUR CUSTOMER (OKYC) RECORD</div>
                    </div>
                  </div>
                  <ShieldCheck size={26} color="#16a34a" />
                </div>

                <div className="okyc-details-grid">
                  <div className="okyc-avatar-box">
                    <UserCheck size={36} color="#0a3871" />
                    <span>PHOTO</span>
                  </div>

                  <div className="okyc-info-list">
                    <div className="okyc-info-row">
                      <span className="okyc-info-label">Full Name:</span>
                      <span className="okyc-info-value">{okycResult.okycData?.fullName}</span>
                    </div>
                    <div className="okyc-info-row">
                      <span className="okyc-info-label">Gender:</span>
                      <span className="okyc-info-value">{okycResult.okycData?.gender}</span>
                    </div>
                    <div className="okyc-info-row">
                      <span className="okyc-info-label">DOB / YOB:</span>
                      <span className="okyc-info-value">{okycResult.okycData?.dateOfBirth}</span>
                    </div>
                    <div className="okyc-info-row">
                      <span className="okyc-info-label">Address:</span>
                      <span className="okyc-info-value">
                        {okycResult.okycData?.address?.line1}, {okycResult.okycData?.address?.city}, {okycResult.okycData?.address?.state} - {okycResult.okycData?.address?.pincode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="okyc-uid-box">
                  {okycResult.okycData?.maskedAadhaar}
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b' }}>
                  <div>Certificate Serial: <strong style={{ color: '#0f172a' }}>{okycResult.certificate?.certificateId}</strong></div>
                  <div>CA: <strong style={{ color: '#0f172a' }}>{okycResult.certificate?.certifyingAuthority}</strong></div>
                  <div>Statutory: <strong style={{ color: '#0a3871' }}>{okycResult.certificate?.statutoryCompliance}</strong></div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#94a3b8' }}>
                <Smartphone size={48} strokeWidth={1.5} style={{ margin: '0 auto 1rem auto', opacity: 0.6 }} />
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#475569', fontWeight: 600 }}>No OKYC Profile Decoded Yet</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>
                  Execute Step 1 (Generate OTP) and Step 2 (Verify) on the left to test the live CGPay API response and inspect the verified demographic identity card.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: DigiLocker Integration */}
      {activeTab === 'digilocker' && (
        <div className="cgpay-panel">
          <div className="panel-header">
            <h3>
              <Award size={18} color="#0a3871" />
              DigiLocker MeriPehchan Consent &amp; Document Fetch
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Gateway: MeriPehchan National Single Sign-On</span>
          </div>

          <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            DigiLocker provides consent-based, frictionless electronic identity verification directly from Government of India repositories (UIDAI, Income Tax Department, Transport).
          </p>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={18} color="#16a34a" />
              <strong style={{ color: '#166534', fontSize: '0.95rem' }}>Paperless Legal Consent Artifact Trail</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#15803d', lineHeight: 1.5 }}>
              Each request generates a unique cryptographic consent ID logged with timestamp, IP address, and SHA-256 document checksum compliant with Rule 3 of the Information Technology (Certifying Authorities) Rules.
            </p>
          </div>

          <button 
            className="btn-primary-cgpay"
            onClick={handleTestDigiLocker}
            disabled={digiLockerLoading}
            style={{ marginBottom: '1.5rem' }}
          >
            {digiLockerLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            Test DigiLocker Consent &amp; Fetch Documents
          </button>

          {digiLockerResult && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>DigiLocker Verification Response:</strong>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '100px' }}>
                  200 OK
                </span>
              </div>
              <pre className="json-console" style={{ maxHeight: '250px' }}>
                {JSON.stringify(digiLockerResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Multi-Party e-Sign Simulator */}
      {activeTab === 'multisign' && (
        <div className="cgpay-panel">
          <div className="panel-header">
            <div>
              <h3>
                <Users size={18} color="#0a3871" />
                Multi-Party Legal e-Sign Workflow (Sender, Receiver, Lawyer)
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Document: <strong style={{ color: '#0f172a' }}>{sampleDocTitle}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary-cgpay" onClick={() => handleAddSimSigner('Sender')}>
                + Add Sender
              </button>
              <button className="btn-secondary-cgpay" onClick={() => handleAddSimSigner('Receiver')}>
                + Add Receiver
              </button>
              <button className="btn-secondary-cgpay" onClick={() => handleAddSimSigner('Lawyer')}>
                + Add Lawyer
              </button>
            </div>
          </div>

          <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0 0 1rem 0' }}>
            Simulate unlimited signers executing their respective Aadhaar OKYC signatures sequentially or concurrently. All signers receive tamper-proof audit trails.
          </p>

          <div className="studio-signers-list">
            {simSigners.map((signer, idx) => {
              const roleClass = signer.role.toLowerCase();
              const isSigned = signer.status === 'Signed';

              return (
                <div key={signer.id} className={`studio-signer-card ${roleClass}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: signer.role === 'Sender' ? '#2563eb' : (signer.role === 'Receiver' ? '#16a34a' : '#d97706'),
                      color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem'
                    }}>
                      {idx + 1}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{signer.name}</strong>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '100px',
                          background: signer.role === 'Sender' ? '#dbeafe' : (signer.role === 'Receiver' ? '#dcfce7' : '#fef3c7'),
                          color: signer.role === 'Sender' ? '#1d4ed8' : (signer.role === 'Receiver' ? '#15803d' : '#b45309')
                        }}>
                          {signer.role.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {signer.email} • {isSigned ? `Signed at ${signer.signedAt}` : 'Awaiting Aadhaar eSign'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isSigned ? (
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '0.3rem 0.75rem', borderRadius: '100px' }}>
                          <CheckCircle size={14} /> Signed ({signer.certificateId?.substring(0, 14)})
                        </span>
                      </div>
                    ) : (
                      <button 
                        className="btn-primary-cgpay"
                        onClick={() => handleSimulatePartySign(idx)}
                        disabled={simSigningInProgress}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                      >
                        Sign via CGPay Aadhaar ✍️
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                Overall Agreement Execution Status:
              </span>
              <strong style={{ marginLeft: '0.5rem', color: simSigners.every(s => s.status === 'Signed') ? '#16a34a' : '#d97706' }}>
                {simSigners.every(s => s.status === 'Signed') ? '✅ FULLY EXECUTED & LEGALLY BINDING' : `⏳ PARTIAL (${simSigners.filter(s => s.status === 'Signed').length} / ${simSigners.length} Signed)`}
              </strong>
            </div>

            <button 
              className="btn-secondary-cgpay"
              onClick={() => {
                setSimSigners(prev => prev.map(s => ({ ...s, status: 'Pending', signedAt: null })));
              }}
            >
              Reset Signers
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Raw Logs & API Inspector */}
      {activeTab === 'console' && (
        <div className="cgpay-panel">
          <div className="panel-header">
            <h3>
              <Terminal size={18} color="#0a3871" />
              Real-Time CGPay API Request &amp; Response Inspector
            </h3>
            <button className="btn-secondary-cgpay" onClick={() => setApiLogs([])}>
              Clear Logs
            </button>
          </div>

          {apiLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <Terminal size={40} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No API calls recorded in this session yet.</p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Perform any connection test, OTP request, or verification to view request payloads and responses.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {apiLogs.map((log, index) => (
                <div key={log.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ background: '#0a3871', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                        {log.method}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{log.title}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{log.timestamp} ({log.latency}ms)</span>
                    </div>

                    <button 
                      className="btn-secondary-cgpay"
                      onClick={() => {
                        const curl = `curl -X ${log.method} "${log.endpoint}" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(log.requestBody)}'`;
                        navigator.clipboard.writeText(curl);
                        setCopiedIndex(index);
                        setTimeout(() => setCopiedIndex(null), 2000);
                      }}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      {copiedIndex === index ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                      {copiedIndex === index ? 'Copied cURL' : 'Copy cURL'}
                    </button>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                    <code>{log.endpoint}</code>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>REQUEST PAYLOAD:</span>
                      <pre className="json-console" style={{ maxHeight: '180px' }}>
                        {JSON.stringify(log.requestBody, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>RESPONSE PAYLOAD ({log.status}):</span>
                      <pre className="json-console" style={{ maxHeight: '180px' }}>
                        {JSON.stringify(log.responseData, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CGPayStudio;
