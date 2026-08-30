import React, { useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import './CompareAgreements.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:8000/api' : 'https://legel-ai.vercel.app/api');

const CompareAgreements = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fileInput1 = useRef(null);
  const fileInput2 = useRef(null);

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCompare = async () => {
    if (!file1 || !file2) return;
    
    setIsComparing(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const response = await fetch(`${API_BASE_URL}/document/compare`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to compare documents');
      }

      const data = await response.json();
      setResult(data.comparison);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsComparing(false);
    }
  };

  const isReady = file1 && file2;

  return (
    <div className="compare-container animate-fade-in">
      <div className="compare-header">
        <h1>Compare agreements</h1>
        <p>Upload two documents to compare their content</p>
      </div>

      <div className="compare-upload-area">
        {/* Box 1 */}
        <div 
          className="upload-box" 
          onClick={() => fileInput1.current.click()}
        >
          {file1 ? (
            <div className="file-selected">
              <div className="plus-icon" style={{ color: '#10b981' }}>✓</div>
              <div className="upload-text-main">{file1.name}</div>
              <div className="upload-text-sub">{(file1.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          ) : (
            <>
              <div className="plus-icon">+</div>
              <div className="upload-text-main">Drag & Drop files</div>
              <div className="upload-text-sub">or browse files on your device</div>
            </>
          )}
          <input 
            type="file" 
            ref={fileInput1} 
            onChange={(e) => handleFileChange(e, setFile1)} 
            style={{ display: 'none' }} 
            accept=".pdf,.txt,.csv"
          />
        </div>

        {/* Box 2 */}
        <div 
          className="upload-box" 
          onClick={() => fileInput2.current.click()}
        >
          {file2 ? (
            <div className="file-selected">
              <div className="plus-icon" style={{ color: '#10b981' }}>✓</div>
              <div className="upload-text-main">{file2.name}</div>
              <div className="upload-text-sub">{(file2.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          ) : (
            <>
              <div className="plus-icon">+</div>
              <div className="upload-text-main">Drag & Drop files</div>
              <div className="upload-text-sub">or browse files on your device</div>
            </>
          )}
          <input 
            type="file" 
            ref={fileInput2} 
            onChange={(e) => handleFileChange(e, setFile2)} 
            style={{ display: 'none' }} 
            accept=".pdf,.txt,.csv"
          />
        </div>
      </div>

      <div className="supported-formats">
        Supported formats: PDF, TXT, CSV (max 10MB per file)
      </div>

      <button 
        className={`compare-btn ${isReady ? 'active' : ''}`} 
        disabled={!isReady || isComparing}
        onClick={handleCompare}
      >
        {isComparing ? (
          <>
            <Loader2 className="spin-icon" size={18} style={{ marginRight: '8px' }} />
            Comparing...
          </>
        ) : 'Compare'}
      </button>

      {error && (
        <div style={{ marginTop: '1rem', color: '#ef4444', padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '2rem', textAlign: 'left', background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#1e293b' }}>Comparison Results</h2>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#334155' }}>
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareAgreements;
