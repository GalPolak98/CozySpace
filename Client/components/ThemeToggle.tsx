import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import ThemedText from './ThemedText';

const ThemeToggle = () => {
  const { theme: currentTheme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={styles.container}
      className="flex-row items-center"
    >
      <Ionicons
        name={currentTheme === 'light' ? 'moon-outline' : 'sunny-outline'}
        size={24}
        color={currentTheme === 'light' ? '#000' : '#FFF'}
      />
      <ThemedText className="ml-2 font-pmedium">
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginRight: 8,
  }
});

export default ThemeToggle;