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
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signingLink, setSigningLink] = useState('');
  const [isSending, setIsSending] = useState(false);

  const openSignModal = (doc) => {
    setSelectedDoc(doc);
    setSignerName('');
    setSignerEmail('');
    setSigningLink('');
    setShowSignModal(true);
  };

  const handleSendForSignature = async (e) => {
    e.preventDefault();
    if (!signerName || !signerEmail || !selectedDoc) return;
    setIsSending(true);

    try {
      const { data: sigData, error: sigError } = await supabase
        .from('signatures')
        .insert([{
          document_id: selectedDoc.id,
          signer_name: signerName,
          signer_email: signerEmail,
          status: 'Pending'
        }])
        .select()
        .single();

      if (sigError) throw sigError;

      await supabase.from('audit_logs').insert([{
        document_id: selectedDoc.id,
        action: 'Sent for Signature',
        performed_by: user.email || 'System',
        ip_address: 'Client'
      }]);

      await supabase.from('documents').update({ status: 'Pending Signature' }).eq('id', selectedDoc.id);

      const link = `${window.location.origin}/sign/${selectedDoc.id}/${sigData.id}`;
      setSigningLink(link);
      setGeneratedDocs(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: 'Pending Signature' } : d));
    } catch (error) {
      console.error(error);
      alert("Failed to create signature request");
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
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px'
          }}>
            <h2 style={{marginTop: 0, marginBottom: '1rem'}}>Send for e-Signature</h2>
            <p style={{marginBottom: '1.5rem', color: '#64748b'}}>
              Document: <strong>{selectedDoc?.title}</strong>
            </p>

            {!signingLink ? (
              <form onSubmit={handleSendForSignature}>
                <div className="form-group" style={{marginBottom: '1rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Signer's Name</label>
                  <input 
                    type="text" 
                    required 
                    value={signerName} 
                    onChange={e => setSignerName(e.target.value)} 
                    style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1'}}
                  />
                </div>
                <div className="form-group" style={{marginBottom: '1.5rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Signer's Email</label>
                  <input 
                    type="email" 
                    required 
                    value={signerEmail} 
                    onChange={e => setSignerEmail(e.target.value)} 
                    style={{width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1'}}
                  />
                </div>
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                  <button type="button" onClick={() => setShowSignModal(false)} style={{
                    padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b'
                  }}>Cancel</button>
                  <button type="submit" disabled={isSending} style={{
                    padding: '0.75rem 1.5rem', background: 'var(--accent-main)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
                  }}>
                    {isSending ? 'Creating Link...' : 'Generate Secure Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div style={{
                  padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', 
                  wordBreak: 'break-all', marginBottom: '1.5rem', fontSize: '0.875rem'
                }}>
                  {signingLink}
                </div>
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                  <button onClick={() => navigator.clipboard.writeText(signingLink)} style={{
                    padding: '0.75rem 1.5rem', background: 'var(--accent-main)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
                  }}>Copy Link</button>
                  <button onClick={() => setShowSignModal(false)} style={{
                    padding: '0.75rem 1.5rem', background: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '6px', cursor: 'pointer'
                  }}>Done</button>
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
