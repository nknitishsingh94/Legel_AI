import React, { useState, useEffect, useRef } from 'react';
import { FileText, File, FilePlus, Download, Trash2, MoreVertical, Search, RefreshCw, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabase';
import { fetchWorkspaceDocuments, deleteWorkspaceDocument } from '../api';
import LegalEsignModal from './LegalEsignModal';
import './WorkspaceFiles.css';

const WorkspaceFiles = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [generatedDocs, setGeneratedDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    // 1. Fetch generated agreements & drafts via secure backend API (bypasses RLS)
    try {
      const data = await fetchWorkspaceDocuments(user?.id);
      if (data && data.success && Array.isArray(data.documents)) {
        // Merge with any local drafts backup if not present in DB
        const localBackups = JSON.parse(localStorage.getItem('vakeel_drafts_backup') || '[]');
        const existingIds = new Set(data.documents.map(d => d.id));
        const merged = [...data.documents];
        for (const loc of localBackups) {
          if (!existingIds.has(loc.id)) {
            merged.push(loc);
          }
        }
        setGeneratedDocs(merged);
      } else {
        throw new Error('API returned invalid format');
      }
    } catch (e) {
      console.warn("API documents fetch fallback to direct DB + local backups:", e);
      let docs = [];
      if (user) {
        const { data: docData } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (docData) docs = docData;
      }
      const localBackups = JSON.parse(localStorage.getItem('vakeel_drafts_backup') || '[]');
      const combined = [...docs];
      const existing = new Set(combined.map(d => d.id));
      for (const loc of localBackups) {
        if (!existing.has(loc.id)) combined.push(loc);
      }
      setGeneratedDocs(combined);
    }

    // 2. Fetch uploaded workspace files
    if (user) {
      const { data: fileData } = await supabase
        .from('workspace_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (fileData) setFiles(fileData);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleDeleteDoc = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document from Workspace Files?")) return;
    try {
      await deleteWorkspaceDocument(id);
    } catch (e) {
      console.warn("API delete error:", e);
      await supabase.from('documents').delete().eq('id', id).catch(() => {});
    }
    try {
      const localBackups = JSON.parse(localStorage.getItem('vakeel_drafts_backup') || '[]');
      localStorage.setItem('vakeel_drafts_backup', JSON.stringify(localBackups.filter(d => d.id !== id)));
    } catch (e) {}
    setGeneratedDocs(prev => prev.filter(d => d.id !== id));
  };

  const handleDownloadDoc = (doc) => {
    if (!doc || !doc.content) return;
    const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(doc.title || 'document').replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
  
  const openSignModal = (doc) => {
    setSelectedDoc(doc);
    setShowSignModal(true);
  };

  return (
    <div className="workspace-files-container animate-fade-in" style={{ padding: '1rem 1.75rem 3rem' }}>
      <div className="wf-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="wf-search" style={{ flex: 1, maxWidth: '380px' }}>
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search documents and files by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        
        <button className="wf-upload-btn" onClick={handleUploadClick}>
          <FilePlus size={17} />
          <span>Upload File</span>
        </button>
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
                      <button 
                        className="icon-btn-small" 
                        title="Download Document"
                        onClick={() => handleDownloadDoc(doc)}
                      >
                        <Download size={15} />
                      </button>
                      <button 
                        className="icon-btn-small wf-danger" 
                        title="Delete Document" 
                        onClick={() => handleDeleteDoc(doc.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                      {doc.status !== 'Signed' && (
                        <button 
                          className="icon-btn-small" 
                          title="Send for Multi-Party Legal e-Sign" 
                          style={{ 
                            background: '#059669', 
                            color: 'white', 
                            padding: '6px 12px', 
                            borderRadius: '8px', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontWeight: 700, 
                            fontSize: '0.82rem', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
                            transition: 'all 0.15s ease'
                          }}
                          onClick={() => openSignModal(doc)}
                        >
                          <ShieldCheck size={14} /> Send e-Sign
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

      {showSignModal && selectedDoc && (
        <LegalEsignModal
          isOpen={showSignModal}
          onClose={() => {
            setShowSignModal(false);
            setSelectedDoc(null);
          }}
          document={selectedDoc}
          user={user}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default WorkspaceFiles;
