import React, { useState } from 'react';
import { 
  View, 
  Pressable, 
  StyleSheet, 
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Dimensions
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import * as Haptics from 'expo-haptics';

interface ChatMessageProps {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, sender, timestamp }) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isHighlighted, setIsHighlighted] = useState(false);
  const screenHeight = Dimensions.get('window').height;

  const handleCopyText = async () => {
    try {
      await Clipboard.setStringAsync(text);
      if (Platform.OS === 'ios') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
    } finally {
      setMenuVisible(false);
      setIsHighlighted(false);
    }
  };

  const handleLongPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    
    const yPosition = pageY + 50 > screenHeight ? pageY - 50 : pageY;
    
    setMenuPosition({ x: pageX, y: yPosition });
    setMenuVisible(true);
    setIsHighlighted(true);
    
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    }
  };

  const handleModalClose = () => {
    setMenuVisible(false);
    setIsHighlighted(false);
  };

  return (
    <>
      <View 
        style={[
          styles.container,
          sender === 'user' ? styles.userContainer : styles.botContainer
        ]}
      >
        <Pressable 
          onLongPress={handleLongPress}
          style={styles.pressable}
        >
          <View style={[
            styles.bubble,
            sender === 'user' 
              ? [styles.userBubble, { backgroundColor: colors.primary }]
              : [styles.botBubble, { backgroundColor: colors.surface }],
            isHighlighted && styles.highlightedBubble
          ]}>
            <ThemedText
              style={[
                styles.messageText,
                { color: sender === 'user' ? '#FFFFFF' : colors.text }
              ]}
              selectable={false}
            >
              {text}
            </ThemedText>
            
            <ThemedText
              style={[
                styles.timeText,
                { 
                  color: sender === 'user' 
                    ? 'rgba(255,255,255,0.7)' 
                    : colors.textSecondary 
                }
              ]}
            >
              {new Date(timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </ThemedText>
          </View>
        </Pressable>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <TouchableWithoutFeedback onPress={handleModalClose}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={[
                styles.copyButton,
                {
                  backgroundColor: colors.surface,
                  left: menuPosition.x - 50, 
                  top: menuPosition.y - 40,  
                }
              ]}
              onPress={handleCopyText}
            >
              <ThemedText style={styles.copyText}>Copy</ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  pressable: {
    width: '100%',
  },
  bubble: {
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 16,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  botBubble: {
    borderTopLeftRadius: 4,
  },
  highlightedBubble: {
    opacity: 0.7,
  },
  messageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  timeText: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',  
  },
  copyButton: {
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  copyText: {
    fontSize: 14,
    fontWeight: '600',
  }
});

export default ChatMessage;