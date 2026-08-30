const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Middleware
const allowedOrigins = ['http://localhost:5173', 'https://legel-ai.vercel.app'];
app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));
app.use(express.json());

// ---- Root ----
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Wakalat AI Backend is running (Node.js).' });
});

// ---- Auth ----
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    return res.json({
      token: 'jwt-token-' + Date.now(),
      user: {
        id: '1',
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      },
    });
  }
  res.status(401).json({ detail: 'Invalid credentials' });
});

let multer, pdfParse, ChatOpenAI, SystemMessage, HumanMessage, AIMessage;
let initError = null;

try {
  multer = require('multer');
  pdfParse = require('pdf-parse');
  const langchainOpenAI = require("@langchain/openai");
  ChatOpenAI = langchainOpenAI.ChatOpenAI;
  
  // Adding Gemini support for free tier
  try {
    const googleGenAI = require("@langchain/google-genai");
    ChatGoogleGenerativeAI = googleGenAI.ChatGoogleGenerativeAI;
  } catch(e) {
    console.warn("Gemini package not yet installed");
  }

  const langchainCore = require("@langchain/core/messages");
  SystemMessage = langchainCore.SystemMessage;
  HumanMessage = langchainCore.HumanMessage;
  AIMessage = langchainCore.AIMessage;
  require('dotenv').config();
} catch (error) {
  initError = error.toString() + " | Stack: " + error.stack;
  console.error("Initialization Error:", error);
}

// Modify Root to show error if any
app.get('/', (req, res) => {
  if (initError) {
    return res.status(500).json({ status: 'error', message: 'Backend initialization failed', error: initError });
  }
  res.json({ status: 'ok', message: 'Wakalat AI Backend is running (Node.js).' });
});

// Configure multer for memory storage
let upload = null;
try {
  if (multer) upload = multer({ storage: multer.memoryStorage() });
} catch (e) {
  console.error(e);
}

