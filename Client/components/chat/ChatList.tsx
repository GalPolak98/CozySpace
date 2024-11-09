import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from './ChatMessage';
import { Message } from '@/types/chat';

interface ChatListProps {
  messages: Message[];
  keyboardHeight: number;
}

const ChatList = React.forwardRef<FlashList<Message>, ChatListProps>(({ 
  messages,
  keyboardHeight 
}, ref) => {
  const scrollToBottom = () => {
    if (ref && 'current' in ref && ref.current && messages.length > 0) {
      ref.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <FlashList
        ref={ref}
        data={messages}
        estimatedItemSize={80}
        renderItem={({ item }) => (
          <View style={styles.messageWrapper}>
            <ChatMessage 
              text={item.text}
              sender={item.sender}
              timestamp={item.timestamp}
            />
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 90 : 80
        }}
        showsVerticalScrollIndicator={true}
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
  messageWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
});

export default ChatList;