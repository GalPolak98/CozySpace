import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/components/ThemeContext'; 
import { theme } from '@/Styles/Theme';
import ThemedText from '@/components/ThemedText';

interface NoteHeaderProps {
  toggleTheme: () => void;
}

const NoteHeader: React.FC<NoteHeaderProps> = ({ toggleTheme }) => {
  const { theme: currentTheme } = useTheme(); // Access current theme
  const router = useRouter();
  const colors = theme[currentTheme]; // Get theme colors

  const handleBack = () => {
    router.replace('/(patient)/home');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.header }]}>
      <TouchableOpacity onPress={handleBack}>
        <Ionicons name="chevron-back" size={28} color={colors.text} />
      </TouchableOpacity>
      <ThemedText style={styles.title}>Documenting</ThemedText>
      <TouchableOpacity onPress={toggleTheme}> 
        <Ionicons
          name={currentTheme === 'light' ? 'moon-outline' : 'sunny-outline'}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    flex: 1,
  },
});

export default NoteHeader;
