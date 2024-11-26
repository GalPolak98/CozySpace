import React from 'react';
import { TextInput, I18nManager } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import ThemedView from '@/components/ThemedView';
import { theme } from '@/styles/Theme';

const NoteInput: React.FC<{
  note: string;
  setNote: (note: string) => void;
}> = ({ note, setNote }) => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = currentTheme === 'dark' ? theme.dark : theme.light;

  return (
    <ThemedView
      style={{
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <TextInput
        style={{
          width: '100%',
          height: 470,
          padding: 20,
          backgroundColor: 'transparent',
          textAlignVertical: 'top',
          lineHeight: 25,
          fontSize: 16,
          color: colors.text,
          fontWeight: '400',
          borderRadius: 16,
          textAlign: isRTL ? 'right' : 'left',
          writingDirection: isRTL ? 'rtl' : 'ltr',
        }}
        placeholder={t.note.placeholder}
        placeholderTextColor={colors.textSecondary}
        value={note}
        onChangeText={setNote}
        multiline={true}
      />
    </ThemedView>
  );
};

export default NoteInput;