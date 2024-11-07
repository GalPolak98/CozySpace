// app/chat/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ThemedView from '@/components/ThemedView';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import ThemedText from '@/components/ThemedText';
import Loader from '@/components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createChatService } from '@/services/chatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  text: "Hello! I'm here to help you manage anxiety. How are you feeling today?",
  sender: 'bot',
  timestamp: new Date()
};

// Message component
const ChatMessage: React.FC<Message> = ({ text, sender, timestamp }) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <View style={[
      styles.messageContainer,
      sender === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <View style={[
        styles.messageBubble,
        {
          backgroundColor: sender === 'user' ? colors.primary : colors.surface,
        }
      ]}>
        <ThemedText
          style={[
            styles.messageText,
            { color: sender === 'user' ? '#FFFFFF' : colors.text }
          ]}
        >
          {text}
        </ThemedText>
        <ThemedText
          style={[
            styles.timestampText,
            { 
              color: sender === 'user' 
                ? 'rgba(255,255,255,0.7)' 
                : colors.textSecondary 
            }
          ]}
        >
          {new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </ThemedText>
      </View>
    </View>
  );
};

// Input component
const ChatInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
}> = ({ value, onChangeText, onSend, isLoading }) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const inputRef = useRef<TextInput>(null);

  return (
    <View
      style={[
        styles.inputContainer,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        }
      ]}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type your message..."
        placeholderTextColor={colors.placeholder}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: currentTheme === 'dark' ? colors.background : colors.surface,
            borderColor: colors.border,
          }
        ]}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={isLoading || !value.trim()}
        style={[
          styles.sendButton,
          {
            backgroundColor: colors.primary,
            opacity: isLoading || !value.trim() ? 0.5 : 1,
          }
        ]}
      >
        <Ionicons name="send" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

// Main Chat Screen
const ChatScreen = () => {
  const { theme: currentTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const listRef = useRef<FlashList<Message>>(null);
  const chatService = createChatService();

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
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

  const scrollToBottom = () => {
    if (listRef.current && messages.length > 0) {
      listRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);
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
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
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
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ThemedView style={[
        styles.container,
        { paddingBottom: insets.bottom }
      ]}>
        <View style={styles.listContainer}>
          <FlashList
            ref={listRef}
            data={messages}
            estimatedItemSize={80}
            renderItem={({ item }) => (
              <ChatMessage {...item} />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              paddingTop: 16,
              paddingHorizontal: 16,
              paddingBottom: keyboardHeight > 0 ? keyboardHeight : 16,
            }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
          />
        </View>

        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          isLoading={isLoading}
        />
      </ThemedView>

      {isLoading && <Loader isLoading={true} />}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 16,
  },
  messageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  timestampText: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;