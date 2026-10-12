import React, { useState, useEffect } from 'react';
import { 
  FileText, PenTool, Sparkles, Download, Printer, Copy, Check, Save, 
  Shield, Scale, ChevronRight, RefreshCw, Search, BookOpen, AlertCircle,
  ArrowLeft, ArrowRight
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
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | 'editor'
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

  // Core drafting function: renders immediately with zero lag, then refreshes if AI returns
  const executeDraftGeneration = async (tmplToUse, formToUse) => {
    const tmpl = tmplToUse || selectedTemplate;
    const fData = formToUse || formData;
    setIsGenerating(true);

    // 1. Instantly generate and display court-ready high fidelity draft (0ms delay)
    const initialDraft = generateFullDraft(tmpl, fData);
    setGeneratedDraft(initialDraft);

    // 2. Background attempt to augment with backend AI if online
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const response = await fetch(`${API_BASE_URL}/document/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          document_type: fData.language === 'hi' ? tmpl.titleHi : tmpl.title,
          category: tmpl.category,
          parties: [fData.partyA, fData.partyB],
          party_details: {
            partyA: fData.partyA,
            partyB: fData.partyB,
            advocateName: fData.advocateName
          },
          case_details: {
            jurisdiction: fData.jurisdiction,
            courtName: fData.courtName,
            amount: fData.amount,
            chequeNo: fData.chequeNo,
            chequeDate: fData.chequeDate,
            bankName: fData.bankName,
            firNo: fData.firNo,
            policeStation: fData.policeStation,
            propertyAddress: fData.propertyAddress,
            rentAmount: fData.rentAmount,
            securityDeposit: fData.securityDeposit
          },
          specific_clauses: fData.specificClauses ? [fData.specificClauses] : [],
          language: fData.language,
          criminal_code: fData.criminalCode
        })
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.draft) {
          setGeneratedDraft(data.draft);
        }
      }
    } catch (err) {
      // High-fidelity client draft is already displayed cleanly
    } finally {
      setIsGenerating(false);
    }
  };

  // Initial load: keep paper pre-rendered
  useEffect(() => {
    executeDraftGeneration(DRAFT_TEMPLATES[0], formData);
  }, []);

  // When user clicks "Draft Now" or any template card in Gallery
  const handleStartDrafting = (tmpl) => {
    setSelectedTemplate(tmpl);
    const updatedForm = {
      ...formData,
      partyA: tmpl.defaultPartyA || formData.partyA,
      partyB: tmpl.defaultPartyB || formData.partyB
    };
    setFormData(updatedForm);
    setViewMode('editor');
    executeDraftGeneration(tmpl, updatedForm);

    // Scroll window/container to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const container = document.querySelector('.drafting-studio-container');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When user switches template inside Editor view
  const handleSwitchTemplate = (tmpl) => {
    setSelectedTemplate(tmpl);
    const updatedForm = {
      ...formData,
      partyA: tmpl.defaultPartyA || formData.partyA,
      partyB: tmpl.defaultPartyB || formData.partyB
    };
    setFormData(updatedForm);
    executeDraftGeneration(tmpl, updatedForm);
  };

  // Form submit button handler
  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();
    await executeDraftGeneration(selectedTemplate, formData);
  };

  // Comprehensive Client-side Legal Draft Generator for ALL templates
  const generateFullDraft = (tmpl, fData) => {
    const isHi = fData.language === 'hi';
    const isBnss = fData.criminalCode === 'BNSS';
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // 1. CHEQUE BOUNCE NOTICE (138 NI ACT)
    if (tmpl.id === 'notice-138') {
      if (isHi) {
        return `रजिस्टर्ड डाक / स्पीड पोस्ट द्वारा विधिक नोटिस
(धारा 138 एवं 142 पराक्राम्य लिखत अधिनियम, 1881 के अंतर्गत)

दिनांक: ${dateStr}
स्थान: ${fData.jurisdiction}

प्रेषक:
${fData.advocateName}
अधिवक्ता, उच्च न्यायालय एवं जिला न्यायालय
कार्यालय: चैम्बर नं. 412, लॉयर्स ब्लॉक, ${fData.jurisdiction}

सेवा में (Noticee):
${fData.partyB}
निवासी: [विपक्षी का पूर्ण पता]

विषय: धारा 138 पराक्राम्य लिखत अधिनियम, 1881 के तहत चेक अनादर (Cheque Bounce) बाबत 15 दिवसीय कानूनी नोटिस।

महोदय/महोदया,

मेरे मुवक्किल श्री/श्रीमती ${fData.partyA} की ओर से तथा उनके स्पष्ट निर्देशों के अधीन, मैं आपको निम्नलिखित कानूनी नोटिस प्रेषित करता हूँ:

1. यह कि आपने अपने वैध ऋण एवं कानूनी देयता के पूर्ण भुगतान स्वरूप मेरे मुवक्किल के पक्ष में निम्नलिखित चेक जारी किया था:
   - चेक संख्या: ${fData.chequeNo}
   - दिनांक: ${fData.chequeDate}
   - राशि: ₹${fData.amount}/-
   - बैंक: ${fData.bankName}

2. यह कि मेरे मुवक्किल ने उक्त चेक को अपने बैंक खाते में भुगतान हेतु प्रस्तुत किया, परन्तु यह चेक बैंक द्वारा "खाते में पर्याप्त राशि नहीं (Funds Insufficient)" की टिप्पणी के साथ अनादृत (Dishonoured) कर लौटा दिया गया।

3. ${fData.specificClauses ? `विशिष्ट तथ्य एवं शर्तें:\n${fData.specificClauses}\n` : ''}

अतः इस विधिक नोटिस के माध्यम से आपको निर्देशित किया जाता है कि नोटिस प्राप्ति के 15 (पंद्रह) दिनों के भीतर उक्त चेक राशि ₹${fData.amount}/- का पूर्ण भुगतान मेरे मुवक्किल को करें। ऐसा न करने पर आपके विरुद्ध सक्षम न्यायालय में आपराधिक परिवाद दायर किया जाएगा, जिसमें 2 वर्ष का कारावास एवं दोगुनी राशि का जुर्माना हो सकता है।

भवदीय,
(${fData.advocateName})
अधिवक्ता`;
      }

      return `LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
(BY REGISTERED POST A.D. / SPEED POST)

Date: ${dateStr}
Place: ${fData.jurisdiction}

FROM:
${fData.advocateName}
Advocate, High Court & District Courts
Chamber No. 412, Lawyers Chambers Block, ${fData.jurisdiction}

TO (NOTICEE):
${fData.partyB}
Resident of / Having Office at: [Noticee Address Here]

RE: STATUTORY DEMAND NOTICE UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 IN RESPECT OF DISHONOUR OF CHEQUE NO. ${fData.chequeNo} FOR ₹${fData.amount}/-

Sir / Madam,

Under instructions from and on behalf of my client, ${fData.partyA}, I hereby serve upon you this Statutory Legal Notice as under:

1. That towards discharge of your legally enforceable debt and liability, you had issued Cheque No. ${fData.chequeNo} dated ${fData.chequeDate} for an amount of INR ${fData.amount}/- drawn on ${fData.bankName} in favour of my client.

2. That believing your assurance, my client presented the said cheque through their banker. However, the said cheque was returned dishonoured and unpaid with the endorsement "FUNDS INSUFFICIENT".

3. ${fData.specificClauses ? `SPECIFIC STIPULATIONS:\n${fData.specificClauses}\n` : ''}

4. That by your aforesaid act, you have committed an offence punishable under Section 138 of the Negotiable Instruments Act, 1881 as well as Section 318(4) of Bharatiya Nyaya Sanhita, 2023.

THEREFORE, I hereby call upon you to pay the entire cheque amount of INR ${fData.amount}/- to my client within 15 (FIFTEEN) DAYS of the receipt of this notice, failing which criminal proceedings shall be instituted against you before the competent Criminal Court at your sole risk, cost, and consequence.

Yours faithfully,
(${fData.advocateName})
Advocate for the Complainant`;
    }

    // 2. MONEY RECOVERY NOTICE
    if (tmpl.id === 'notice-recovery') {
      return `LEGAL NOTICE FOR RECOVERY OF OUTSTANDING DUES
(BY REGISTERED POST A.D. / SPEED POST)

Date: ${dateStr} | Place: ${fData.jurisdiction}

FROM:
${fData.advocateName} (Advocate)
Chamber No. 412, Lawyers Block, ${fData.jurisdiction}

TO:
${fData.partyB} (Debtor)

RE: DEMAND NOTICE FOR PAYMENT OF OUTSTANDING PRINCIPAL DUES OF ₹${fData.amount}/- ALONG WITH INTEREST @ 18% P.A.

Sir / Madam,

Under instructions from my client, ${fData.partyA}, I state as under:

1. That my client has supplied goods / provided professional services to you against valid invoices and acknowledged purchase orders.
2. That as per the books of accounts maintained in ordinary course of business, an aggregate sum of INR ${fData.amount}/- remains overdue, unpaid, and outstanding against you.
3. That despite repeated reminders, telephonic requests, and emails, you have intentionally neglected to clear the legitimate dues.
${fData.specificClauses ? `4. SPECIFIC FACTS:\n${fData.specificClauses}\n` : ''}

NOW THEREFORE, I call upon you to remit the total outstanding amount of INR ${fData.amount}/- together with interest @ 18% per annum within 15 days from the date of receipt hereof, failing which my client shall initiate Summary Civil Suit under Order XXXVII CPC along with insolvency/recovery proceedings before competent courts.

(${fData.advocateName})
Advocate for Creditor`;
    }

    // 3. TENANT EVICTION NOTICE
    if (tmpl.id === 'notice-eviction') {
      return `LEGAL NOTICE FOR EVICTION AND VACATION OF TENANTED PREMISES
(UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882)

Date: ${dateStr} | Place: ${fData.jurisdiction}

FROM: ${fData.advocateName} (Advocate for Landlord)
TO: ${fData.partyB} (Tenant)

SUBJECT: NOTICE TO VACATE PREMISES SITUATED AT ${fData.propertyAddress} AND HAND OVER VACANT PEACEFUL POSSESSION.

Sir,
Under instructions from my client, ${fData.partyA} (Landlord), I hereby serve upon you this notice:
1. That my client is the absolute owner of the premises situated at ${fData.propertyAddress}.
2. That you were inducted as a tenant on a monthly rental of ₹${fData.rentAmount}/- payable in advance.
3. That you have committed persistent default in payment of rent and the tenancy term stands terminated.
${fData.specificClauses ? `4. ADDITIONAL GROUNDS:\n${fData.specificClauses}\n` : ''}

YOU ARE HEREBY CALLED UPON to quit, vacate, and hand over the vacant peaceful possession of the premises to my client within 15 (Fifteen) days, failing which an eviction suit along with claim for mesne profits and damages shall be instituted against you.

(${fData.advocateName})
Advocate for Landlord`;
    }

    // 4. REGULAR BAIL APPLICATION
    if (tmpl.id === 'bail-regular') {
      const secCite = isBnss ? 'SECTION 483 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS)' : 'SECTION 439 OF Cr.P.C., 1973';
      const offences = isBnss ? 'Sections 316, 318(4) of Bharatiya Nyaya Sanhita, 2023 (BNS)' : 'Sections 420, 406 Indian Penal Code, 1860';
      return `IN THE COURT OF THE LEARNED SESSIONS JUDGE AT ${fData.jurisdiction.toUpperCase()}
BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
${fData.partyA}
...APPLICANT / ACCUSED

VERSUS

STATE (GOVT. OF NCT OF DELHI / STATE)
Through SHO, Police Station: ${fData.policeStation}
...RESPONDENT / PROSECUTION

CASE PARTICULARS:
FIR No.: ${fData.firNo} | P.S.: ${fData.policeStation}
Offences Under: ${offences}

APPLICATION UNDER ${secCite} FOR GRANT OF REGULAR BAIL ON BEHALF OF THE APPLICANT

MOST RESPECTFULLY SHOWETH:
1. That the Applicant is a law-abiding citizen with clean antecedents and deep roots in society, falsely implicated in the above FIR.
2. That the Applicant was arrested and is in judicial custody. Custodial interrogation is no longer required and investigation is substantially complete.
3. That the dispute is fundamentally civil in nature arising from commercial dealings, to which an unjust criminal colour has been given.
4. That the Applicant undertakes not to tamper with prosecution evidence, nor influence any witness, and will abide by all bail conditions.
${fData.specificClauses ? `5. SPECIAL GROUNDS:\n${fData.specificClauses}\n` : ''}

PRAYER:
Wherefore, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to release the Applicant ${fData.partyA} on regular bail in FIR No. ${fData.firNo}, P.S. ${fData.policeStation}, on furnishing sound surety to the satisfaction of this Hon'ble Court.

FILED BY:
(${fData.advocateName})
Advocate for the Applicant`;
    }

    // 5. ANTICIPATORY BAIL
    if (tmpl.id === 'bail-anticipatory') {
      const secCite = isBnss ? 'SECTION 482 OF BNSS, 2023' : 'SECTION 438 OF Cr.P.C., 1973';
      return `IN THE COURT OF THE LEARNED SESSIONS JUDGE AT ${fData.jurisdiction.toUpperCase()}
ANTICIPATORY BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
${fData.partyA}
...APPLICANT

VERSUS

STATE (NCT OF DELHI / STATE)
Through SHO, Police Station: ${fData.policeStation}
...RESPONDENT

FIR No.: ${fData.firNo} | P.S.: ${fData.policeStation}

APPLICATION UNDER ${secCite} FOR GRANT OF ANTICIPATORY BAIL IN THE EVENT OF ARREST

MOST RESPECTFULLY SHOWETH:
1. That the Applicant has a grave, well-founded apprehension of imminent arrest in connection with the false and motivated FIR captioned above.
2. That the Applicant has never been involved in any criminal activity and possesses an unblemished reputation.
3. That the Applicant undertakes to join investigation as and when directed by the Investigating Officer.
${fData.specificClauses ? `4. GROUNDS:\n${fData.specificClauses}\n` : ''}

PRAYER:
It is most respectfully prayed that in the event of arrest in FIR No. ${fData.firNo}, P.S. ${fData.policeStation}, the Applicant ${fData.partyA} may kindly be directed to be released on Anticipatory Bail.

APPLICANT THROUGH COUNSEL:
(${fData.advocateName})`;
    }

    // 6. CIVIL PLAINT FOR MONEY RECOVERY
    if (tmpl.id === 'plaint-money') {
      return `IN THE COURT OF LEARNED SENIOR CIVIL JUDGE AT ${fData.jurisdiction.toUpperCase()}
CIVIL SUIT NO. ________ OF 2026

IN THE MATTER OF:
${fData.partyA}
...PLAINTIFF

VERSUS

${fData.partyB}
...DEFENDANT

SUIT UNDER ORDER VII OF THE CODE OF CIVIL PROCEDURE, 1908 FOR RECOVERY OF ₹${fData.amount}/- WITH PENDENTE LITE AND FUTURE INTEREST

MOST RESPECTFULLY SHOWETH:
1. That the Plaintiff is a registered business enterprise carrying on lawful commercial activities.
2. That the Defendant entered into business transactions and accepted deliveries of goods against signed invoices.
3. That an amount of INR ${fData.amount}/- remains due, payable, and outstanding despite statutory legal notice.
4. That the cause of action arose within the territorial and pecuniary jurisdiction of this Hon'ble Court.
${fData.specificClauses ? `5. SPECIFIC PARTICULARS:\n${fData.specificClauses}\n` : ''}

PRAYER:
The Plaintiff most respectfully prays for a decree for the sum of INR ${fData.amount}/- along with interest @ 18% p.a. from date of filing till realization, along with costs of the suit.

PLAINTIFF
THROUGH COUNSEL: (${fData.advocateName})

VERIFICATION:
Verified at ${fData.jurisdiction} on ${dateStr} that contents of paragraphs 1 to 5 are true to plaintiff's knowledge.`;
    }

    // 7. MUTUAL CONSENT DIVORCE (SEC 13B HMA)
    if (tmpl.id === 'divorce-mutual') {
      return `IN THE FAMILY COURT AT ${fData.jurisdiction.toUpperCase()}
HMA PETITION NO. ________ OF 2026

IN THE MATTER OF:
1. ${fData.partyA} (First Petitioner / Husband)
AND
2. ${fData.partyB} (Second Petitioner / Wife)

JOINT PETITION UNDER SECTION 13B(1) OF THE HINDU MARRIAGE ACT, 1955 FOR DISSOLUTION OF MARRIAGE BY MUTUAL CONSENT

MOST RESPECTFULLY SHOWETH:
1. That marriage between Petitioner No. 1 and Petitioner No. 2 was solemnized according to Hindu rites and ceremonies.
2. That due to irreconcilable temperamental differences, the parties have been living separately for over one year.
3. That all joint matrimonial claims including permanent alimony, maintenance, stridhan, and custody have been amicably resolved.
4. That mutual consent has not been obtained by force, fraud, or undue influence.
${fData.specificClauses ? `5. SETTLEMENT CLAUSES:\n${fData.specificClauses}\n` : ''}

PRAYER:
It is most respectfully prayed that this Hon'ble Court may be pleased to dissolve the marriage between the Petitioners by a decree of divorce by mutual consent.

PETITIONER NO. 1: __________________
PETITIONER NO. 2: __________________
COUNSEL: (${fData.advocateName})`;
    }

    // 8. NON-DISCLOSURE AGREEMENT (NDA)
    if (tmpl.id === 'agreement-nda') {
      return `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

THIS AGREEMENT is entered into on this ${dateStr} at ${fData.jurisdiction}, by and between:
1. FIRST PARTY: ${fData.partyA}
AND
2. SECOND PARTY: ${fData.partyB}

WHEREAS the Parties wish to evaluate prospective business collaboration and will disclose proprietary and confidential information.

NOW THEREFORE, THE PARTIES AGREE AS FOLLOWS:
1. CONFIDENTIAL INFORMATION: Includes all proprietary technical, business, financial, software, and trade secret data disclosed by either party.
2. NON-DISCLOSURE: The receiving party shall safeguard all confidential information with standard reasonable care and not disclose to third parties without prior written consent.
3. TERM: This agreement shall remain binding for a period of two (2) years from the Effective Date.
${fData.specificClauses ? `4. SPECIAL COVENANTS:\n${fData.specificClauses}\n` : ''}
5. GOVERNING LAW: Governed exclusively by the laws of India, subject to courts at ${fData.jurisdiction}.

FOR FIRST PARTY: _________________________ (${fData.partyA})
FOR SECOND PARTY: ________________________ (${fData.partyB})
COUNSEL: _________________________________ (${fData.advocateName})`;
    }

    // 9. EMPLOYMENT AGREEMENT
    if (tmpl.id === 'agreement-employment') {
      return `EMPLOYMENT CONTRACT & APPOINTMENT AGREEMENT

THIS EMPLOYMENT AGREEMENT is executed on ${dateStr} at ${fData.jurisdiction} between:
EMPLOYER: ${fData.partyA}
AND
EMPLOYEE: ${fData.partyB}

1. POSITION & DUTIES: The Employee is appointed to the designated position, performing all duties diligently in good faith.
2. REMUNERATION: The Employee shall receive the agreed CTC/salary subject to statutory tax deductions (TDS, PF).
3. PROBATION & NOTICE: The Employee shall be on probation for a period of three (3) months, terminable with 30 days written notice.
4. CONFIDENTIALITY & IP ASSIGNMENT: All inventions, designs, and works created during employment shall vest exclusively in the Employer.
${fData.specificClauses ? `5. SPECIFIC TERMS:\n${fData.specificClauses}\n` : ''}

EMPLOYER: ___________________________
EMPLOYEE: ___________________________`;
    }

    // 10. RESIDENTIAL RENT AGREEMENT
    if (tmpl.id === 'agreement-rent') {
      return `RESIDENTIAL RENT AGREEMENT (11 MONTHS)

THIS RENT AGREEMENT is executed on this ${dateStr} at ${fData.jurisdiction} between:
LANDLORD: ${fData.partyA}
AND
TENANT: ${fData.partyB}

WHEREAS Landlord is the sole legal owner of residential premises: ${fData.propertyAddress}.

TERMS AND CONDITIONS:
1. TENURE: Fixed 11-month period commencing from ${dateStr}.
2. RENT: Monthly rent of ₹${fData.rentAmount}/- payable on or before 7th of each month.
3. SECURITY DEPOSIT: Refundable security deposit of ₹${fData.securityDeposit}/- received by Landlord.
4. UTILITIES: Tenant shall directly pay actual electricity and water charges as per meter readings.
5. USE: Strictly residential use; sub-letting is strictly prohibited.
${fData.specificClauses ? `6. SPECIAL TERMS:\n${fData.specificClauses}\n` : ''}

LANDLORD: ___________________________ (${fData.partyA})
TENANT: _____________________________ (${fData.partyB})
WITNESS 1: __________________________
WITNESS 2: __________________________`;
    }

    // 11. GENERAL SWORN AFFIDAVIT
    if (tmpl.id === 'affidavit-general') {
      return `GENERAL SWORN AFFIDAVIT ON OATH
(TO BE NOTARIZED ON NON-JUDICIAL STAMP PAPER)

BEFORE THE NOTARY PUBLIC / EXECUTIVE MAGISTRATE AT ${fData.jurisdiction.toUpperCase()}

I, ${fData.partyA}, Resident of [Permanent Residential Address], do hereby solemnly affirm and state on oath as under:

1. That I am a bona fide citizen of India and competent to depose to this affidavit.
2. That all particulars, declarations, and statements made herein are based on my true personal knowledge and records.
3. That [Specific statements of the matter].
${fData.specificClauses ? `4. SPECIFIC DECLARATIONS:\n${fData.specificClauses}\n` : ''}
5. That no material facts have been suppressed or misrepresented herein.

DEPONENT: ___________________________ (${fData.partyA})

VERIFICATION:
Verified at ${fData.jurisdiction} on ${dateStr} that contents of paragraphs 1 to 5 are true and correct.
DEPONENT
IDENTIFIED BY COUNSEL: (${fData.advocateName})`;
    }

    // DEFAULT / GENERIC LEGAL DRAFT
    return `LEGAL DOCUMENT DRAFT
TYPE: ${tmpl.title.toUpperCase()}
DATE: ${dateStr} | JURISDICTION: ${fData.jurisdiction}

FIRST PARTY: ${fData.partyA}
SECOND PARTY: ${fData.partyB}
COUNSEL: ${fData.advocateName}

WHEREAS the Parties have agreed to execute this formal legal instrument under Indian Law.
NOW THIS DEED WITNESSETH AS FOLLOWS:
1. Both Parties agree to the statutory covenants and rights governing ${tmpl.title}.
2. Each Party represents that it has full legal capacity and competence to execute this instrument.
${fData.specificClauses ? `3. SPECIAL STIPULATIONS:\n${fData.specificClauses}\n` : ''}
4. Governed exclusively by the laws of India, subject to the jurisdiction of competent courts at ${fData.jurisdiction}.

FIRST PARTY: _________________________ (${fData.partyA})
SECOND PARTY: ________________________ (${fData.partyB})
COUNSEL: _____________________________ (${fData.advocateName})`;
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

  // GALLERY VIEW: Display all legal templates with prominent "Draft Now" buttons
  if (viewMode === 'gallery') {
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
            <p>Select any court-tested Indian legal template below and click <strong>"Draft Now"</strong> to customize and generate authentic instruments.</p>
          </div>

          <div className="ds-header-stats">
            <div className="ds-stat-pill">
              <Scale size={16} className="icon-gold" />
              <span>BNS / BNSS 2023 Ready</span>
            </div>
            <div className="ds-stat-pill">
              <BookOpen size={16} color="#059669" />
              <span>Indian Courts & Registry Tested</span>
            </div>
          </div>
        </div>

        {/* Category Nav & Quick Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
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

          <div style={{ position: 'relative', width: '260px' }}>
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

        {/* Template Cards Grid */}
        <div className="ds-templates-row">
          {filteredTemplates.map(tmpl => {
            const IconComp = tmpl.icon || FileText;
            return (
              <div 
                key={tmpl.id} 
                className="ds-template-card"
                onClick={() => handleStartDrafting(tmpl)}
              >
                <div className="ds-template-top">
                  <div className="ds-template-icon">
                    <IconComp size={18} />
                  </div>
                  <span className="ds-template-tag">{tmpl.tag}</span>
                </div>
                <div className="ds-template-title">{tmpl.title}</div>
                <div className="ds-template-desc">{tmpl.desc}</div>
                <button 
                  type="button"
                  className="ds-draft-now-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartDrafting(tmpl);
                  }}
                >
                  <span>Draft Now</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // EDITOR VIEW: Dedicated full-screen drafting workspace & legal paper editor
  return (
    <div className="drafting-studio-container animate-fade-in">
      
      {/* Editor Top Navigation Bar */}
      <div className="ds-editor-nav-bar">
        <div className="ds-editor-nav-left">
          <button 
            type="button"
            className="ds-back-btn"
            onClick={() => setViewMode('gallery')}
            title="Return to Templates Gallery"
          >
            <ArrowLeft size={16} />
            <span>All Templates</span>
          </button>

          <div className="ds-active-doc-info">
            <span className="ds-doc-status-badge">Active</span>
            <span className="ds-doc-title">
              {formData.language === 'hi' ? selectedTemplate.titleHi : selectedTemplate.title}
            </span>
          </div>

          <div className="ds-quick-switch-wrap">
            <label>Template:</label>
            <select 
              className="ds-template-select-dropdown"
              value={selectedTemplate.id}
              onChange={(e) => {
                const tmpl = DRAFT_TEMPLATES.find(t => t.id === e.target.value);
                if (tmpl) handleSwitchTemplate(tmpl);
              }}
            >
              {DRAFT_TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ds-editor-nav-right">
          {/* Language Toggle */}
          <div className="ds-pill-group">
            <button 
              type="button" 
              className={`ds-pill-opt ${formData.language === 'en' ? 'active' : ''}`}
              onClick={() => {
                const updated = { ...formData, language: 'en' };
                setFormData(updated);
                executeDraftGeneration(selectedTemplate, updated);
              }}
            >
              English
            </button>
            <button 
              type="button" 
              className={`ds-pill-opt ${formData.language === 'hi' ? 'active' : ''}`}
              onClick={() => {
                const updated = { ...formData, language: 'hi' };
                setFormData(updated);
                executeDraftGeneration(selectedTemplate, updated);
              }}
            >
              Hindi
            </button>
          </div>

          {/* Criminal Code Toggle if applicable */}
          {selectedTemplate.needsCriminal && (
            <div className="ds-pill-group">
              <button 
                type="button" 
                className={`ds-pill-opt ${formData.criminalCode === 'BNSS' ? 'active' : ''}`}
                onClick={() => {
                  const updated = { ...formData, criminalCode: 'BNSS' };
                  setFormData(updated);
                  executeDraftGeneration(selectedTemplate, updated);
                }}
              >
                BNSS 2023
              </button>
              <button 
                type="button" 
                className={`ds-pill-opt ${formData.criminalCode === 'CrPC' ? 'active' : ''}`}
                onClick={() => {
                  const updated = { ...formData, criminalCode: 'CrPC' };
                  setFormData(updated);
                  executeDraftGeneration(selectedTemplate, updated);
                }}
              >
                CrPC
              </button>
            </div>
          )}

          {/* Export Action Buttons */}
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
      </div>

      {/* Studio Workspace: Left Form & Right Paper Editor */}
      <div id="drafting-workspace" className="ds-workspace-grid">
        
        {/* Left Form Panel */}
        <div className="ds-form-panel">
          
          <div className="ds-section-title">
            <FileText size={16} /> Parties & Legal Representation
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
            onClick={handleFormSubmit}
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
                Regenerate {formData.language === 'hi' ? selectedTemplate.titleHi : selectedTemplate.title}
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
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Click anywhere inside the paper to edit text directly
            </span>
          </div>

          {/* Paper Viewport */}
          <div className="ds-paper-viewport">
            {isGenerating && !generatedDraft ? (
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
