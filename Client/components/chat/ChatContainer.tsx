import React from 'react';
import { 
  Platform, 
  StyleSheet,
  View, 
} from 'react-native';
import ThemedView from '@/components/ThemedView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

  return (
    <ThemedView 
      style={[
        styles.container, 
        { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0 }
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
  },
});

export default ChatContainer;