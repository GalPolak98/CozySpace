// app/chat/context/ChatContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface ChatContextType {
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <ChatContext.Provider value={{ isTyping, setIsTyping }}>
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