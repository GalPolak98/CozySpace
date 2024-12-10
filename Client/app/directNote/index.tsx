import React, { useState, useEffect } from 'react';
import { View, Alert, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../../hooks/useAuth';
import NoteCard from '../../components/notes/NoteCard';
import NoteModal from '../../components/notes/NoteModal';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import ThemedText from '@/components/ThemedText';
import NotebookInput from '../../components/notes/NoteInput';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/styles/Theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useUserData } from '@/hooks/useUserData';

const NotesSection: React.FC = () => {
  const [note, setNote] = useState<string>('');
  const [notes, setNotes] = useState<{ _id: string; content: string; timestamp: string }[]>([]);
  const [selectedNote, setSelectedNote] = useState<{ _id: string; content: string; timestamp: string } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const userId = useAuth();
  const { 
    gender,  
  } = useUserData(userId);
  const { t, isRTL, getGenderedText } = useLanguage();
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString(isRTL ? 'he-IL' : 'en-US');
  };

  useEffect(() => {
    const loadDraftNote = async () => {
      const savedDraft = await AsyncStorage.getItem('draftNote');
      if (savedDraft) {
        setNote(savedDraft);
      }
    };
    loadDraftNote();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('draftNote', note);
  }, [note]);

  const parseTimestamp = (timestamp: string): number => {
    if (isRTL) {
      // Hebrew date format parsing
      const [datePart, timePart] = timestamp.split(', ');
      const [day, month, year] = datePart.split('.').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
    } else {
      // English date format parsing
      return new Date(timestamp).getTime();
    }
  };

  const loadNotes = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/latest`, {
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
      Alert.alert(t.common.error, t.note.fetchError);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [userId]);

  const addNote = async () => {
    if (note.trim() === '') return;

    const newNote = {
      userId,
      content: note,
      timestamp: getCurrentDateTime(),
    };
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/addNotes`, {
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
      Alert.alert(t.common.success, t.note.saveSuccess);
    } catch (error) {
      console.error('Failed to save note', error);
      Alert.alert(t.common.error, t.note.saveError);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!userId || !noteId) return;

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/${noteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');

      loadNotes();
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
      loadNotes();
      Alert.alert(t.common.success, t.note.updateSuccess);
    } catch (error) {
      console.error('Failed to update note', error);
      Alert.alert(t.common.error, t.note.updateError);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme === 'dark' ? '#333' : '#F9F9F9' }]}>
      <KeyboardAwareScrollView
      keyboardOpeningTime={0}
      keyboardShouldPersistTaps="handled"
      scrollToOverflowEnabled={true}
      enableOnAndroid={true}
      enableAutomaticScroll={true}>
        <View style={[styles.header, { width: '100%' }]}>
          {notes.length > 0 && (
            <NoteCard 
              note={notes[0]} 
              setSelectedNote={setSelectedNote} 
              setEditedNote={setEditedNote} 
              setIsModalVisible={setIsModalVisible}
            />
          )}
        </View>        

        <View 
          style={[
            styles.inputContainer, 
            {
              backgroundColor: currentTheme === 'dark' ? '#333' : '#F9F9F9',
              paddingBottom: isKeyboardVisible ? 10 : insets.bottom
            }
          ]}
        >
        
        <View style={{ width: '100%' }}>
          <NotebookInput note={note} setNote={setNote} />
        </View>
        
        <View style={[styles.addNoteButton, { width: '100%' }]}>
          <TouchableOpacity 
            onPress={addNote} 
            style={[
              styles.button, 
              { 
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }
            ]}
          >
            <ThemedText style={[styles.buttonText]} isRTL={isRTL}>
              {getGenderedText(t.note.addNote, gender as string)}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAwareScrollView>

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
          } else {
            addNote();
          }
          setIsModalVisible(false);
        }}
        deleteNote={deleteNote}
        selectedNote={selectedNote}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    padding: 20,
  },
  inputContainer: {
    position: 'relative',
    left: 0,
    right: 0,
    padding: 20,
  },
  addNoteButton: {
    marginTop: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotesSection; 