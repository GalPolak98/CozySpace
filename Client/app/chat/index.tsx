// app/chat/index.tsx
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { createChatService } from '@/services/chatService';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatList from '@/components/chat/ChatList';
import ChatInput from '@/components/chat/ChatInput';
import { Message } from '@/types/chat';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
import { useChatContext } from '@/context/ChatContext';

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Hello! I'm here to help you manage anxiety. How are you feeling today?",
  sender: 'bot',
  timestamp: new Date()
};

const ChatScreen = () => {
  // Hooks
  const { messages, setMessages, saveChatHistory } = useChatHistory();
  const keyboardHeight = useKeyboardHeight();
  const { isTyping, setIsTyping } = useChatContext(); // Get isTyping from context
  
  // Local state
  const [inputText, setInputText] = React.useState('');
  const listRef = useRef<FlashList<Message>>(null);
  
  // Services
  const chatService = createChatService();

  // Scroll handler
  const scrollToBottom = () => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToEnd({ animated: true });
    }
  };

  // Message handler
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    // Update UI
    setMessages((prev: any) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    scrollToBottom();

    try {
      // Get bot response
      const response = await chatService.getChatResponse(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date()
      };

      // Update messages and save
      const updatedMessages = [...messages, userMessage, botMessage];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);
      
      // Ensure smooth scroll after new message
      setTimeout(scrollToBottom, 100);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Handle error with fallback message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm here to help. Would you like to try a calming exercise together?",
        sender: 'bot',
        timestamp: new Date()
      };

      // Update messages and save
      const updatedMessages = [...messages, userMessage, errorMessage];
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);

    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContainer>
      <View style={styles.container}>
        <ChatList
          ref={listRef}
          messages={messages}
          isTyping={isTyping} // Pass isTyping to ChatList
          keyboardHeight={keyboardHeight}
        />
        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          isLoading={isTyping} // Use isTyping for input loading state
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