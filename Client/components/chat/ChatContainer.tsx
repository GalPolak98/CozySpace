import React from 'react';
import { 
  StyleSheet,
  View, 
} from 'react-native';
import ThemedView from '@/components/ThemedView';
import HistoryButton from './HistoryButton';

interface ChatContainerProps {
  children: React.ReactNode;
  onNewChat?: () => void;
  showHistoryButton?: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  children, 
  onNewChat,
  showHistoryButton = true 
}) => {

  return (
    <ThemedView 
      style={[
        styles.container
      ]}
    >
        <View style={[
          styles.content
        ]}>
          {children}
        </View>
      {showHistoryButton && <HistoryButton onNewChat={onNewChat} />}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
    marginBottom: 8,
  },
});

export default ChatContainer;