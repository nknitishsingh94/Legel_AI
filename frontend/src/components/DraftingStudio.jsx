import React, { useState } from 'react';
import { 
  FileText, PenTool, Sparkles, Download, Printer, Copy, Check, Save, 
  Share2, Shield, Scale, ChevronRight, RefreshCw, Search, BookOpen, AlertCircle
} from 'lucide-react';
import { supabase } from '../supabase';
import './DraftingStudio.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const DRAFT_TEMPLATES = [
  // Legal Notices
  {
    id: 'notice-138',
    category: 'notices',
    title: 'Section 138 NI Act Cheque Bounce Notice',
    titleHi: 'धारा 138 चेक बाउंस विधिक नोटिस',
    desc: 'Statutory 15-day demand notice under Negotiable Instruments Act with criminal prosecution warning.',
    tag: 'Statutory 15-Day',
    icon: AlertCircle,
    defaultPartyA: 'Rajesh Kumar (Payee / Complainant)',
    defaultPartyB: 'M/s Apex Logistics Pvt. Ltd. (Drawer)',
    needsCheque: true,
  },
  {
    id: 'notice-recovery',
    category: 'notices',
    title: 'Money Recovery & Outstanding Dues Notice',
    titleHi: 'बकाया राशि वसूली कानूनी नोटिस',
    desc: 'Formal legal demand notice for unpaid business invoices, loans, or services with 18% p.a. interest.',
    tag: 'Civil & Commercial',
    icon: Scale,
    defaultPartyA: 'Sunita Enterprises (Creditor)',
    defaultPartyB: 'Anand Builders (Debtor)',
    needsAmount: true,
  },
  {
    id: 'notice-eviction',
    category: 'notices',
    title: 'Tenant Eviction & Vacate Notice',
    titleHi: 'किराएदार बेदखली एवं परिसर खाली नोटिस',
    desc: 'Notice to tenant for non-payment of rent, lease expiry, or violation of rental covenants.',
    tag: 'Property Law',
    icon: BookOpen,
    defaultPartyA: 'Vikramaditya Rao (Landlord)',
    defaultPartyB: 'Suresh Menon (Tenant)',
    needsProperty: true,
  },

  // Court Pleadings & Bail
  {
    id: 'bail-regular',
    category: 'court',
    title: 'Regular Bail Application (BNSS / CrPC)',
    titleHi: 'नियमित जमानत प्रार्थना पत्र (BNSS Sec 483 / CrPC 439)',
    desc: 'High-court tested format under Section 483 BNSS 2023 or Section 439 CrPC with case grounds and prayer.',
    tag: 'BNSS 2023 / CrPC',
    icon: Shield,
    defaultPartyA: 'Amitabh Sharma (Accused / Applicant)',
    defaultPartyB: 'State (NCT of Delhi / Respondent)',
    needsCriminal: true,
  },
  {
    id: 'bail-anticipatory',
    category: 'court',
    title: 'Anticipatory Bail Application',
    titleHi: 'अग्रिम जमानत याचिका (BNSS Sec 482 / CrPC 438)',
    desc: 'Pre-arrest protection petition demonstrating apprehension of arrest, clean antecedents, and bona fides.',
    tag: 'Pre-Arrest',
    icon: Shield,
    defaultPartyA: 'Devendra Patel (Applicant)',
    defaultPartyB: 'State of Maharashtra (Respondent)',
    needsCriminal: true,
  },
  {
    id: 'plaint-money',
    category: 'court',
    title: 'Civil Plaint for Money Recovery (Order VII CPC)',
    titleHi: 'दीवानी वाद / वसूली दावा (Civil Suit Plaint)',
    desc: 'Formal civil court plaint with valuation, court fees, causes of action, and decree prayer.',
    tag: 'CPC Order VII',
    icon: Scale,
    defaultPartyA: 'Apex Trading Corp (Plaintiff)',
    defaultPartyB: 'Zenith Retailers (Defendant)',
    needsAmount: true,
  },
  {
    id: 'divorce-mutual',
    category: 'court',
    title: 'Mutual Consent Divorce Petition (Sec 13B HMA)',
    titleHi: 'आपसी सहमति से तलाक याचिका (धारा 13B हिन्दू विवाह अधिनियम)',
    desc: 'Joint petition under Hindu Marriage Act with settlement terms, permanent alimony, and custody.',
    tag: 'Family Court',
    icon: Scale,
    defaultPartyA: 'Petitioner No. 1 (Husband)',
    defaultPartyB: 'Petitioner No. 2 (Wife)',
    needsFamily: true,
  },

  // Business & Contracts
  {
    id: 'agreement-nda',
    category: 'contracts',
    title: 'Mutual Non-Disclosure Agreement (NDA)',
    titleHi: 'गोपनीयता समझौता (Mutual NDA)',
    desc: 'Comprehensive bilateral confidentiality deed covering trade secrets, proprietary IP, and non-circumvention.',
    tag: 'Corporate & IP',
    icon: FileText,
    defaultPartyA: 'Innovatech Solutions Pvt. Ltd.',
    defaultPartyB: 'Nexus Alpha Ventures LLC',
  },
  {
    id: 'agreement-employment',
    category: 'contracts',
    title: 'Employment Agreement & Appointment Letter',
    titleHi: 'रोजगार अनुबंध एवं नियुक्ति पत्र',
    desc: 'Full-time employment contract with non-compete, probation terms, notice period, and IP assignment.',
    tag: 'HR & Labor',
    icon: FileText,
    defaultPartyA: 'Starlight Tech India Pvt. Ltd. (Employer)',
    defaultPartyB: 'Kunal Singhania (Employee)',
  },
  {
    id: 'agreement-service',
    category: 'contracts',
    title: 'Independent Service Provider Agreement',
    titleHi: 'स्वतंत्र सेवा प्रदाता / कंसल्टेंसी अनुबंध',
    desc: 'Freelancer and vendor service contract with milestones, payment terms, and deliverables.',
    tag: 'Commercial',
    icon: FileText,
    defaultPartyA: 'Bluebird Media (Client)',
    defaultPartyB: 'Digital Spark Consultancy (Service Provider)',
  },

  // Property & Deeds
  {
    id: 'agreement-rent',
    category: 'property',
    title: 'Residential Rent Agreement (11 Months)',
    titleHi: '11-माह आवासीय किरायानामा (Rent Deed)',
    desc: 'Standard Indian residential tenancy deed with maintenance terms, deposit return, and lock-in period.',
    tag: 'Tenancy Law',
    icon: BookOpen,
    defaultPartyA: 'Pankaj Mathur (Landlord)',
    defaultPartyB: 'Rohan Deshmukh (Tenant)',
    needsProperty: true,
  },
  {
    id: 'power-of-attorney',
    category: 'property',
    title: 'General Power of Attorney (GPA)',
    titleHi: 'आम मुख्तारनामा (General Power of Attorney)',
    desc: 'Legal authorization empowering agent to manage bank accounts, properties, and court cases.',
    tag: 'Powers & Registry',
    icon: Scale,
    defaultPartyA: 'Naveen Jindal (Principal)',
    defaultPartyB: 'Manish Jindal (Attorney Holder)',
  },

  // Affidavits
  {
    id: 'affidavit-general',
    category: 'affidavits',
    title: 'General Sworn Affidavit on Oath',
    titleHi: 'सामान्य शपथ पत्र / हलफनामा',
    desc: 'Notarized affidavit format with formal statement on oath, verification, and deponent declaration.',
    tag: 'Notary Stamp',
    icon: PenTool,
    defaultPartyA: 'Harish Chandra Roy (Deponent)',
    defaultPartyB: 'Before Notary Public / Executive Magistrate',
  },
  {
    id: 'affidavit-name-change',
    category: 'affidavits',
    title: 'Name Change Affidavit (Gazette Ready)',
    titleHi: 'नाम परिवर्तन शपथ पत्र (राजपत्र अधिसूचना हेतु)',
    desc: 'Official declaration of change of name for Gazette notification, Passport Office, and PAN card.',
    tag: 'Gazette Verified',
    icon: PenTool,
    defaultPartyA: 'Ananya Sharma (Old Name: Sunita Sharma)',
    defaultPartyB: 'General Public & Passport Authority',
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'notices', label: 'Legal Notices' },
  { id: 'court', label: 'Court Pleadings & Bail' },
  { id: 'contracts', label: 'Contracts & Agreements' },
  { id: 'property', label: 'Property & Real Estate' },
  { id: 'affidavits', label: 'Affidavits & Undertakings' },
];

