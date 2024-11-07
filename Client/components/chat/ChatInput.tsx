import React, { useRef, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  Keyboard,
  StyleSheet,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import * as Haptics from 'expo-haptics';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  isLoading
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const inputRef = useRef<TextInput>(null);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        Animated.spring(translateY, {
          toValue: Platform.OS === 'ios' ? -8 : 0,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleSend = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSend();
    inputRef.current?.focus();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          transform: [{ translateY }]
        }
      ]}
    >
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: currentTheme === 'dark' ? colors.background : colors.surface,
            borderColor: colors.border,
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
            }
          ]}
          multiline
          maxLength={500}
          returnKeyType="default"
          blurOnSubmit={false}
        />
        
        <TouchableOpacity
          onPress={handleSend}
          disabled={isLoading || !value.trim()}
          style={[
            styles.sendButton,
            {
              backgroundColor: colors.primary,
              opacity: isLoading || !value.trim() ? 0.5 : 1,
            }
          ]}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
});

export default ChatInput;