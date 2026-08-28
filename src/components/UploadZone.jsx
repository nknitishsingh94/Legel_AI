import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const UploadZone = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setAnalysisResult(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/document/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload');
      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error(error);
      alert('Error analyzing document. Please make sure backend is running.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-zone glass-panel animate-fade-in" style={{ animationDelay: '0.2s', width: '320px', display: 'flex', flexDirection: 'column' }}>
      {!analysisResult ? (
        <>
          <div className="upload-icon">
            <UploadCloud size={48} style={{ margin: '0 auto' }} />
          </div>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Upload Documents</h3>
          <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
            Drag & drop legal contracts, NDAs, or case files here for analysis.
          </p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept=".pdf,.docx,.txt"
          />
          
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={isUploading}
            style={{ 
              background: 'var(--accent-gold)', 
              color: '#0a0a0ab6', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
            {isUploading ? <><Loader2 size={18} className="spin-icon" /> Analyzing...</> : 'Browse Files'}
          </button>
          <p style={{ fontSize: '0.75rem', marginTop: '1rem', opacity: 0.6 }}>
            Supported: PDF, DOCX, TXT (Max 50MB)
          </p>
        </>
      ) : (
        <div className="analysis-results" style={{ textAlign: 'left', flex: 1, overflowY: 'auto' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>
            <FileText size={20} /> Document Analysis
          </h4>
          
          <div style={{ marginBottom: '1rem' }}>
            <h5 style={{ color: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <AlertTriangle size={16} /> Risks
            </h5>
            <ul style={{ fontSize: '0.875rem', paddingLeft: '1.2rem', margin: 0 }}>
              {analysisResult.risks.map((risk, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{risk}</li>)}
            </ul>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <h5 style={{ color: '#ffcc00', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <AlertTriangle size={16} /> Red Flags
            </h5>
            <ul style={{ fontSize: '0.875rem', paddingLeft: '1.2rem', margin: 0 }}>
              {analysisResult.red_flags.map((flag, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{flag}</li>)}
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#4dff4d', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={16} /> Suggestions
            </h5>
            <ul style={{ fontSize: '0.875rem', paddingLeft: '1.2rem', margin: 0 }}>
              {analysisResult.suggestions.map((sug, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{sug}</li>)}
            </ul>
          </div>

          <button 
            onClick={() => setAnalysisResult(null)}
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              color: 'var(--text-primary)', 
              border: '1px solid rgba(255,255,255,0.2)', 
              padding: '0.5rem', 
              borderRadius: '6px',
              marginTop: '1.5rem',
              width: '100%',
              cursor: 'pointer'
            }}>
            Upload Another
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
