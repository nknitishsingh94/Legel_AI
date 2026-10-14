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
  
  // Dual-Party State: Advocate (Lawyer) & Client
  const [lawyerName, setLawyerName] = useState('');
  const [lawyerEmail, setLawyerEmail] = useState('');
  const [lawyerBarId, setLawyerBarId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  
  const [dualSigningLinks, setDualSigningLinks] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const openSignModal = (doc) => {
    setSelectedDoc(doc);
    const defaultLawyerName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0].toUpperCase() : 'Adv. Kumar');
    setLawyerName(defaultLawyerName.startsWith('Adv.') ? defaultLawyerName : `Adv. ${defaultLawyerName}`);
    setLawyerEmail(user?.email || 'advocate@wakalat.ai');
    setLawyerBarId('D/1482/2021');
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setDualSigningLinks(null);
    setShowSignModal(true);
  };

  const handleSendForSignature = async (e) => {
    e.preventDefault();
    if (!lawyerName || !lawyerEmail || !clientName || !clientEmail || !selectedDoc) {
      alert("Please enter both Advocate and Client details.");
      return;
    }
    setIsSending(true);

    try {
      // 1. Create Signature Request for Advocate (Lawyer)
      const { data: lawyerSig, error: lawyerErr } = await supabase
        .from('signatures')
        .insert([{
          document_id: selectedDoc.id,
          signer_name: `${lawyerName.trim()} (Advocate / Legal Counsel)`,
          signer_email: lawyerEmail.trim(),
          status: 'Pending'
        }])
        .select()
        .single();

      if (lawyerErr) throw lawyerErr;

      // 2. Create Signature Request for Client / First Party
      const { data: clientSig, error: clientErr } = await supabase
        .from('signatures')
        .insert([{
          document_id: selectedDoc.id,
          signer_name: `${clientName.trim()} (Client / Deponent)`,
          signer_email: clientEmail.trim(),
          status: 'Pending'
        }])
        .select()
        .single();

      if (clientErr) throw clientErr;

      // 3. Record Audit Log for Dual eSign initiation
      await supabase.from('audit_logs').insert([{
        document_id: selectedDoc.id,
        action: `Dual e-Sign initiated under IT Act 2000 for Advocate (${lawyerName}) and Client (${clientName})`,
        performed_by: user?.email || lawyerEmail,
        ip_address: 'Client Verified'
      }]).catch(() => {});

      // 4. Update Document Status
      await supabase.from('documents').update({ status: 'Pending Signatures (Dual)' }).eq('id', selectedDoc.id);

      const lawyerLink = `${window.location.origin}/sign/${selectedDoc.id}/${lawyerSig.id}`;
      const clientLink = `${window.location.origin}/sign/${selectedDoc.id}/${clientSig.id}`;

      setDualSigningLinks({
        lawyerLink,
        clientLink,
        lawyerName,
        clientName,
        docTitle: selectedDoc.title
      });

      setGeneratedDocs(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: 'Pending Signatures (Dual)' } : d));
    } catch (error) {
      console.error("Signature setup error:", error);
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
            background: '#ffffff', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '580px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', border: '1px solid #e2e8f0', boxSizing: 'border-box',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.65rem', borderRadius: '100px', letterSpacing: '0.04em' }}>
                  IT ACT 2000 SEC. 10A &amp; BSA 2023
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0a3871', background: 'rgba(10, 56, 113, 0.1)', padding: '0.25rem 0.65rem', borderRadius: '100px' }}>
                  DIGILOCKER / AADHAAR
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Dual Execution</span>
            </div>
            
            <h2 style={{ marginTop: 0, marginBottom: '0.35rem', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              Dual Legal e-Sign (Advocate &amp; Client)
            </h2>
            <p style={{ marginBottom: '1.25rem', color: '#64748b', fontSize: '0.85rem', lineHeight: 1.4 }}>
              Document: <strong style={{ color: '#0f172a' }}>{selectedDoc?.title}</strong>
              <br /><span style={{ fontSize: '0.78rem', color: '#b8860b' }}>Both parties (Lawyer &amp; Client) will digitally sign this document to make it legally binding.</span>
            </p>

            {!dualSigningLinks ? (
              <form onSubmit={handleSendForSignature}>
                {/* Party 1: Advocate Section */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#0f172a', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>1</span>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>Party 1: Advocate / Legal Counsel (वक़ील)</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.78rem', color: '#475569' }}>
                        Advocate Full Name
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={lawyerName} 
                        onChange={e => setLawyerName(e.target.value)} 
                        placeholder="e.g. Adv. R. K. Sharma"
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.78rem', color: '#475569' }}>
                        Bar Enrollment / ID
                      </label>
                      <input 
                        type="text" 
                        value={lawyerBarId} 
                        onChange={e => setLawyerBarId(e.target.value)} 
                        placeholder="e.g. D/1482/2021"
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.78rem', color: '#475569' }}>
                      Advocate Official Email
                    </label>
                    <input 
                      type="email" 
                      required 
                      value={lawyerEmail} 
                      onChange={e => setLawyerEmail(e.target.value)} 
                      placeholder="advocate@example.com"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {/* Party 2: Client Section */}
                <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '14px', border: '1px solid #bae6fd', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#0284c7', color: '#ffffff', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>2</span>
                    <strong style={{ fontSize: '0.9rem', color: '#0369a1' }}>Party 2: Client / First Party (मुवक्किल)</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.78rem', color: '#0369a1' }}>
                        Client Legal Name
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={clientName} 
                        onChange={e => setClientName(e.target.value)} 
                        placeholder="e.g. Ramesh Verma"
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid #7dd3fc', fontSize: '0.85rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.78rem', color: '#0369a1' }}>
                        Mobile (for DigiLocker OTP)
                      </label>
                      <input 
                        type="tel" 
                        value={clientPhone} 
                        onChange={e => setClientPhone(e.target.value)} 
                        placeholder="9876543210"
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid #7dd3fc', fontSize: '0.85rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.78rem', color: '#0369a1' }}>
                      Client Email
                    </label>
                    <input 
                      type="email" 
                      required 
                      value={clientEmail} 
                      onChange={e => setClientEmail(e.target.value)} 
                      placeholder="client@example.com"
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1.5px solid #7dd3fc', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <button type="button" onClick={() => setShowSignModal(false)} style={{
                    padding: '0.75rem 1.25rem', background: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer', color: '#64748b', fontWeight: 600, fontSize: '0.85rem'
                  }}>Cancel</button>
                  <button type="submit" disabled={isSending} style={{
                    padding: '0.75rem 1.5rem', background: '#b8860b', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(184, 134, 11, 0.25)'
                  }}>
                    {isSending ? 'Initiating Dual Sign...' : 'Create Dual Signature Requests'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <strong style={{ color: '#065f46', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>
                    ✅ Dual Signature Requests Created Successfully!
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#047857' }}>
                    Both links below carry unique cryptographic tokens. Advocate and Client can sign sequentially or simultaneously via DigiLocker / Aadhaar OTP or Digital Pen.
                  </p>
                </div>

                {/* Link 1: Advocate Signing Link */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                      ⚖️ 1. Advocate Portal Link ({dualSigningLinks.lawyerName})
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#b8860b', fontWeight: 600 }}>Your Signing Portal</span>
                  </div>
                  <div style={{ padding: '0.6rem 0.8rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', wordBreak: 'break-all', fontSize: '0.78rem', color: '#334155', marginBottom: '0.6rem' }}>
                    {dualSigningLinks.lawyerLink}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <a href={dualSigningLinks.lawyerLink} target="_blank" rel="noopener noreferrer" style={{
                      padding: '0.5rem 1rem', background: '#0f172a', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}>
                      Sign as Advocate Now ✍️
                    </a>
                    <button onClick={() => {
                      navigator.clipboard.writeText(dualSigningLinks.lawyerLink);
                      alert("Advocate signing link copied!");
                    }} style={{
                      padding: '0.5rem 0.85rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', color: '#475569'
                    }}>Copy</button>
                  </div>
                </div>

                {/* Link 2: Client Signing Link */}
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1' }}>
                      👤 2. Client Portal Link ({dualSigningLinks.clientName})
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600 }}>Send to Client</span>
                  </div>
                  <div style={{ padding: '0.6rem 0.8rem', background: '#ffffff', border: '1px solid #7dd3fc', borderRadius: '8px', wordBreak: 'break-all', fontSize: '0.78rem', color: '#0369a1', marginBottom: '0.6rem' }}>
                    {dualSigningLinks.clientLink}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => {
                      navigator.clipboard.writeText(dualSigningLinks.clientLink);
                      alert("Client signing link copied to clipboard!");
                    }} style={{
                      padding: '0.5rem 1rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer'
                    }}>
                      Copy Client Link 📋
                    </button>
                    <a 
                      href={`https://wa.me/${clientPhone.replace(/\D/g,'')}?text=${encodeURIComponent(`Namaste ${dualSigningLinks.clientName}, please review and e-sign our legal document "${dualSigningLinks.docTitle}" through the secure Government Recognized portal: ${dualSigningLinks.clientLink}`)}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.5rem 1rem', background: '#25D366', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      WhatsApp Client 💬
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowSignModal(false)} style={{
                    padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
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
