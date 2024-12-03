import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView,  Keyboard,} from 'react-native';
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
import { theme } from '@/styles/Theme';
import { useLanguage } from '@/context/LanguageContext';
import useAuth from '@/hooks/useAuth';

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
  const userId = useAuth();
  const chatService = useMemo(() => createChatService(userId as string), [userId]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    if (currentSession) {
      const newSession = {
        ...currentSession,
        messages: [
          getRandomInitialMessage(currentLanguage as 'en' | 'he'),
          ...currentSession.messages.slice(1)
        ]
      };
      setCurrentSession(newSession);
      saveSession(newSession);
    }
  }, [currentLanguage]);

  useEffect(() => {
    const keyboardWillShow = Platform.OS === 'ios' 
      ? Keyboard.addListener('keyboardWillShow', () => setIsKeyboardVisible(true))
      : Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
      
    const keyboardWillHide = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', () => setIsKeyboardVisible(false))
      : Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  useEffect(() => {
    if (!currentSession) {
      const initialMessage = getRandomInitialMessage(currentLanguage as 'en' | 'he');
      const newSession = {
        id: Date.now().toString(),
        messages: [initialMessage],
        createdAt: new Date(),
        lastMessageAt: new Date(),
        hasUserMessages: false
      };
      setCurrentSession(newSession);
      chatService.addInitialMessage(initialMessage);
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
      const response = await chatService.getChatResponse(inputText, currentLanguage);
      
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
      messages: [getRandomInitialMessage(currentLanguage as 'en' | 'he')],
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
    backgroundColor: colors.bottomBar,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: isKeyboardVisible ? 0 : insets.bottom,
    zIndex: 1,
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <ChatContainer onNewChat={handleNewChat}>
          <ChatList
            ref={listRef}
            messages={currentSession?.messages || []}
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