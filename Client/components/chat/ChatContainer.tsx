import React from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet
} from 'react-native';
import ThemedView from '@/components/ThemedView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatContainerProps {
  children: React.ReactNode;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {children}
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
});

export default ChatContainer;