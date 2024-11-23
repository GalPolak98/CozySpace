import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../../hooks/useAuth';
import config from '../../env';
import NoteCard from '../../components/notes/NoteCard';
import NotebookLines from '../../components/notes/NotebookLines';
import NoteInput from '../../components/notes/NoteInput';
import NoteModal from '../../components/notes/NoteModal';
import { useTheme } from '@/components/ThemeContext';

const NotesSection: React.FC = () => {
  const [note, setNote] = useState<string>('');
  const [notes, setNotes] = useState<{ _id: string; content: string; timestamp: string }[]>([]);
  const [selectedNote, setSelectedNote] = useState<{ _id: string; content: string; timestamp: string } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const userId = useAuth();
  const { theme: currentTheme } = useTheme();

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  // Load draft note from AsyncStorage
  useEffect(() => {
    const loadDraftNote = async () => {
      const savedDraft = await AsyncStorage.getItem('draftNote');
      if (savedDraft) {
        setNote(savedDraft);
      }
    };
    loadDraftNote();
  }, []);

  // Store note in AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem('draftNote', note);
  }, [note]);

  const parseTimestamp = (timestamp: string): number => {
    const [datePart, timePart] = timestamp.split(', ');
    const [day, month, year] = datePart.split('.').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    // Create a Date object from parsed values
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return date.getTime(); // Convert Date object to timestamp (milliseconds)
  };
  

  // Load notes from the server
  const loadNotes = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${config.API_URL}/users/${userId}/latest`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Failed to fetch notes');
  
      const fetchedNotes = (await response.json()).notes;

      const sortedNotes = Array.isArray(fetchedNotes)
      ? fetchedNotes.sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp))
      : [fetchedNotes];

    setNotes(sortedNotes);
    } catch (error) {
      console.error('Failed to fetch notes', error);
    }
  };
  

  useEffect(() => {
    loadNotes();
  }, [userId]);

  // Add a new note
  const addNote = async () => {
    if (note.trim() === '') return;

    const newNote = {
      userId,
      content: note,
      timestamp: getCurrentDateTime(),
    };
    try {
      const response = await fetch(`${config.API_URL}/users/${userId}/addNotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) throw new Error('Failed to save note');

      const savedNote = await response.json();
      setNotes(prevNotes => [savedNote, ...prevNotes]);
      setNote('');
      await AsyncStorage.removeItem('draftNote');
      loadNotes();
      Alert.alert('Success', 'Note saved successfully!');
    } catch (error) {
      console.error('Failed to save note', error);
      Alert.alert('Error', 'Failed to save note. Please try again.');
    }
  };

  // Delete a note
  const deleteNote = async (noteId: string) => {
    if (!userId || !noteId) return;

    try {
      const response = await fetch(`${config.API_URL}/users/${userId}/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');

      loadNotes();
      Alert.alert('Success', 'Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      Alert.alert('Error', 'Failed to delete note. Please try again.');
    }
  };

// Update a note in the database
const updateNote = async (updatedNote: { _id: string; content: string; timestamp: string }) => {
  if (!updatedNote._id) return;

  try {
    const response = await fetch(`${config.API_URL}/users/${userId}/${updatedNote._id}`, {
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
    loadNotes(); 
    Alert.alert('Success', 'Note updated successfully!');
  } catch (error) {
    console.error('Failed to update note', error);
    Alert.alert('Error', 'Failed to update note. Please try again.');
  }
};

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentTheme === 'dark' ? '#333' : '#F9F9F9' }]}>
<View style={styles.header}>
  {notes.length > 0 && <NoteCard note={notes[0]} setSelectedNote={setSelectedNote} setEditedNote={setEditedNote} setIsModalVisible={setIsModalVisible} />}
</View>


      <View>
        <NoteInput note={note} setNote={setNote} />
        <View style={styles.addNoteButton}>
          <TouchableOpacity onPress={addNote} style={[styles.button, { backgroundColor: currentTheme === 'dark' ? '#4B5563' : '#007BFF' }]}>
            <Text style={styles.buttonText}>Add Note</Text>
          </TouchableOpacity>
        </View>
        <NotebookLines />
      </View>

      <NoteModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        editedNote={editedNote}
        setEditedNote={setEditedNote}
        saveNote={() => {
          if (selectedNote) {
            // Update existing note
            const updatedNote = {
              ...selectedNote,
              content: editedNote, // Updated content
              timestamp: getCurrentDateTime(), // Update timestamp
            };
            updateNote(updatedNote); // Call update method
          } else {
            // Add new note
            addNote(); // Call addNote method
          }
          setIsModalVisible(false); // Close modal after saving
        }}
        deleteNote={deleteNote}
        selectedNote={selectedNote}
      />


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    flex:1,
    paddingBottom: 30,
    backgroundColor: '#f9f9f9',
  },
  header: {
    marginBottom: 20,
  },
  noteInputContainer: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  addNoteButton: {
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,  
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default NotesSection;
