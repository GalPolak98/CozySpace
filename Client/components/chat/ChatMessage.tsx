import React from 'react';
import { View, Pressable, StyleSheet, Platform } from 'react-native';
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

  const handleLongPress = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <View style={[
      styles.container,
      sender === 'user' ? styles.userContainer : styles.botContainer
    ]}>
      <Pressable onLongPress={handleLongPress}>
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
});

export default ChatMessage;