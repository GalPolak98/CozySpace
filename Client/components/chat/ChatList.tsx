import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from './ChatMessage';
import { Message } from '@/types/chat';

interface ChatListProps {
  messages: Message[];
}

const ChatList = React.forwardRef<FlashList<Message>, ChatListProps>(({ 
  messages,
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
        contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingBottom: 90, 
  }
});

export default ChatList;