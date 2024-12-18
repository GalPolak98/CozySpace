import React, { useEffect , useState} from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { NotesList } from './_layout';
import { loadNotes } from '../../utils/notesUtils';  
import useAuth from '../../hooks/useAuth';
import NoteModal from '../../components/notes/NoteModal';
import { useLanguage } from '@/context/LanguageContext';


export default function NotesScreen() {
  const { theme } = useTheme();
  const [notes, setNotes] = React.useState<{ _id: string; content: string; date: string; timestamp: string }[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const userId = useAuth();
  const [selectedNote, setSelectedNote] = useState<{ _id: string; content: string; date: string; timestamp: string } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const { t, isRTL } = useLanguage();

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString(); // Return the timestamp in ISO 8601 format
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await loadNotes(userId, isRTL, t as { common: { error: string }; note: { fetchError: string } });
        setNotes(
          fetchedNotes.map(note => {
            const date = new Date(note.timestamp);
            const hour = date.getHours();  // Extract the hour (0-23)
            const minutes = date.getMinutes();  // Extract the minutes (0-59)
            const formattedTime = `${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`; // Format time as "HH:MM"
  
            return {
              _id: note._id,
              date: new Date(note.timestamp).toLocaleDateString(),
              content: note.content,
              timestamp: formattedTime,  // Change timestamp to include hours and minutes
            };
          })
        );
      } catch (error) {
        Alert.alert(t.common.error, t.note.fetchError);
      } finally {
        setLoading(false);
      }
    };
  
    if (userId) {
      fetchNotes();
    }
  }, [userId]);
  
  


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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <ThemedText style={{ fontSize: 28, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000' }}>
          Notes
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons 
            name="notes" 
            size={20} 
            color={theme === 'dark' ? '#4A90E2' : '#2196F3'}
          />
          <ThemedText style={{ marginLeft: 8, fontSize: 14, color: theme === 'dark' ? '#999' : '#666' }}>
            {notes.length} Notes
          </ThemedText>
        </View>
      </View>
      <NotesList notes={notes} />
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
      />
    </ThemedView>
  );
}
