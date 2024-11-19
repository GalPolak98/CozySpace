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
  const [notes, setNotes] = useState<{ _id: string; text: string; timestamp: string }[]>([]);
  const [selectedNote, setSelectedNote] = useState<{ _id: string; text: string; timestamp: string } | null>(null);
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

  // Load notes from the server
  const loadNotes = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${config.API_URL}/notes/latest?userId=${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch notes');

      const fetchedNotes = await response.json();
      setNotes(Array.isArray(fetchedNotes) ? fetchedNotes : [fetchedNotes]);
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
      text: note,
      timestamp: getCurrentDateTime(),
    };

    try {
      const response = await fetch(`${config.API_URL}/notes`, {
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
      const response = await fetch(`${config.API_URL}/notes/${userId}/${noteId}`, {
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

  // Save (update) an existing note
  const saveNote = async () => {
    if (editedNote.trim() === '') return;

    const updatedNote = {
      userId,
      text: editedNote,
      timestamp: getCurrentDateTime(),
    };

    try {
      const response = await fetch(`${config.API_URL}/notes/${selectedNote?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      });

      if (!response.ok) throw new Error('Failed to update note');

      loadNotes();
      setIsModalVisible(false);
      Alert.alert('Success', 'Note updated successfully!');
    } catch (error) {
      console.error('Error updating note:', error);
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
        selectedNote={selectedNote}
        setEditedNote={setEditedNote}
        saveNote={saveNote}
        deleteNote={deleteNote}
        editedNote={editedNote}
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
