import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatSession} from '@/types/chat';

interface ChatContextType {
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  currentSession: ChatSession | null;
  setCurrentSession: (session: ChatSession | null) => void;
  saveSession: (session: ChatSession) => Promise<void>;
  getAllSessions: () => Promise<ChatSession[]>;
  clearCurrentSession: () => void;
  deleteSession: (sessionId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const STORAGE_KEY = 'chat_sessions';

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  const saveSession = async (session: ChatSession) => {
    try {
      // Only save sessions that have user messages
      if (!session.hasUserMessages) return;

      const existingSessions = await getAllSessions();
      const updatedSessions = existingSessions.map(s => 
        s.id === session.id ? session : s
      );

      if (!existingSessions.find(s => s.id === session.id)) {
        updatedSessions.push(session);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  };

  const getAllSessions = async (): Promise<ChatSession[]> => {
    try {
      const savedSessions = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedSessions) {
        const sessions = JSON.parse(savedSessions) as ChatSession[];
        // Filter out sessions without user messages
        const validSessions = sessions.filter(session => session.hasUserMessages);
        return validSessions.sort((a, b) => 
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
      }
      return [];
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      return [];
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const sessions = await getAllSessions();
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
      
      if (currentSession?.id === sessionId) {
        clearCurrentSession();
      }
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  };

  const clearCurrentSession = () => {
    setCurrentSession(null);
  };

  return (
    <ChatContext.Provider
      value={{
        isTyping,
        setIsTyping,
        currentSession,
        setCurrentSession,
        saveSession,
        getAllSessions,
        clearCurrentSession,
        deleteSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatContextProvider');
  }
  return context;
};