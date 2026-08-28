import React, { useState, useRef } from 'react';
import './CompareAgreements.css';

const CompareAgreements = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const fileInput1 = useRef(null);
  const fileInput2 = useRef(null);

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
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
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
          />
        </div>
      </div>

      <div className="supported-formats">
        Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, CSV (max 50MB per file)
      </div>

      <button className={`compare-btn ${isReady ? 'active' : ''}`} disabled={!isReady}>
        Compare
      </button>
    </div>
  );
};

export default CompareAgreements;
