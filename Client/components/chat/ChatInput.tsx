import React, { useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  StyleSheet,
  Alert,
  ActionSheetIOS,
  Pressable,
  ViewStyle
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import * as Haptics from 'expo-haptics';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
  style?: ViewStyle;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  isLoading,
  style
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const inputRef = useRef<TextInput>(null);

  const handleSend = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSend();
    inputRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        const selectionStart = inputRef.current?.props.selection?.start || value.length;
        const newText = value.slice(0, selectionStart) + text + value.slice(selectionStart);
        onChangeText(newText);
      }
    } catch (error) {
      console.error('Failed to paste:', error);
    }
  };

  const handleLongPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Paste', 'Cancel'],
          cancelButtonIndex: 1,
          title: 'Input Options',
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            await handlePaste();
          }
        }
      );
    } else {
      Alert.alert(
        'Input Options',
        '',
        [
          { text: 'Paste', onPress: handlePaste },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={style}>
      <View style={styles.innerContainer}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }
          ]}
        >
          <Pressable 
            onLongPress={handleLongPress} 
            style={styles.inputWrapper}
          >
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              placeholder="Type your message..."
              placeholderTextColor={colors.placeholder}
              style={[
                styles.input,
                { color: colors.text }
              ]}
              multiline
              maxLength={500}
              contextMenuHidden={false}
              returnKeyType="default"
              textAlignVertical="center"
              scrollEnabled={true}
              keyboardType="default"
              autoCapitalize="sentences"
              selectionColor={colors.primary}
            />
          </Pressable>
          
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    paddingVertical: 8,
    maxHeight: 100,
    minHeight: 24,
    textAlignVertical: 'center',
  },
  sendButton: {
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
});

export default ChatInput;