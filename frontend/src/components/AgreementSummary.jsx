import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, FileText, ChevronRight } from 'lucide-react';
import './AgreementSummary.css';

const AgreementSummary = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    // Simulate API call for document analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  };

  return (
    <div className="summary-container animate-fade-in">
      {!analysisComplete ? (
        <div className="summary-upload-view">
          <div className="summary-header">
            <h1>Agreement Summary</h1>
            <p>Upload a contract or agreement to extract key clauses, summarize terms, and identify risks instantly.</p>
          </div>
          
          <div className="summary-dropzone" onClick={() => fileInputRef.current.click()}>
            <div className="dropzone-content">
              {file ? (
                <>
                  <div className="dropzone-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h3>{file.name}</h3>
                  <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              ) : (
                <>
                  <div className="dropzone-icon">
                    <UploadCloud size={32} />
                  </div>
                  <h3>Click to upload or drag and drop</h3>
                  <p>PDF, DOCX, TXT (Max. 50MB)</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }} 
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>

          <button 
            className={`summary-analyze-btn ${file && !isAnalyzing ? 'active' : ''}`}
            disabled={!file || isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? 'Analyzing Document...' : 'Generate Summary'}
          </button>
        </div>
      ) : (
        <div className="summary-results-view">
          <div className="results-header">
            <div>
              <h2>{file.name}</h2>
              <span className="badge badge-success">Analysis Complete</span>
            </div>
            <button className="btn-secondary" onClick={() => { setFile(null); setAnalysisComplete(false); }}>
              Upload Another
            </button>
          </div>

          <div className="results-grid">
            <div className="results-column">
              <div className="card">
                <h3>Executive Summary</h3>
                <p>This is a standard Non-Disclosure Agreement (NDA) between Acme Corp (Disclosing Party) and the Recipient. It aims to protect proprietary technology and business processes disclosed during partnership evaluations.</p>
              </div>

              <div className="card">
                <h3>Key Clauses Extract</h3>
                <ul className="clause-list">
                  <li>
                    <ChevronRight size={16} /> <strong>Confidentiality Term:</strong> 5 years from the date of disclosure.
                  </li>
                  <li>
                    <ChevronRight size={16} /> <strong>Return of Materials:</strong> Within 15 days upon written request.
                  </li>
                  <li>
                    <ChevronRight size={16} /> <strong>Governing Law:</strong> State of California, USA.
                  </li>
                </ul>
              </div>
            </div>

            <div className="results-column">
              <div className="card card-warning">
                <h3>Identified Risks</h3>
                <ul className="risk-list">
                  <li>The definition of "Confidential Information" is overly broad and lacks standard exclusions (e.g., publicly known info).</li>
                  <li>No explicit limitation of liability clause found.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreementSummary;
