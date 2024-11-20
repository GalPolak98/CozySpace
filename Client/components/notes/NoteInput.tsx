import React from 'react';
import { TextInput } from 'react-native';
import { useTheme } from '@/components/ThemeContext';  // Import the useTheme hook
import ThemedView from '@/components/ThemedView';
import { theme } from '@/Styles/Theme';  // Import theme for colors

const NoteInput: React.FC<{
  note: string;
  setNote: (note: string) => void;
}> = ({ note, setNote }) => {
  const { theme: currentTheme } = useTheme();  // Get current theme
  const colors = currentTheme === 'dark' ? theme.dark : theme.light;  // Select theme colors

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
          color: colors.text,  // Dynamically set text color based on theme
          fontWeight: '400',
          borderRadius: 16,
        }}
        placeholder="Write your thoughts here..."
        placeholderTextColor={colors.textSecondary}  // Dynamically set placeholder color based on theme
        value={note}
        onChangeText={setNote}
        multiline={true}
      />
    </ThemedView>
  );
};

export default NoteInput;
