import React, { useState } from 'react';
import { PenTool, Loader2, Copy, Check, FileText, Save } from 'lucide-react';
import { supabase } from '../supabase';
import './CreateAgreement.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const CreateAgreement = ({ user, onNavigate }) => {
  const [formData, setFormData] = useState({
    type: 'Non-Disclosure Agreement',
    partyA: '',
    partyB: '',
    clauses: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.partyA || !formData.partyB) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/document/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: formData.type,
          parties: [formData.partyA, formData.partyB],
          specific_clauses: formData.clauses ? [formData.clauses] : [],
          language: 'English'
        }),
      });
      
      if (!response.ok) throw new Error('Generation failed');
      
      const data = await response.json();
      setGeneratedDoc(data.draft);
    } catch (error) {
      setGeneratedDoc('Failed to generate document. Please ensure the backend is running and OPENAI_API_KEY is configured.');
    } finally {
      setIsGenerating(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveDocument = async () => {
    if (!user || !generatedDoc) return;
    setIsSaving(true);
    try {
      const docTitle = `${formData.type} - ${formData.partyA} & ${formData.partyB}`;
      const { error } = await supabase.from('documents').insert([{
        user_id: user.id,
        title: docTitle,
        content: generatedDoc,
        status: 'Draft'
      }]);

      if (error) throw error;
      
      // Navigate to Workspace/Files page
      if (onNavigate) {
        onNavigate('files');
      }
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Failed to save document to database.");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDoc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="create-agreement-container animate-fade-in">
      <div className="ca-header">
        <h1>Create Agreement</h1>
        <p>Use AI to draft a custom legal document tailored to your specific requirements.</p>
      </div>

      <div className="ca-content">
        <div className="ca-form-section">
          <form onSubmit={handleGenerate} className="ca-form">
            <div className="form-group">
              <label>Document Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="form-control"
              >
                <option value="Non-Disclosure Agreement">Non-Disclosure Agreement (NDA)</option>
                <option value="Employment Contract">Employment Contract</option>
                <option value="Service Agreement">Service Agreement</option>
                <option value="Lease Agreement">Lease Agreement</option>
                <option value="Legal Notice">Legal Notice</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Party A (e.g. Employer, Discloser)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Company or Individual Name"
                  value={formData.partyA}
                  onChange={(e) => setFormData({ ...formData, partyA: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Party B (e.g. Employee, Recipient)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Company or Individual Name"
                  value={formData.partyB}
                  onChange={(e) => setFormData({ ...formData, partyB: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Specific Clauses or Requirements (Optional)</label>
              <textarea 
                className="form-control" 
                rows="4" 
                placeholder="E.g., Include a non-compete clause for 2 years, governing law is State of New York..."
                value={formData.clauses}
                onChange={(e) => setFormData({ ...formData, clauses: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="ca-submit-btn" disabled={isGenerating || !formData.partyA || !formData.partyB}>
              {isGenerating ? (
                <><Loader2 size={18} className="spin-icon" /> Generating Draft...</>
              ) : (
                <><PenTool size={18} /> Generate Document</>
              )}
            </button>
          </form>
        </div>

        <div className="ca-preview-section">
          <div className="preview-header">
            <h3>Generated Draft</h3>
            {generatedDoc && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="copy-btn" onClick={copyToClipboard} title="Copy to clipboard">
                  {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                </button>
                {user && (
                  <button 
                    className="save-doc-btn" 
                    onClick={handleSaveDocument} 
                    disabled={isSaving}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'var(--accent-main)', color: 'white',
                      border: 'none', padding: '6px 12px', borderRadius: '6px',
                      cursor: 'pointer', fontSize: '0.875rem'
                    }}
                  >
                    {isSaving ? <Loader2 size={16} className="spin-icon" /> : <Save size={16} />}
                    Save Document
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="preview-content">
            {isGenerating ? (
              <div className="generating-state">
                <Loader2 size={32} className="spin-icon text-gray-400" />
                <p>Drafting your agreement...</p>
              </div>
            ) : generatedDoc ? (
              <div className="document-draft">
                {generatedDoc.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FileText size={48} className="text-gray-300" style={{ margin: '0 auto 16px', color: '#cbd5e1' }} />
                <p>Fill out the form and click Generate to create your document.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAgreement;