const DraftingStudio = ({ user, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(DRAFT_TEMPLATES[0]);

  // Form State
  const [formData, setFormData] = useState({
    partyA: DRAFT_TEMPLATES[0].defaultPartyA,
    partyB: DRAFT_TEMPLATES[0].defaultPartyB,
    advocateName: user?.user_metadata?.full_name ? `Adv. ${user.user_metadata.full_name}` : 'Adv. Nitish Singh',
    jurisdiction: 'New Delhi',
    courtName: 'Learned Sessions Judge / Chief Judicial Magistrate, New Delhi',
    language: 'en', // 'en' or 'hi'
    criminalCode: 'BNSS', // 'BNSS' or 'CrPC'
    amount: '5,00,000',
    chequeNo: '482910',
    chequeDate: '15/01/2026',
    bankName: 'State Bank of India, Connaught Place Branch',
    firNo: '104/2026',
    policeStation: 'Connaught Place',
    propertyAddress: 'Flat No. 402, Royal Residency, Sector 62, Noida, Uttar Pradesh',
    rentAmount: '25,000',
    securityDeposit: '50,000',
    specificClauses: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Template switch handler
  const handleSelectTemplate = (tmpl) => {
    setSelectedTemplate(tmpl);
    setFormData(prev => ({
      ...prev,
      partyA: tmpl.defaultPartyA,
      partyB: tmpl.defaultPartyB
    }));
  };

  // Generate Draft via Backend API
  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/document/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_type: formData.language === 'hi' ? selectedTemplate.titleHi : selectedTemplate.title,
          category: selectedTemplate.category,
          parties: [formData.partyA, formData.partyB],
          party_details: {
            partyA: formData.partyA,
            partyB: formData.partyB,
            advocateName: formData.advocateName
          },
          case_details: {
            jurisdiction: formData.jurisdiction,
            courtName: formData.courtName,
            amount: formData.amount,
            chequeNo: formData.chequeNo,
            chequeDate: formData.chequeDate,
            bankName: formData.bankName,
            firNo: formData.firNo,
            policeStation: formData.policeStation,
            propertyAddress: formData.propertyAddress,
            rentAmount: formData.rentAmount,
            securityDeposit: formData.securityDeposit
          },
          specific_clauses: formData.specificClauses ? [formData.specificClauses] : [],
          language: formData.language,
          criminal_code: formData.criminalCode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate draft from server.');
      }

      const data = await response.json();
      setGeneratedDraft(data.draft);
    } catch (err) {
      console.warn("Backend API unavailable, using client-side generator:", err);
      // Client-side fallback generator for instant zero-downtime reliability
      const draft = generateFallbackDraft();
      setGeneratedDraft(draft);
    } finally {
      setIsGenerating(false);
    }
  };

  // Client-side fallback generator in case of network/offline issues
  const generateFallbackDraft = () => {
    const isHi = formData.language === 'hi';
    const isBnss = formData.criminalCode === 'BNSS';

    if (selectedTemplate.id === 'notice-138') {
      if (isHi) {
        return `रजिस्टर्ड डाक / स्पीड पोस्ट द्वारा विधिक नोटिस
(धारा 138 एवं 142 पराक्राम्य लिखत अधिनियम, 1881 के अंतर्गत)

दिनांक: ${new Date().toLocaleDateString('en-IN')}
स्थान: ${formData.jurisdiction}

प्रेषक:
${formData.advocateName}
अधिवक्ता, उच्च न्यायालय एवं जिला न्यायालय
कार्यालय: चैम्बर नं. 412, लॉयर्स ब्लॉक, ${formData.jurisdiction}

सेवा में (Noticee):
${formData.partyB}
निवासी: [विपक्षी का पूर्ण पता]

विषय: धारा 138 पराक्राम्य लिखत अधिनियम, 1881 के तहत चेक अनादर (Cheque Bounce) बाबत 15 दिवसीय कानूनी नोटिस।

महोदय/महोदया,

मेरे मुवक्किल श्री/श्रीमती ${formData.partyA} की ओर से तथा उनके स्पष्ट निर्देशों के अधीन, मैं आपको निम्नलिखित कानूनी नोटिस प्रेषित करता हूँ:

1. यह कि आपने अपने वैध ऋण एवं कानूनी देयता के पूर्ण भुगतान स्वरूप मेरे मुवक्किल के पक्ष में निम्नलिखित चेक जारी किया था:
   - चेक संख्या: ${formData.chequeNo}
   - दिनांक: ${formData.chequeDate}
   - राशि: ₹${formData.amount}/-
   - बैंक: ${formData.bankName}

2. यह कि मेरे मुवक्किल ने उक्त चेक को अपने बैंक खाते में भुगतान हेतु प्रस्तुत किया, परन्तु यह चेक बैंक द्वारा "खाते में पर्याप्त राशि नहीं (Funds Insufficient)" की टिप्पणी के साथ अनादृत (Dishonoured) कर लौटा दिया गया।

3. ${formData.specificClauses ? `विशिष्ट तथ्य:\n${formData.specificClauses}\n` : ''}

अतः इस विधिक नोटिस के माध्यम से आपको निर्देशित किया जाता है कि नोटिस प्राप्ति के 15 (पंद्रह) दिनों के भीतर उक्त चेक राशि ₹${formData.amount}/- का पूर्ण भुगतान मेरे मुवक्किल को करें। ऐसा न करने पर आपके विरुद्ध सक्षम न्यायालय में आपराधिक परिवाद दायर किया जाएगा।

भवदीय,
(${formData.advocateName})
अधिवक्ता`;
      }

      return `LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
(BY REGISTERED POST A.D. / SPEED POST)

Date: ${new Date().toLocaleDateString('en-IN')}
Place: ${formData.jurisdiction}

FROM:
${formData.advocateName}
Advocate, High Court & District Courts
Chamber No. 412, Lawyers Chambers Block, ${formData.jurisdiction}

TO (NOTICEE):
${formData.partyB}
Resident of / Having Office at: [Noticee Address Here]

RE: STATUTORY DEMAND NOTICE UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 IN RESPECT OF DISHONOUR OF CHEQUE NO. ${formData.chequeNo} FOR ₹${formData.amount}/-

Sir / Madam,

Under instructions from and on behalf of my client, ${formData.partyA}, I hereby serve upon you this Statutory Legal Notice as under:

1. That towards discharge of your legally enforceable debt and liability, you had issued Cheque No. ${formData.chequeNo} dated ${formData.chequeDate} for an amount of INR ${formData.amount}/- drawn on ${formData.bankName} in favour of my client.

2. That the aforesaid cheque was returned dishonoured and unpaid by the banker with the endorsement "FUNDS INSUFFICIENT".

3. ${formData.specificClauses ? `SPECIFIC STIPULATIONS:\n${formData.specificClauses}\n` : ''}

THEREFORE, I hereby call upon you to pay the entire cheque amount of INR ${formData.amount}/- to my client within 15 (FIFTEEN) DAYS of the receipt of this notice, failing which criminal proceedings under Section 138 of the Negotiable Instruments Act, 1881 shall be initiated against you before the competent Criminal Court at your sole risk, cost, and consequence.

Yours faithfully,
(${formData.advocateName})
Advocate for the Complainant`;
    }

    if (selectedTemplate.id.includes('bail')) {
      return `IN THE COURT OF THE LEARNED SESSIONS JUDGE AT ${formData.jurisdiction.toUpperCase()}
BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
${formData.partyA}
...APPLICANT / ACCUSED

VERSUS

STATE (GOVT. OF NCT OF DELHI / STATE)
Through SHO, Police Station: ${formData.policeStation}
...RESPONDENT / PROSECUTION

FIR No.: ${formData.firNo} | P.S.: ${formData.policeStation}
Offences Under: ${isBnss ? 'Sections 316, 318(4) Bharatiya Nyaya Sanhita, 2023 (BNS)' : 'Sections 420, 406 Indian Penal Code, 1860'}

APPLICATION UNDER ${isBnss ? 'SECTION 483 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS)' : 'SECTION 439 OF Cr.P.C., 1973'} FOR GRANT OF REGULAR BAIL

MOST RESPECTFULLY SHOWETH:
1. That the Applicant is a law-abiding citizen with unblemished antecedents and has been falsely implicated in the present case due to civil animosity.
2. That the Applicant was arrested and is languishing in judicial custody. Custodial interrogation is no longer required.
3. That the Applicant undertakes to abide by all conditions imposed by this Hon'ble Court and furnish solvent surety.
${formData.specificClauses ? `4. GROUNDS:\n${formData.specificClauses}\n` : ''}

PRAYER:
It is most respectfully prayed that this Hon'ble Court may graciously be pleased to release the Applicant ${formData.partyA} on bail in connection with FIR No. ${formData.firNo}, P.S. ${formData.policeStation}.

FILED BY:
(${formData.advocateName})
Advocate for the Applicant`;
    }

    // Default template
    return `LEGAL DOCUMENT DRAFT
DOCUMENT: ${selectedTemplate.title.toUpperCase()}
DATE: ${new Date().toLocaleDateString('en-IN')} | JURISDICTION: ${formData.jurisdiction}

FIRST PARTY: ${formData.partyA}
SECOND PARTY: ${formData.partyB}
ADVOCATE / LEGAL COUNSEL: ${formData.advocateName}

WHEREAS the Parties have agreed to execute this formal legal instrument under the governing laws of India.

NOW THIS DEED WITNESSETH AS FOLLOWS:
1. The Parties acknowledge the legal validity, consideration, and obligations governing ${selectedTemplate.title}.
2. Each Party warrants its full legal authority and capacity to enter into and execute this document.
${formData.specificClauses ? `3. SPECIAL TERMS & CLAUSES:\n${formData.specificClauses}\n` : ''}
4. Any dispute arising under this instrument shall be subject to the exclusive jurisdiction of the competent courts at ${formData.jurisdiction}.

IN WITNESS WHEREOF, the Parties have affixed their signatures.

FIRST PARTY: _________________________ (${formData.partyA})
SECOND PARTY: ________________________ (${formData.partyB})
LEGAL COUNSEL: _______________________ (${formData.advocateName})`;
  };

  // Save Document to Supabase
  const handleSaveToWorkspace = async () => {
    if (!user || !generatedDraft) return;
    setIsSaving(true);
    try {
      const docTitle = `${selectedTemplate.title} - ${formData.partyA} & ${formData.partyB}`;
      const { error } = await supabase.from('documents').insert([{
        user_id: user.id,
        title: docTitle,
        content: generatedDraft,
        status: 'Draft'
      }]);

      if (error) throw error;
      alert("✅ Document saved to your Workspace Files!");
      if (onNavigate) onNavigate('files');
    } catch (err) {
      console.error("Error saving document:", err);
      alert("Failed to save document to workspace.");
    } finally {
      setIsSaving(false);
    }
  };

  // Download DOCX / Word File
  const handleDownloadWord = () => {
    if (!generatedDraft) return;
    const blob = new Blob([generatedDraft], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedTemplate.id}_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print Court Paper
  const handlePrint = () => {
    window.print();
  };

  // Copy to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter Templates
  const filteredTemplates = DRAFT_TEMPLATES.filter(tmpl => {
    const matchesCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;
    const matchesSearch = tmpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tmpl.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="drafting-studio-container animate-fade-in">
      
      {/* Studio Header */}
      <div className="ds-header">
        <div className="ds-header-left">
          <h1>
            <PenTool size={28} color="#10b981" />
            Legal Drafting Studio
            <span className="ds-header-badge">AI DRAFT GEN</span>
          </h1>
          <p>Draft court-admissible petitions, statutory notices under Section 138, BNSS 2023 bail applications, and agreements in seconds.</p>
        </div>

        <div className="ds-header-stats">
          <div className="ds-stat-pill">
            <Scale size={16} className="icon-gold" />
            <span>BNS / BNSS 2023 Ready</span>
          </div>
          <div className="ds-stat-pill">
            <BookOpen size={16} color="#38bdf8" />
            <span>Bilingual Support</span>
          </div>
        </div>
      </div>

      {/* Category Nav & Quick Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div className="ds-category-nav">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              className={`ds-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
          <input 
            type="text" 
            placeholder="Search templates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="ds-input"
            style={{ paddingLeft: '32px', width: '100%', boxSizing: 'border-box', fontSize: '0.82rem' }}
          />
        </div>
      </div>

      {/* Template Cards Carousel / Grid */}
      <div className="ds-templates-row">
        {filteredTemplates.map(tmpl => {
          const IconComp = tmpl.icon || FileText;
          return (
            <div 
              key={tmpl.id} 
              className={`ds-template-card ${selectedTemplate.id === tmpl.id ? 'active' : ''}`}
              onClick={() => handleSelectTemplate(tmpl)}
            >
              <div className="ds-template-top">
                <div className="ds-template-icon">
                  <IconComp size={18} />
                </div>
                <span className="ds-template-tag">{tmpl.tag}</span>
              </div>
              <div className="ds-template-title">{formData.language === 'hi' ? tmpl.titleHi : tmpl.title}</div>
              <div className="ds-template-desc">{tmpl.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#10b981', marginTop: '0.25rem' }}>
                Draft Now <ChevronRight size={13} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Studio Workspace: Left Form & Right Paper Editor */}
      <div className="ds-workspace-grid">
        
        {/* Left Form Panel */}
        <div className="ds-form-panel">
          
          <div className="ds-section-title">
            <Scale size={16} /> 1. Drafting Configuration & Language
          </div>

          <div className="ds-form-row">
            <div className="ds-form-group">
              <label>Drafting Language</label>
              <div className="ds-pill-group">
                <button 
                  type="button" 
                  className={`ds-pill-opt ${formData.language === 'en' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, language: 'en' })}
                >
                  English
                </button>
                <button 
                  type="button" 
                  className={`ds-pill-opt ${formData.language === 'hi' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, language: 'hi' })}
                >
                  Hindi
                </button>
              </div>
            </div>

            <div className="ds-form-group">
              <label>Criminal Code</label>
              <div className="ds-pill-group">
                <button 
                  type="button" 
                  className={`ds-pill-opt ${formData.criminalCode === 'BNSS' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, criminalCode: 'BNSS' })}
                  title="Bharatiya Nyaya Sanhita / BNSS 2023"
                >
                  BNSS / BNS (2023)
                </button>
                <button 
                  type="button" 
                  className={`ds-pill-opt ${formData.criminalCode === 'CrPC' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, criminalCode: 'CrPC' })}
                  title="Traditional CrPC / IPC"
                >
                  CrPC / IPC
                </button>
              </div>
            </div>
          </div>

          <div className="ds-section-title" style={{ marginTop: '0.5rem' }}>
            <FileText size={16} /> 2. Parties & Representation
          </div>

          <div className="ds-form-row">
            <div className="ds-form-group">
              <label>
                Party 1 / Complainant / Landlord / First Party <span className="required">*</span>
              </label>
              <input 
                type="text" 
                className="ds-input"
                placeholder="Full Legal Name"
                value={formData.partyA}
                onChange={e => setFormData({ ...formData, partyA: e.target.value })}
                required
              />
            </div>

            <div className="ds-form-group">
              <label>
                Party 2 / Respondent / Accused / Second Party <span className="required">*</span>
              </label>
              <input 
                type="text" 
                className="ds-input"
                placeholder="Full Legal Name"
                value={formData.partyB}
                onChange={e => setFormData({ ...formData, partyB: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="ds-form-row">
            <div className="ds-form-group">
              <label>Counsel / Advocate Name</label>
              <input 
                type="text" 
                className="ds-input"
                placeholder="e.g. Adv. Rajesh Sharma, Bar D/1482"
                value={formData.advocateName}
                onChange={e => setFormData({ ...formData, advocateName: e.target.value })}
              />
            </div>

            <div className="ds-form-group">
              <label>Territorial Jurisdiction / City</label>
              <input 
                type="text" 
                className="ds-input"
                placeholder="e.g. New Delhi / Mumbai / Lucknow"
                value={formData.jurisdiction}
                onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })}
              />
            </div>
          </div>

          {/* Conditional Case Details: Cheque Bounce */}
          {selectedTemplate.needsCheque && (
            <>
              <div className="ds-section-title" style={{ marginTop: '0.5rem' }}>
                <AlertCircle size={16} /> Section 138 Cheque Particulars
              </div>
              <div className="ds-form-row">
                <div className="ds-form-group">
                  <label>Cheque Number</label>
                  <input 
                    type="text" 
                    className="ds-input"
                    placeholder="e.g. 482910"
                    value={formData.chequeNo}
                    onChange={e => setFormData({ ...formData, chequeNo: e.target.value })}
                  />
                </div>
                <div className="ds-form-group">
                  <label>Cheque Amount (₹)</label>
                  <input 
                    type="text" 
                    className="ds-input"
                    placeholder="e.g. 5,00,000"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>
              <div className="ds-form-row">
                <div className="ds-form-group">
                  <label>Cheque Date</label>
                  <input 
                    type="text" 
                    className="ds-input"
                    placeholder="DD/MM/YYYY"
                    value={formData.chequeDate}
                    onChange={e => setFormData({ ...formData, chequeDate: e.target.value })}
                  />
                </div>
                <div className="ds-form-group">
                  <label>Drawn On Bank & Branch</label>
                  <input 
                    type="text" 
                    className="ds-input"
                    placeholder="e.g. State Bank of India, CP Branch"
                    value={formData.bankName}
                    onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {/* Conditional Case Details: Criminal / Bail */}
          {selectedTemplate.needsCriminal && (
            <>
              <div className="ds-section-title" style={{ marginTop: '0.5rem' }}>
                <Shield size={16} /> FIR & Criminal Case Details
              </div>
              <div className="ds-form-row">
                <div className="ds-form-group">
                  <label>FIR Number & Year</label>
                  <input 
                    type="text" 
                    className="ds-input"
                    placeholder="e.g. 104/2026"
                    value={formData.firNo}
                    onChange={e => setFormData({ ...formData, firNo: e.target.value })}
                  />
                </div>
                <div className="ds-form-group">
                  <label>Police Station & District</label>
                  <input 
                    type="text" 
                    className="ds-input"
                    placeholder="e.g. P.S. Connaught Place, New Delhi"
                    value={formData.policeStation}
                    onChange={e => setFormData({ ...formData, policeStation: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {/* Conditional Case Details: Property / Rent */}
          {selectedTemplate.needsProperty && (
            <>
              <div className="ds-section-title" style={{ marginTop: '0.5rem' }}>
                <BookOpen size={16} /> Demised Property & Rent Details
              </div>
              <div className="ds-form-group">
                <label>Full Property Address</label>
                <input 
                  type="text" 
                  className="ds-input"
                  placeholder="House/Flat No, Society, Street, City, State"
                  value={formData.propertyAddress}
                  onChange={e => setFormData({ ...formData, propertyAddress: e.target.value })}
                />
              </div>
              <div className="ds-form-row">
                <div className="ds-form-group">
                  <label>Monthly Rent (₹)</label>
                  <input 
                    type="text" 
                    className="ds-input"
                    placeholder="e.g. 25,000"
                    value={formData.rentAmount}
                    onChange={e => setFormData({ ...formData, rentAmount: e.target.value })}
                  />
                </div>
                <div className="ds-form-group">
                  <label>Refundable Security Deposit (₹)</label>
                  <input 
                    type="text" 
                    className="ds-input"
                    placeholder="e.g. 50,000"
                    value={formData.securityDeposit}
                    onChange={e => setFormData({ ...formData, securityDeposit: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {/* Special Facts & Clauses Textarea */}
          <div className="ds-form-group">
            <label>Specific Facts, Grounds, or Custom Clauses (Optional)</label>
            <textarea 
              className="ds-textarea"
              placeholder="Enter any specific facts, loan particulars, lock-in period, grounds for bail, or non-compete terms..."
              value={formData.specificClauses}
              onChange={e => setFormData({ ...formData, specificClauses: e.target.value })}
            />
          </div>

          <button 
            type="button" 
            className="ds-generate-btn" 
            onClick={handleGenerate}
            disabled={isGenerating || !formData.partyA || !formData.partyB}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="ds-spinning" />
                Drafting Court Document with AI...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate {formData.language === 'hi' ? selectedTemplate.titleHi : selectedTemplate.title}
              </>
            )}
          </button>

        </div>

        {/* Right Legal Document Canvas Panel */}
        <div className="ds-preview-panel">
          
          {/* Action Toolbar */}
          <div className="ds-preview-toolbar">
            <div className="ds-toolbar-title">
              <FileText size={16} color="#10b981" />
              <span>Court Document Paper Editor</span>
            </div>

            {generatedDraft && (
              <div className="ds-toolbar-actions">
                <button className="ds-tool-btn" onClick={handleCopy} title="Copy Draft to Clipboard">
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button className="ds-tool-btn" onClick={handleDownloadWord} title="Download as Word Document (.doc)">
                  <Download size={14} />
                  <span>Word (.doc)</span>
                </button>

                <button className="ds-tool-btn" onClick={handlePrint} title="Print / Save PDF with Court Margins">
                  <Printer size={14} />
                  <span>Print / PDF</span>
                </button>

                {user && (
                  <button 
                    className="ds-tool-btn primary" 
                    onClick={handleSaveToWorkspace}
                    disabled={isSaving}
                    title="Save to Workspace Documents"
                  >
                    <Save size={14} />
                    <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Paper Viewport */}
          <div className="ds-paper-viewport">
            {isGenerating ? (
              <div className="ds-state-box">
                <RefreshCw size={40} className="ds-spinning" color="#10b981" />
                <h3>Drafting Legal Instrument...</h3>
                <p>Analyzing statutory citations, BNSS/CrPC grounds, and Indian judicial drafting standards.</p>
              </div>
            ) : generatedDraft ? (
              <div 
                className="ds-court-paper" 
                contentEditable 
                suppressContentEditableWarning 
                onBlur={e => setGeneratedDraft(e.currentTarget.innerText)}
                title="Click anywhere to edit this legal draft directly"
              >
                {generatedDraft}
              </div>
            ) : (
              <div className="ds-state-box">
                <Scale size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                <h3>No Draft Generated Yet</h3>
                <p>Select a legal template, enter case particulars on the left, and click <strong>"Generate"</strong> to produce an authentic legal instrument.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default DraftingStudio;
