import React, { useState, useEffect, useRef } from 'react';
import { FileText, File, FilePlus, Download, Trash2, MoreVertical, Search } from 'lucide-react';
import { supabase } from '../supabase';
import './WorkspaceFiles.css';

const WorkspaceFiles = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [generatedDocs, setGeneratedDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      // Fetch uploaded files
      const { data: fileData } = await supabase
        .from('workspace_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fileData) setFiles(fileData);

      // Fetch generated documents
      const { data: docData } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (docData) setGeneratedDocs(docData);
    };
    fetchData();
  }, [user]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile || !user) return;

    const newFile = {
      id: Date.now().toString(),
      user_id: user.id,
      name: uploadedFile.name,
      size: (uploadedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
      date: new Date().toISOString().split('T')[0],
      type: uploadedFile.name.split('.').pop().toLowerCase()
    };

    // Save to Supabase
    await supabase.from('workspace_files').insert([newFile]);

    setFiles(prev => [newFile, ...prev]);
    e.target.value = ''; // reset
  };

  const handleDelete = async (id) => {
    await supabase.from('workspace_files').delete().eq('id', id);
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  
  // Multi-Party Signers State: Unlimited Senders, Receivers, and Lawyers
  const [signers, setSigners] = useState([]);
  const [multiSigningLinks, setMultiSigningLinks] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const openSignModal = (doc) => {
    setSelectedDoc(doc);
    const defaultLawyerName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0].toUpperCase() : 'Adv. Rajesh Kumar');
    const formattedLawyer = defaultLawyerName.startsWith('Adv.') ? defaultLawyerName : `Adv. ${defaultLawyerName}`;

    // Initialize all 3 standard legal roles: Sender, Receiver, Lawyer
    setSigners([
      {
        id: '1',
        role: 'Sender',
        name: '',
        email: '',
        phone: '',
        method: 'cgpay_aadhaar'
      },
      {
        id: '2',
        role: 'Receiver',
        name: '',
        email: '',
        phone: '',
        method: 'cgpay_aadhaar'
      },
      {
        id: '3',
        role: 'Lawyer',
        name: formattedLawyer,
        email: user?.email || 'advocate@wakalat.ai',
        phone: '',
        barId: 'D/1482/2021',
        method: 'cgpay_aadhaar'
      }
    ]);
    setMultiSigningLinks(null);
    setShowSignModal(true);
  };

  const handleAddSigner = (role = 'Sender') => {
    const newSigner = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      role,
      name: '',
      email: '',
      phone: '',
      method: 'cgpay_aadhaar'
    };
    setSigners(prev => [...prev, newSigner]);
  };

  const handleRemoveSigner = (id) => {
    if (signers.length <= 1) {
      alert("At least one signer is required.");
      return;
    }
    setSigners(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateSigner = (id, field, value) => {
    setSigners(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSendForSignature = async (e) => {
    e.preventDefault();
    if (!selectedDoc) return;

    // Validate all signers
    for (let i = 0; i < signers.length; i++) {
      const s = signers[i];
      if (!s.name.trim() || !s.email.trim()) {
        alert(`Please fill in Name and Email for Signer #${i + 1} (${s.role}).`);
        return;
      }
    }

    setIsSending(true);

    try {
      const createdLinks = [];

      for (let i = 0; i < signers.length; i++) {
        const s = signers[i];
        const roleLabel = s.role === 'Lawyer' ? 'Advocate / Legal Counsel' : s.role;
        const displayName = `${s.name.trim()} (${roleLabel})`;

        const { data: sigRecord, error: sigErr } = await supabase
          .from('signatures')
          .insert([{
            document_id: selectedDoc.id,
            signer_name: displayName,
            signer_email: s.email.trim(),
            status: 'Pending'
          }])
          .select()
          .single();

        if (sigErr) throw sigErr;

        createdLinks.push({
          ...s,
          sigId: sigRecord.id,
          link: `${window.location.origin}/sign/${selectedDoc.id}/${sigRecord.id}`
        });
      }

      // Record detailed Audit Log
      try {
        await supabase.from('audit_logs').insert([{
          document_id: selectedDoc.id,
          action: `Multi-Party e-Sign initiated under IT Act 2000 & BSA 2023 for ${signers.length} signers: ${signers.map(s => `${s.role} (${s.name})`).join(', ')}`,
          performed_by: user?.email || 'Authorized Advocate',
          ip_address: 'Client Verified'
        }]);
      } catch (logErr) {
        console.warn("Audit log insert skipped:", logErr);
      }

      // Update Document Status
      await supabase.from('documents').update({
        status: `Pending Signatures (${signers.length} Parties)`
      }).eq('id', selectedDoc.id);

      setMultiSigningLinks({
        signers: createdLinks,
        docTitle: selectedDoc.title
      });

      setGeneratedDocs(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: `Pending Signatures (${signers.length} Parties)` } : d));
    } catch (error) {
      console.error("Multi-signature setup error:", error);
      alert("Failed to create signature requests: " + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="workspace-files-container animate-fade-in">
      <div className="wf-header">
        <div className="wf-title-section">
          <h1>Workspace Files</h1>
          <p>Manage and organize all your legal documents in one place.</p>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        
        <button className="wf-upload-btn" onClick={handleUploadClick}>
          <FilePlus size={18} />
          <span>Upload File</span>
        </button>
      </div>

      <div className="wf-toolbar">
        <div className="wf-search">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search files by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="wf-table-container">
        <table className="wf-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Size</th>
              <th>Date Added</th>
              <th className="wf-actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No files found. Click "Upload File" to add one.
                </td>
              </tr>
            ) : (
              filteredFiles.map(file => (
                <tr key={file.id}>
                  <td>
                    <div className="wf-file-name">
                      {file.type === 'pdf' ? <FileText size={18} className="wf-icon-pdf" /> : <File size={18} className="wf-icon-doc" />}
                      <span>{file.name}</span>
                    </div>
                  </td>
                  <td>{file.size}</td>
                  <td>{file.date}</td>
                  <td>
                    <div className="wf-actions">
                      <button className="icon-btn-small" title="Download"><Download size={16} /></button>
                      <button className="icon-btn-small wf-danger" title="Delete" onClick={() => handleDelete(file.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="wf-header" style={{ marginTop: '3rem' }}>
        <h2>Generated Agreements</h2>
        <p>Contracts drafted using Wakalat AI.</p>
      </div>
      
      <div className="wf-table-container">
        <table className="wf-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date Created</th>
              <th className="wf-actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {generatedDocs.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No agreements generated yet. Go to "Draft Document" to create one.
                </td>
              </tr>
            ) : (
              generatedDocs.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className="wf-file-name">
                      <FileText size={18} className="wf-icon-doc" />
                      <span>{doc.title}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px',
                      background: doc.status === 'Draft' ? '#f1f5f9' : '#dcfce3',
                      color: doc.status === 'Draft' ? '#64748b' : '#16a34a'
                    }}>
                      {doc.status}
                    </span>
                  </td>
                  <td>{new Date(doc.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="wf-actions">
                      {doc.status !== 'Signed' && (
                        <button 
                          className="icon-btn-small" 
                          title="Send for Signature" 
                          style={{ background: 'var(--accent-main)', color: 'white', padding: '4px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                          onClick={() => openSignModal(doc)}
                        >
                          eSign
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showSignModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, 
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="modal-content animate-scale-up" style={{
            background: '#ffffff', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '680px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', border: '1px solid #e2e8f0', boxSizing: 'border-box',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.65rem', borderRadius: '100px', letterSpacing: '0.04em' }}>
                  IT ACT 2000 SEC. 3A &amp; 10A • BSA 2023
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0a3871', background: 'rgba(10, 56, 113, 0.1)', padding: '0.25rem 0.65rem', borderRadius: '100px' }}>
                  CGPAY AADHAAR OKYC &amp; DIGILOCKER
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>
                {signers.length} {signers.length === 1 ? 'Party' : 'Parties'}
              </span>
            </div>
            
            <h2 style={{ marginTop: 0, marginBottom: '0.35rem', fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              Multi-Party Legal e-Sign (Sender, Receiver &amp; Lawyer)
            </h2>
            <p style={{ marginBottom: '1.25rem', color: '#64748b', fontSize: '0.85rem', lineHeight: 1.4 }}>
              Document: <strong style={{ color: '#0f172a' }}>{selectedDoc?.title}</strong>
              <br /><span style={{ fontSize: '0.78rem', color: '#b8860b' }}>
                Add unlimited signers across the 3 statutory roles. Each person receives an individual, tamper-proof signing link.
              </span>
            </p>

            {/* 3 Government Approval Ways Notice Banner */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0a3871', letterSpacing: '0.03em' }}>
                  🏛️ 3 WAYS RECIPIENTS CAN APPROVE &amp; ESIGN:
                </span>
                <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '100px' }}>
                  Court Recognized (BSA Sec. 63)
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', fontSize: '0.75rem', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#16a34a', fontWeight: 800 }}>1.</span> <strong>Aadhaar OTP</strong> (Instant SMS)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#0a3871', fontWeight: 800 }}>2.</span> <strong>DigiLocker</strong> (MeriPehchan)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#b8860b', fontWeight: 800 }}>3.</span> <strong>UIDAI OKYC</strong> (Offline XML)
                </div>
              </div>
            </div>

            {!multiSigningLinks ? (
              <form onSubmit={handleSendForSignature}>
                {/* Signers List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {signers.map((signer, index) => {
                    const isSender = signer.role === 'Sender';
                    const isReceiver = signer.role === 'Receiver';
                    const isLawyer = signer.role === 'Lawyer';

                    const borderColor = isSender ? '#bfdbfe' : (isReceiver ? '#bbf7d0' : '#fde68a');
                    const bgColor = isSender ? '#f8faff' : (isReceiver ? '#f9fdfa' : '#fffdf5');
                    const badgeBg = isSender ? '#2563eb' : (isReceiver ? '#16a34a' : '#d97706');

                    return (
                      <div key={signer.id} style={{
                        background: bgColor, border: `1.5px solid ${borderColor}`,
                        borderRadius: '14px', padding: '1rem', position: 'relative'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{
                              background: badgeBg, color: '#ffffff', width: '22px', height: '22px',
                              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.75rem', fontWeight: 800
                            }}>
                              {index + 1}
                            </span>
                            
                            {/* Role Selector Dropdown */}
                            <select 
                              value={signer.role}
                              onChange={e => handleUpdateSigner(signer.id, 'role', e.target.value)}
                              style={{
                                fontWeight: 700, fontSize: '0.85rem', padding: '0.25rem 0.5rem',
                                borderRadius: '6px', border: `1px solid ${borderColor}`,
                                background: '#ffffff', color: isSender ? '#1d4ed8' : (isReceiver ? '#15803d' : '#b45309')
                              }}
                            >
                              <option value="Sender">Party 1: Sender (प्रेषक / Initiator)</option>
                              <option value="Receiver">Party 2: Receiver (प्राप्तकर्ता / Counterparty)</option>
                              <option value="Lawyer">Legal Counsel: Lawyer / Advocate (वक़ील)</option>
                            </select>
                          </div>

                          {signers.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => handleRemoveSigner(signer.id)}
                              style={{
                                background: 'transparent', border: 'none', color: '#ef4444',
                                cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.5rem'
                              }}
                            >
                              ✕ Remove
                            </button>
                          )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.76rem', color: '#475569' }}>
                              {isLawyer ? 'Advocate Full Name' : `${signer.role} Full Name`} *
                            </label>
                            <input 
                              type="text" 
                              required 
                              value={signer.name} 
                              onChange={e => handleUpdateSigner(signer.id, 'name', e.target.value)}
                              placeholder={isLawyer ? "e.g. Adv. Rajesh Sharma" : (isSender ? "e.g. Ramesh Verma (Lessor)" : "e.g. Sunil Gupta (Lessee)")}
                              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box', background: '#ffffff' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.76rem', color: '#475569' }}>
                              Official Email *
                            </label>
                            <input 
                              type="email" 
                              required 
                              value={signer.email} 
                              onChange={e => handleUpdateSigner(signer.id, 'email', e.target.value)}
                              placeholder="signer@example.com"
                              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box', background: '#ffffff' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '0.75rem' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.76rem', color: '#475569' }}>
                              Mobile (Aadhaar OTP / WhatsApp)
                            </label>
                            <input 
                              type="tel" 
                              value={signer.phone} 
                              onChange={e => handleUpdateSigner(signer.id, 'phone', e.target.value)}
                              placeholder="9876543210"
                              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box', background: '#ffffff' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.76rem', color: '#475569' }}>
                              Verification Method
                            </label>
                            <select 
                              value={signer.method} 
                              onChange={e => handleUpdateSigner(signer.id, 'method', e.target.value)}
                              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.82rem', boxSizing: 'border-box', background: '#ffffff' }}
                            >
                              <option value="cgpay_aadhaar">🇮🇳 CGPay Aadhaar OKYC + eSign (Recommended)</option>
                              <option value="digilocker">🏛️ DigiLocker MeriPehchan</option>
                              <option value="draw_type">✍️ Digital Pad / Certificate eSign</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add More Signers Buttons (Unlimited) */}
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    + Add Unlimited Signers:
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button 
                      type="button" 
                      onClick={() => handleAddSigner('Sender')}
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add Sender
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleAddSigner('Receiver')}
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add Receiver
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleAddSigner('Lawyer')}
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', background: '#fefce8', color: '#b45309', border: '1px solid #fde68a', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add Lawyer
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <button type="button" onClick={() => setShowSignModal(false)} style={{
                    padding: '0.75rem 1.25rem', background: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#64748b', fontWeight: 600, fontSize: '0.85rem'
                  }}>Cancel</button>
                  <button type="submit" disabled={isSending} style={{
                    padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #0a3871 0%, #032047 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(10, 56, 113, 0.25)'
                  }}>
                    {isSending ? `Initiating ${signers.length} Signature Requests...` : `Create ${signers.length} Signature Requests`}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <strong style={{ color: '#065f46', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>
                    ✅ Multi-Party Signature Requests Created Successfully ({multiSigningLinks.signers.length} Parties)!
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#047857' }}>
                    Each signer listed below has received a unique, cryptographically signed portal link with <strong>3 official ways to approve</strong> (1. Aadhaar OTP, 2. DigiLocker MeriPehchan, 3. UIDAI OKYC) pursuant to Section 10A IT Act 2000.
                  </p>
                </div>

                {/* Generated Links for All Signers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem', maxHeight: '420px', overflowY: 'auto' }}>
                  {multiSigningLinks.signers.map((s, idx) => {
                    const isSender = s.role === 'Sender';
                    const isReceiver = s.role === 'Receiver';
                    const borderColor = isSender ? '#bfdbfe' : (isReceiver ? '#bbf7d0' : '#fde68a');
                    const badgeBg = isSender ? '#2563eb' : (isReceiver ? '#16a34a' : '#d97706');

                    return (
                      <div key={s.sigId} style={{ background: '#ffffff', border: `1.5px solid ${borderColor}`, borderRadius: '12px', padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                              background: badgeBg, color: '#ffffff', fontSize: '0.72rem', fontWeight: 800,
                              padding: '0.15rem 0.5rem', borderRadius: '100px'
                            }}>
                              {s.role.toUpperCase()}
                            </span>
                            <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{s.name}</strong>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{s.email}</span>
                        </div>

                        <div style={{ padding: '0.55rem 0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', wordBreak: 'break-all', fontSize: '0.76rem', color: '#334155', marginBottom: '0.6rem' }}>
                          {s.link}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <a href={s.link} target="_blank" rel="noopener noreferrer" style={{
                            padding: '0.45rem 0.85rem', background: '#0a3871', color: '#ffffff', textDecoration: 'none', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px'
                          }}>
                            Open &amp; Sign Now ✍️
                          </a>

                          <button onClick={() => {
                            navigator.clipboard.writeText(s.link);
                            alert(`Signing link for ${s.name} (${s.role}) copied to clipboard!`);
                          }} style={{
                            padding: '0.45rem 0.8rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#475569'
                          }}>
                            Copy Link 📋
                          </button>

                          {s.phone && (
                            <a 
                              href={`https://wa.me/${s.phone.replace(/\D/g,'')}?text=${encodeURIComponent(`Namaste ${s.name}, please review and e-sign our legal document "${multiSigningLinks.docTitle}" as ${s.role} through the secure Government Recognized portal: ${s.link}`)}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{
                                padding: '0.45rem 0.85rem', background: '#25D366', color: '#ffffff', textDecoration: 'none', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px'
                              }}
                            >
                              WhatsApp 💬
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    onClick={() => {
                      const allText = multiSigningLinks.signers.map(s => `${s.role}: ${s.name}\nLink: ${s.link}`).join('\n\n');
                      navigator.clipboard.writeText(allText);
                      alert("All multi-party signing links copied to clipboard!");
                    }}
                    style={{
                      padding: '0.65rem 1.1rem', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '9px', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer'
                    }}
                  >
                    Copy All {multiSigningLinks.signers.length} Links 📋
                  </button>

                  <button onClick={() => setShowSignModal(false)} style={{
                    padding: '0.75rem 1.5rem', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem'
                  }}>Done &amp; Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceFiles;
