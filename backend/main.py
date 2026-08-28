from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time

app = FastAPI(title="Wakalat AI API")

# Configure CORS for React frontend (Vite default port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock Models
class LoginRequest(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str
    conversation_id: str = None

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Wakalat AI Backend is running."}

@app.post("/api/auth/login")
def login(request: LoginRequest):
    # Mock authentication
    if request.email and request.password:
        return {
            "token": "mock-jwt-token-12345",
            "user": {
                "id": "1",
                "email": request.email,
                "name": request.email.split('@')[0].capitalize()
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/chat/message")
def chat_message(request: ChatRequest):
    # Mock LLM / RAG response
    # In Phase 2, this will connect to OpenAI/Gemini and ChromaDB
    time.sleep(1) # simulate processing delay
    
    response_text = f"This is a placeholder response for your query: '{request.message}'. \n\n"
    response_text += "Once we integrate the LLM API and Indian Legal Database (RAG) in Phase 2, this endpoint will return real legal analyses and citations."
    
    return {
        "reply": response_text,
        "citations": [
            {"source": "Placeholder Bare Act", "section": "Sec 123"}
        ]
    }

import random
from datetime import datetime

@app.get("/api/dashboard/live-stats")
def live_stats():
    # Simulate real-time metric updates
    now = datetime.now()
    time_label = now.strftime("%H:%M:%S")
    
    return {
        "timestamp": time_label,
        "active_cases": 140 + random.randint(0, 5),
        "docs_analyzed": 18600 + random.randint(50, 100),
        "hours_saved": 415 + round(random.uniform(0.1, 1.5), 1),
        "cpu_usage": random.randint(20, 85), # Simulated server load or AI processing load
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
