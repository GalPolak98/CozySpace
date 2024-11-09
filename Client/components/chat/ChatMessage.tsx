import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Platform, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
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
  const [messageWidth, setMessageWidth] = useState(0);

  const handleCopyText = async () => {
    await Clipboard.setStringAsync(text);
    if (Platform.OS === 'ios') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setMenuVisible(false);
  };

  const handleLongPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setMenuVisible(true);
  };

  return (
    <>
      <View 
        style={[
          styles.container,
          sender === 'user' ? styles.userContainer : styles.botContainer
        ]}
        onLayout={(event) => {
          setMessageWidth(event.nativeEvent.layout.width);
        }}
      >
        <Pressable 
          onLongPress={handleLongPress}
          style={styles.pressable}
        >
          <View style={[
            styles.bubble,
            sender === 'user' 
              ? [styles.userBubble, { backgroundColor: colors.primary }]
              : [styles.botBubble, { backgroundColor: colors.surface }]
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
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View 
              style={[
                styles.menuContainer,
                {
                  backgroundColor: colors.surface,
                  left: menuPosition.x - (messageWidth / 2),
                  top: menuPosition.y - 50,
                }
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleCopyText}
              >
                <ThemedText style={styles.menuText}>Copy</ThemedText>
              </TouchableOpacity>
            </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    position: 'absolute',
    minWidth: 100,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    padding: 12,
  },
  menuText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ChatMessage;