// Initialize LLM (will fail gracefully if no API key is provided)
const initializeLLM = () => {
  if (process.env.GEMINI_API_KEY && typeof ChatGoogleGenerativeAI !== 'undefined') {
    return new ChatGoogleGenerativeAI({
      modelName: "gemini-1.5-flash",
      temperature: 0.2,
      apiKey: process.env.GEMINI_API_KEY
    });
  }
  if (process.env.OPENAI_API_KEY) {
    return new ChatOpenAI({
      modelName: "gpt-4o-mini", // Cost-effective model
      temperature: 0.2,
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return null;
};

// In-memory conversation store (for demo purposes)
const chatMemory = {};

// ---- Chat ----
app.post('/api/chat/message', async (req, res) => {
  const { message, sessionId = 'default', language = 'en' } = req.body;
  const llm = initializeLLM();

  if (!llm) {
    const isHindi = message.match(/[अ-ह]/) || language === 'hi';
    
    let summary = isHindi ? "सिम्युलेटेड कानूनी उत्तर (डेमो)" : "Simulated Legal Response (Demo)";
    let explanation = isHindi 
      ? `आपने पूछा: "${message}"।\n\nचूँकि अभी सर्वर पर 'OPENAI_API_KEY' सेट नहीं है, मैं एक डमी उत्तर दे रहा हूँ। जब आप अपनी API Key डाल देंगे, तो मैं भारतीय कानूनों (BNS, BNSS आदि) के अनुसार इसका सटीक और पेशेवर कानूनी जवाब दूँगा।`
      : `You asked: "${message}".\n\nSince the 'OPENAI_API_KEY' is currently missing in the backend, I am providing a simulated response. Once you provide your API key, I will use advanced AI to give a highly accurate, professional legal analysis based on Indian law.`;
    
    let actionSteps = isHindi
      ? ["अपनी OpenAI API Key प्रदान करें।", ".env फाइल में कुंजी (key) सेट करें।", "अपना प्रश्न दोबारा पूछें।"]
      : ["Provide your OpenAI API Key.", "Set the key in the backend .env file.", "Ask your query again."];

    return res.json({
      structured_response: {
        summary: summary,
        legal_explanation: explanation,
        action_steps: actionSteps
      },
      citations: []
    });
  }

  try {
    if (!chatMemory[sessionId]) {
      chatMemory[sessionId] = [
        new SystemMessage(`You are Wakalat AI, an expert Indian legal assistant. 
        Provide highly accurate legal analysis based on Indian laws (BNSS, BNS, IPC, etc.).
        Structure your response exactly as follows:
        **Summary:** [1 sentence summary]
        **Explanation:** [Detailed explanation]
        **Action Steps:** [Numbered list]
        
        Respond entirely in ${language === 'hi' ? 'Hindi' : 'English'}.`)
      ];
    }

    chatMemory[sessionId].push(new HumanMessage(message));

    // Limit memory to last 10 messages to save tokens
    const recentHistory = chatMemory[sessionId].slice(-10);
    
    const response = await llm.invoke(recentHistory);
    chatMemory[sessionId].push(new AIMessage(response.content));

    // Simple parsing to match the frontend expectations
    const content = response.content;
    let summary = "Legal Analysis";
    let explanation = content;
    let action_steps = [];

    const summaryMatch = content.match(/\*\*Summary:\*\*\s*(.*?)(?=\*\*Explanation:\*\*)/is);
    const explMatch = content.match(/\*\*Explanation:\*\*\s*(.*?)(?=\*\*Action Steps:\*\*)/is);
    const actionMatch = content.match(/\*\*Action Steps:\*\*\s*(.*)/is);

    if (summaryMatch) summary = summaryMatch[1].trim();
    if (explMatch) explanation = explMatch[1].trim();
    if (actionMatch) {
      action_steps = actionMatch[1].split('\n').filter(s => s.trim().length > 0).map(s => s.replace(/^\d+\.\s*/, '').trim());
    }

    res.json({
      structured_response: {
        summary,
        legal_explanation: explanation,
        action_steps: action_steps.length ? action_steps : ["Consult a lawyer for specific advice."]
      },
      citations: [{ source: 'AI Generated (OpenAI)', section: 'Context-Aware' }]
    });

  } catch (error) {
    console.error("LLM Error:", error);
    res.status(500).json({ detail: "Error generating AI response." });
  }
});

// ---- Document Upload ----
app.post('/api/document/upload', (req, res, next) => {
  if (!upload) return res.status(500).json({ detail: 'Multer failed to initialize' });
  upload.single('file')(req, res, next);
}, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ detail: 'No file uploaded' });
  }

  const llm = initializeLLM();

  try {
    let extractedText = '';
    
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      extractedText = data.text;
    } else {
      extractedText = req.file.buffer.toString('utf8');
    }

    if (!llm) {
      return res.json({
        filename: req.file.originalname,
        text_snippet: extractedText.substring(0, 100) + '...',
        analysis: {
          risks: ["API Key missing. Cannot analyze document."],
          suggestions: ["Add OPENAI_API_KEY to backend/.env"],
          red_flags: ["AI Analysis Disabled"]
        }
      });
    }

    // Limit text length for token limits (approx 4000 chars for demo)
    const truncatedText = extractedText.substring(0, 4000);

    const prompt = `Analyze the following legal document extract. Identify major risks, red flags, and provide suggestions.
    Return ONLY a valid JSON object strictly matching this format: {"risks": ["..."], "red_flags": ["..."], "suggestions": ["..."]}
    Document Text:
    ${truncatedText}`;

    const response = await llm.invoke([new HumanMessage(prompt)]);
    let analysis;
    try {
      // Clean up markdown block if present
      let jsonStr = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
      analysis = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON Parse Error from LLM:", response.content);
      analysis = {
        risks: ["Failed to parse AI response into structured format."],
        red_flags: [],
        suggestions: []
      }
    }

    res.json({
      filename: req.file.originalname,
      text_snippet: extractedText.substring(0, 100) + '...', 
      analysis
    });

  } catch (error) {
    console.error("Error parsing document:", error);
    res.status(500).json({ detail: 'Failed to process document' });
  }
});

