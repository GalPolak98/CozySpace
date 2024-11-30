import React, { useEffect, useRef, useState } from 'react';
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
import { useLanguage } from '@/context/LanguageContext';
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
  const { isRTL, t } = useLanguage();
  const colors = theme[currentTheme];
  const inputRef = useRef<TextInput>(null);
  const [iconTransform, setIconTransform] = useState({ transform: [{ scaleX: 1 }, { scaleY: 1 }] });

  useEffect(() => {
    setIconTransform({ transform: [{ scaleX: isRTL ? -1 : 1 }, { scaleY: 1 }] });
  }, [isRTL]);

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
          options: [t.common.paste, t.common.cancel],
          cancelButtonIndex: 1,
          title: t.common.inputOptions,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            await handlePaste();
          }
        }
      );
    } else {
      Alert.alert(
        t.common.inputOptions,
        '',
        [
          { text: t.common.paste, onPress: handlePaste },
          { text: t.common.cancel, style: 'cancel' },
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
              },
              isRTL && styles.inputContainerRTL
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
                placeholder={t.common.typeMessage}
                placeholderTextColor={colors.placeholder}
                style={[
                  styles.input,
                  { color: colors.text },
                  isRTL && styles.inputRTL
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
                textAlign={isRTL ? 'right' : 'left'}
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
                  marginLeft: isRTL ? 0 : 8,
                  marginRight: isRTL ? 8 : 0
                }
              ]}
            >
            <Ionicons 
              name="send" 
              size={20} 
              color="#FFFFFF"
              style={iconTransform}
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
  inputContainerRTL: {
    flexDirection: 'row-reverse',
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
  inputRTL: {
    textAlign: 'right',
  },
  sendButton: {
    borderRadius: 20,
    padding: 8,
  },
});

export default ChatInput;