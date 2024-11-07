import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '@/types/chat';

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Hello! I'm here to help you manage anxiety. How are you feeling today?",
  sender: 'bot',
  timestamp: new Date()
};

export const useChatHistory = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('chatHistory');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([INITIAL_MESSAGE]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([INITIAL_MESSAGE]);
    }
  };

  const saveChatHistory = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem('chatHistory', JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  return { messages, setMessages, saveChatHistory };
};
