import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { loadNotes } from '../../utils/notesUtils';
import useAuth from '../../hooks/useAuth';
import NoteModal from '../../components/notes/NoteModal';
import { useLanguage } from '@/context/LanguageContext';
import { useLocalSearchParams } from 'expo-router';

export interface Note {
  _id: string;
  date: string;
  content: string;
  timestamp?: string;
}

interface NotesListProps {
  notes: Note[];
  onNotePress: (note: Note) => void;
}

function NotesList({ notes, onNotePress }: NotesListProps) {
  const { theme } = useTheme();
  const { isRTL, t } = useLanguage();

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={[
        styles.noteCard,
        {
          backgroundColor: theme === 'dark' ? '#2A2A2A' : '#fff',
          borderLeftColor: theme === 'dark' ? '#4A90E2' : '#2196F3',
        },
      ]}
      onPress={() => onNotePress(item)}
    >
      <View style={styles.noteHeader}>
        <View style={styles.dateContainer}>
          <MaterialIcons
            name="event"
            size={18}
            color={theme === 'dark' ? '#4A90E2' : '#2196F3'}
            style={styles.dateIcon}
          />
          <ThemedText style={[styles.noteDate, { color: theme === 'dark' ? '#fff' : '#000' }]}>
            {item.date}
          </ThemedText>
        </View>
        <MaterialIcons
          name="more-vert"
          size={20}
          color={theme === 'dark' ? '#999' : '#666'}
        />
      </View>

      <ThemedText style={[styles.noteContent, { color: theme === 'dark' ? '#ccc' : '#555' }]}>
        {item.content}
      </ThemedText>

      <View style={styles.noteFooter}>
        <View style={styles.timestampContainer}>
          <MaterialIcons
            name="access-time"
            size={14}
            color={theme === 'dark' ? '#999' : '#666'}
            style={styles.timeIcon}
          />
          <ThemedText style={[styles.timestampText, { color: theme === 'dark' ? '#999' : '#666' }]}>
            {item.timestamp}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {notes.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <ThemedText style={[styles.emptyStateText, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
            {t.note.noNotesMessage}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item._id}
          renderItem={renderNote}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const NotesScreen = () => {
  const { theme } = useTheme();
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const userId = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const { t, isRTL } = useLanguage();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString();
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const targetId = patientId || userId;
        console.log('Fetching notes for user:', targetId);
        const fetchedNotes = await loadNotes(targetId, isRTL, t as { common: { error: string }; note: { fetchError: string } });
        
        // Sort notes by timestamp in descending order (newest first)
        const sortedNotes = fetchedNotes.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setNotes(
          sortedNotes.map(note => {
            const date = new Date(note.timestamp);
            const hour = date.getHours();
            const minutes = date.getMinutes();
            const formattedTime = `${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
            return {
              _id: note._id,
              date: new Date(note.timestamp).toLocaleDateString(),
              content: note.content,
              timestamp: formattedTime,
            };
          })
        );
      } catch (error) {
        // Alert.alert(t.common.error, t.note.fetchError);
        console.log('Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchNotes();
    }
  }, [userId]);

  const handleNotePress = (note: Note) => {
    setSelectedNote(note);
    setEditedNote(note.content);
    setIsModalVisible(true);
  };

  const deleteNote = async (noteId: string) => {
    if (!userId || !noteId) return;

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');

      const updatedNotes = await loadNotes(userId, isRTL, t as { common: { error: string }; note: { fetchError: string } });
      setNotes(updatedNotes);
      Alert.alert(t.common.success, t.note.deleteSuccess);
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert(t.common.error, t.note.deleteError);
    }
  };

  const updateNote = async (updatedNote: { _id: string; content: string; timestamp: string }) => {
    if (!updatedNote._id) return;

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/${updatedNote._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) throw new Error('Failed to update note');

      const savedNote = await response.json();
      setNotes(prevNotes =>
        prevNotes.map(note => (note._id === updatedNote._id ? savedNote : note))
      );
      setEditedNote('');
      const updatedNotes = await loadNotes(userId, isRTL, t as { common: { error: string }; note: { fetchError: string } });
      setNotes(updatedNotes);
      Alert.alert(t.common.success, t.note.updateSuccess);
    } catch (error) {
      console.error('Failed to update note', error);
      Alert.alert(t.common.error, t.note.updateError);
    }
  };

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#000'} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>

      <NotesList
        notes={notes}
        onNotePress={handleNotePress}
      />

      <NoteModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        editedNote={editedNote}
        setEditedNote={setEditedNote}
        saveNote={() => {
          if (selectedNote) {
            const updatedNote = {
              ...selectedNote,
              content: editedNote,
              timestamp: getCurrentDateTime(),
            };
            updateNote(updatedNote);
          }
          setIsModalVisible(false);
        }}
        deleteNote={deleteNote}
        selectedNote={selectedNote}
        disableEditDelete={!!patientId}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 20,
  },
  noteCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  emptyStateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 6,
  },
  noteDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 4,
  },
  timestampText: {
    fontSize: 12,
  },
});

export default NotesScreen;