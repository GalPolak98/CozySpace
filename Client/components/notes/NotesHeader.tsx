import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import ThemedText from '@/components/ThemedText';
import { HeaderRight } from '../navigation/HeaderButtons';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

interface NoteHeaderProps {
  toggleTheme: () => void;
}

const NoteHeader: React.FC<NoteHeaderProps> = ({ toggleTheme }) => {
  const { theme: currentTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const colors = theme[currentTheme];

  const handleBack = () => {
    router.replace('/(patient)/home');
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.header }]}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>
            {t.note.documenting}
          </ThemedText>
        </View>

        <View style={styles.rightContainer}>
          <HeaderRight />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: STATUSBAR_HEIGHT,
  },
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leftContainer: {
    width: 40,
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  rightContainer: {
    width: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default NoteHeader;