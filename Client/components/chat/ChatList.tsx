import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { Message } from '@/types/chat';

interface ChatListProps {
  messages: Message[];
  isTyping: boolean;
  keyboardHeight: number;
}

const ChatList = React.forwardRef<FlashList<Message>, ChatListProps>(({ 
  messages, 
  isTyping, 
  keyboardHeight 
}, ref) => {
  const scrollToBottom = () => {
    if (ref && 'current' in ref && ref.current && messages.length > 0) {
      ref.current.scrollToEnd({ animated: true });
    }
  };

  const ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      {isTyping && <TypingIndicator />}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlashList
        ref={ref}
        data={messages}
        estimatedItemSize={80}
        ListHeaderComponent={ListHeaderComponent}
        renderItem={({ item }) => (
          <ChatMessage 
            text={item.text}
            sender={item.sender}
            timestamp={item.timestamp}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          paddingBottom: keyboardHeight > 0 ? keyboardHeight : 16,
        }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
  },
});

export default ChatList;