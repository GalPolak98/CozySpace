import React from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet,
  View, 
  Keyboard 
} from 'react-native';
import ThemedView from '@/components/ThemedView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HistoryButton from './HistoryButton';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';

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
  const keyboardHeight = useKeyboardHeight();
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
      () => setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return (
    <ThemedView 
      style={[
        styles.container, 
        { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0 }
      ]}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={[
          styles.content,
          Platform.OS === 'android' && {
            paddingBottom: keyboardVisible ? keyboardHeight : 0
          }
        ]}>
          {children}
        </View>
      </KeyboardAvoidingView>
      {showHistoryButton && <HistoryButton onNewChat={onNewChat} />}
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
  content: {
    flex: 1,
    position: 'relative',
  },
});

export default ChatContainer;