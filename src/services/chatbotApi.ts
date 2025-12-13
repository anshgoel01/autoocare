// Chatbot API Service
// TODO: Replace with your actual Django API base URL
const API_BASE_URL = 'https://your-django-api.com/api/chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export interface SendMessageRequest {
  message: string;
  userId: string;
  sessionId: string;
}

export interface SendMessageResponse {
  reply: string;
  suggestions?: string[];
  timestamp: string;
}

export interface ChatHistoryResponse {
  messages: {
    role: 'user' | 'bot';
    content: string;
    timestamp: string;
  }[];
}

export interface SuggestionsResponse {
  suggestions: string[];
}

class ChatbotApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await fetch(`${this.baseUrl}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    return response.json();
  }

  async getHistory(userId: string, sessionId: string): Promise<ChatHistoryResponse> {
    const response = await fetch(
      `${this.baseUrl}/history?userId=${encodeURIComponent(userId)}&sessionId=${encodeURIComponent(sessionId)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get history: ${response.statusText}`);
    }

    return response.json();
  }

  async clearHistory(userId: string, sessionId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to clear history: ${response.statusText}`);
    }
  }

  async getSuggestions(): Promise<SuggestionsResponse> {
    const response = await fetch(`${this.baseUrl}/suggestions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get suggestions: ${response.statusText}`);
    }

    return response.json();
  }
}

export const chatbotApi = new ChatbotApiService();
