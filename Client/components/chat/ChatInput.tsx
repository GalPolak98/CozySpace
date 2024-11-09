import React, { useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Platform,
  StyleSheet,
  Alert,
  ActionSheetIOS,
  Pressable 
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
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
    <View
      style={[
        styles.container,
        { 
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? 5 : 0,
          marginBottom: Platform.OS === 'ios' ? 0 : 0,
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
              {
                color: colors.text,
              }
            ]}
            multiline
            maxLength={500}
            contextMenuHidden={false}
            returnKeyType="default"
            blurOnSubmit={false}
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
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'white',
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