import React from 'react';
import { TouchableOpacity } from 'react-native';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';

const NoteCard: React.FC<{
  note: { _id: string; text: string; timestamp: string } | null;
  setSelectedNote: (note: { _id: string; text: string; timestamp: string }) => void;
  setEditedNote: (text: string) => void;
  setIsModalVisible: (visible: boolean) => void;
}> = ({ note, setSelectedNote, setEditedNote, setIsModalVisible }) => {
  if (!note) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedNote(note);
        setEditedNote(note.text);
        setIsModalVisible(true);
      }}
    >
      <ThemedView
        style={{
          borderRadius: 16,
          padding: 18,
          shadowColor: '#000', // Shadow color
          shadowOffset: { width: 0, height: 4 }, // Shadow position
          shadowOpacity: 0.2, // Shadow transparency
          shadowRadius: 6, // Shadow blur
          elevation: 5
        }}
      >
        <ThemedText
          style={{ fontSize: 12, marginBottom: 8 }}
          variant="secondary" 
        >
          Latest Note • {note.timestamp}
        </ThemedText>
        <ThemedText
          numberOfLines={3}
          style={{
            fontSize: 18,
            lineHeight: 24,
            fontWeight: '600',
          }}
        >
          {note.text}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default NoteCard;
