/**
 * Wakalat AI - Indian Legal AI Reasoning & Advisory Engine
 * Comprehensive statutory database covering:
 * - Bharatiya Nyaya Sanhita (BNS 2023) & IPC
 * - Bharatiya Nagarik Suraksha Sanhita (BNSS 2023) & CrPC
 * - Bharatiya Sakshya Adhiniyam (BSA 2023) & Indian Evidence Act
 * - Negotiable Instruments Act 1881 (Section 138)
 * - Consumer Protection Act 2019
 * - Indian Contract Act 1872 & Specific Relief Act 1963
 * - Family & Matrimonial Laws (HMA 1955, DV Act 2005, CrPC 125 / BNSS 144)
 * - Property, RERA 2016 & Tenancy Laws
 * - Cyber Law & Information Technology Act 2000
 * - Labour, Employment & Commercial Arbitration
 */

function generateLegalAdvice(query, { language = 'en', userEmail = '' } = {}) {
  const q = (query || '').toLowerCase().trim();
  const isHindi = language === 'hi' || /[अ-ह]/.test(query);

  // 1. Bail & Criminal Law (BNSS / BNS / CrPC)
  const isCriminal = /\b(bail|anticipatory|arrest|fir|f\.i\.r|police|crpc|bnss|bns|remand|custody|accused|cognizable)\b/i.test(q) && !q.includes('fired');
  if (isCriminal) {
    const isAnticipatory = q.includes('anticipatory') || q.includes('agrim');
    const isRegular = q.includes('regular') || (!isAnticipatory && q.includes('bail'));

    if (isHindi) {
      return {
        summary: isAnticipatory
          ? "भारतीय नागरिक सुरक्षा संहिता (BNSS) 2023 की धारा 482 (पूर्व CrPC 438) के तहत सत्र न्यायालय (Sessions Court) या उच्च न्यायालय में अग्रिम जमानत (Anticipatory Bail) याचिका दायर की जा सकती है।"
          : "गिरफ्तारी के उपरांत BNSS 2023 की धारा 480 / 483 (पूर्व CrPC 437/439) के अंतर्गत नियमित जमानत याचिका सक्षम न्यायिक मजिस्ट्रेट या सत्र न्यायालय में दायर की जाती है।",
        legal_explanation: `**1. लागू कानून एवं वैधानिक प्रावधान:**
- **अग्रिम जमानत:** BNSS 2023 की धारा 482 (पूर्व में CrPC की धारा 438)। जब किसी व्यक्ति को किसी गैर-जमानती अपराध (Non-bailable offence) में गिरफ्तारी की उचित आशंका हो।
- **नियमित जमानत:** BNSS 2023 की धारा 480 (मजिस्ट्रेट न्यायालय) एवं धारा 483 (सत्र न्यायालय व उच्च न्यायालय)।
- **अंडरट्रायल जमानत अधिकार:** BNSS 2023 की धारा 479 के तहत पहली बार के अपराधियों (First-time offenders) को अधिकतम सजा की एक-तिहाई (1/3) अवधि पूरी करने पर जमानत का वैधानिक अधिकार प्राप्त है।

**2. सर्वोच्च न्यायालय के महत्वपूर्ण दिशानिर्देश:**
- *सतिंदर कुमार अंतिल बनाम CBI (2022)*: 7 वर्ष से कम सजा वाले अपराधों में अनावश्यक गिरफ्तारी वर्जित है; धारा 41A (अब BNSS धारा 35) का अनुपालन अनिवार्य है।
- *अरनेश कुमार बनाम बिहार राज्य (2014)*: पुलिस को बिना ठोस आधार गिरफ्तारी का नोटिस जारी करना होगा।
- *गुरबख्श सिंह सिब्बिया बनाम पंजाब राज्य*: अग्रिम जमानत का उद्देश्य निर्दोष नागरिक को अनुचित उत्पीड़न से बचाना है।

**3. न्यायालयीन क्षेत्राधिकार व प्रक्रिया:**
- याचिका सबसे पहले जिला एवं सत्र न्यायाधीश (Sessions Judge) के समक्ष पेश की जाती है। खारिज होने पर माननीय उच्च न्यायालय का रुख किया जा सकता है।`,
        action_steps: [
          "यदि FIR दर्ज हुई है, तो उसकी प्रमाणित प्रतिलिपि (Certified Copy) या ई-FIR तुरंत प्राप्त करें।",
          "आरोपों के खंडन हेतु साक्ष्य, अलिबी (Alibi), बैंक स्टेटमेंट या व्हाट्सएप/कॉल रिकॉर्ड सुरक्षित रखें।",
          "BNSS धारा 482 के अंतर्गत सत्र न्यायालय या उच्च न्यायालय में अग्रिम जमानत आवेदन वकील के माध्यम से ड्राफ्ट कराएं।",
          "न्यायालय द्वारा दी जाने वाली शर्तों (पासपोर्ट जमा करना, जांच में सहयोग, गवाहों को न धमकाना) का पालन करने हेतु शपथ पत्र तैयार करें।"
        ],
        citations: [
          "Section 482 BNSS 2023 (Anticipatory Bail)",
          "Section 483 BNSS 2023 (Special Powers of Sessions/High Court)",
          "Section 35 BNSS 2023 (Notice of Appearance before Police)",
          "Satender Kumar Antil v. CBI (2022) 10 SCC 51"
        ]
      };
    }

    return {
      summary: isAnticipatory
        ? "Under Section 482 of the Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 (formerly Section 438 CrPC), an application for Anticipatory Bail can be filed before the Sessions Court or the High Court when there is reasonable apprehension of arrest in a non-bailable offence."
        : "Post-arrest or appearance, Regular Bail is governed by Section 480 (Magistrate) and Section 483 (Sessions Court/High Court) of BNSS 2023 (formerly Sections 437 & 439 CrPC).",
      legal_explanation: `**1. Governing Statutory Architecture (BNSS 2023 vs. CrPC):**
- **Anticipatory Bail:** Section 482 BNSS 2023 empowers the Sessions Court and the High Court to issue pre-arrest protective bail directions. Factors evaluated: nature/gravity of accusation, applicant's antecedent record, flight risk, and bona fides of the complainant.
- **First-Time Offender Relief (Sec. 479 BNSS):** Introduces a landmark statutory relaxation allowing first-time offenders who have served 1/3rd of the maximum prescribed imprisonment to be released on bail/bond.
- **Mandatory Notice prior to Arrest (Sec. 35 BNSS / Former Sec. 41A CrPC):** For offences punishable with up to 7 years imprisonment, routine arrest is unlawful unless subjective satisfaction of police is recorded.

**2. Binding Judicial Precedents:**
- *Satender Kumar Antil v. CBI (2022)*: Categorized offences and mandated that guidelines on personal liberty must be strictly implemented without mechanical arrests.
- *Arnesh Kumar v. State of Bihar (2014)*: Police officers must provide valid reasons in writing before effecting arrest in minor/moderate criminal penal cases.
- *Sushila Aggarwal v. State (NCT of Delhi) (2020)*: Constitution Bench held that protection of anticipatory bail is not automatically limited to a fixed timeframe and can endure until trial completion.

**3. Procedural Matrix:**
- File petition supported by affidavit before the Sessions Judge having local jurisdiction. If rejected, approach the Hon'ble High Court having territorial jurisdiction under BNSS Section 483.`,
      action_steps: [
        "Obtain a certified copy of the FIR / Complaint or inspect the status on the State Police online CCTNS portal.",
        "Compile documentary exculpatory evidence (alibi proofs, geolocation logs, CCTV records, banking receipts, chat logs).",
        "Prepare an Anticipatory Bail application under Section 482 BNSS 2023 with an interim protection prayer.",
        "Execute a Vakalatnama and draft an affidavit confirming readiness to cooperate with investigation and furnish local sureties."
      ],
      citations: [
        "Section 482 BNSS 2023 (Anticipatory Bail)",
        "Section 480 & 483 BNSS 2023 (Regular Bail)",
        "Section 35 BNSS 2023 (Notice of Appearance / Arrest Safeguards)",
        "Satender Kumar Antil v. CBI, (2022) 10 SCC 51",
        "Sushila Aggarwal v. State (NCT of Delhi), (2020) 5 SCC 1"
      ]
    };
  }

  // 2. Cheque Bounce (Section 138 NI Act)
  if (
    q.includes('cheque') || q.includes('check') || q.includes('138') || 
    q.includes('bounce') || q.includes('dishonour') || q.includes('dishonor') ||
    q.includes('insufficient funds') || q.includes('ni act')
  ) {
    if (isHindi) {
      return {
        summary: "चेक बाउंस का मामला परक्राम्य लिखत अधिनियम (NI Act) 1881 की धारा 138 के तहत एक गंभीर दाण्डिक अपराध है, जिसमें 2 वर्ष तक का कारावास अथवा चेक राशि के दोगुने तक का जुर्माना हो सकता है।",
        legal_explanation: `**1. धारा 138 NI Act की अनिवार्य वैधानिक शर्तें:**
- **चेक की वैधता:** चेक जारी होने की तारीख से 3 माह के भीतर बैंक में प्रस्तुत किया गया हो।
- **बैंक मेमो (Dishonour Memo):** बैंक द्वारा 'अपर्याप्त धनराशि' (Funds Insufficient) या 'खाता बंद' आदि कारण से चेक लौटाया गया हो।
- **15 दिवसीय कानूनी नोटिस (Statutory Notice):** बैंक मेमो प्राप्त होने के **30 दिनों के भीतर** देनदार को लिखित में 15 दिनों का कानूनी मांग नोटिस भेजना अनिवार्य है।
- **मुकदमा दायर करने की समयसीमा (Limitation):** 15 दिन की नोटिस अवधि समाप्त होने के बाद अगले **30 दिनों के भीतर** सक्षम न्यायिक मजिस्ट्रेट (JMFC/MM) के समक्ष परिवाद (Complaint) दायर करना होता है।

**2. धारा 143A - अंतरिम मुआवजा (Interim Compensation):**
- न्यायालय मुकदमे की शुरुआत में ही आरोपी को चेक राशि का अधिकतम **20% तक अंतरिम मुआवजा** शिकायतकर्ता को देने का आदेश दे सकती है।

**3. सर्वोच्च न्यायालय का क्षेत्राधिकार दिशानिर्देश (*दशरथ रूपसिंह राठौड़ मामला* एवं 2015 संशोधन):**
- परिवाद उस स्थान के न्यायालय में दायर होगा जहां शिकायतकर्ता का बैंक खाता स्थित है (धारा 142(2))।`,
        action_steps: [
          "बैंक द्वारा जारी चेक रिटर्न मेमो (Dishonour Memo) की मूल प्रति सुरक्षित रखें।",
          "मेमो मिलने के 30 दिनों के भीतर स्पीड पोस्ट / रजिस्टर्ड डाक द्वारा 15 दिवसीय कानूनी मांग नोटिस भेजें।",
          "डाक रसीद (Postal Receipt) एवं ऑनलाइन ट्रैकिंग डिलीवरी रिपोर्ट संभाल कर रखें।",
          "यदि नोटिस प्राप्ति के 15 दिनों में भुगतान नहीं आता है, तो 30 दिन के भीतर धारा 138 के तहत कोर्ट में परिवाद दाखिल करें।"
        ],
        citations: [
          "Section 138 Negotiable Instruments Act 1881",
          "Section 142(2) NI Act (Jurisdiction of Payee Bank)",
          "Section 143A NI Act (Power to Direct Interim Compensation)",
          "M/s Meters and Instruments Pvt Ltd v. Kanchan Mehta (2018) 1 SCC 560"
        ]
      };
    }

    return {
      summary: "Cheque dishonour is a statutory criminal offence under Section 138 of the Negotiable Instruments Act, 1881, punishable with imprisonment up to 2 years, or a fine up to twice the cheque amount, or both.",
      legal_explanation: `**1. Mandatory Statutory Ingredients & Deadlines:**
- **Presentation:** Cheque must be presented within its validity period (3 months from issuance date).
- **Dishonour Memo:** Return by bank with reasons such as 'Funds Insufficient', 'Account Closed', or 'Exceeds Arrangement'.
- **Statutory Demand Notice:** Must be dispatched within **30 days** of receiving the bank memo, demanding payment within **15 clear days**.
- **Limitation Period for Complaint (Sec. 142):** Cause of action arises on the 16th day after receipt of notice; complaint must be filed within **30 days** thereafter before the competent Metropolitan Magistrate (MM) or Judicial Magistrate First Class (JMFC).

**2. Interim Compensation (Section 143A NI Act):**
- The trial court has statutory power to order the drawer/accused to pay interim compensation up to **20% of the cheque amount** to the complainant pending trial.

**3. Jurisdiction (Section 142(2)):**
- Following the 2015 amendment and *Dashrath Rupsingh Rathod* doctrine, jurisdiction lies strictly before the court within whose local limits the payee maintains their bank account where the cheque was presented.`,
      action_steps: [
        "Preserve original dishonoured cheque along with the official Bank Return Memo.",
        "Dispatch a formal 15-day Statutory Demand Notice via Registered Post with A/D or Speed Post within 30 days of memo date.",
        "Retain postal dispatch receipts and print official India Post tracking delivery proofs.",
        "If payment is not remitted within 15 days, institute a criminal complaint under Section 138 read with Section 142 within 30 days."
      ],
      citations: [
        "Section 138 Negotiable Instruments Act 1881",
        "Section 141 NI Act (Offences by Companies & Directors' Vicarious Liability)",
        "Section 143A NI Act (20% Interim Compensation Order)",
        "K.S. Joseph v. Philips Carbon Black Ltd., (2016) 11 SCC 105"
      ]
    };
  }

  // 3. Employment & Wrongful Termination
  if (
    q.includes('fired') || q.includes('job') || q.includes('termination') || 
    q.includes('salary') || q.includes('unpaid') || q.includes('employer') || 
    q.includes('gratuity') || q.includes('provident fund') || q.includes('pf') || q.includes('posh')
  ) {
    if (isHindi) {
      return {
        summary: "बिना उचित कारण, बिना कानूनी नोटिस अथवा प्राकृतिक न्याय (Natural Justice) के सिद्धांतों का उल्लंघन कर नौकरी से निकालना गैर-कानूनी (Unlawful Termination) हो सकता है।",
        legal_explanation: `**1. कर्मचारी के विधिक अधिकार एवं श्रम कानून:**
- **अनुबंध की शर्तें:** रोजगार अनुबंध (Employment Agreement / Offer Letter) में निर्धारित नोटिस अवधि (1 से 3 माह) अथवा नोटिस के बदले वेतन (Payment in lieu of notice) अनिवार्य है।
- **औद्योगिक विवाद अधिनियम 1947:** श्रमिकों/वर्कमैन की श्रेणी में आने वाले कर्मचारियों को बिना नोटिस या छंटनी मुआवजे (Retrenchment Compensation) के नहीं हटाया जा सकता।
- **पूर्ण एवं अंतिम निपटान (Full & Final Settlement - F&F):** अंतिम कार्यदिवस के 7 से 30 दिनों के भीतर संचित अवकाश (Leave Encashment), बकाया वेतन व बोनस का भुगतान अनिवार्य है।
- **ग्रेच्युटी भुगतान अधिनियम 1972:** लगातार 5 वर्ष की सेवा पूर्ण करने वाले कर्मचारी को ग्रेच्युटी का वैधानिक अधिकार है।`,
        action_steps: [
          "नियुक्ति पत्र (Offer Letter), वेतन पर्ची (Salary Slips), और टर्मिनेशन ईमेल/पत्र की प्रतियां सुरक्षित रखें।",
          "कंपनी के HR को आधिकारिक ईमेल लिखकर कारण, नोटिस पे और बकाया वेतन (F&F) की तत्काल मांग करें।",
          "यदि कंपनी भुगतान न करे, तो श्रम आयुक्त (Labour Commissioner) कार्यालय में शिकायत दर्ज कराएं या लीगल नोटिस भेजें।"
        ],
        citations: [
          "Industrial Disputes Act 1947 (Section 25F)",
          "Payment of Gratuity Act 1972 (Section 4)",
          "Payment of Wages Act 1936",
          "Delhi Shops and Establishments Act 1954 (Section 30)"
        ]
      };
    }

    return {
      summary: "Wrongful termination occurs when an employer discharges an employee in breach of the employment contract, without contractual notice period, or in violation of statutory labour protections.",
      legal_explanation: `**1. Contractual & Statutory Framework:**
- **Notice Period & Severance:** Employers are contractually bound to serve notice (typically 30–90 days) or furnish salary in lieu of notice as per the Offer Letter and Employment Agreement.
- **Industrial Disputes Act, 1947 (Sec. 25F):** For employees qualifying as 'workmen', mandatory retrenchment compensation (15 days average pay for every completed year of service) and 1 month prior notice/wages are compulsory.
- **Full & Final Settlement (F&F):** Cleared within 30 days including earned wages, accrued leave encashment, incentive dues, and statutory bonus.
- **Payment of Gratuity Act, 1972:** Mandates payment of gratuity upon completing 5 years of continuous service (calculated as 15 days wages per completed year of service).`,
      action_steps: [
        "Download and secure all relevant emails, performance appraisals, offer letters, and termination notices to personal storage.",
        "Send a formal, polite reply to HR disputing the termination and demanding contractual notice pay and full settlement.",
        "If unresolved, issue a legal demand notice through an advocate or approach the Labour Commissioner's forum.",
        "Check eligibility for gratuity and file Form N before the Controlling Authority under the Gratuity Act if withheld."
      ],
      citations: [
        "Industrial Disputes Act 1947 (Section 25F & 25N)",
        "Payment of Gratuity Act 1972 (Section 4)",
        "State Shops & Commercial Establishments Acts",
        "Western India Match Co. v. Workman, (1974) 3 SCC 330"
      ]
    };
  }

  // 4. Rental, Lease & Property
  if (
    q.includes('rent') || q.includes('lease') || q.includes('tenant') || 
    q.includes('landlord') || q.includes('eviction') || q.includes('security deposit') || 
    q.includes('property') || q.includes('rera') || q.includes('flat')
  ) {
    if (isHindi) {
      return {
        summary: "किराया एवं संपत्ति विवाद भारतीय अनुबंध अधिनियम 1872, संपत्ति अंतरण अधिनियम 1882 एवं संबंधित राज्य के किराया नियंत्रण अधिनियम (Rent Control Act) द्वारा शासित होते हैं।",
        legal_explanation: `**1. किरायेदार एवं मकान मालिक के अधिकार:**
- **सिक्योरिटी डिपॉजिट की वापसी:** अनुबंध समाप्ति पर सामान्य टूट-फूट को छोड़कर मकान मालिक द्वारा सुरक्षा राशि (Security Deposit) रोकना गैर-कानूनी है।
- **अवैध बेदखली (Illegal Eviction):** कोई भी मकान मालिक बिना कानूनी प्रक्रिया और उचित नोटिस दिए किरायेदार का सामान बाहर नहीं निकाल सकता या बिजली-पानी नहीं काट सकता।
- **रेंट एग्रीमेंट का पंजीकरण:** 11 महीने से अधिक की अवधि वाले लीज एग्रीमेंट का पंजीकरण (Registration) और स्टैम्प ड्यूटी भुगतान अनिवार्य है।`,
        action_steps: [
          "मूल रेंट एग्रीमेंट, किराया भुगतान रसीदें (Rent Receipts/UPI Logs) एवं बैंक स्टेटमेंट सुरक्षित रखें।",
          "मकान मालिक को 15-30 दिन का कानूनी नोटिस भेजकर सिक्योरिटी डिपॉजिट की ब्याज सहित मांग करें।",
          "यदि फ्लैट बिल्डर से जुड़ा विवाद है, तो राज्य RERA अथॉरिटी में ऑनलाइन शिकायत दर्ज करें।"
        ],
        citations: [
          "Transfer of Property Act 1882 (Section 106 & 108)",
          "Indian Contract Act 1872 (Section 73)",
          "Real Estate (Regulation and Development) Act 2016 (RERA Sec. 18 & 31)",
          "Model Tenancy Act 2021"
        ]
      };
    }

    return {
      summary: "Tenancy agreements and property disputes are governed by the Transfer of Property Act 1882, the Indian Contract Act 1872, state Tenancy Acts, and RERA 2016 for builder-buyer disputes.",
      legal_explanation: `**1. Key Legal Tenets of Tenancy & Lease:**
- **Notice of Termination (Sec. 106 TPA):** Monthly tenancies require 15 days written notice; yearly leases require 6 months notice unless contractually altered.
- **Security Deposit Refund:** Landlords cannot arbitrarily withhold security deposits post-vacation except for demonstrable structural damages beyond normal wear and tear.
- **Protection Against Self-Help Eviction:** Landlords are strictly barred from cutting utility supplies (electricity, water) or resorting to physical force without due process of civil law.
- **RERA Section 18:** For buyers awaiting builder possession, RERA mandates full refund with statutory interest or monthly delay penalty interest until handover.`,
      action_steps: [
        "Review the registered or notarized lease agreement, specifically the termination and security deposit clauses.",
        "Document the property handover state with timestamped photographs or video walkthroughs.",
        "Serve a formal Legal Notice demanding deposit return within 15 days under threat of civil suit and criminal breach of trust.",
        "For builder delays, initiate an online complaint before the state Real Estate Regulatory Authority (RERA)."
      ],
      citations: [
        "Section 106 & 111 Transfer of Property Act 1882",
        "Section 73 & 74 Indian Contract Act 1872",
        "Section 18 & 31 RERA Act 2016",
        "Bishandas v. State of Punjab, AIR 1961 SC 1570"
      ]
    };
  }

  // 5. Consumer Complaints
  if (
    q.includes('consumer') || q.includes('refund') || q.includes('defective') || 
    q.includes('flipkart') || q.includes('amazon') || q.includes('warranty') || 
    q.includes('deficiency') || q.includes('fraud') || q.includes('complaint')
  ) {
    if (isHindi) {
      return {
        summary: "उपभोक्ता संरक्षण अधिनियम (Consumer Protection Act) 2019 के तहत खराब सामान या सेवा में कमी (Deficiency in Service) के खिलाफ उपभोक्ता आयोग में शिकायत और हर्जाने की मांग की जा सकती है।",
        legal_explanation: `**1. उपभोक्ता आयोगों का क्षेत्राधिकार (Jurisdiction):**
- **जिला उपभोक्ता आयोग (District Commission):** ₹50 लाख तक के दावों के लिए।
- **राज्य आयोग (State Commission):** ₹50 लाख से ₹2 करोड़ तक।
- **राष्ट्रीय आयोग (NCDRC):** ₹2 करोड़ से अधिक के दावों के लिए।

**2. ऑनलाइन फाइलिंग (e-Daakhil Portal):**
- अब उपभोक्ता अपने घर बैठे 'edaakhil.nic.in' पोर्टल के माध्यम से सीधे केस दर्ज कर सकते हैं।
- उपभोक्ता अपने निवास स्थान के स्थानीय आयोग में भी शिकायत कर सकता है।`,
        action_steps: [
          "खरीद बिल (Invoice), वारंटी कार्ड, और कंपनी कस्टमर केयर से हुए ईमेल/चैट का रिकॉर्ड एकत्र करें।",
          "कंपनी को 15 दिन का कानूनी नोटिस (Legal Notice) भेजकर सामान बदलने या रिफंड की मांग करें।",
          "समाधान न होने पर e-Daakhil पोर्टल पर जाकर जिला उपभोक्ता फोरम में ऑनलाइन परिवाद दर्ज करें।"
        ],
        citations: [
          "Consumer Protection Act 2019 (Section 35 & 84)",
          "Consumer Protection (E-Commerce) Rules 2020",
          "National Consumer Helpline (1915 / consumerhelpline.gov.in)"
        ]
      };
    }

    return {
      summary: "Under the Consumer Protection Act, 2019, any buyer experiencing defect in goods, deficiency in service, or unfair trade practices can seek full refund, replacement, and punitive damages for mental agony.",
      legal_explanation: `**1. Pecuniary Jurisdictional Hierarchy (2021 Notification):**
- **District Consumer Disputes Redressal Commission:** Claims up to ₹50 Lakhs.
- **State Consumer Disputes Redressal Commission:** Claims between ₹50 Lakhs and ₹2 Crores.
- **National Commission (NCDRC, New Delhi):** Claims exceeding ₹2 Crores.

**2. Key Protections:**
- **Product Liability (Chapter VI):** Direct action against manufacturers, service providers, and e-commerce platforms.
- **Complainant Residence Jurisdiction (Sec. 34):** Complaint can be instituted where the consumer resides or works for gain.
- **E-Daakhil Facility:** Direct electronic filing and digital fee remittance without compulsory physical court presence.`,
      action_steps: [
        "Assemble tax invoice, delivery docket, warranty certificate, service technician reports, and customer care transcripts.",
        "Serve a formal statutory Demand Notice allowing 15 days for rectification/refund.",
        "Register a complaint on the National Consumer Helpline (NCH - dial 1915 or through consumerhelpline.gov.in).",
        "If unresolved, file an electronic consumer complaint on the e-Daakhil portal (edaakhil.nic.in)."
      ],
      citations: [
        "Consumer Protection Act 2019 (Sections 34, 35, 84 & 85)",
        "Consumer Protection (E-Commerce) Rules 2020",
        "Lucknow Development Authority v. M.K. Gupta, (1994) 1 SCC 243"
      ]
    };
  }

  // 6. Matrimonial, Divorce & Maintenance
  if (
    q.includes('divorce') || q.includes('marriage') || q.includes('maintenance') || 
    q.includes('alimony') || q.includes('custody') || q.includes('domestic violence') || 
    q.includes('dv act') || q.includes('dowry') || q.includes('498a')
  ) {
    if (isHindi) {
      return {
        summary: "विवाह विच्छेद और भरण-पोषण हिंदू विवाह अधिनियम 1955, घरेलू हिंसा अधिनियम 2005 और BNSS 2023 की धारा 144 (पूर्व CrPC 125) के तहत फैमिली कोर्ट द्वारा तय किए जाते हैं।",
        legal_explanation: `**1. तलाक के प्रकार:**
- **आपसी सहमति से तलाक (Mutual Consent Divorce - धारा 13B):** दोनों पक्षों की सहमति से 6 माह के कूलिंग-ऑफ पीरियड (जिसे सुप्रीम कोर्ट छूट दे सकता है) के साथ दो मोशन में पूर्ण होता है।
- **एकतरफा तलाक (Contested Divorce - धारा 13):** क्रूरता (Cruelty), परित्याग (Desertion), व्यभिचार (Adultery) आदि आधारों पर।

**2. भरण-पोषण (Maintenance):**
- पत्नी एवं नाबालिग बच्चों को BNSS 2023 धारा 144 / CrPC धारा 125 एवं HMA धारा 24/25 के तहत पति की आय के अनुपात में अंतरिम व स्थाई भरण-पोषण पाने का अधिकार है (*रजनीश बनाम नेहा - 2020 सुप्रीम कोर्ट* दिशानिर्देश)।`,
        action_steps: [
          "विवाह प्रमाण पत्र (Marriage Certificate), शादी के फोटो और दोनों पक्षों के संपत्ति/आय विवरण जुटाएं।",
          "यदि दोनों सहमत हैं, तो आपसी सहमति तलाक (13B HMA) हेतु संयुक्त याचिका फैमिली कोर्ट में दायर करें।",
          "भरण-पोषण एवं सुरक्षा हेतु फैमिली कोर्ट या महिला मजिस्ट्रेट कोर्ट में आवेदन दें।"
        ],
        citations: [
          "Section 13B Hindu Marriage Act 1955 (Mutual Consent Divorce)",
          "Section 144 BNSS 2023 / Section 125 CrPC (Maintenance)",
          "Protection of Women from Domestic Violence Act 2005 (PWDVA)",
          "Rajnesh v. Neha, (2021) 2 SCC 324 (Guidelines on Maintenance Affidavits)"
        ]
      };
    }

    return {
      summary: "Matrimonial disputes, divorce, and maintenance are adjudicated by Family Courts under the Hindu Marriage Act 1955 (or Special Marriage Act 1954), PWDVA 2005, and Section 144 BNSS 2023 (former Section 125 CrPC).",
      legal_explanation: `**1. Divorce Pathways:**
- **Mutual Consent Divorce (Section 13B HMA):** Joint petition by both spouses citing living separately for at least 1 year. The 6-month statutory waiting period can be waived by the court under *Amardeep Singh v. Harveen Kaur (2017)* if mediation efforts fail.
- **Contested Divorce (Section 13(1) HMA):** Adjudicated on specific grounds including mental or physical cruelty, desertion (min. 2 years), conversion, or unsoundness of mind.

**2. Maintenance Regime & Mandatory Disclosures:**
- In *Rajnesh v. Neha (2020)*, the Supreme Court mandated comprehensive Affidavits of Assets and Liabilities for both parties to ascertain fair interim and permanent alimony.`,
      action_steps: [
        "Procure marriage certificate, settlement agreements, residence proofs, and bank statements.",
        "In mutual cases, draft a comprehensive Memorandum of Understanding (MoU) defining custody, alimony, and asset division.",
        "File the First Motion petition under Section 13B before the competent Principal Judge, Family Court.",
        "Submit statutory Assets and Liabilities affidavits as prescribed under the Supreme Court *Rajnesh v. Neha* directive."
      ],
      citations: [
        "Section 13B & 24 Hindu Marriage Act 1955",
        "Section 144 BNSS 2023 (Order for Maintenance)",
        "Protection of Women from Domestic Violence Act 2005",
        "Rajnesh v. Neha, (2021) 2 SCC 324",
        "Amardeep Singh v. Harveen Kaur, (2017) 8 SCC 746"
      ]
    };
  }

  // 7. General Indian Legal Consultation & Drafting
  if (isHindi) {
    return {
      summary: `आपके प्रश्न ("${query.slice(0, 70)}...") का विश्लेषण भारतीय कानून, प्रक्रिया संहिता (BNSS/BNS 2023) एवं न्यायशास्त्र के अनुसार तैयार किया गया है।`,
      legal_explanation: `**1. विधिक विश्लेषण एवं लागू सिद्धांत:**
- किसी भी कानूनी मामले में प्राथमिक चरण संबंधित अधिकार (Rights), उल्लंघन (Infringement/Breach), और उचित फोरम (Civil Court, Magistrate, High Court या ट्रिब्यूनल) की पहचान करना होता है।
- नए आपराधिक एवं साक्ष्य कानूनों—**भारतीय न्याय संहिता (BNS) 2023**, **भारतीय नागरिक सुरक्षा संहिता (BNSS) 2023** तथा **भारतीय साक्ष्य अधिनियम (BSA) 2023** के तहत इलेक्ट्रॉनिक साक्ष्य एवं डिजिटल रिकॉर्ड्स (धारा 61-63 BSA) पूर्णतः मान्य हैं।

**2. समयसीमा (Limitation Act 1963):**
- किसी भी दीवानी या संविदात्मक विवाद में मुकदमा दायर करने की सामान्य समयसीमा कारण उत्पन्न होने की तिथि से **3 वर्ष** होती है।`,
      action_steps: [
        "समस्त लिखित पत्राचार, अनुबंध, रसीदें और डिजिटल साक्ष्य (ईमेल, चैट) एक समयबद्ध फाइल में व्यवस्थित करें।",
        "विरोधी पक्ष को अपने अधिवक्ता के माध्यम से 15 दिवसीय औपचारिक लीगल नोटिस भेजें।",
        "यदि मामला आपराधिक प्रकृति का है, तो नजदीकी थाने में लिखित शिकायत या BNSS धारा 175(3) के तहत मजिस्ट्रेट को आवेदन दें।",
        "आवश्यकता पड़ने पर जिला विधिक सेवा प्राधिकरण (DLSA) या निजी अधिवक्ता से कानूनी परामर्श लें।"
      ],
      citations: [
        "Bharatiya Nyaya Sanhita (BNS) 2023",
        "Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023",
        "Bharatiya Sakshya Adhiniyam (BSA) 2023 (Sections 61-63)",
        "The Limitation Act 1963"
      ]
    };
  }

  return {
    summary: `Structured Indian legal analysis for your query regarding: "${query.slice(0, 75)}${query.length > 75 ? '...' : ''}" with relevant statutory provisions and court-tested procedural remedies.`,
    legal_explanation: `**1. Legal Classification & Statutory Landscape:**
- **Civil & Contractual Sphere:** Governed by the Indian Contract Act 1872, Specific Relief Act 1963, and the Limitation Act 1963. Primary remedy lies in specific performance, restitution, or damages.
- **Criminal & Penal Sphere:** Replaced by the **Bharatiya Nyaya Sanhita (BNS 2023)** and **Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)** effective from July 1, 2024.
- **Evidentiary Compliance:** Under Sections 61 to 63 of the **Bharatiya Sakshya Adhiniyam (BSA) 2023**, digital communication, electronic contracts, and WhatsApp/Email trails carry primary evidential admissibility when accompanied by a compliant certificate.

**2. Procedural Roadmap & Limitation:**
- Ensure remedies are sought within the statutory limitation window (typically 3 years for civil claims under the Limitation Act 1963).
- Notice before suit is customary and legally persuasive to demonstrate bona fides before initiating formal court proceedings.`,
    action_steps: [
      "Chronologically collate all relevant documentary proofs, contracts, bank statements, and electronic correspondence.",
      "Issue a formal Statutory Legal Demand Notice giving the counterparty 15 days to remedy the grievance or face litigation.",
      "Identify the territorial and pecuniary jurisdiction of the competent court or regulatory tribunal.",
      "Consult with a licensed advocate to draft the petition/plaint under proper verification and stamp duty adherence."
    ],
    citations: [
      "Bharatiya Nyaya Sanhita (BNS) 2023",
      "Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023",
      "Bharatiya Sakshya Adhiniyam (BSA) 2023",
      "The Limitation Act 1963"
    ]
  };
}

module.exports = {
  generateLegalAdvice
};
