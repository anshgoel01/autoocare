import { useState, useCallback, useEffect, useRef } from 'react';
import { chatbotApi, ChatMessage } from '@/services/chatbotApi';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const SESSION_STORAGE_KEY = 'chatbot_session';
const MESSAGES_STORAGE_KEY = 'chatbot_messages';

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}

function getStoredMessages(): ChatMessage[] {
  try {
    const stored = sessionStorage.getItem(MESSAGES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (e) {
    console.error('Failed to parse stored messages:', e);
  }
  return [];
}

function storeMessages(messages: ChatMessage[]): void {
  sessionStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
}

export function useChatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => getStoredMessages());
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    'Book Service',
    'Check Health',
    'Find Center',
  ]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  
  const sessionIdRef = useRef(getOrCreateSessionId());
  const userId = user?.id || 'anonymous';

  // Store messages when they change
  useEffect(() => {
    storeMessages(messages);
  }, [messages]);

  // Reset unread count when chat is opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Fetch suggestions on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await chatbotApi.getSuggestions();
        if (response.suggestions?.length) {
          setSuggestions(response.suggestions);
        }
      } catch (error) {
        // Use default suggestions if API fails
        console.log('Using default suggestions');
      }
    };
    fetchSuggestions();
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await chatbotApi.sendMessage({
        message: content.trim(),
        userId,
        sessionId: sessionIdRef.current,
      });

      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'bot',
        content: response.reply,
        timestamp: new Date(response.timestamp),
        suggestions: response.suggestions,
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (response.suggestions?.length) {
        setSuggestions(response.suggestions);
      }

      // Increment unread if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      
      // Add error message from bot
      const errorMessage: ChatMessage = {
        id: `bot_error_${Date.now()}`,
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [userId, isOpen]);

  const clearHistory = useCallback(async () => {
    try {
      await chatbotApi.clearHistory(userId, sessionIdRef.current);
      setMessages([]);
      sessionStorage.removeItem(MESSAGES_STORAGE_KEY);
      toast({
        title: 'Chat Cleared',
        description: 'Conversation history has been cleared.',
      });
    } catch (error) {
      console.error('Failed to clear history:', error);
      // Clear locally even if API fails
      setMessages([]);
      sessionStorage.removeItem(MESSAGES_STORAGE_KEY);
    }
  }, [userId]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    suggestions,
    unreadCount,
    isOpen,
    sendMessage,
    clearHistory,
    toggleChat,
    openChat,
    closeChat,
  };
}
