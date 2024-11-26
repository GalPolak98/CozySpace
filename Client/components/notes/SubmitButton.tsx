import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import ThemedText from '../ThemedText';

interface SubmitButtonProps {
  onPress: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onPress }) => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();

  const buttonColors = {
    light: '#0B72B8',
    dark: '#5A9BD3',
  };

  return (
    <TouchableOpacity
      style={[styles.submitButton, { backgroundColor: buttonColors[currentTheme] }]}
      onPress={onPress}
    >
      <ThemedText style={styles.submitText} isRTL={isRTL}>
        {t.common.submit}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SubmitButton;