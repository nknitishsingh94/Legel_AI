import React, { useState, useEffect } from 'react';
import { 
  FileText, PenTool, Sparkles, Download, Printer, Copy, Check, Save, 
  Shield, Scale, ChevronRight, ChevronDown, ChevronUp, RefreshCw, Search, BookOpen, AlertCircle,
  ArrowLeft, ArrowRight, Info, Layers, CheckSquare, Square, X, ExternalLink, HelpCircle
} from 'lucide-react';
import { supabase } from '../supabase';
import './DraftingStudio.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// BNS, BNSS & Indian Statutory Knowledge Base with Old IPC / CrPC / IEA Mappings
const BNS_IPC_MAPPING = [
  { bns: 'BNS Sec 318(4)', bnsTitle: 'Cheating & Dishonest Inducement', bnsHi: 'धोखाधड़ी एवं कपट छल', old: 'IPC Sec 420', oldTitle: 'Cheating and dishonestly inducing delivery of property', cat: 'Criminal / Fraud', punishment: 'Up to 7 years + Fine (Non-Bailable)' },
  { bns: 'BNS Sec 316', bnsTitle: 'Criminal Breach of Trust', bnsHi: 'आपराधिक न्यासभंग / विश्वासघात', old: 'IPC Sec 406', oldTitle: 'Criminal breach of trust', cat: 'Property / Trust', punishment: 'Up to 5 years / Fine (Cognizable)' },
  { bns: 'BNS Sec 351(2)', bnsTitle: 'Criminal Intimidation', bnsHi: 'आपराधिक धमकी', old: 'IPC Sec 506', oldTitle: 'Criminal intimidation', cat: 'Person / Threat', punishment: 'Up to 2 yrs / 7 yrs if threat of death' },
  { bns: 'BNS Sec 338', bnsTitle: 'Forgery of Valuable Security / Will', bnsHi: 'मूल्यवान प्रतिभूति जालसाजी', old: 'IPC Sec 467', oldTitle: 'Forgery of valuable security, will, etc.', cat: 'Forgery', punishment: 'Life or up to 10 yrs + Fine' },
  { bns: 'BNS Sec 336(3)', bnsTitle: 'Forgery for Purpose of Cheating', bnsHi: 'धोखाधड़ी हेतु कूटरचना', old: 'IPC Sec 468', oldTitle: 'Forgery for purpose of cheating', cat: 'Forgery', punishment: 'Up to 7 years + Fine' },
  { bns: 'BNS Sec 340', bnsTitle: 'Using as Genuine a Forged Document', bnsHi: 'जाली दस्तावेज का असली रूप में उपयोग', old: 'IPC Sec 471', oldTitle: 'Using as genuine a forged document', cat: 'Forgery', punishment: 'Punished as for forgery' },
  { bns: 'BNS Sec 61(2)', bnsTitle: 'Criminal Conspiracy', bnsHi: 'आपराधिक षड्यंत्र', old: 'IPC Sec 120B', oldTitle: 'Criminal conspiracy', cat: 'Conspiracy', punishment: 'Same as offence or 6 months' },
  { bns: 'BNS Sec 329', bnsTitle: 'Criminal Trespass / House Trespass', bnsHi: 'आपराधिक अतिचार', old: 'IPC Sec 447/448', oldTitle: 'Criminal trespass & House trespass', cat: 'Property Law', punishment: 'Up to 3 months / 1 yr + Fine' },
  { bns: 'BNS Sec 303(2)', bnsTitle: 'Theft / Dishonest Misappropriation', bnsHi: 'चोरी व गबन', old: 'IPC Sec 379', oldTitle: 'Theft', cat: 'Property', punishment: 'Up to 3 yrs or fine or community service' },
  { bns: 'BNS Sec 352', bnsTitle: 'Intentional Insult Provoking Breach of Peace', bnsHi: 'शांतिभंग हेतु जानबूझकर अपमान', old: 'IPC Sec 504', oldTitle: 'Intentional insult to provoke breach of peace', cat: 'Public Order', punishment: 'Up to 2 years or fine' },
  { bns: 'BNS Sec 227', bnsTitle: 'Giving False Evidence / Perjury Warning', bnsHi: 'झूठा साक्ष्य देना / झूठा हलफनामा', old: 'IPC Sec 193', oldTitle: 'Punishment for false evidence', cat: 'Judicial Process', punishment: 'Up to 7 years imprisonment + Fine' },
  { bns: 'BNSS Sec 483', bnsTitle: 'Regular Bail (Sessions & High Court)', bnsHi: 'नियमित जमानत (सत्र व उच्च न्यायालय)', old: 'Cr.P.C. Sec 439', oldTitle: 'Special powers of High Court or Court of Session regarding bail', cat: 'Bail Procedure', punishment: 'Release on bail bonds & solvent surety' },
  { bns: 'BNSS Sec 482', bnsTitle: 'Anticipatory Bail (Apprehension of Arrest)', bnsHi: 'अग्रिम जमानत (गिरफ्तारी की आशंका)', old: 'Cr.P.C. Sec 438', oldTitle: 'Direction for grant of bail to person apprehending arrest', cat: 'Pre-Arrest Bail', punishment: 'Protection from custodial arrest' },
  { bns: 'BNSS Sec 223', bnsTitle: 'Private Criminal Complaint Procedure', bnsHi: 'निजी परिवाद पर मजिस्ट्रेट संज्ञान', old: 'Cr.P.C. Sec 200/202', oldTitle: 'Examination of complainant & magistrate inquiry', cat: 'Magistrate Court', punishment: 'Judicial summons to accused' },
  { bns: 'BNSS Sec 173', bnsTitle: 'FIR & Zero FIR Registration', bnsHi: 'प्राथमिकी (FIR) दर्ज करने का अधिकार', old: 'Cr.P.C. Sec 154', oldTitle: 'Information in cognizable cases', cat: 'Police Procedure', punishment: 'Mandatory FIR registration' },
  { bns: 'BSA Sec 63', bnsTitle: 'Electronic Records Certificate', bnsHi: 'इलेक्ट्रॉनिक साक्ष्य ग्राह्यता प्रमाण पत्र', old: 'IEA Sec 65B', oldTitle: 'Admissibility of electronic records certificate', cat: 'Evidence Law', punishment: 'Mandatory certificate for chats & logs' }
];

const QUICK_ADDABLE_BNS = [
  { code: 'BNS Sec 318(4)', title: 'Cheating (धोखाधड़ी)', old: 'IPC 420', punishment: '7 yrs (Non-Bailable)' },
  { code: 'BNS Sec 316', title: 'Breach of Trust (विश्वासघात)', old: 'IPC 406', punishment: '5 yrs (Cognizable)' },
  { code: 'BNS Sec 351(2)', title: 'Intimidation (धमकी)', old: 'IPC 506', punishment: '2 to 7 yrs' },
  { code: 'BNS Sec 338', title: 'Forgery (जालसाजी)', old: 'IPC 467', punishment: '10 yrs / Life' },
  { code: 'BNS Sec 61(2)', title: 'Conspiracy (षड्यंत्र)', old: 'IPC 120B', punishment: 'Substantive' },
  { code: 'BSA Sec 63', title: 'Electronic Evidence (डिजिटल साक्ष्य)', old: 'IEA 65B', punishment: 'Mandatory Proof' }
];

