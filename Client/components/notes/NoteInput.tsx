import React from 'react';
import { TextInput } from 'react-native';
import ThemedView from '@/components/ThemedView';

const NoteInput: React.FC<{
  note: string;
  setNote: (note: string) => void;
}> = ({ note, setNote }) => {
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
          color: '#4B5563',
          fontWeight: '400',
          borderRadius: 16,
        }}
        placeholder="Write your thoughts here..."
        placeholderTextColor="#9CA3AF"
        value={note}
        onChangeText={setNote}
        multiline={true}
      />
    </ThemedView>
  );
};

export default NoteInput;