app.post('/api/document/generate', async (req, res) => {
  const { document_type, parties, specific_clauses, language = 'en' } = req.body;
  const llm = initializeLLM();

  const isHindi = language === 'hi';
  const typeStr = document_type || "Legal Document";
  const partyA = parties && parties.length > 0 ? parties[0] : "Party A";
  const partyB = parties && parties.length > 1 ? parties[1] : "Party B";

  if (!llm) {
    const mockDraft = isHindi
      ? `**सिम्युलेटेड दस्तावेज़ ड्राफ्ट (डेमो)**\n\nयह ${typeStr} ${partyA} और ${partyB} के बीच है।\n\n**कृपया ध्यान दें:** चूँकि बैकएंड में 'OPENAI_API_KEY' गायब है, AI इस समय वास्तविक दस्तावेज़ उत्पन्न नहीं कर सकता है। यह केवल एक संरचनात्मक डमी है।\n\n**शर्तें (डेमो):**\n1. दोनों पक्ष सहमत हैं कि... \n2. विशिष्ट खंड: ${specific_clauses && specific_clauses.length > 0 ? specific_clauses[0] : 'कोई नहीं'}\n\nकृपया अपनी API Key सेट करें ताकि मैं आपको एक पेशेवर, कानूनी रूप से वैध ड्राफ्ट दे सकूँ।`
      : `**SIMULATED DOCUMENT DRAFT (DEMO)**\n\nThis ${typeStr} is entered into by and between ${partyA} and ${partyB}.\n\n**Please Note:** Because the 'OPENAI_API_KEY' is missing in the backend, the AI cannot generate the actual document right now. This is a structural dummy.\n\n**Terms (Demo):**\n1. Both parties agree to... \n2. Specific Clauses requested: ${specific_clauses && specific_clauses.length > 0 ? specific_clauses[0] : 'None'}\n\nPlease set your API Key so I can provide a highly professional, legally sound draft tailored to your exact needs.`;

     return res.json({ draft: mockDraft });
  }

  try {
    const prompt = `Draft a standard legal ${typeStr} between ${partyA} and ${partyB}. 
    Ensure it includes the following specific clauses or requirements: ${specific_clauses ? specific_clauses.join(', ') : 'Standard clauses'}.
    Format it professionally.
    Respond entirely in ${isHindi ? 'Hindi' : 'English'}.`;

    const response = await llm.invoke([new HumanMessage(prompt)]);
    res.json({ draft: response.content });
  } catch (error) {
    console.error("Error generating contract:", error);
    res.status(500).json({ detail: error.message || 'Failed to generate contract' });
  }
});

app.post('/api/document/compare', (req, res, next) => {
  if (!upload) return res.status(500).json({ detail: 'Multer failed to initialize' });
  upload.fields([{ name: 'file1', maxCount: 1 }, { name: 'file2', maxCount: 1 }])(req, res, next);
}, async (req, res) => {
  try {
    if (!req.files || !req.files.file1 || !req.files.file2) {
      return res.status(400).json({ detail: 'Please provide both file1 and file2' });
    }

    const file1 = req.files.file1[0];
    const file2 = req.files.file2[0];

    // Helper to extract text
    const extractText = async (file) => {
      if (file.mimetype === 'application/pdf') {
        const data = await pdfParse(file.buffer);
        return data.text;
      }
      return file.buffer.toString('utf8'); // fallback for text/csv
    };

    const text1 = await extractText(file1);
    const text2 = await extractText(file2);

    const llm = initializeLLM();
    if (!llm) {
      return res.json({ 
        comparison: `**Simulated Comparison (API Key Missing)**\n\n* **File 1:** ${file1.originalname}\n* **File 2:** ${file2.originalname}\n\nSince the AI API key is missing, no real comparison could be generated. Both documents have been received successfully, but please add an API key (OpenAI/Gemini) to see the actual legal differences and missing clauses.` 
      });
    }

    const prompt = `You are a highly experienced legal assistant. Compare the following two documents.
    
Document 1 (${file1.originalname}):
"""
${text1.substring(0, 4000)}...
"""

Document 2 (${file2.originalname}):
"""
${text2.substring(0, 4000)}...
"""

Please provide a detailed, well-formatted Markdown response that highlights:
1. The primary differences between the two documents.
2. Any critical clauses present in Document 1 but missing in Document 2.
3. Potential legal risks or anomalies found in Document 2 compared to Document 1.`;

    const response = await llm.invoke([new HumanMessage(prompt)]);
    res.json({ comparison: response.content });

  } catch (error) {
    console.error("Error comparing documents:", error);
    res.status(500).json({ detail: error.message || 'Failed to compare documents' });
  }
});

// ---- Dashboard Live Stats ----
app.get('/api/dashboard/live-stats', (req, res) => {
  if (initError) {
    return res.status(500).json({ status: 'error', error: initError });
  }
  const now = new Date();
  const timeLabel = now.toLocaleTimeString('en-IN', { hour12: false });

  // Real data — 0 until actual cases/docs exist
  res.json({
    timestamp: timeLabel,
    active_cases: 0,
    docs_analyzed: 0,
    hours_saved: 0,
    cpu_usage: 0,
  });
});

// ---- Start Server ----
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n  🚀 Wakalat AI Backend (Node.js) running at:`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  API:     http://localhost:${PORT}/api\n`);
  });
}

// Export the Express API for Vercel Serverless Functions
module.exports = app;
