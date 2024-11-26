// components/TextInputField.tsx

import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useLanguage } from '@/context/LanguageContext';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
}

const TextInputField: React.FC<TextInputFieldProps> = ({ label, value, onChange }) => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();

  return (
    <ThemedView style={styles.section}>
      <ThemedText 
        style={[
          styles.label, 
          { 
            color: currentTheme === 'dark' ? '#FFF' : '#333',
            textAlign: isRTL ? 'right' : 'left'
          }
        ]}
      >
        {label}
      </ThemedText>
      <TextInput
        multiline
        value={value}
        onChangeText={onChange}
        style={[
          styles.input, 
          { 
            color: currentTheme === 'dark' ? '#FFF' : '#333', 
            borderColor: currentTheme === 'dark' ? '#666' : '#CCC',
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr'
          }
        ]}
      />
    </ThemedView>
  );
};


const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow position
    shadowOpacity: 0.2, // Shadow transparency
    shadowRadius: 6, // Shadow blur
    elevation: 5
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 100,
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    fontSize: 16,
    
  },
  icon: {
    marginRight: 10,
  },
});

export default TextInputField;
