import React, { useState, useEffect, useRef } from 'react';
import { FileText, File, FilePlus, Download, Trash2, MoreVertical, Search } from 'lucide-react';
import { supabase } from '../supabase';
import './WorkspaceFiles.css';

const WorkspaceFiles = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('workspace_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        setFiles(data);
      }
    };
    fetchFiles();
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
    </div>
  );
};

export default WorkspaceFiles;
