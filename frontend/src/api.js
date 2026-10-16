// Frontend API connector for Wakalat AI backend
export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:8000/api';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Auth error:", error);
    throw error;
  }
};

export const sendChatMessage = async (message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Chat request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

// ---- Document Management APIs (RLS Bypassed via Secure Backend) ----

export const saveDocumentToWorkspace = async ({ title, content, status = 'Draft', userId, userEmail }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, status, userId, userEmail }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.detail || 'Failed to save document to database');
    }
    return data;
  } catch (error) {
    console.error("Save document API error:", error);
    throw error;
  }
};

export const fetchWorkspaceDocuments = async (userId) => {
  try {
    const url = userId ? `${API_BASE_URL}/documents?userId=${encodeURIComponent(userId)}` : `${API_BASE_URL}/documents`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch documents API error:", error);
    throw error;
  }
};

export const deleteWorkspaceDocument = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  } catch (error) {
    console.error("Delete document API error:", error);
    throw error;
  }
};
