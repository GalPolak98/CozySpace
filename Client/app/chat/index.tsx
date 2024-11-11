import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { createChatService } from '@/services/chatService';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatList from '@/components/chat/ChatList';
import ChatInput from '@/components/chat/ChatInput';
import { Message } from '@/types/chat';
import { useChatContext } from '@/context/ChatContext';
import { getRandomInitialMessage } from '@/constants/messages';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

const ChatScreen = () => {
  const { 
    isTyping, 
    setIsTyping, 
    currentSession, 
    setCurrentSession,
    saveSession,
    clearCurrentSession 
  } = useChatContext();
  
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const [inputText, setInputText] = React.useState('');
  const listRef = useRef<FlashList<Message>>(null);
  const insets = useSafeAreaInsets();
  const chatService = createChatService();

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
    
    return () => {
      if (currentSession && !currentSession.hasUserMessages) {
        clearCurrentSession();
      }
    };
  }, []);

  const scrollToBottom = () => {
    if (listRef.current && currentSession?.messages && currentSession.messages.length > 0) {
      listRef.current.scrollToEnd({ animated: true });
    }
  };

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
      hasUserMessages: true
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

  const inputContainerStyle = {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: insets.bottom,
    zIndex: 1,
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <ChatContainer onNewChat={handleNewChat}>
          <ChatList
            ref={listRef}
            messages={currentSession?.messages || []}
            keyboardHeight={0}
          />
        </ChatContainer>
        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          isLoading={isTyping}
          style={inputContainerStyle}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default ChatScreen;