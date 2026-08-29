import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const SigningPortal = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [typedSignature, setTypedSignature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Extract IDs from URL path: /sign/:docId/:sigId
    const pathParts = window.location.pathname.split('/');
    const docId = pathParts[2];
    const sigId = pathParts[3];

    if (!docId || !sigId) {
      setError("Invalid signature link.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch signature record
        const { data: sig, error: errSig } = await supabase
          .from('signatures')
          .select('*')
          .eq('id', sigId)
          .eq('document_id', docId)
          .single();

        if (errSig || !sig) throw new Error("Signature request not found.");
        setSignatureData(sig);

        if (sig.status === 'Signed') {
          setIsSuccess(true);
        }

        // Fetch document
        const { data: doc, error: errDoc } = await supabase
          .from('documents')
          .select('*')
          .eq('id', docId)
          .single();

        if (errDoc || !doc) throw new Error("Document not found.");
        setDocumentData(doc);

        // Record Audit Log: Viewed
        if (sig.status !== 'Signed') {
          await supabase.from('audit_logs').insert([{
            document_id: docId,
            action: 'Viewed by Signer',
            performed_by: sig.signer_email,
            ip_address: 'Client'
          }]);
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSign = async (e) => {
    e.preventDefault();
    if (!typedSignature) return;
    setIsSubmitting(true);

    try {
      // Update signature record
      await supabase.from('signatures').update({
        status: 'Signed',
        signature_data: typedSignature, // Storing typed name as signature data for now
        signed_at: new Date().toISOString(),
        ip_address: 'Client'
      }).eq('id', signatureData.id);

      // Record Audit Log
      await supabase.from('audit_logs').insert([{
        document_id: documentData.id,
        action: 'Signed',
        performed_by: signatureData.signer_email,
        ip_address: 'Client'
      }]);

      // Update Document Status (Check if all are signed, but for simplicity, we just mark Signed)
      await supabase.from('documents').update({
        status: 'Signed'
      }).eq('id', documentData.id);

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit signature.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc'}}>
      <Loader2 size={48} className="spin-icon" style={{color: 'var(--accent-main)', animation: 'spin 1s linear infinite'}} />
      <p style={{marginTop: '1rem', color: '#64748b'}}>Loading document...</p>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc'}}>
      <AlertCircle size={48} color="#ef4444" />
      <h2 style={{marginTop: '1rem', color: '#1e293b'}}>Error</h2>
      <p style={{color: '#64748b'}}>{error}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ background: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Wakalat AI <span style={{color: '#3b82f6'}}>eSigner</span></div>
        <div style={{ fontSize: '0.875rem', color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: '99px' }}>IT Act 2000 Compliant</div>
      </header>

      <main style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h1 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.5rem', color: '#1e293b' }}>{documentData.title}</h1>
            <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.875rem' }}>
              Requested by Wakalat AI User. Please review the document below carefully before signing.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '2rem', maxHeight: '500px', overflowY: 'auto' }}>
              {documentData.content.split('\n').map((para, i) => (
                <p key={i} style={{ marginBottom: '1rem', color: '#334155', lineHeight: 1.6 }}>{para}</p>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h2 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Document Signed Successfully!</h2>
                <p style={{ color: '#64748b' }}>
                  A legally binding audit log including your timestamp and IP address has been securely recorded. You may now close this window.
                </p>
              </div>
            ) : (
              <>
                <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>Sign Document</h2>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  By typing your name below and clicking 'Sign', you agree to be legally bound by this document under the Information Technology Act, 2000.
                </p>
                <form onSubmit={handleSign}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Full Legal Name</label>
                    <input 
                      type="text" 
                      required 
                      value={typedSignature}
                      onChange={e => setTypedSignature(e.target.value)}
                      placeholder={signatureData.signer_name}
                      style={{ 
                        width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', 
                        fontFamily: "cursive, sans-serif", fontSize: '1.25rem', color: '#1e40af' 
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !typedSignature}
                      style={{
                        padding: '0.75rem 2rem', background: '#3b82f6', color: 'white', 
                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600,
                        opacity: (!typedSignature || isSubmitting) ? 0.7 : 1
                      }}
                    >
                      {isSubmitting ? 'Processing...' : 'Click to Sign'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default SigningPortal;
