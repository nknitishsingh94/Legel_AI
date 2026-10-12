/**
 * Vakeel AI - Legal Drafting Engine
 * High-fidelity, Indian court-admissible and statutory compliant draft generator.
 * Supports both English and Hindi with Bharatiya Nyaya Sanhita (BNS) / BNSS and traditional IPC / CrPC.
 */

function generateLegalDraft({
  document_type = 'Non-Disclosure Agreement',
  category = 'General',
  parties = [],
  party_details = {},
  case_details = {},
  specific_clauses = [],
  language = 'en',
  criminal_code = 'BNSS', // 'BNSS' or 'CrPC'
  tone = 'formal'
}) {
  const isHindi = language === 'hi';
  const partyA = party_details.partyA || (parties && parties[0]) || (isHindi ? "प्रथम पक्ष / शिकायतकर्ता" : "Party A / Complainant");
  const partyB = party_details.partyB || (parties && parties[1]) || (isHindi ? "द्वितीय पक्ष / विपक्षी" : "Party B / Respondent");
  const advocateName = party_details.advocateName || (isHindi ? "अधिवक्ता, उच्च न्यायालय" : "Advocate, High Court & District Courts");
  const courtName = case_details.courtName || (isHindi ? "न्यायालय मुख्य न्यायिक मजिस्ट्रेट / सत्र न्यायालय" : "IN THE COURT OF LEARNED SESSIONS JUDGE / CHIEF JUDICIAL MAGISTRATE");
  const jurisdiction = case_details.jurisdiction || (isHindi ? "नई दिल्ली" : "New Delhi");
  const dateStr = case_details.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const amount = case_details.amount || "5,00,000";
  const chequeNo = case_details.chequeNo || "458921";
  const chequeDate = case_details.chequeDate || "15/01/2026";
  const bankName = case_details.bankName || "State Bank of India";
  const firNo = case_details.firNo || "104/2026";
  const policeStation = case_details.policeStation || "Connaught Place";
  const propertyAddress = case_details.propertyAddress || "Flat No. 402, Royal Residency, Sector 62, Noida, Uttar Pradesh";
  const rentAmount = case_details.rentAmount || "25,000";
  const securityDeposit = case_details.securityDeposit || "50,000";
  const customClausesText = Array.isArray(specific_clauses) && specific_clauses.length > 0 
    ? specific_clauses.join('\n') 
    : (typeof specific_clauses === 'string' ? specific_clauses : '');

  const normalizedType = document_type.toLowerCase();

  // 1. CHEQUE BOUNCE NOTICE (SECTION 138 NI ACT)
  if (normalizedType.includes('138') || normalizedType.includes('cheque') || normalizedType.includes('चेक')) {
    if (isHindi) {
      return `रजिस्टर्ड डाक / स्पीड पोस्ट द्वारा विधिक नोटिस
(धारा 138 एवं 142 पराक्राम्य लिखत अधिनियम, 1881 / NEGOTIABLE INSTRUMENTS ACT, 1881 के अंतर्गत)

दिनांक: ${dateStr}
स्थान: ${jurisdiction}

प्रेषक:
${advocateName}
अधिवक्ता, भारतीय विधिज्ञ परिषद
कार्यालय: चैम्बर नं. 412, लॉयर्स ब्लॉक, ${jurisdiction}
मो.: +91 98765 43210

सेवा में (Noticee):
${partyB}
निवासी: [विपक्षी का पूर्ण पता]

विषय: धारा 138 परक्राम्य लिखत अधिनियम, 1881 के तहत चेक अनादर (Cheque Bounce) बाबत 15 दिवसीय अंतिम कानूनी नोटिस।

महोदय/महोदया,

मेरे मुवक्किल (Client) श्री/श्रीमती ${partyA} की ओर से तथा उनके स्पष्ट निर्देशों के अधीन, मैं आपको निम्नलिखित कानूनी नोटिस प्रेषित करता हूँ:

1. यह कि मेरे मुवक्किल और आपके बीच पूर्व से व्यापारिक/मित्रवत संबंध रहे हैं, जिसके तहत आपने मेरे मुवक्किल से वैध देयता के रूप में धनराशि ₹${amount}/- (अक्षरी: रुपये ${amount} मात्र) प्राप्त की थी।

2. यह कि उक्त वैध कानूनी देयता के पूर्ण/आंशिक भुगतान स्वरूप आपने मेरे मुवक्किल के पक्ष में निम्नलिखित चेक जारी किया था:
   - चेक संख्या: ${chequeNo}
   - दिनांक: ${chequeDate}
   - राशि: ₹${amount}/-
   - बैंक का नाम: ${bankName}

3. यह कि आपके पूर्ण आश्वासन पर मेरे मुवक्किल ने उक्त चेक को अपने बैंक खाते में भुगतान हेतु प्रस्तुत किया। परन्तु मेरे मुवक्किल को यह जानकर गहरा आघात पहुँचा कि उक्त चेक बैंक द्वारा 'अनादृत' (Dishonoured) कर दिया गया, जिसका कारण बैंक रिटर्न मेमो में "खाते में पर्याप्त राशि नहीं (Funds Insufficient)" अंकित था।

4. यह कि आपने जानबूझकर और कपटपूर्ण इरादे से उक्त चेक यह जानते हुए जारी किया था कि आपके खाते में पर्याप्त शेष राशि नहीं है, जिससे स्पष्ट है कि आपका इरादा मेरे मुवक्किल को आर्थिक क्षति पहुँचाने का था।

5. ${customClausesText ? `विशिष्ट शर्तें/तथ्य:\n${customClausesText}\n` : ''}

अतः इस कानूनी नोटिस के माध्यम से आपको निर्देशित किया जाता है कि इस नोटिस की प्राप्ति के 15 (पंद्रह) दिनों के भीतर उक्त चेक राशि ₹${amount}/- का पूर्ण भुगतान मेरे मुवक्किल को करें। 

यदि आप उक्त समयावधि में भुगतान करने में विफल रहते हैं, तो मेरे मुवक्किल आपके विरुद्ध सक्षम न्यायालय में धारा 138 एवं 142 पराक्राम्य लिखत अधिनियम के साथ-साथ भारतीय न्याय संहिता, 2023 (BNS) की धारा 318 (धोखाधड़ी) के तहत आपराधिक परिवाद दायर करने के लिए पूर्णतः स्वतंत्र होंगे, जिसमें 2 वर्ष का कारावास एवं चेक राशि से दोगुनी राशि का जुर्माना हो सकता है।

नोटिस की प्रति मेरे कार्यालय में सुरक्षित रखी गई है।

भवदीय,

____________________
(${advocateName})
अधिवक्ता (मुवक्किल की ओर से)`;
    }

    return `LEGAL NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
(BY REGISTERED POST A.D. / SPEED POST / LEGAL COURIER)

Date: ${dateStr}
Place: ${jurisdiction}

FROM:
${advocateName}
Advocate, Enrolment No. D/1482/2018
Chamber No. 412, Lawyers Chambers Block, ${jurisdiction}
Contact: legal.chamber@wakalat.ai

TO (NOTICEE):
${partyB}
Resident of / Having Office at: [Noticee Address Here]

RE: STATUTORY DEMAND NOTICE UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 IN RESPECT OF DISHONOUR OF CHEQUE NO. ${chequeNo} FOR ₹${amount}/-

Sir / Madam,

Under instructions from and on behalf of my client, ${partyA} (hereinafter referred to as "My Client"), I hereby serve upon you this Statutory Legal Notice as under:

1. That you, the noticee, had approached my client and towards discharge of your legally enforceable debt and liability, you had issued the following cheque drawn on your bank account in favour of my client:
   - Cheque Number: ${chequeNo}
   - Cheque Dated: ${chequeDate}
   - Amount: INR ${amount}/- (Rupees ${amount} Only)
   - Drawn on: ${bankName}

2. That you had assured my client at the time of handing over the aforesaid cheque that the same would be duly honoured upon presentation on its due date.

3. That believing your express representation and assurance, my client presented the said cheque for clearance through their banker. However, to my client’s utter shock and dismay, the aforesaid cheque was returned dishonoured and unpaid by the bank vide Bank Return Memo dated with the endorsement "FUNDS INSUFFICIENT" (or "EXCEEDS ARRANGEMENT").

4. That immediately upon receipt of the bank return memo, my client informed you regarding the dishonour of the said cheque and requested you to make the payment, but you have deliberately neglected, evaded, and failed to liquidate the said legitimate amount.

${customClausesText ? `5. SPECIFIC FACTS & STIPULATIONS:\n${customClausesText}\n` : ''}

6. That by your aforesaid acts of issuing a cheque without sufficient funds in your bank account, you have committed an offence punishable under Section 138 of the Negotiable Instruments Act, 1881, as well as an offence of Cheating under Section 318(4) of Bharatiya Nyaya Sanhita, 2023 (formerly Section 420 of the Indian Penal Code).

THEREFORE, I hereby call upon you through this statutory notice to pay the entire cheque amount of INR ${amount}/- (Rupees ${amount} Only) to my client within 15 (FIFTEEN) DAYS of the receipt of this notice.

PLEASE TAKE NOTE that in the event of your failure to make the payment within the stipulated statutory period of 15 days, my client has peremptory instructions to initiate criminal proceedings against you before the Court of Learned Metropolitan Magistrate / Judicial Magistrate First Class under Section 138 of the Negotiable Instruments Act, 1881, wherein you shall be liable to be punished with imprisonment for a term which may extend up to two years, or with fine which may extend to twice the amount of the cheque, or with both, entirely at your sole risk, cost, and consequence.

A copy of this legal notice is retained in my office for record and future legal proceedings.

Yours faithfully,

_______________________________
(${advocateName})
Advocate for the Complainant`;
  }

  // 2. REGULAR BAIL APPLICATION (CRPC 439 / BNSS 483)
  if (normalizedType.includes('bail') && !normalizedType.includes('anticipatory')) {
    const isBnss = criminal_code === 'BNSS';
    const sectionCite = isBnss 
      ? 'SECTION 483 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS)' 
      : 'SECTION 439 OF THE CODE OF CRIMINAL PROCEDURE, 1973 (Cr.P.C.)';
    const sectionCiteHindi = isBnss
      ? 'भारतीय नागरिक सुरक्षा संहिता, 2023 की धारा 483'
      : 'दण्ड प्रक्रिया संहिता, 1973 की धारा 439';

    if (isHindi) {
      return `न्यायालय माननीय सत्र न्यायाधीश / अपर सत्र न्यायाधीश, ${jurisdiction}
जमानत प्रार्थना पत्र संख्या: ________ / 2026

मामले में:
${partyA} (आवेदक / अभियुक्त)
पुत्र/पुत्री श्री: [पिता का नाम], उम्र: [आयु] वर्ष
निवासी: [स्थाई पता]
...आवेदक / अभियुक्त

बनाम

राज्य (राष्ट्रीय राजधानी क्षेत्र दिल्ली / संबंधित राज्य)
द्वारा थाना प्रभारी, थाना ${policeStation}
...विपक्षी / राज्य

प्राथमिकी (FIR) विवरण:
- एफ.आई.आर. संख्या: ${firNo}
- दिनांक: ${dateStr}
- थाना: ${policeStation}
- धाराएं: ${isBnss ? 'धारा 316, 318(4), 351(2) भारतीय न्याय संहिता, 2023 (BNS)' : 'धारा 420, 406, 506 भारतीय दण्ड संहिता (IPC)'}

${sectionCiteHindi} के अंतर्गत नियमित जमानत (Regular Bail) हेतु प्रार्थना पत्र।

आवेदक / अभियुक्त की ओर से सविनय निवेदन निम्नवत है:

1. यह कि आवेदक निर्दोष है और उसे पुलिस द्वारा दुर्भावनापूर्ण एवं झूठे आरोपों के आधार पर इस मामले में संलिप्त किया गया है।

2. यह कि आवेदक को दिनांक [गिरफ्तारी की तारीख] को गिरफ्तार किया गया था और वह तब से न्यायिक हिरासत में जेल में निरूद्ध है। आवेदक से किसी भी प्रकार की पुलिस रिमांड अथवा बरामदगी शेष नहीं है।

3. यह कि आवेदक समाज में गहरी जड़ें रखने वाला एक सम्मानित नागरिक है, जिसका कोई पूर्व आपराधिक इतिहास (Criminal Antecedents) नहीं है।

4. यह कि मामले की जांच लगभग पूर्ण हो चुकी है और आवेदक के भागने या न्याय से बचने की कोई संभावना नहीं है।

5. यह कि आवेदक माननीय न्यायालय द्वारा अधिरोपित किसी भी निष्पक्ष एवं उचित शर्त का पालन करने तथा सक्षम प्रतिभू (Sound Surety) प्रस्तुत करने के लिए तत्पर है।

${customClausesText ? `6. विशेष आधार:\n${customClausesText}\n` : ''}

प्रार्थना (PRAYER):
अतः माननीय न्यायालय से न्यायहित में विनम्र प्रार्थना है कि:
(क) आवेदक / अभियुक्त ${partyA} को उक्त एफ.आई.आर. संख्या ${firNo}, थाना ${policeStation} में माननीय न्यायालय की संतुष्टि के अनुसार जमानत बंधपत्र एवं मुचलका प्रस्तुत करने पर नियमित जमानत पर रिहा करने की कृपा की जावे।
(ख) कोई अन्य आदेश जो माननीय न्यायालय न्यायहित में उचित समझे, पारित करने की कृपा की जावे।

स्थान: ${jurisdiction}
दिनांक: ${dateStr}

प्रार्थी / आवेदक
द्वारा
____________________
(${advocateName})
अधिवक्ता, आवेदक हेतु

सत्यापन (VERIFICATION):
मैं, उपरोक्त नामी आवेदक/हितेषी, सत्यनिष्ठा से प्रतिज्ञान करता हूँ कि इस जमानत प्रार्थना पत्र के पैरा 1 से 6 में वर्णित समस्त तथ्य मेरे निजी ज्ञान व विधिक सलाह के अनुसार सत्य व सही हैं।
सत्यापित स्थान: ${jurisdiction}, दिनांक: ${dateStr}`;
    }

    return `IN THE COURT OF THE LEARNED SESSIONS JUDGE AT ${jurisdiction.toUpperCase()}
BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
${partyA}
S/o [Father's Name], Aged about [Age] Years,
R/o [Full Permanent Residential Address]
...APPLICANT / ACCUSED

VERSUS

STATE (GOVT. OF NCT OF DELHI / STATE)
Through SHO, Police Station: ${policeStation}
...RESPONDENT / PROSECUTION

CASE CRIME PARTICULARS:
FIR No.: ${firNo}
Dated: ${dateStr}
Police Station: ${policeStation}
Offences Under: ${isBnss ? 'Sections 316, 318(4), 351(2) of Bharatiya Nyaya Sanhita, 2023 (BNS)' : 'Sections 420, 406, 506 of the Indian Penal Code, 1860 (IPC)'}

APPLICATION UNDER ${sectionCite} FOR GRANT OF REGULAR BAIL ON BEHALF OF THE ACCUSED / APPLICANT

MOST RESPECTFULLY SHOWETH:

1. That the Applicant is a law-abiding citizen of India, having deep roots in society, and has been falsely implicated in the above-captioned FIR at the instance of vested and interested parties due to civil and monetary animosity.

2. That the Applicant was arrested on [Date of Arrest] and has been languishing in judicial custody since then. No recovery remains to be effected from the applicant, and custodial interrogation is no longer required by the investigating agency.

3. That the entire dispute between the parties is purely of a civil nature arising out of commercial dealings, which has been given a criminal colour to exert undue pressure upon the Applicant.

4. That the Applicant has clean and unblemished antecedents with no prior criminal convictions or pending cases of similar nature.

5. That the Applicant undertakes not to tamper with the evidence, nor influence any prosecution witness, nor flee from the course of justice in any manner whatsoever.

6. That the Applicant is ready and willing to abide by any stringent condition that may be imposed by this Hon'ble Court and undertakes to furnish sound, solvent surety to the satisfaction of this Hon'ble Court.

${customClausesText ? `7. SPECIAL GROUNDS:\n${customClausesText}\n` : ''}

PRAYER:
Wherefore, in the light of the facts and circumstances stated hereinabove, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to:

a) Release the Applicant / Accused ${partyA} on Regular Bail in connection with FIR No. ${firNo}, registered at Police Station ${policeStation}, upon furnishing bail bonds and solvent sureties to the satisfaction of this Hon'ble Court; and

b) Pass such other or further order(s) as this Hon'ble Court may deem fit and proper in the interest of justice.

AND FOR THIS ACT OF KINDNESS, THE APPLICANT AS IN DUTY BOUND SHALL EVER PRAY.

FILED BY:

__________________________________
(${advocateName})
Advocate for the Applicant
Chamber No. 412, Lawyers Chambers Block, ${jurisdiction}

VERIFICATION & AFFIDAVIT
I, [Name of Deponent / Relative / Pairokar], the deponent herein, do hereby solemnly affirm and state on oath that the contents of paragraphs 1 to 7 of the accompanying Bail Application are true and correct to the best of my knowledge and information derived from court records.
Verified at ${jurisdiction} on this ${dateStr}.

DEPONENT`;
  }

  // 3. ANTICIPATORY BAIL APPLICATION (CRPC 438 / BNSS 482)
  if (normalizedType.includes('anticipatory') || normalizedType.includes('अग्रिम जमानत')) {
    const isBnss = criminal_code === 'BNSS';
    const sectionCite = isBnss ? 'SECTION 482 OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS)' : 'SECTION 438 OF Cr.P.C., 1973';
    return `IN THE COURT OF THE LEARNED SESSIONS JUDGE AT ${jurisdiction.toUpperCase()}
ANTICIPATORY BAIL APPLICATION NO. ________ OF 2026

IN THE MATTER OF:
${partyA}
S/o [Father's Name], Aged about [Age] Years,
R/o [Full Residential Address]
...APPLICANT

VERSUS

STATE (NCT OF DELHI / STATE)
Through SHO, Police Station: ${policeStation}
...RESPONDENT

FIR No.: ${firNo} | P.S.: ${policeStation}
Offences Under: ${isBnss ? 'Sections 318(4), 316(2) BNS, 2023' : 'Sections 420, 406 IPC, 1860'}

APPLICATION UNDER ${sectionCite} FOR GRANT OF ANTICIPATORY BAIL IN THE EVENT OF ARREST

MOST RESPECTFULLY SHOWETH:

1. That the Applicant has a bona fide and grave apprehension of imminent arrest by the investigating officers of P.S. ${policeStation} in connection with the above-mentioned FIR, which is totally false, frivolous, and concocted.

2. That the Applicant has never been involved in any anti-social or criminal activity. The complainant has roped in the Applicant with oblique motives.

3. That the Applicant is a permanent resident of the address stated above and there is no likelihood of the Applicant absconding or fleeing from the course of justice.

4. That the Applicant undertakes to join and fully cooperate with the investigation as and when directed by the Investigating Officer.

${customClausesText ? `5. SPECIFIC SUBMISSIONS:\n${customClausesText}\n` : ''}

PRAYER:
It is therefore most respectfully prayed that in the event of arrest in FIR No. ${firNo}, P.S. ${policeStation}, the Applicant ${partyA} may kindly be directed to be released on Anticipatory Bail, on such terms and conditions as this Hon'ble Court may deem fit and proper.

APPLICANT
THROUGH COUNSEL: ${advocateName}`;
  }

  // 4. RESIDENTIAL RENT AGREEMENT
  if (normalizedType.includes('rent') || normalizedType.includes('lease') || normalizedType.includes('किराया')) {
    if (isHindi) {
      return `किरायानामा (RESIDENTIAL RENT AGREEMENT)

यह किरायानामा आज दिनांक ${dateStr} को ${jurisdiction} में निम्नलिखित पक्षों के मध्य निष्पादित किया गया:

प्रथम पक्ष (मकान मालिक / Landlord):
श्री/श्रीमती ${partyA}
पुत्र/पत्नी श्री [नाम], निवासी: [मकान मालिक का स्थाई पता]
(जिन्हें इसके पश्चात् "मकान मालिक" कहा जाएगा, जिसमें उनके वैध उत्तराधिकारी शामिल हैं)

एवं

द्वितीय पक्ष (किराएदार / Tenant):
श्री/श्रीमती ${partyB}
पुत्र/पत्नी श्री [नाम], निवासी: [किराएदार का स्थाई पता]
(जिन्हें इसके पश्चात् "किराएदार" कहा जाएगा)

यह कि प्रथम पक्ष उक्त संपत्ति संख्या: ${propertyAddress} (इसके पश्चात् "किराया परिसर") का एकमात्र वैधानिक स्वामी एवं अधिभोगी है।

अब यह विलेख निम्नलिखित शर्तों एवं निबंधनों का साक्ष्य प्रस्तुत करता है:

1. अवधि (Tenancy Period): यह किरायानामा दिनांक ${dateStr} से आगामी 11 (ग्यारह) माह की अवधि हेतु निष्पादित किया जा रहा है। दोनों पक्षों की पारस्परिक सहमति से इसे आगे बढ़ाया जा सकेगा।

2. मासिक किराया (Monthly Rent): किराएदार द्वारा प्रतिमाह ₹${rentAmount}/- (अक्षरी: रुपये ${rentAmount} मात्र) का भुगतान प्रत्येक माह की 7 तारीख तक मकान मालिक को बैंक अंतरण / नकद द्वारा किया जाएगा।

3. सुरक्षा जमा राशि (Security Deposit): किराएदार ने मकान मालिक को ब्याज मुक्त प्रतिभूति के रूप में ₹${securityDeposit}/- जमा किए हैं, जो परिसर खाली करने पर किसी भी बकाया या टूट-फूट की कटौती उपरांत वापस कर दी जाएगी।

4. बिजली एवं पानी शुल्क: किराएदार परिसर में प्रयुक्त बिजली एवं पानी का वास्तविक बिल मीटर रीडिंग के आधार पर सीधे जमा करेगा।

5. परिसर का उपयोग: किराएदार उक्त परिसर का उपयोग केवल वैध आवासीय प्रयोजन हेतु करेगा। परिसर में किसी भी प्रकार की उप-किराएदारी (Sub-letting) या गैर-कानूनी गतिविधि पूर्णतः प्रतिबंधित होगी।

${customClausesText ? `6. विशेष शर्तें:\n${customClausesText}\n` : ''}

7. समाप्ति एवं नोटिस (Termination): दोनों में से कोई भी पक्ष 1 माह का पूर्व लिखित नोटिस देकर इस किराएनामे को समाप्त कर सकेगा।

उपरोक्त समस्त शर्तों को दोनों पक्षों ने भली-भांति पढ़कर व समझकर बिना किसी दबाव के निम्नलिखित साक्षियों की उपस्थिति में अपने हस्ताक्षर कर दिए हैं।

हस्ताक्षर प्रथम पक्ष (मकान मालिक): ____________________
हस्ताक्षर द्वितीय पक्ष (किराएदार): ____________________

साक्षीगण:
1. हस्ताक्षर: __________________ नाम व पता: _______________________________
2. हस्ताक्षर: __________________ नाम व पता: _______________________________`;
    }

    return `RESIDENTIAL RENT AGREEMENT
(STANDARD 11-MONTH TENANCY LEASE DEED)

THIS DEED OF RENT AGREEMENT is made and executed on this ${dateStr} at ${jurisdiction} by and between:

LESSOR / LANDLORD:
${partyA}
S/o / D/o / W/o [Father/Spouse Name],
Permanent Address: [Landlord Permanent Address]
(hereinafter referred to as the "LANDLORD", which expression shall include his/her legal heirs, executors, and assigns) OF THE FIRST PART.

AND

LESSEE / TENANT:
${partyB}
S/o / D/o / W/o [Father/Spouse Name],
Permanent Address: [Tenant Permanent Address]
(hereinafter referred to as the "TENANT", which expression shall include his/her legal heirs, executors, and assigns) OF THE SECOND PART.

WHEREAS the Landlord is the sole, absolute, and lawful owner of the residential property situated at:
${propertyAddress} (hereinafter referred to as the "DEMISED PREMISES").

AND WHEREAS the Tenant has requested the Landlord to let out the Demised Premises for strictly bona fide residential purposes for a temporary period of 11 (Eleven) Months.

NOW THIS AGREEMENT WITNESSETH AND IT IS HEREBY MUTUALLY AGREED BY AND BETWEEN THE PARTIES AS FOLLOWS:

1. TENURE:
The tenancy shall be for a fixed term of 11 (Eleven) months commencing from ${dateStr}. This agreement may be renewed with mutual written consent of both parties on freshly negotiated terms.

2. MONTHLY RENT:
The Tenant agrees to pay a monthly rent of INR ${rentAmount}/- (Rupees ${rentAmount} Only), payable in advance on or before the 7th day of each calendar month directly into the Landlord's designated bank account.

3. INTEREST-FREE REFUNDABLE SECURITY DEPOSIT:
The Tenant has paid to the Landlord an interest-free refundable security deposit of INR ${securityDeposit}/- (Rupees ${securityDeposit} Only) via online transfer / cheque. The said deposit shall be refunded upon peaceful handover of vacant possession, subject to deductions for unpaid utility dues or structural damages.

4. UTILITIES AND MAINTENANCE:
The Tenant shall directly pay all electricity, water, and broadband charges incurred in the Demised Premises in accordance with actual meter readings.

5. RESTRICTIONS ON USE AND SUB-LETTING:
The Tenant shall use the premises strictly for residential purposes and shall not sublet, assign, or part with possession of the premises to any third party. No hazardous, immoral, or commercial activity shall be carried out.

${customClausesText ? `6. SPECIAL COVENANTS & CLAUSES:\n${customClausesText}\n` : ''}

7. NOTICE FOR VACATING / TERMINATION:
Either party may terminate this agreement prior to expiry of the 11-month term by serving 1 (One) month's written notice to the other party.

IN WITNESS WHEREOF, the Landlord and the Tenant have set their respective hands to this Rent Agreement on the day, month, and year first above written in the presence of the following witnesses:

_________________________________
LANDLORD (${partyA})

_________________________________
TENANT (${partyB})

WITNESSES:
1. Signature: __________________ Name & Address: __________________________________
2. Signature: __________________ Name & Address: __________________________________`;
  }

  // 5. NON-DISCLOSURE AGREEMENT (NDA)
  if (normalizedType.includes('nda') || normalizedType.includes('non-disclosure') || normalizedType.includes('गोपनीयता')) {
    return `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

THIS MUTUAL NON-DISCLOSURE AGREEMENT ("Agreement") is entered into on this ${dateStr} ("Effective Date") at ${jurisdiction}, India, by and between:

PARTY A (Disclosing / Receiving Party):
${partyA}, having its principal place of business at [Address of Party A]

AND

PARTY B (Disclosing / Receiving Party):
${partyB}, having its principal place of business at [Address of Party B]

(Party A and Party B are collectively referred to as the "Parties" and individually as a "Party").

RECITALS:
WHEREAS, the Parties wish to explore and evaluate a prospective business relationship or collaboration (the "Purpose"); and
WHEREAS, in connection with the Purpose, each Party may disclose to the other Party certain non-public, proprietary, and confidential business, technical, or financial information.

NOW, THEREFORE, IN CONSIDERATION OF THE MUTUAL PROMISES CONTAINED HEREIN, THE PARTIES AGREE AS FOLLOWS:

1. DEFINITION OF CONFIDENTIAL INFORMATION:
"Confidential Information" means all non-public information disclosed by one Party ("Disclosing Party") to the other Party ("Receiving Party"), whether orally or in writing, including but not limited to business plans, software source code, financial data, customer lists, intellectual property, product designs, trade secrets, and proprietary methodologies.

2. OBLIGATIONS OF RECEIVING PARTY:
The Receiving Party agrees:
(a) To hold all Confidential Information in strict confidence and protect it with the same degree of care as it uses for its own confidential information, but in no case less than reasonable care;
(b) Not to disclose Confidential Information to any third party without prior written consent of Disclosing Party;
(c) To use Confidential Information solely for the authorized Purpose.

3. EXCLUSIONS FROM CONFIDENTIALITY:
Confidential Information does not include information that:
(a) Is or becomes publicly known through no breach of this Agreement;
(b) Was already in possession of Receiving Party prior to disclosure;
(c) Is independently developed by Receiving Party without reference to Confidential Information.

4. TERM AND SURVIVAL:
This Agreement shall remain in effect for a period of two (2) years from the Effective Date, and the confidentiality obligations herein shall survive termination for a period of three (3) years thereafter.

${customClausesText ? `5. SPECIFIC CLAUSES:\n${customClausesText}\n` : ''}

6. GOVERNING LAW AND JURISDICTION:
This Agreement shall be governed by and construed in accordance with the laws of India. Any dispute arising under this Agreement shall be subject to the exclusive jurisdiction of the competent courts at ${jurisdiction}.

IN WITNESS WHEREOF, the Parties have executed this Non-Disclosure Agreement as of the Effective Date.

FOR PARTY A (${partyA}):
Signature: __________________________
Name & Designation: ________________

FOR PARTY B (${partyB}):
Signature: __________________________
Name & Designation: ________________`;
  }

  // 6. GENERAL SWORN AFFIDAVIT
  if (normalizedType.includes('affidavit') || normalizedType.includes('हलफनामा') || normalizedType.includes('शपथ पत्र')) {
    if (isHindi) {
      return `शपथ पत्र (AFFIDAVIT)
(₹100 के गैर-न्यायिक स्टाम्प पेपर पर नोटरीकृत होने हेतु)

समक्ष: नोटरी पब्लिक / प्रथम श्रेणी कार्यपालक दंडाधिकारी, ${jurisdiction}

मैं, ${partyA}, पुत्र/पत्नी श्री [पिता का नाम], उम्र लगभग [आयु] वर्ष, स्थाई निवासी: [पूर्ण पता], सत्यनिष्ठापूर्वक शपथ लेकर निम्नलिखित कथन करता हूँ:

1. यह कि मैं भारत का नागरिक हूँ तथा उपरोक्त पते का स्थाई निवासी हूँ।

2. यह कि मैं इस शपथ पत्र में किए गए समस्त कथनों से भली-भांति अवगत हूँ तथा सत्य कथन करने हेतु पूर्णतः सक्षम हूँ।

3. यह कि [विशिष्ट तथ्य एवं घोषणा का विवरण]।

${customClausesText ? `4. विशेष घोषणा:\n${customClausesText}\n` : ''}

5. यह कि मेरे द्वारा दी गई समस्त जानकारी पूर्णतः सत्य, निष्पक्ष एवं यथार्थ है तथा मैंने कोई भी सारवान तथ्य छिपाया नहीं है।

शपथग्रहीता (DEPONENT)

सत्यापन (VERIFICATION):
मैं, उपरोक्त नामी शपथग्रहीता, सत्यनिष्ठापूर्वक सत्यापित करता हूँ कि इस शपथ पत्र की कंडिका 1 से 5 में दिए गए समस्त कथन मेरे निजी ज्ञान व विश्वास के अनुसार पूर्णतः सत्य व सही हैं, इसमें कुछ भी असत्य नहीं है और न ही कोई तथ्य छिपाया गया है। ईश्वर मेरी सहायता करे।

सत्यापित स्थान: ${jurisdiction}
दिनांक: ${dateStr}

शपथग्रहीता (DEPONENT)
पहचानकर्ता (Identified by):
अधिवक्ता / नोटरी पब्लिक सील व हस्ताक्षर`;
    }

    return `GENERAL SWORN AFFIDAVIT
(TO BE ATTESTED BEFORE NOTARY PUBLIC / OATH COMMISSIONER ON STAMP PAPER)

BEFORE THE NOTARY PUBLIC / EXECUTIVE MAGISTRATE AT ${jurisdiction.toUpperCase()}

I, ${partyA}, S/o / D/o / W/o [Father/Spouse Name], Aged about [Age] Years,
Residing at: [Full Residential Address],
Do hereby solemnly affirm, state, and declare on oath as under:

1. That I am a bona fide citizen of India and a permanent resident of the address aforementioned.

2. That I am fully conversant with the facts and circumstances stated herein and competent to depose to this affidavit.

3. That [Specific facts and declarations of the matter].

${customClausesText ? `4. SPECIFIC DECLARATIONS:\n${customClausesText}\n` : ''}

5. That all the particulars furnished above are true, complete, and correct to the best of my knowledge, and nothing material has been concealed or misrepresented herein.

DEPONENT (${partyA})

VERIFICATION
Verified at ${jurisdiction} on this ${dateStr} that the contents of paragraphs 1 to 5 of this affidavit are true and correct to the best of my personal knowledge and belief. No part of it is false and nothing material has been concealed therefrom.

DEPONENT
IDENTIFIED BY COUNSEL: ${advocateName}`;
  }

  // 7. DEFAULT FALLBACK LEGAL DOCUMENT
  return `LEGAL DOCUMENT DRAFT
TYPE: ${document_type.toUpperCase()}
JURISDICTION: ${jurisdiction} | DATE: ${dateStr}

BETWEEN:
1. FIRST PARTY: ${partyA}
AND
2. SECOND PARTY: ${partyB}

REPRESENTED BY ADVOCATE: ${advocateName}

WHEREAS the Parties have agreed to enter into this formal legal instrument governing their mutual rights, obligations, covenants, and remedies under applicable Indian Laws.

NOW THIS DEED WITNESSETH AS FOLLOWS:

1. APPOINTMENT & SCOPE:
The Parties agree to the core covenants governing ${document_type}, executed in good faith and with lawful consideration.

2. OBLIGATIONS & REPRESENTATIONS:
Each Party represents that it has the full requisite legal authority, capacity, and standing to enter into and execute this document without contravention of any statutory mandate.

${customClausesText ? `3. SPECIAL STIPULATIONS & CLAUSES:\n${customClausesText}\n` : ''}

4. DISPUTE RESOLUTION & GOVERNING LAW:
This document shall be governed by the laws of India. Any dispute arising out of or in connection with this agreement shall be settled through amicable mediation, failing which the courts having territorial jurisdiction at ${jurisdiction} shall have exclusive competence.

IN WITNESS WHEREOF, the Parties have executed this instrument on the date first written above.

PARTY A: ___________________________ (${partyA})
PARTY B: ___________________________ (${partyB})

COUNSEL / WITNESS:
___________________________________
(${advocateName})`;
}

module.exports = {
  generateLegalDraft
};