const DRAFT_TEMPLATES = [
  // Legal Notices
  {
    id: 'notice-138',
    category: 'notices',
    title: 'Section 138 NI Act Cheque Bounce Notice',
    titleHi: 'धारा 138 चेक बाउंस विधिक नोटिस',
    desc: 'Statutory 15-day demand notice under Negotiable Instruments Act with criminal prosecution warning under BNS 318(4).',
    tag: 'Statutory 15-Day',
    icon: AlertCircle,
    primaryLaw: 'Negotiable Instruments Act, 1881 & Bharatiya Nyaya Sanhita, 2023 (BNS)',
    primaryLawHi: 'पराक्राम्य लिखत अधिनियम, 1881 एवं भारतीय न्याय संहिता, 2023 (BNS)',
    applicableActs: [
      'Negotiable Instruments Act, 1881',
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
      'Bharatiya Sakshya Adhiniyam, 2023 (BSA)'
    ],
    keySections: [
      { code: 'NI Act Sec 138', title: 'Cheque Dishonour for Insufficiency of Funds', titleHi: 'अपर्याप्त राशि पर चेक अनादर', oldMapping: 'Special Statute', punishment: 'Up to 2 yrs imprisonment or fine up to 2x cheque' },
      { code: 'NI Act Sec 142', title: 'Cognizance of Offence & Statutory Demand Notice', titleHi: 'संज्ञान एवं 15-दिवसीय विधिक मांग', oldMapping: 'Special Statute', punishment: 'Mandatory pre-requisite for complaint' },
      { code: 'BNS Sec 318(4)', title: 'Cheating & Fraudulent Inducement', titleHi: 'धोखाधड़ी एवं कपटपूर्ण छल', oldMapping: 'Formerly IPC Sec 420', punishment: 'Up to 7 years imprisonment + fine (Non-Bailable)' },
      { code: 'BNS Sec 316', title: 'Criminal Breach of Trust', titleHi: 'आपराधिक विश्वासघात', oldMapping: 'Formerly IPC Sec 406', punishment: 'Up to 5 years imprisonment (Cognizable)' },
      { code: 'BSA Sec 63', title: 'Electronic Bank Return Memo Certificate', titleHi: 'डिजिटल बैंक मेमो साक्ष्य प्रमाण पत्र', oldMapping: 'Formerly Evidence Act Sec 65B', punishment: 'Mandatory electronic evidence proof' }
    ],
    defaultSelectedBns: ['NI Act Sec 138', 'NI Act Sec 142', 'BNS Sec 318(4)', 'BNS Sec 316', 'BSA Sec 63'],
    defaultPartyA: 'Rajesh Kumar (Payee / Complainant)',
    defaultPartyB: 'M/s Apex Logistics Pvt. Ltd. (Drawer)',
    needsCheque: true,
  },
  {
    id: 'notice-recovery',
    category: 'notices',
    title: 'Money Recovery & Outstanding Dues Notice',
    titleHi: 'बकाया राशि वसूली कानूनी नोटिस',
    desc: 'Formal legal demand notice for unpaid business invoices, loans, or services with 18% p.a. interest under CPC & Contract Act.',
    tag: 'Civil & Commercial',
    icon: Scale,
    primaryLaw: 'Code of Civil Procedure, 1908 & Indian Contract Act, 1872',
    primaryLawHi: 'व्यवहार प्रक्रिया संहिता, 1908 एवं भारतीय संविदा अधिनियम, 1872',
    applicableActs: [
      'Code of Civil Procedure, 1908 (CPC)',
      'Indian Contract Act, 1872',
      'Commercial Courts Act, 2015',
      'Bharatiya Nyaya Sanhita, 2023 (BNS)'
    ],
    keySections: [
      { code: 'Order XXXVII CPC', title: 'Summary Procedure for Debt Recovery', titleHi: 'संक्षिप्त वसूली प्रक्रिया (Summary Suit)', oldMapping: 'CPC 1908', punishment: 'Immediate decree upon failure to defend' },
      { code: 'Order VII CPC', title: 'Civil Suit Plaint for Overdue Recovery', titleHi: 'दीवानी वाद एवं वसूली दावा', oldMapping: 'CPC 1908', punishment: 'Money decree with 18% p.a. interest' },
      { code: 'Contract Act Sec 73', title: 'Compensation for Breach of Contract', titleHi: 'संविदा भंग पर हर्जाना व क्षतिपूर्ति', oldMapping: 'Contract Law', punishment: 'Enforceable liquidated damages' },
      { code: 'BNS Sec 318(4)', title: 'Cheating & Inducement (Optional Criminal)', titleHi: 'धोखाधड़ी एवं कपट छल (आपराधिक दायित्व)', oldMapping: 'Formerly IPC Sec 420', punishment: 'Up to 7 years imprisonment' }
    ],
    defaultSelectedBns: ['Order XXXVII CPC', 'Order VII CPC', 'Contract Act Sec 73', 'BNS Sec 318(4)'],
    defaultPartyA: 'Sunita Enterprises (Creditor)',
    defaultPartyB: 'Anand Builders (Debtor)',
    needsAmount: true,
  },
  {
    id: 'notice-eviction',
    category: 'notices',
    title: 'Tenant Eviction & Vacate Notice',
    titleHi: 'किराएदार बेदखली एवं परिसर खाली नोटिस',
    desc: 'Statutory notice under Section 106 Transfer of Property Act for non-payment of rent, lease expiry, or violation of covenants.',
    tag: 'Property Law',
    icon: BookOpen,
    primaryLaw: 'Transfer of Property Act, 1882 & Rent Control Act',
    primaryLawHi: 'सम्पत्ति अन्तरण अधिनियम, 1882 एवं किराया नियंत्रण कानून',
    applicableActs: [
      'Transfer of Property Act, 1882 (TPA)',
      'Model Tenancy Act / State Rent Control Act',
      'Code of Civil Procedure, 1908',
      'Bharatiya Nyaya Sanhita, 2023 (BNS)'
    ],
    keySections: [
      { code: 'TPA Sec 106', title: 'Statutory 15-Day Notice to Quit Tenancy', titleHi: 'परिसर खाली करने बाबत 15-दिवसीय विधिक नोटिस', oldMapping: 'TPA 1882', punishment: 'Mandatory condition precedent for eviction' },
      { code: 'TPA Sec 111(g)', title: 'Determination & Forfeiture of Lease for Default', titleHi: 'किराया डिफ़ॉल्ट पर पट्टा निरस्तीकरण', oldMapping: 'TPA 1882', punishment: 'Extinguishment of tenancy rights' },
      { code: 'Order VII CPC', title: 'Civil Suit for Possession & Mesne Profits', titleHi: 'कब्जा वसूली एवं हर्जाना दावा', oldMapping: 'CPC 1908', punishment: 'Court eviction decree & mesne profits' },
      { code: 'BNS Sec 329', title: 'Criminal Trespass for Unlawful Occupation', titleHi: 'अवैध कब्जे पर आपराधिक अतिचार', oldMapping: 'Formerly IPC Sec 447/448', punishment: 'Criminal prosecution for trespass' }
    ],
    defaultSelectedBns: ['TPA Sec 106', 'TPA Sec 111(g)', 'Order VII CPC', 'BNS Sec 329'],
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
    desc: 'High-court tested bail application under Section 483 BNSS 2023 with grounds of parity, clean antecedents, and lack of custodial need.',
    tag: 'BNSS 2023 / CrPC',
    icon: Shield,
    primaryLaw: 'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) & BNS 2023',
    primaryLawHi: 'भारतीय नागरिक सुरक्षा संहिता, 2023 (BNSS) एवं BNS 2023',
    applicableActs: [
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Bharatiya Sakshya Adhiniyam, 2023 (BSA)'
    ],
    keySections: [
      { code: 'BNSS Sec 483', title: 'Regular Bail before Sessions Court / High Court', titleHi: 'सत्र एवं उच्च न्यायालय द्वारा नियमित जमानत', oldMapping: 'Formerly Cr.P.C. Sec 439', punishment: 'Release on solvent sureties & bail bonds' },
      { code: 'BNS Sec 318(4)', title: 'Cheating & Dishonest Inducement', titleHi: 'धोखाधड़ी एवं कपट छल (आरोप)', oldMapping: 'Formerly IPC Sec 420', punishment: 'Up to 7 years imprisonment (Non-bailable)' },
      { code: 'BNS Sec 316', title: 'Criminal Breach of Trust', titleHi: 'आपराधिक विश्वासघात (आरोप)', oldMapping: 'Formerly IPC Sec 406', punishment: 'Up to 5 years imprisonment (Cognizable)' },
      { code: 'BNS Sec 351(2)', title: 'Criminal Intimidation', titleHi: 'आपराधिक धमकी (आरोप)', oldMapping: 'Formerly IPC Sec 506', punishment: 'Up to 2 / 7 years imprisonment' },
      { code: 'BSA Sec 63', title: 'Admissibility of Electronic Records (WhatsApp / CDR)', titleHi: 'इलेक्ट्रॉनिक साक्ष्य / सीडीआर ग्राह्यता', oldMapping: 'Formerly Evidence Act Sec 65B', punishment: 'Mandatory electronic certificate' }
    ],
    defaultSelectedBns: ['BNSS Sec 483', 'BNS Sec 318(4)', 'BNS Sec 316', 'BNS Sec 351(2)', 'BSA Sec 63'],
    defaultPartyA: 'Amitabh Sharma (Accused / Applicant)',
    defaultPartyB: 'State (NCT of Delhi / Respondent)',
    needsCriminal: true,
  },
  {
    id: 'bail-anticipatory',
    category: 'court',
    title: 'Anticipatory Bail Application',
    titleHi: 'अग्रिम जमानत याचिका (BNSS Sec 482 / CrPC 438)',
    desc: 'Pre-arrest protection petition under Section 482 BNSS 2023 demonstrating apprehension of arrest, clean antecedents, and bona fides.',
    tag: 'Pre-Arrest',
    icon: Shield,
    primaryLaw: 'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS Sec 482)',
    primaryLawHi: 'भारतीय नागरिक सुरक्षा संहिता, 2023 (BNSS धारा 482 - अग्रिम जमानत)',
    applicableActs: [
      'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
      'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      'Constitution of India (Article 21)'
    ],
    keySections: [
      { code: 'BNSS Sec 482', title: 'Anticipatory Bail in Apprehension of Arrest', titleHi: 'गिरफ्तारी की आशंका में अग्रिम जमानत', oldMapping: 'Formerly Cr.P.C. Sec 438', punishment: 'Protection from custodial arrest' },
      { code: 'BNS Sec 318(4)', title: 'Alleged Cheating & Fraud', titleHi: 'धोखाधड़ी का आरोप', oldMapping: 'Formerly IPC Sec 420', punishment: 'Pre-arrest protection subject to inquiry' },
      { code: 'BNS Sec 338', title: 'Alleged Forgery of Valuable Security', titleHi: 'मूल्यवान प्रतिभूति जालसाजी आरोप', oldMapping: 'Formerly IPC Sec 467', punishment: 'Life / up to 10 years imprisonment' },
      { code: 'Constitution Art 21', title: 'Right to Personal Liberty against Unjust Arrest', titleHi: 'प्राण एवं दैहिक स्वतंत्रता का मौलिक अधिकार', oldMapping: 'Constitution', punishment: 'Judicial restraint on arbitrary arrest' }
    ],
    defaultSelectedBns: ['BNSS Sec 482', 'BNS Sec 318(4)', 'BNS Sec 338', 'Constitution Art 21'],
    defaultPartyA: 'Devendra Patel (Applicant)',
    defaultPartyB: 'State of Maharashtra (Respondent)',
    needsCriminal: true,
  },
  {
    id: 'plaint-money',
    category: 'court',
    title: 'Civil Plaint for Money Recovery (Order VII CPC)',
    titleHi: 'दीवानी वाद / वसूली दावा (Civil Suit Plaint)',
    desc: 'Formal civil court plaint under Order VII CPC with valuation, court fees, causes of action, and decree prayer.',
    tag: 'CPC Order VII',
    icon: Scale,
    primaryLaw: 'Code of Civil Procedure, 1908 (Order VII) & Indian Contract Act, 1872',
    primaryLawHi: 'व्यवहार प्रक्रिया संहिता, 1908 (आदेश 7) एवं भारतीय संविदा अधिनियम, 1872',
    applicableActs: [
      'Code of Civil Procedure, 1908',
      'Indian Contract Act, 1872',
      'Court Fees Act, 1870',
      'Commercial Courts Act, 2015'
    ],
    keySections: [
      { code: 'Order VII Rule 1 CPC', title: 'Plaint Requirements, Valuation & Cause of Action', titleHi: 'वादपत्र के सारवान विवरण एवं क्षेत्राधिकार', oldMapping: 'CPC 1908', punishment: 'Civil trial and decree' },
      { code: 'Order XXXVII CPC', title: 'Summary Suit for Liquidated Commercial Debt', titleHi: 'संक्षिप्त वसूली प्रक्रिया', oldMapping: 'CPC 1908', punishment: 'Expedited decree without leave to defend' },
      { code: 'Contract Act Sec 73', title: 'Compensation for Loss on Breach of Contract', titleHi: 'संविदा भंग पर हर्जाना व क्षतिपूर्ति', oldMapping: 'Contract Law', punishment: 'Enforceable money decree' },
      { code: 'Sec 34 CPC', title: 'Pendente Lite & Future Interest', titleHi: 'मुकदमा अवधि एवं भविष्य का ब्याज (18% p.a.)', oldMapping: 'CPC 1908', punishment: 'Statutory interest award' }
    ],
    defaultSelectedBns: ['Order VII Rule 1 CPC', 'Order XXXVII CPC', 'Contract Act Sec 73', 'Sec 34 CPC'],
    defaultPartyA: 'Apex Trading Corp (Plaintiff)',
    defaultPartyB: 'Zenith Retailers (Defendant)',
    needsAmount: true,
  },
  {
    id: 'divorce-mutual',
    category: 'court',
    title: 'Mutual Consent Divorce Petition (Sec 13B HMA)',
    titleHi: 'आपसी सहमति से तलाक याचिका (धारा 13B हिन्दू विवाह अधिनियम)',
    desc: 'Joint petition under Section 13B Hindu Marriage Act with settlement terms, permanent alimony, and custody covenants.',
    tag: 'Family Court',
    icon: Scale,
    primaryLaw: 'Hindu Marriage Act, 1955 (Section 13B) & Family Courts Act, 1984',
    primaryLawHi: 'हिन्दू विवाह अधिनियम, 1955 (धारा 13B) एवं परिवार न्यायालय अधिनियम',
    applicableActs: [
      'Hindu Marriage Act, 1955',
      'Family Courts Act, 1984'
    ],
    keySections: [
      { code: 'HMA Sec 13B(1)', title: 'First Motion for Mutual Consent Divorce', titleHi: 'आपसी सहमति तलाक हेतु प्रथम प्रस्ताव (1st Motion)', oldMapping: 'Family Law', punishment: 'Judicial separation recognition' },
      { code: 'HMA Sec 13B(2)', title: 'Second Motion for Final Decree of Dissolution', titleHi: 'विवाह विघटन की अंतिम डिक्री (2nd Motion)', oldMapping: 'Family Law', punishment: 'Final decree of divorce' },
      { code: 'HMA Sec 25', title: 'Permanent Alimony & Maintenance Settlement', titleHi: 'स्थाई गुजारा भत्ता एवं स्त्रीधन निपटारा', oldMapping: 'Family Law', punishment: 'Binding financial settlement' }
    ],
    defaultSelectedBns: ['HMA Sec 13B(1)', 'HMA Sec 13B(2)', 'HMA Sec 25'],
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
    desc: 'Comprehensive bilateral confidentiality deed covering trade secrets, proprietary IP, and non-circumvention under Contract Act.',
    tag: 'Corporate & IP',
    icon: FileText,
    primaryLaw: 'Indian Contract Act, 1872 & Specific Relief Act, 1963',
    primaryLawHi: 'भारतीय संविदा अधिनियम, 1872 एवं विनिर्दिष्ट अनुतोष अधिनियम',
    applicableActs: [
      'Indian Contract Act, 1872',
      'Specific Relief Act, 1963',
      'Information Technology Act, 2000',
      'Bharatiya Nyaya Sanhita, 2023 (BNS)'
    ],
    keySections: [
      { code: 'Contract Act Sec 10 & 27', title: 'Valid Non-Disclosure Covenants & Trade Secrets', titleHi: 'गोपनीय व्यापारिक अनुबंध की वैधता', oldMapping: 'Contract Law', punishment: 'Binding commercial deed' },
      { code: 'Specific Relief Act Sec 38', title: 'Perpetual Injunction against Confidentiality Breach', titleHi: 'गोपनीयता उल्लंघन पर स्थाई रोक (Injunction)', oldMapping: 'Specific Relief', punishment: 'Court restraining order' },
      { code: 'IT Act Sec 43A & 72A', title: 'Penalty for Breach of Sensitive Personal Data', titleHi: 'डिजिटल डेटा उल्लंघन पर दंडात्मक हर्जाना', oldMapping: 'Cyber Law', punishment: 'Civil damages & imprisonment up to 3 yrs' },
      { code: 'BNS Sec 316', title: 'Criminal Breach of Entrusted Trade Secret Data', titleHi: 'सौंपे गए व्यापारिक डेटा का आपराधिक दुरुपयोग', oldMapping: 'Formerly IPC Sec 406', punishment: 'Up to 5 years imprisonment' }
    ],
    defaultSelectedBns: ['Contract Act Sec 10 & 27', 'Specific Relief Act Sec 38', 'IT Act Sec 43A & 72A'],
    defaultPartyA: 'Innovatech Solutions Pvt. Ltd.',
    defaultPartyB: 'Nexus Alpha Ventures LLC',
  },
  {
    id: 'agreement-employment',
    category: 'contracts',
    title: 'Employment Agreement & Appointment Letter',
    titleHi: 'रोजगार अनुबंध एवं नियुक्ति पत्र',
    desc: 'Full-time employment contract with non-compete, probation terms, notice period, and IP assignment under Labor Codes & Contract Act.',
    tag: 'HR & Labor',
    icon: FileText,
    primaryLaw: 'Indian Contract Act, 1872 & Code on Wages, 2019',
    primaryLawHi: 'भारतीय संविदा अधिनियम, 1872 एवं श्रम संहिताएं',
    applicableActs: [
      'Indian Contract Act, 1872',
      'Code on Wages, 2019',
      'Industrial Relations Code, 2020',
      'Copyright Act, 1957'
    ],
    keySections: [
      { code: 'Contract Act Sec 27', title: 'Non-Compete and Non-Solicitation Enforceability', titleHi: 'प्रतिस्पर्धा रोधी व गोपनीयता उपबंध', oldMapping: 'Contract Law', punishment: 'Legal protection within reasonable bounds' },
      { code: 'Copyright Act Sec 17(c)', title: 'Work for Hire / IP Assignment to Employer', titleHi: 'कार्य के दौरान सृजित बौद्धिक संपदा का हस्तांतरण', oldMapping: 'IP Law', punishment: 'Exclusive company ownership' },
      { code: 'Code on Wages 2019', title: 'Remuneration, Deductions & Notice Period', titleHi: 'पारिश्रमिक, नोटिस अवधि एवं वैधानिक कटौतियां', oldMapping: 'Labor Law', punishment: 'Statutory compliance' }
    ],
    defaultSelectedBns: ['Contract Act Sec 27', 'Copyright Act Sec 17(c)', 'Code on Wages 2019'],
    defaultPartyA: 'Starlight Tech India Pvt. Ltd. (Employer)',
    defaultPartyB: 'Kunal Singhania (Employee)',
  },
  {
    id: 'agreement-service',
    category: 'contracts',
    title: 'Independent Service Provider Agreement',
    titleHi: 'स्वतंत्र सेवा प्रदाता / कंसल्टेंसी अनुबंध',
    desc: 'Freelancer and vendor service contract with milestones, payment terms, and deliverables under Contract Act.',
    tag: 'Commercial',
    icon: FileText,
    primaryLaw: 'Indian Contract Act, 1872 & Specific Relief Act, 1963',
    primaryLawHi: 'भारतीय संविदा अधिनियम, 1872 एवं विनिर्दिष्ट अनुतोष अधिनियम',
    applicableActs: [
      'Indian Contract Act, 1872',
      'Specific Relief Act, 1963',
      'Arbitration and Conciliation Act, 1996'
    ],
    keySections: [
      { code: 'Contract Act Sec 73 & 74', title: 'Damages for Breach of Deliverables or Non-payment', titleHi: 'सेवा शर्तों के उल्लंघन पर हर्जाना व ब्याज', oldMapping: 'Contract Law', punishment: 'Liquidated damages recovery' },
      { code: 'Arbitration Act Sec 7', title: 'Arbitration Agreement for Commercial Dispute', titleHi: 'मध्यस्थता समझौता (Fast-Track Arbitration)', oldMapping: 'Arbitration Law', punishment: 'Binding arbitral award' }
    ],
    defaultSelectedBns: ['Contract Act Sec 73 & 74', 'Arbitration Act Sec 7'],
    defaultPartyA: 'Bluebird Media (Client)',
    defaultPartyB: 'Digital Spark Consultancy (Service Provider)',
  },

  // Property & Deeds
  {
    id: 'agreement-rent',
    category: 'property',
    title: 'Residential Rent Agreement (11 Months)',
    titleHi: '11-माह आवासीय किरायानामा (Rent Deed)',
    desc: 'Standard Indian residential tenancy deed with maintenance terms, deposit return, and lock-in period under TPA & Registration Act.',
    tag: 'Tenancy Law',
    icon: BookOpen,
    primaryLaw: 'Transfer of Property Act, 1882 & Registration Act, 1908',
    primaryLawHi: 'सम्पत्ति अन्तरण अधिनियम, 1882 एवं रजिस्ट्रीकरण अधिनियम, 1908',
    applicableActs: [
      'Transfer of Property Act, 1882',
      'Registration Act, 1908',
      'Indian Stamp Act, 1899',
      'Model Tenancy Act, 2021'
    ],
    keySections: [
      { code: 'TPA Sec 107', title: '11-Month Periodic Tenancy Registration Exemption', titleHi: '11-माह लीज अनिवार्य पंजीकरण छूट', oldMapping: 'TPA 1882', punishment: 'Valid legal agreement on stamp paper' },
      { code: 'TPA Sec 108', title: 'Statutory Rights & Liabilities of Landlord and Tenant', titleHi: 'मकान मालिक एवं किराएदार के वैधानिक अधिकार व दायित्व', oldMapping: 'TPA 1882', punishment: 'Covenants enforceable in law' },
      { code: 'Registration Act Sec 17', title: 'Exemption from Compulsory Registration', titleHi: 'पंजीकरण अधिनियम धारा 17 छूट', oldMapping: 'Registration Act', punishment: 'Prima facie court admissibility' }
    ],
    defaultSelectedBns: ['TPA Sec 107', 'TPA Sec 108', 'Registration Act Sec 17'],
    defaultPartyA: 'Pankaj Mathur (Landlord)',
    defaultPartyB: 'Rohan Deshmukh (Tenant)',
    needsProperty: true,
  },
  {
    id: 'power-of-attorney',
    category: 'property',
    title: 'General Power of Attorney (GPA)',
    titleHi: 'आम मुख्तारनामा (General Power of Attorney)',
    desc: 'Legal authorization empowering attorney holder to manage bank accounts, properties, and court cases under Powers of Attorney Act.',
    tag: 'Powers & Registry',
    icon: Scale,
    primaryLaw: 'Powers of Attorney Act, 1882 & Indian Stamp Act, 1899',
    primaryLawHi: 'मुख्तारनामा अधिनियम, 1882 एवं भारतीय स्टाम्प अधिनियम',
    applicableActs: [
      'Powers of Attorney Act, 1882',
      'Indian Stamp Act, 1899',
      'Registration Act, 1908'
    ],
    keySections: [
      { code: 'Powers of Attorney Act Sec 1A & 2', title: 'Execution of Instrument under Power of Attorney', titleHi: 'मुख्तारनामा के तहत विलेख निष्पादन की विधिक शक्ति', oldMapping: 'Special Statute', punishment: 'Valid authorization to act on principal behalf' },
      { code: 'Registration Act Sec 17', title: 'Compulsory Registration for Immovable Property Powers', titleHi: 'अचल संपत्ति हेतु अनिवार्य पंजीकरण', oldMapping: 'Registration Act', punishment: 'Enforceable before Sub-Registrar & Courts' }
    ],
    defaultSelectedBns: ['Powers of Attorney Act Sec 1A & 2', 'Registration Act Sec 17'],
    defaultPartyA: 'Naveen Jindal (Principal)',
    defaultPartyB: 'Manish Jindal (Attorney Holder)',
  },

  // Affidavits
  {
    id: 'affidavit-general',
    category: 'affidavits',
    title: 'General Sworn Affidavit on Oath',
    titleHi: 'सामान्य शपथ पत्र / हलफनामा',
    desc: 'Notarized affidavit format with formal statement on oath, verification, and perjury warning under BSA 2023 & BNS 227.',
    tag: 'Notary Stamp',
    icon: PenTool,
    primaryLaw: 'Bharatiya Sakshya Adhiniyam, 2023 (BSA) & Notaries Act, 1952',
    primaryLawHi: 'भारतीय साक्ष्य अधिनियम, 2023 (BSA) एवं नोटरी अधिनियम, 1952',
    applicableActs: [
      'Bharatiya Sakshya Adhiniyam, 2023 (BSA)',
      'Notaries Act, 1952',
      'Oaths Act, 1969',
      'Bharatiya Nyaya Sanhita, 2023 (BNS)'
    ],
    keySections: [
      { code: 'BSA Sec 1 & 165', title: 'Statements on Oath & Evidentiary Value', titleHi: 'शपथ पर साक्ष्य एवं विधिक ग्राह्यता', oldMapping: 'Formerly Evidence Act', punishment: 'Admissible as prima facie evidence in court' },
      { code: 'BNS Sec 227', title: 'Perjury Warning for False Evidence / Statement', titleHi: 'झूठा शपथ पत्र देने पर दंडात्मक प्रावधान (Perjury)', oldMapping: 'Formerly IPC Sec 193', punishment: 'Up to 7 years imprisonment + Fine' },
      { code: 'Notaries Act Sec 8', title: 'Notarial Attestation and Official Seal', titleHi: 'नोटरी पब्लिक द्वारा विधिक सत्यापन', oldMapping: 'Notaries Act', punishment: 'Presumption of valid attestation' }
    ],
    defaultSelectedBns: ['BSA Sec 1 & 165', 'BNS Sec 227', 'Notaries Act Sec 8'],
    defaultPartyA: 'Harish Chandra Roy (Deponent)',
    defaultPartyB: 'Before Notary Public / Executive Magistrate',
  },
  {
    id: 'affidavit-name-change',
    category: 'affidavits',
    title: 'Name Change Affidavit (Gazette Ready)',
    titleHi: 'नाम परिवर्तन शपथ पत्र (राजपत्र अधिसूचना हेतु)',
    desc: 'Official declaration of change of name for Gazette notification, Passport Office, and PAN card under BSA 2023.',
    tag: 'Gazette Verified',
    icon: PenTool,
    primaryLaw: 'Bharatiya Sakshya Adhiniyam, 2023 (BSA) & Gazette Guidelines',
    primaryLawHi: 'भारतीय साक्ष्य अधिनियम, 2023 एवं भारत का राजपत्र निर्देशिका',
    applicableActs: [
      'Bharatiya Sakshya Adhiniyam, 2023',
      'Department of Publication Guidelines',
      'Notaries Act, 1952'
    ],
    keySections: [
      { code: 'BSA Sec 1', title: 'Sworn Declaration of Renunciation & New Name', titleHi: 'पुराने नाम त्याग एवं नए नाम अंगीकार की घोषणा', oldMapping: 'Evidence Law', punishment: 'Official legal declaration' },
      { code: 'Gazette Notification Norms', title: 'Mandatory Gazette of India Publication Basis', titleHi: 'भारत का राजपत्र में सार्वजनिक प्रकाशन का आधार', oldMapping: 'Statutory Guidelines', punishment: 'Statutory change for Passport / UIDAI / PAN' }
    ],
    defaultSelectedBns: ['BSA Sec 1', 'Gazette Notification Norms'],
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
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'editor') return 'editor';
    }
    return 'gallery';
  }); // 'gallery' | 'editor'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(DRAFT_TEMPLATES[0]);

  // Selected BNS / Statutory Sections
  const [selectedBnsCodes, setSelectedBnsCodes] = useState(DRAFT_TEMPLATES[0].defaultSelectedBns || []);
  const [showStatutoryDetails, setShowStatutoryDetails] = useState(false);
  const [showBnsModal, setShowBnsModal] = useState(false);
  const [bnsSearch, setBnsSearch] = useState('');

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

  // Toggle BNS or Statutory section dynamically
  const handleToggleBnsSection = (secCode) => {
    let nextCodes;
    if (selectedBnsCodes.includes(secCode)) {
      nextCodes = selectedBnsCodes.filter(c => c !== secCode);
    } else {
      nextCodes = [...selectedBnsCodes, secCode];
    }
    setSelectedBnsCodes(nextCodes);
    executeDraftGeneration(selectedTemplate, formData, nextCodes);
  };

  // Build the authoritative court statutory block that is prepended to drafts
  const buildStatutoryBlock = (tmpl, fData, activeCodes = []) => {
    const isHi = fData.language === 'hi';
    const isBnss = fData.criminalCode === 'BNSS';

    // Find all sections that are active or default
    const allSecs = tmpl.keySections || [];
    let activeSecs = allSecs.filter(s => activeCodes.includes(s.code));
    if (activeSecs.length === 0) activeSecs = allSecs;

    // Add any quick BNS items that are active but not in template
    activeCodes.forEach(code => {
      if (!activeSecs.find(s => s.code === code)) {
        const foundQuick = QUICK_ADDABLE_BNS.find(q => q.code === code);
        if (foundQuick) {
          activeSecs.push({
            code: foundQuick.code,
            title: foundQuick.title,
            titleHi: foundQuick.title,
            oldMapping: `Formerly ${foundQuick.old}`,
            punishment: foundQuick.punishment
          });
        }
      }
    });

    if (isHi) {
      return `════════════════════════════════════════════════════════════════════════════════
लागू विधिक प्रावधान, अधिनियम एवं धाराएं (STATUTORY CITATIONS):
१. मुख्य अधिनियम: ${tmpl.primaryLawHi || tmpl.primaryLaw}
२. संदर्भित विधिक धाराएं एवं प्रावधान:
${activeSecs.map((s, idx) => `   (${idx + 1}) ${s.code} - ${s.titleHi || s.title} ${s.oldMapping ? `[${s.oldMapping}]` : ''} (${s.punishment || 'विधिक उपचार'})`).join('\n')}
३. साक्ष्य एवं प्रक्रियात्मक अनुपालन:
   • ${isBnss ? 'भारतीय नागरिक सुरक्षा संहिता, 2023 (BNSS)' : 'दण्ड प्रक्रिया संहिता, 1973 (Cr.P.C.)'}
   • भारतीय साक्ष्य अधिनियम, 2023 (BSA) धारा 61 व 63 [डिजिटल साक्ष्य प्रमाण पत्र]
४. सक्षम क्षेत्राधिकार: सक्षम न्यायालय / प्राधिकरण, ${fData.jurisdiction}
════════════════════════════════════════════════════════════════════════════════\n\n`;
    }

    return `================================================================================
APPLICABLE LAWS & STATUTORY CITATIONS (लागू कानून व धाराएं):
• PRIMARY GOVERNING ACT: ${tmpl.primaryLaw}
• STATUTORY SECTIONS CITED & APPLIED:
${activeSecs.map((s, idx) => `  ${idx + 1}. ${s.code}: ${s.title} ${s.oldMapping ? `[${s.oldMapping}]` : ''} — ${s.punishment || 'Statutory Remedy'}`).join('\n')}
• EVIDENTIARY & PROCEDURAL COMPLIANCE:
  - ${isBnss ? 'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) [formerly Cr.P.C., 1973]' : 'Code of Criminal Procedure, 1973 (Cr.P.C.)'}
  - Bharatiya Sakshya Adhiniyam, 2023 (BSA) Section 61 & 63 [Electronic Evidence Certificate]
• COMPETENT JURISDICTION: Court of Competent Jurisdiction at ${fData.jurisdiction}
================================================================================\n\n`;
  };

  // Core drafting function: renders immediately with zero lag, then refreshes if AI returns
  const executeDraftGeneration = async (tmplToUse, formToUse, bnsCodesToUse) => {
    const tmpl = tmplToUse || selectedTemplate;
    const fData = formToUse || formData;
    const codes = bnsCodesToUse || selectedBnsCodes || tmpl.defaultSelectedBns || [];
    setIsGenerating(true);

    // 1. Instantly generate and display court-ready high fidelity draft (0ms delay)
    const initialDraft = generateFullDraft(tmpl, fData, codes);
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
          criminal_code: fData.criminalCode,
          statutory_sections: codes
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
    executeDraftGeneration(DRAFT_TEMPLATES[0], formData, DRAFT_TEMPLATES[0].defaultSelectedBns);
  }, []);

  // When user clicks "Draft Now" or any template card in Gallery
  const handleStartDrafting = (tmpl) => {
    setSelectedTemplate(tmpl);
    const updatedBns = tmpl.defaultSelectedBns || [];
    setSelectedBnsCodes(updatedBns);
    const updatedForm = {
      ...formData,
      partyA: tmpl.defaultPartyA || formData.partyA,
      partyB: tmpl.defaultPartyB || formData.partyB
    };
    setFormData(updatedForm);
    setViewMode('editor');
    executeDraftGeneration(tmpl, updatedForm, updatedBns);

    // Scroll window/container to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const container = document.querySelector('.drafting-studio-container');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When user switches template inside Editor view
  const handleSwitchTemplate = (tmpl) => {
    setSelectedTemplate(tmpl);
    const updatedBns = tmpl.defaultSelectedBns || [];
    setSelectedBnsCodes(updatedBns);
    const updatedForm = {
      ...formData,
      partyA: tmpl.defaultPartyA || formData.partyA,
      partyB: tmpl.defaultPartyB || formData.partyB
    };
    setFormData(updatedForm);
    executeDraftGeneration(tmpl, updatedForm, updatedBns);
  };

  // Form submit button handler
  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();
    await executeDraftGeneration(selectedTemplate, formData, selectedBnsCodes);
  };

  // Comprehensive Client-side Legal Draft Generator for ALL templates with explicit Statutory Box
  const generateFullDraft = (tmpl, fData, bnsCodes = []) => {
    const isHi = fData.language === 'hi';
    const isBnss = fData.criminalCode === 'BNSS';
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const statBox = buildStatutoryBlock(tmpl, fData, bnsCodes);

    // 1. CHEQUE BOUNCE NOTICE (138 NI ACT)
    if (tmpl.id === 'notice-138') {
      if (isHi) {
        return `${statBox}रजिस्टर्ड डाक / स्पीड पोस्ट द्वारा विधिक नोटिस
(धारा 138 एवं 142 पराक्राम्य लिखत अधिनियम, 1881 / NEGOTIABLE INSTRUMENTS ACT, 1881 के अंतर्गत)

दिनांक: ${dateStr}
स्थान: ${fData.jurisdiction}

प्रेषक:
${fData.advocateName}
अधिवक्ता, उच्च न्यायालय एवं जिला न्यायालय
कार्यालय: चैम्बर नं. 412, लॉयर्स ब्लॉक, ${fData.jurisdiction}
मो.: +91 98765 43210

सेवा में (Noticee):
${fData.partyB}
निवासी: [विपक्षी का पूर्ण पता]

विषय: धारा 138 परक्राम्य लिखत अधिनियम, 1881 एवं धारा 318(4) भारतीय न्याय संहिता, 2023 के तहत चेक अनादर (Cheque Bounce) बाबत 15 दिवसीय कानूनी नोटिस।

महोदय/महोदया,

मेरे मुवक्किल श्री/श्रीमती ${fData.partyA} की ओर से तथा उनके स्पष्ट निर्देशों के अधीन, मैं आपको निम्नलिखित कानूनी नोटिस प्रेषित करता हूँ:

1. यह कि आपने अपने वैध ऋण एवं कानूनी देयता के पूर्ण/आंशिक भुगतान स्वरूप मेरे मुवक्किल के पक्ष में निम्नलिखित चेक जारी किया था:
   - चेक संख्या: ${fData.chequeNo}
   - दिनांक: ${fData.chequeDate}
   - राशि: ₹${fData.amount}/- (अक्षरी: रुपये ${fData.amount} मात्र)
   - बैंक का नाम: ${fData.bankName}

2. यह कि आपके पूर्ण आश्वासन पर मेरे मुवक्किल ने उक्त चेक को अपने बैंक खाते में प्रस्तुत किया, परन्तु यह चेक बैंक द्वारा "खाते में पर्याप्त राशि नहीं (Funds Insufficient)" की टिप्पणी के साथ अनादृत (Dishonoured) कर लौटा दिया गया।

3. यह कि आपने कपटपूर्ण इरादे से उक्त चेक यह जानते हुए जारी किया था कि आपके खाते में पर्याप्त राशि नहीं है, जिससे स्पष्ट है कि आपका आशय मेरे मुवक्किल को आर्थिक क्षति पहुँचाना था।

${fData.specificClauses ? `4. विशिष्ट तथ्य एवं शर्तें:\n${fData.specificClauses}\n` : ''}

5. यह कि आपके इस कृत्य से पराक्राम्य लिखत अधिनियम की धारा 138 तथा भारतीय न्याय संहिता, 2023 (BNS) की धारा 318(4) [पूर्ववर्ती IPC 420 - धोखाधड़ी] एवं धारा 316 [आपराधिक न्यासभंग] के तहत संज्ञेय अपराध कारित हुआ है।

अतः इस विधिक नोटिस के माध्यम से आपको निर्देशित किया जाता है कि नोटिस प्राप्ति के 15 (पंद्रह) दिनों के भीतर उक्त चेक राशि ₹${fData.amount}/- का पूर्ण भुगतान मेरे मुवक्किल को करें। 

अन्यथा समयावधि व्यतीत होने पर आपके विरुद्ध सक्षम दाण्डिक न्यायालय में आपराधिक परिवाद दायर किया जाएगा, जिसमें 2 वर्ष तक का कारावास एवं चेक राशि से दोगुनी राशि तक का जुर्माना हो सकता है।

भवदीय,
(${fData.advocateName})
अधिवक्ता, मुवक्किल हेतु`;
      }

      return `${statBox}LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
(BY REGISTERED POST A.D. / SPEED POST / LEGAL COURIER)

Date: ${dateStr}
Place: ${fData.jurisdiction}

FROM:
${fData.advocateName}
Advocate, High Court & District Courts
Chamber No. 412, Lawyers Chambers Block, ${fData.jurisdiction}
Contact: legal.chamber@wakalat.ai

TO (NOTICEE):
${fData.partyB}
Resident of / Having Office at: [Noticee Address Here]

RE: STATUTORY DEMAND NOTICE UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 AND SECTION 318(4) OF BHARATIYA NYAYA SANHITA, 2023 IN RESPECT OF DISHONOUR OF CHEQUE NO. ${fData.chequeNo} FOR ₹${fData.amount}/-

Sir / Madam,

Under instructions from and on behalf of my client, ${fData.partyA} (hereinafter referred to as "My Client"), I hereby serve upon you this Statutory Legal Notice as under:

1. That you, the noticee, had approached my client and towards discharge of your legally enforceable debt and liability, you had issued the following cheque drawn on your bank account in favour of my client:
   - Cheque Number: ${fData.chequeNo}
   - Cheque Dated: ${fData.chequeDate}
   - Amount: INR ${fData.amount}/- (Rupees ${fData.amount} Only)
   - Drawn on: ${fData.bankName}

2. That believing your express representation and assurance, my client presented the said cheque through their banker for clearance. However, the said cheque was returned dishonoured and unpaid with the endorsement "FUNDS INSUFFICIENT".

3. That immediately upon receipt of the bank return memo, my client informed you regarding the dishonour and requested payment, but you have deliberately neglected and failed to liquidate the legitimate debt.

${fData.specificClauses ? `4. SPECIFIC STIPULATIONS & ALLEGATIONS:\n${fData.specificClauses}\n` : ''}

5. That by your aforesaid acts, you have committed an offence punishable under Section 138 read with Section 142 of the Negotiable Instruments Act, 1881, as well as an offence of Cheating under Section 318(4) [formerly Section 420 IPC] and Criminal Breach of Trust under Section 316 of Bharatiya Nyaya Sanhita, 2023 (BNS).

THEREFORE, I hereby call upon you through this statutory notice to pay the entire cheque amount of INR ${fData.amount}/- to my client within 15 (FIFTEEN) DAYS of the receipt of this notice.

PLEASE TAKE NOTE that in the event of your failure to make the payment within the stipulated statutory period of 15 days, my client has peremptory instructions to institute criminal proceedings against you before the Court of Learned Judicial Magistrate / Metropolitan Magistrate under Section 138 NI Act and BNS 2023, wherein you shall be liable to be punished with imprisonment up to two years or fine extending to twice the cheque amount, or both.

Yours faithfully,
(${fData.advocateName})
Advocate for the Complainant`;
    }

    // 2. MONEY RECOVERY NOTICE
    if (tmpl.id === 'notice-recovery') {
      return `${statBox}LEGAL NOTICE FOR RECOVERY OF OUTSTANDING DUES
(UNDER CODE OF CIVIL PROCEDURE, 1908 & INDIAN CONTRACT ACT, 1872)
(BY REGISTERED POST A.D. / SPEED POST)

Date: ${dateStr} | Place: ${fData.jurisdiction}

FROM:
${fData.advocateName} (Advocate)
Chamber No. 412, Lawyers Block, ${fData.jurisdiction}

TO:
${fData.partyB} (Debtor)
Address: [Debtor Address Here]

RE: DEMAND NOTICE FOR PAYMENT OF OVERDUE PRINCIPAL DUES OF ₹${fData.amount}/- ALONG WITH INTEREST @ 18% P.A.

Sir / Madam,

Under instructions from my client, ${fData.partyA}, I state as under:

1. That my client has supplied goods / provided professional services to you against valid invoices, acknowledged delivery challans, and acknowledged purchase orders.
2. That as per the books of accounts maintained in ordinary course of business, an aggregate sum of INR ${fData.amount}/- remains overdue, unpaid, and outstanding against you.
3. That despite repeated reminders, telephonic requests, and emails, you have intentionally neglected to clear the legitimate dues.
${fData.specificClauses ? `4. SPECIFIC FACTS & PARTICULARS:\n${fData.specificClauses}\n` : ''}
5. That your non-payment constitutes an actionable breach of contract under Section 73 of the Indian Contract Act, 1872 and fraudulent inducement under Section 318(4) of Bharatiya Nyaya Sanhita, 2023 (BNS).

NOW THEREFORE, I call upon you to remit the total outstanding amount of INR ${fData.amount}/- together with interest @ 18% per annum within 15 days from the date of receipt hereof, failing which my client shall initiate a Summary Civil Suit under Order XXXVII of the Code of Civil Procedure, 1908 along with pre-institution mediation under Section 12A of the Commercial Courts Act, 2015 at your sole risk and costs.

(${fData.advocateName})
Advocate for Creditor`;
    }

    // 3. TENANT EVICTION NOTICE
    if (tmpl.id === 'notice-eviction') {
      return `${statBox}LEGAL NOTICE FOR EVICTION AND VACATION OF TENANTED PREMISES
(UNDER SECTION 106 & SECTION 111(g) OF THE TRANSFER OF PROPERTY ACT, 1882)

Date: ${dateStr} | Place: ${fData.jurisdiction}

FROM: ${fData.advocateName} (Advocate for Landlord)
TO: ${fData.partyB} (Tenant)

SUBJECT: STATUTORY 15-DAY NOTICE TO VACATE PREMISES SITUATED AT ${fData.propertyAddress} AND HAND OVER VACANT PEACEFUL POSSESSION.

Sir,
Under instructions from my client, ${fData.partyA} (Landlord), I hereby serve upon you this notice:

1. That my client is the absolute, lawful owner of the premises situated at: ${fData.propertyAddress}.
2. That you were inducted as a tenant on a monthly rental of ₹${fData.rentAmount}/- payable in advance on or before the 7th of each month.
3. That you have committed persistent default in payment of rent, causing substantial financial prejudice, and the tenancy stands determined and forfeited under Section 111(g) of the Transfer of Property Act, 1882.
${fData.specificClauses ? `4. ADDITIONAL GROUNDS & ARREARS:\n${fData.specificClauses}\n` : ''}
5. That in the event you continue in unauthorized occupation of the demised premises upon expiry of 15 days, your status shall be that of a trespasser liable to prosecution under Section 329 of Bharatiya Nyaya Sanhita, 2023 (BNS) [Criminal Trespass].

YOU ARE HEREBY CALLED UPON to quit, vacate, and hand over the vacant peaceful possession of the premises to my client within 15 (Fifteen) days, failing which an eviction suit under Order VII CPC along with claim for mesne profits and damages shall be instituted against you.

(${fData.advocateName})
Advocate for Landlord`;
    }

    // 4. REGULAR BAIL APPLICATION
    if (tmpl.id === 'bail-regular') {
      const secCite = isBnss ? 'SECTION 483 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS)' : 'SECTION 439 OF Cr.P.C., 1973';
      const offences = isBnss 
        ? 'Sections 316, 318(4), 351(2) of Bharatiya Nyaya Sanhita, 2023 (BNS) [formerly Sections 406, 420, 506 IPC]' 
        : 'Sections 420, 406, 506 Indian Penal Code, 1860';

      return `${statBox}IN THE COURT OF THE LEARNED SESSIONS JUDGE AT ${fData.jurisdiction.toUpperCase()}
BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
${fData.partyA}
S/o [Father's Name], Aged about [Age] Years,
R/o [Full Permanent Address]
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
4. That all electronic records and communications are already secured under Section 63 BSA 2023, and no recovery remains to be effected.
5. That the Applicant undertakes not to tamper with prosecution evidence, nor influence any witness, and will abide by all bail conditions.
${fData.specificClauses ? `6. SPECIAL GROUNDS FOR BAIL:\n${fData.specificClauses}\n` : ''}

PRAYER:
Wherefore, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to release the Applicant ${fData.partyA} on regular bail in FIR No. ${fData.firNo}, P.S. ${fData.policeStation}, on furnishing sound surety to the satisfaction of this Hon'ble Court.

FILED BY:
(${fData.advocateName})
Advocate for the Applicant`;
    }

    // 5. ANTICIPATORY BAIL
    if (tmpl.id === 'bail-anticipatory') {
      const secCite = isBnss ? 'SECTION 482 OF BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS)' : 'SECTION 438 OF Cr.P.C., 1973';
      const offences = isBnss
        ? 'Sections 318(4), 338, 61(2) BNS, 2023 [formerly Sections 420, 467, 120B IPC]'
        : 'Sections 420, 467, 120B IPC';

      return `${statBox}IN THE COURT OF THE LEARNED SESSIONS JUDGE AT ${fData.jurisdiction.toUpperCase()}
ANTICIPATORY BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
${fData.partyA}
...APPLICANT

VERSUS

STATE (NCT OF DELHI / STATE)
Through SHO, Police Station: ${fData.policeStation}
...RESPONDENT

FIR No.: ${fData.firNo} | P.S.: ${fData.policeStation}
Offences Alleged: ${offences}

APPLICATION UNDER ${secCite} FOR GRANT OF ANTICIPATORY BAIL IN THE EVENT OF ARREST

MOST RESPECTFULLY SHOWETH:
1. That the Applicant has a grave, well-founded apprehension of imminent arrest in connection with the false and motivated FIR captioned above.
2. That the Applicant has never been involved in any criminal activity and possesses an unblemished reputation.
3. That custodial interrogation of the Applicant is wholly unwarranted as all relevant documents and transaction receipts are already in custody of the complainant.
4. That the Applicant undertakes to join investigation as and when directed by the Investigating Officer under Section 173/175 BNSS.
${fData.specificClauses ? `5. SPECIAL GROUNDS:\n${fData.specificClauses}\n` : ''}

PRAYER:
It is most respectfully prayed that in the event of arrest in FIR No. ${fData.firNo}, P.S. ${fData.policeStation}, the Applicant ${fData.partyA} may kindly be directed to be released on Anticipatory Bail.

APPLICANT THROUGH COUNSEL:
(${fData.advocateName})`;
    }

    // 6. CIVIL PLAINT FOR MONEY RECOVERY
    if (tmpl.id === 'plaint-money') {
      return `${statBox}IN THE COURT OF LEARNED SENIOR CIVIL JUDGE AT ${fData.jurisdiction.toUpperCase()}
CIVIL SUIT NO. ________ OF 2026

IN THE MATTER OF:
${fData.partyA}
...PLAINTIFF

VERSUS

${fData.partyB}
...DEFENDANT

SUIT UNDER ORDER VII OF THE CODE OF CIVIL PROCEDURE, 1908 FOR RECOVERY OF ₹${fData.amount}/- WITH PENDENTE LITE AND FUTURE INTEREST @ 18% P.A.

MOST RESPECTFULLY SHOWETH:
1. That the Plaintiff is a registered business enterprise carrying on lawful commercial activities.
2. That the Defendant entered into business transactions and accepted deliveries of goods against signed invoices and acknowledged ledger accounts.
3. That an amount of INR ${fData.amount}/- remains due, payable, and outstanding despite statutory legal notice.
4. That the cause of action arose within the territorial and pecuniary jurisdiction of this Hon'ble Court.
${fData.specificClauses ? `5. SPECIFIC PARTICULARS:\n${fData.specificClauses}\n` : ''}

PRAYER:
The Plaintiff most respectfully prays for a decree for the sum of INR ${fData.amount}/- along with interest @ 18% p.a. from date of filing till realization, along with costs of the suit.

PLAINTIFF
THROUGH COUNSEL: (${fData.advocateName})

VERIFICATION:
Verified at ${fData.jurisdiction} on ${dateStr} that contents of paragraphs 1 to 5 are true to plaintiff's knowledge.
DEPONENT`;
    }

    // 7. MUTUAL CONSENT DIVORCE (SEC 13B HMA)
    if (tmpl.id === 'divorce-mutual') {
      return `${statBox}IN THE FAMILY COURT AT ${fData.jurisdiction.toUpperCase()}
HMA PETITION NO. ________ OF 2026

IN THE MATTER OF:
1. ${fData.partyA} (First Petitioner / Husband)
AND
2. ${fData.partyB} (Second Petitioner / Wife)

JOINT PETITION UNDER SECTION 13B(1) OF THE HINDU MARRIAGE ACT, 1955 FOR DISSOLUTION OF MARRIAGE BY MUTUAL CONSENT

MOST RESPECTFULLY SHOWETH:
1. That marriage between Petitioner No. 1 and Petitioner No. 2 was solemnized according to Hindu rites and ceremonies.
2. That due to irreconcilable temperamental differences, the parties have been living separately for over one year.
3. That all joint matrimonial claims including permanent alimony under Section 25 HMA, maintenance, stridhan, and custody have been amicably resolved.
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
      return `${statBox}MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

THIS AGREEMENT is entered into on this ${dateStr} at ${fData.jurisdiction}, by and between:
1. FIRST PARTY: ${fData.partyA}
AND
2. SECOND PARTY: ${fData.partyB}

WHEREAS the Parties wish to evaluate prospective business collaboration and will disclose proprietary and confidential information.

NOW THEREFORE, UNDER SECTIONS 10 & 27 OF THE INDIAN CONTRACT ACT, 1872, THE PARTIES AGREE AS FOLLOWS:
1. CONFIDENTIAL INFORMATION: Includes all proprietary technical, business, financial, software, and trade secret data disclosed by either party.
2. NON-DISCLOSURE: The receiving party shall safeguard all confidential information with standard reasonable care and not disclose to third parties without prior written consent.
3. INJUNCTIVE RELIEF: In the event of a breach, the aggrieved party is entitled to seek immediate injunctive relief under Section 38 of the Specific Relief Act, 1963.
4. TERM: This agreement shall remain binding for a period of two (2) years from the Effective Date.
${fData.specificClauses ? `5. SPECIAL COVENANTS:\n${fData.specificClauses}\n` : ''}
6. GOVERNING LAW: Governed exclusively by the laws of India, subject to courts at ${fData.jurisdiction}.

FOR FIRST PARTY: _________________________ (${fData.partyA})
FOR SECOND PARTY: ________________________ (${fData.partyB})
COUNSEL: _________________________________ (${fData.advocateName})`;
    }

    // 9. EMPLOYMENT AGREEMENT
    if (tmpl.id === 'agreement-employment') {
      return `${statBox}EMPLOYMENT CONTRACT & APPOINTMENT AGREEMENT

THIS EMPLOYMENT AGREEMENT is executed on ${dateStr} at ${fData.jurisdiction} between:
EMPLOYER: ${fData.partyA}
AND
EMPLOYEE: ${fData.partyB}

1. POSITION & DUTIES: The Employee is appointed to the designated position, performing all duties diligently in good faith.
2. REMUNERATION: The Employee shall receive the agreed CTC/salary subject to statutory deductions under the Code on Wages, 2019.
3. PROBATION & NOTICE: The Employee shall be on probation for three (3) months, terminable with 30 days written notice.
4. CONFIDENTIALITY & IP ASSIGNMENT: All inventions and works created during employment shall vest exclusively in Employer under Section 17(c) Copyright Act, 1957.
${fData.specificClauses ? `5. SPECIFIC TERMS:\n${fData.specificClauses}\n` : ''}

EMPLOYER: ___________________________
EMPLOYEE: ___________________________
COUNSEL: ____________________________ (${fData.advocateName})`;
    }

    // 10. RESIDENTIAL RENT AGREEMENT
    if (tmpl.id === 'agreement-rent') {
      return `${statBox}RESIDENTIAL RENT AGREEMENT (11 MONTHS)
(UNDER TRANSFER OF PROPERTY ACT, 1882 & REGISTRATION ACT, 1908)

THIS RENT AGREEMENT is executed on this ${dateStr} at ${fData.jurisdiction} between:
LANDLORD: ${fData.partyA}
AND
TENANT: ${fData.partyB}

WHEREAS Landlord is the sole legal owner of residential premises: ${fData.propertyAddress}.

TERMS AND CONDITIONS:
1. TENURE: Fixed 11-month period commencing from ${dateStr}, exempt from compulsory registration under Section 17 Registration Act.
2. RENT: Monthly rent of ₹${fData.rentAmount}/- payable on or before 7th of each month.
3. SECURITY DEPOSIT: Refundable security deposit of ₹${fData.securityDeposit}/- received by Landlord.
4. UTILITIES: Tenant shall directly pay actual electricity and water charges as per meter readings.
5. USE: Strictly residential use; sub-letting is strictly prohibited under Section 108 TPA.
${fData.specificClauses ? `6. SPECIAL TERMS:\n${fData.specificClauses}\n` : ''}

LANDLORD: ___________________________ (${fData.partyA})
TENANT: _____________________________ (${fData.partyB})
WITNESS 1: __________________________
WITNESS 2: __________________________`;
    }

    // 11. GENERAL SWORN AFFIDAVIT
    if (tmpl.id === 'affidavit-general') {
      return `${statBox}GENERAL SWORN AFFIDAVIT ON OATH
(TO BE NOTARIZED ON NON-JUDICIAL STAMP PAPER UNDER BSA 2023 & NOTARIES ACT)

BEFORE THE NOTARY PUBLIC / EXECUTIVE MAGISTRATE AT ${fData.jurisdiction.toUpperCase()}

I, ${fData.partyA}, Resident of [Permanent Residential Address], do hereby solemnly affirm and state on oath as under:

1. That I am a bona fide citizen of India and competent to depose to this affidavit.
2. That all particulars, declarations, and statements made herein are based on my true personal knowledge and records under Section 1 of the Bharatiya Sakshya Adhiniyam, 2023 (BSA).
3. That [Specific statements of the matter].
${fData.specificClauses ? `4. SPECIFIC DECLARATIONS:\n${fData.specificClauses}\n` : ''}
5. PERJURY WARNING: That no material facts have been suppressed herein, and I am aware that false affidavit invites prosecution under Section 227 of Bharatiya Nyaya Sanhita, 2023 (BNS).

DEPONENT: ___________________________ (${fData.partyA})

VERIFICATION:
Verified at ${fData.jurisdiction} on ${dateStr} that contents of paragraphs 1 to 5 are true and correct.
DEPONENT
IDENTIFIED BY COUNSEL: (${fData.advocateName})`;
    }

    // DEFAULT / GENERIC LEGAL DRAFT
    return `${statBox}LEGAL DOCUMENT DRAFT
TYPE: ${tmpl.title.toUpperCase()}
DATE: ${dateStr} | JURISDICTION: ${fData.jurisdiction}

FIRST PARTY: ${fData.partyA}
SECOND PARTY: ${fData.partyB}
COUNSEL: ${fData.advocateName}

WHEREFORE the Parties have agreed to execute this formal legal instrument under Indian Law.
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

  // Filter Templates with deep search through Title, Description, and Statutory Acts
  const filteredTemplates = DRAFT_TEMPLATES.filter(tmpl => {
    const matchesCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const inTitle = tmpl.title.toLowerCase().includes(q) || tmpl.titleHi.toLowerCase().includes(q);
    const inDesc = tmpl.desc.toLowerCase().includes(q);
    const inLaw = (tmpl.primaryLaw && tmpl.primaryLaw.toLowerCase().includes(q)) ||
                  (tmpl.primaryLawHi && tmpl.primaryLawHi.toLowerCase().includes(q));
    const inActs = tmpl.applicableActs && tmpl.applicableActs.some(a => a.toLowerCase().includes(q));
    const inSections = tmpl.keySections && tmpl.keySections.some(s => 
      s.code.toLowerCase().includes(q) || 
      s.title.toLowerCase().includes(q) || 
      (s.oldMapping && s.oldMapping.toLowerCase().includes(q))
    );

    return matchesCategory && (inTitle || inDesc || inLaw || inActs || inSections);
  });

  // Filter BNS Comparison Catalog
  const filteredBnsCatalog = BNS_IPC_MAPPING.filter(item => {
    if (!bnsSearch.trim()) return true;
    const q = bnsSearch.toLowerCase().trim();
    return item.bns.toLowerCase().includes(q) ||
           item.bnsTitle.toLowerCase().includes(q) ||
           item.old.toLowerCase().includes(q) ||
           item.oldTitle.toLowerCase().includes(q) ||
           item.cat.toLowerCase().includes(q);
  });

  // GALLERY VIEW: Display all legal templates with prominent "Draft Now" buttons & Statutory Badges
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
            <p>Select any court-tested Indian legal template below. Every draft automatically calculates and displays the governing <strong>Bharatiya Nyaya Sanhita (BNS)</strong>, <strong>BNSS 2023</strong>, and applicable Special Acts.</p>
          </div>

          <div className="ds-header-stats">
            <button 
              type="button" 
              className="ds-stat-pill clickable"
              onClick={() => setShowBnsModal(true)}
              title="Open Bharatiya Nyaya Sanhita (BNS) ↔ IPC Conversion Table"
            >
              <Scale size={16} className="icon-gold" />
              <span>BNS ↔ IPC Conversion Table</span>
              <ChevronRight size={14} />
            </button>
            <div className="ds-stat-pill">
              <BookOpen size={16} color="#059669" />
              <span>BNSS & BSA 2023 Court Verified</span>
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

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
            <input 
              type="text" 
              placeholder="Search templates, BNS, IPC 420..."
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

                {/* Statutory Laws & BNS Badge Preview */}
                <div className="ds-card-laws-preview">
                  <div className="ds-card-primary-law">
                    <Scale size={11} color="#059669" />
                    <span>{tmpl.primaryLaw}</span>
                  </div>
                  <div className="ds-card-pills-row">
                    {tmpl.keySections && tmpl.keySections.slice(0, 3).map((sec, i) => (
                      <span key={i} className="ds-law-chip-preview" title={sec.title}>
                        {sec.code}
                      </span>
                    ))}
                    {tmpl.keySections && tmpl.keySections.length > 3 && (
                      <span className="ds-law-chip-preview more">
                        +{tmpl.keySections.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  type="button"
                  className="ds-draft-now-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartDrafting(tmpl);
                  }}
                >
                  <span>Draft Court Document</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>

        {/* BNS ↔ IPC Comparison Modal */}
        {showBnsModal && (
          <div className="ds-modal-backdrop" onClick={() => setShowBnsModal(false)}>
            <div className="ds-modal-card" onClick={e => e.stopPropagation()}>
              <div className="ds-modal-header">
                <div className="ds-modal-title">
                  <Scale size={20} color="#10b981" />
                  <div>
                    <h3>Bharatiya Nyaya Sanhita (BNS) ↔ IPC Quick Reference</h3>
                    <p>Cross-reference new Indian criminal codes with traditional IPC, Cr.P.C., and Evidence Act sections</p>
                  </div>
                </div>
                <button type="button" className="ds-close-btn" onClick={() => setShowBnsModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="ds-modal-search">
                <Search size={15} color="#64748b" />
                <input 
                  type="text" 
                  placeholder="Search section number (e.g. 420, 318, 439, 483, 120B)..." 
                  value={bnsSearch} 
                  onChange={e => setBnsSearch(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="ds-table-wrap">
                <table className="ds-bns-table">
                  <thead>
                    <tr>
                      <th>New Law (BNS / BNSS / BSA)</th>
                      <th>Offence / Legal Provision</th>
                      <th>Old Law (IPC / CrPC / IEA)</th>
                      <th>Punishment / Remand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBnsCatalog.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="ds-bns-badge">{item.bns}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.bnsTitle}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.bnsHi}</div>
                        </td>
                        <td>
                          <span className="ds-ipc-badge">{item.old}</span>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{item.oldTitle}</div>
                        </td>
                        <td>
                          <span className="ds-punishment-tag">{item.punishment}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="ds-modal-footer">
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  All citations are strictly aligned with Ministry of Home Affairs Gazette Notifications 2023-2024.
                </span>
                <button type="button" className="ds-tool-btn primary" onClick={() => setShowBnsModal(false)}>
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        )}

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
          {/* Quick BNS Comparison Guide Trigger */}
          <button 
            type="button"
            className="ds-statutory-pill-btn"
            onClick={() => setShowBnsModal(true)}
            title="View BNS ↔ IPC Cross-Reference Guide"
          >
            <Scale size={14} color="#059669" />
            <span>BNS ↔ IPC Guide</span>
          </button>

          {/* Language Toggle */}
          <div className="ds-pill-group">
            <button 
              type="button" 
              className={`ds-pill-opt ${formData.language === 'en' ? 'active' : ''}`}
              onClick={() => {
                const updated = { ...formData, language: 'en' };
                setFormData(updated);
                executeDraftGeneration(selectedTemplate, updated, selectedBnsCodes);
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
                executeDraftGeneration(selectedTemplate, updated, selectedBnsCodes);
              }}
            >
              Hindi (हिन्दी)
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
                  executeDraftGeneration(selectedTemplate, updated, selectedBnsCodes);
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
                  executeDraftGeneration(selectedTemplate, updated, selectedBnsCodes);
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

      {/* DEDICATED APPLICABLE LAWS & BNS STATUTORY BANNER (COLLAPSIBLE & SPACIOUS) */}
      <div className={`ds-statutory-panel ${showStatutoryDetails ? 'expanded' : 'collapsed'}`}>
        <div className="ds-statutory-top">
          <div className="ds-statutory-title-wrap">
            <div className="ds-stat-icon-bubble">
              <Scale size={18} color="#059669" />
            </div>
            <div>
              <div className="ds-statutory-title-row">
                <span className="ds-statutory-title">
                  {formData.language === 'hi' ? 'लागू कानून, अधिनियम एवं बीएनएस धाराएं' : 'Governing Statutes & Applied Sections'}
                </span>
                <span className="ds-selected-count-pill">
                  {selectedBnsCodes.length} {formData.language === 'hi' ? 'धाराएं लागू' : 'Sections Active'}
                </span>
              </div>
              <span className="ds-statutory-subtitle">
                {selectedTemplate.primaryLaw}
              </span>
            </div>
          </div>

          <div className="ds-statutory-top-right">
            <div className="ds-statutory-acts-tags">
              {selectedTemplate.applicableActs && selectedTemplate.applicableActs.map((act, idx) => (
                <span key={idx} className="ds-act-badge">
                  {act}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="ds-toggle-sections-btn"
              onClick={() => setShowStatutoryDetails(!showStatutoryDetails)}
              title={showStatutoryDetails ? 'Collapse section details' : 'Customize statutory sections'}
            >
              <span>{showStatutoryDetails ? 'Collapse' : 'Customize Sections'}</span>
              {showStatutoryDetails ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* Collapsed Compact State: Clean horizontal chips with zero vertical congestion */}
        {!showStatutoryDetails && (
          <div className="ds-statutory-collapsed-summary">
            <div className="ds-applied-chips-summary">
              {selectedBnsCodes.map((code, idx) => (
                <span key={idx} className="ds-applied-mini-chip">
                  <Check size={12} color="#059669" /> {code}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="ds-expand-link-btn"
              onClick={() => setShowStatutoryDetails(true)}
            >
              + Add / Modify Sections
            </button>
          </div>
        )}

        {/* Full Expanded State: Responsive Section Cards Grid & Quick-Add BNS */}
        {showStatutoryDetails && (
          <div className="ds-statutory-expanded-body">
            <div className="ds-statutory-sections-list">
              {selectedTemplate.keySections && selectedTemplate.keySections.map((sec, idx) => {
                const isChecked = selectedBnsCodes.includes(sec.code);
                return (
                  <div 
                    key={idx} 
                    className={`ds-section-card ${isChecked ? 'selected' : 'unselected'}`}
                    onClick={() => handleToggleBnsSection(sec.code)}
                    title="Click to include or exclude this section from the draft"
                  >
                    <div className="ds-sec-card-top">
                      <div className="ds-sec-badge-row">
                        <span className="ds-sec-code">{sec.code}</span>
                        {sec.oldMapping && (
                          <span className="ds-old-mapping-tag">{sec.oldMapping}</span>
                        )}
                      </div>
                      <div className="ds-sec-checkbox">
                        {isChecked ? <CheckSquare size={17} color="#10b981" /> : <Square size={17} color="#94a3b8" />}
                      </div>
                    </div>
                    <div className="ds-sec-title">
                      {formData.language === 'hi' ? (sec.titleHi || sec.title) : sec.title}
                    </div>
                    {sec.punishment && (
                      <div className="ds-sec-punishment">
                        {sec.punishment}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Add Extra BNS Sections */}
            <div className="ds-quick-bns-toggle-row">
              <span className="ds-quick-label">
                {formData.language === 'hi' ? 'अतिरिक्त BNS / BNSS धाराएं जोड़ें:' : 'Quick Add Extra BNS / Statutory Sections:'}
              </span>
              <div className="ds-quick-chips">
                {QUICK_ADDABLE_BNS.map((q, idx) => {
                  const isSelected = selectedBnsCodes.includes(q.code);
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`ds-quick-chip ${isSelected ? 'active' : ''}`}
                      onClick={() => handleToggleBnsSection(q.code)}
                    >
                      <span>{isSelected ? '✓ ' : '+ '}{q.code}</span>
                      <small>({q.old})</small>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
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
              <span>Court Document Canvas</span>
              {generatedDraft && (
                <span className="ds-doc-metrics-badge">
                  {generatedDraft.trim().split(/\s+/).filter(Boolean).length} words • {generatedDraft.length} chars
                </span>
              )}
            </div>
            <div className="ds-toolbar-hint">
              <PenTool size={13} color="#059669" />
              <span>Direct Click-to-Edit Enabled</span>
            </div>
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

      {/* BNS ↔ IPC Comparison Modal (can be opened from Editor view as well) */}
      {showBnsModal && (
        <div className="ds-modal-backdrop" onClick={() => setShowBnsModal(false)}>
          <div className="ds-modal-card" onClick={e => e.stopPropagation()}>
            <div className="ds-modal-header">
              <div className="ds-modal-title">
                <Scale size={20} color="#10b981" />
                <div>
                  <h3>Bharatiya Nyaya Sanhita (BNS) ↔ IPC Quick Reference</h3>
                  <p>Cross-reference new Indian criminal codes with traditional IPC, Cr.P.C., and Evidence Act sections</p>
                </div>
              </div>
              <button type="button" className="ds-close-btn" onClick={() => setShowBnsModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ds-modal-search">
              <Search size={15} color="#64748b" />
              <input 
                type="text" 
                placeholder="Search section number (e.g. 420, 318, 439, 483, 120B)..." 
                value={bnsSearch} 
                onChange={e => setBnsSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="ds-table-wrap">
              <table className="ds-bns-table">
                <thead>
                  <tr>
                    <th>New Law (BNS / BNSS / BSA)</th>
                    <th>Offence / Legal Provision</th>
                    <th>Old Law (IPC / CrPC / IEA)</th>
                    <th>Punishment / Remand</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBnsCatalog.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className="ds-bns-badge">{item.bns}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.bnsTitle}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.bnsHi}</div>
                      </td>
                      <td>
                        <span className="ds-ipc-badge">{item.old}</span>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{item.oldTitle}</div>
                      </td>
                      <td>
                        <span className="ds-punishment-tag">{item.punishment}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ds-modal-footer">
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                All citations are strictly aligned with Ministry of Home Affairs Gazette Notifications 2023-2024.
              </span>
              <button type="button" className="ds-tool-btn primary" onClick={() => setShowBnsModal(false)}>
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DraftingStudio;
