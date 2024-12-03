import React from 'react';
import { TouchableOpacity } from 'react-native';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useLanguage } from '@/context/LanguageContext';

const NoteCard: React.FC<{
  note: { _id: string; content: string; timestamp: string } | null;
  setSelectedNote: (note: { _id: string; content: string; timestamp: string }) => void;
  setEditedNote: (content: string) => void;
  setIsModalVisible: (visible: boolean) => void;
}> = ({ note, setSelectedNote, setEditedNote, setIsModalVisible }) => {
  const { t, isRTL } = useLanguage();
  
  if (!note) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedNote(note);
        setEditedNote(note.content);
        setIsModalVisible(true);
      }}
    >
      <ThemedView
        style={{
          borderRadius: 16,
          padding: 18,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5
        }}
      >
        <ThemedText
          style={{ 
            fontSize: 12, 
            marginBottom: 8,
            textAlign: isRTL ? 'right' : 'left'
          }}
          variant="secondary" 
        >
          {t.note.latestNote} • {note.timestamp}
        </ThemedText>
        <ThemedText
          numberOfLines={3}
          style={{
            fontSize: 18,
            lineHeight: 24,
            fontWeight: '600',
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr'
          }}
        >
          {note.content}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default NoteCard;
