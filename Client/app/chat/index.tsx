import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { createChatService } from '@/services/chatService';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatList from '@/components/chat/ChatList';
import ChatInput from '@/components/chat/ChatInput';
import { Message } from '@/types/chat';
import { useChatContext } from '@/context/ChatContext';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
import { getRandomInitialMessage } from '@/constants/messages';

const ChatScreen = () => {
  // Context and hooks
  const { 
    isTyping, 
    setIsTyping, 
    currentSession, 
    setCurrentSession,
    saveSession,
    clearCurrentSession 
  } = useChatContext();
  const keyboardHeight = useKeyboardHeight();
  
  // Local state
  const [inputText, setInputText] = React.useState('');
  const listRef = useRef<FlashList<Message>>(null);
  
  // Services
  const chatService = createChatService();

  // Initialize session if needed
  useEffect(() => {
    if (!currentSession) {
      const newSession = {
        id: Date.now().toString(),
        messages: [getRandomInitialMessage()],
        createdAt: new Date(),
        lastMessageAt: new Date(),
        hasUserMessages: false
      };
      setCurrentSession(newSession);
    }
    
    // Cleanup function
    return () => {
      if (currentSession && !currentSession.hasUserMessages) {
        clearCurrentSession();
      }
    };
  }, []);

  // Scroll handler
  const scrollToBottom = () => {
    if (listRef.current && currentSession && currentSession.messages) {
      const messageCount = currentSession.messages.length;
      if (messageCount > 0) {
        listRef.current.scrollToEnd({ animated: true });
      }
    }
  };

  // Message handler
  const handleSend = async () => {
    if (!inputText.trim() || !currentSession) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...(currentSession.messages || []), userMessage];
    const updatedSession = {
      ...currentSession,
      messages: updatedMessages,
      lastMessageAt: new Date(),
      hasUserMessages: true // Set this to true when user sends a message
    };

    setCurrentSession(updatedSession);
    await saveSession(updatedSession);
    setInputText('');
    setIsTyping(true);
    scrollToBottom();

    try {
      const response = await chatService.getChatResponse(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, botMessage];
      const finalSession = {
        ...updatedSession,
        messages: finalMessages,
        lastMessageAt: new Date()
      };

      setCurrentSession(finalSession);
      await saveSession(finalSession);
      setTimeout(scrollToBottom, 100);

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to help. Would you like to try a calming exercise together?",
        sender: 'bot',
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, errorMessage];
      const finalSession = {
        ...updatedSession,
        messages: finalMessages,
        lastMessageAt: new Date()
      };

      setCurrentSession(finalSession);
      await saveSession(finalSession);

    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    // Only save the current session if it has user messages
    if (currentSession && !currentSession.hasUserMessages) {
      clearCurrentSession();
    }
    
    const newSession = {
      id: Date.now().toString(),
      messages: [getRandomInitialMessage()],
      createdAt: new Date(),
      lastMessageAt: new Date(),
      hasUserMessages: false
    };
    setCurrentSession(newSession);
    setInputText('');
    setIsTyping(false);
  };

  return (
    <ChatContainer onNewChat={handleNewChat}>
      <View style={styles.container}>
        <ChatList
          ref={listRef}
          messages={currentSession?.messages || []}
          keyboardHeight={keyboardHeight}
        />
        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          isLoading={isTyping}
        />
      </View>
    </ChatContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;