import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import ThemedText from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedDots from './AnimatedDots';

interface ChatHeaderProps {
  isTyping: boolean;
  toggleTheme: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isTyping, toggleTheme }) => {
  const { theme: currentTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const colors = theme[currentTheme];
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (pathname === '/chat/history') {
      router.back();
    } else {
      router.replace('/(patient)/home');
    }
  };

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.header,
        paddingTop: insets.top,
        borderBottomColor: colors.border
      }
    ]}>
      <View style={styles.headerContent}>
        <View style={styles.leftContainer}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
          >
            <Ionicons 
              name="chevron-back" 
              size={28} 
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          {pathname === '/chat/history' ? (
            <ThemedText style={styles.title}>Chat History</ThemedText>
          ) : (
            <View>
              <ThemedText style={styles.title}>Coral Care - Chat</ThemedText>
              {isTyping && (
                <View style={styles.typingContainer}>
                  <ThemedText 
                    style={[
                      styles.typingText,
                      { color: colors.textSecondary }
                    ]}
                  >
                    typing
                  </ThemedText>
                  <AnimatedDots />
                </View>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={styles.themeButton}
        >
          <Ionicons
            name={currentTheme === 'light' ? 'moon-outline' : 'sunny-outline'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  headerContent: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  themeButton: {
    padding: 8,
    width: 40,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  typingText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});

export default ChatHeader;