import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HistoryButtonProps {
  onNewChat?: () => void;
}

const HistoryButton: React.FC<HistoryButtonProps> = ({ onNewChat }) => {
  const { theme: currentTheme } = useTheme();
  const { isRTL } = useLanguage();
  const colors = theme[currentTheme];
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const containerStyle = {
    ...styles.container,
    bottom: 90 + insets.bottom,
    [isRTL ? 'right' : 'right']: 16, 
  };

  return (
    <View style={containerStyle}>
      {onNewChat && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.surface }]}
          onPress={onNewChat}
        >
          <Ionicons 
            name="add-outline" 
            size={24} 
            color={colors.text}
            style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.surface }]}
        onPress={() => router.push('/chat/history')}
      >
        <Ionicons 
          name="time-outline" 
          size={24} 
          color={colors.text}
          style={isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    gap: 12,
    zIndex: 100,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HistoryButton;