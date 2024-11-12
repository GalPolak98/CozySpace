import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../hooks/useAuth';
import config from '../env';

const NotesSection: React.FC = () => {
  const [note, setNote] = useState<string>('');
  const [notes, setNotes] = useState<{ _id: string; text: string; timestamp: string }[]>([]);
  const [selectedNote, setSelectedNote] = useState<{ _id: string; text: string; timestamp: string } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const userId = useAuth();
  const textInputRef = useRef<TextInput>(null);

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  useEffect(() => {
    AsyncStorage.setItem('draftNote', note);
  }, [note]);

  const addNote = async () => {
    if (note.trim()) {
      const newNote = {
        userId,
        text: note,
        timestamp: getCurrentDateTime(),
      };

      try {
        const response = await fetch(`${config.API_URL}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newNote),
        });

        if (!response.ok) {
          throw new Error('Failed to save note');
        }

        const savedNote = await response.json();
        setNotes(prevNotes => [savedNote, ...prevNotes]);
        loadNotes();
        setNote('');
        await AsyncStorage.removeItem('draftNote');
        Alert.alert('Success', 'Note saved successfully!');
      } catch (error) {
        console.error('Failed to save note', error);
        Alert.alert('Error', 'Failed to save note. Please try again.');
      }
    }
  };

  const loadNotes = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${config.API_URL}/notes/latest?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notes!');
      }

      const fetchedNotes = await response.json();
      setNotes(Array.isArray(fetchedNotes) ? fetchedNotes : [fetchedNotes]);
    } catch (error) {
      console.error('Failed to fetch notes', error);
    }
  };

  const LINE_HEIGHT = 25;
  const CONTAINER_HEIGHT = 470;
  const NUMBER_OF_LINES = Math.floor(CONTAINER_HEIGHT / LINE_HEIGHT);

  const NotebookLines = () => {
    return [...Array(NUMBER_OF_LINES)].map((_, i) => (
      i !== 0 && i !== 1 && (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: i * LINE_HEIGHT + i * 2,
            height: 1,
            backgroundColor: 'rgba(56, 189, 248, 0.4)', // Light Blue Line
          }}
        />
      )
    ));
  };

  const LatestNoteCard = () => {
    const latestNote = notes[0]; 
    if (!latestNote) return null;
  
    return (
      <TouchableOpacity 
      onPress={() => {
        // console.log("Selected note:", latestNote);  // Check the note details
        setSelectedNote(latestNote);
        setEditedNote(latestNote.text);
        setIsModalVisible(true);
      }}
      
        style={{
          backgroundColor: '#F3F4F6',  // Soft Gray Background
          borderRadius: 16,
          padding: 18,
          marginBottom: 24,
          borderRightWidth: 6,  // Apply the purple border to the right side
          borderRightColor: '#6366F1',  // Lavender color
          shadowColor: '#4B5563',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
          Latest Note • {latestNote.timestamp}
        </Text>
        <Text 
          numberOfLines={3} 
          style={{ 
            fontSize: 18, 
            color: '#374151',
            lineHeight: 24,
            fontWeight: '600',
          }}
        >
          {latestNote.text}
        </Text>
      </TouchableOpacity>
    );
  };
  
// Delete Note
const deleteNote = async (noteId: string) => {
  if (!userId) {
    console.error("User is not logged in, cannot delete note.");
    return;
  }

  if (!noteId) {
    console.error("Invalid noteId:", noteId);
    return;
  }

  try {
    const response = await fetch(`http://10.100.102.10:3000/api/notes/${userId}/${noteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete note');
    }

    const data = await response.json();
    // console.log('Deleted note:', data);
    loadNotes();

  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
  
      // After updating the note, refresh the notes list
      loadNotes();  // This will re-fetch the latest notes
  
      setIsModalVisible(false);
      Alert.alert('Success', 'Note updated successfully!');
    } catch (error) {
      console.error('Error updating note:', error);
      Alert.alert('Error', 'Failed to update note');
    }
  };
  
  
  
  
  return (
    <View style={{ marginBottom: 40 }}>
      <LatestNoteCard />

      <View style={{
        position: 'relative',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
      }}>
        <View
          style={{
            position: 'relative',
            backgroundColor: '#F9FAFB',  // Lighter background color
            borderRadius: 16,
            borderRightWidth: 6,
            borderRightColor: '#3489d3',  // Green Accent
            borderBottomWidth: 3,
            borderBottomColor: '#3489d3',
            overflow: 'hidden',
            paddingHorizontal: 20,
            paddingVertical: 12,
          }}
        >
          <View style={{
            position: 'relative',
            height: CONTAINER_HEIGHT,
          }}>
            <NotebookLines />

            <TextInput
              ref={textInputRef}
              style={{
                width: '100%',
                height: CONTAINER_HEIGHT,
                paddingTop: 20,
                backgroundColor: 'transparent',
                textAlignVertical: 'top',
                lineHeight: 25,
                fontSize: 16,
                color: '#4B5563',
                fontWeight: '400',
              }}
              placeholder="Write your thoughts here..."
              placeholderTextColor="#9CA3AF"
              value={note}
              onChangeText={setNote}
              multiline={true}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={addNote}
        style={{
          backgroundColor: '#6366F1',  // Lavender background
          paddingVertical: 14,
          paddingHorizontal: 32,
          borderRadius: 12,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 6,
          marginHorizontal: 100,
        }}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={{
          color: 'white',
          fontWeight: '600',
          marginLeft: 8,
          fontSize: 16,
          
        }}>
          Add Note
        </Text>
      </TouchableOpacity>

      <Modal
  animationType="slide"
  transparent={true}
  visible={isModalVisible}
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  }}>
    <View style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      width: '100%',
      maxHeight: '80%',
    }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#D1D5DB',
          borderRadius: 8,
          padding: 14,
          marginBottom: 16,
          height: 200,
          textAlignVertical: 'top',
          fontSize: 16,
          color: '#374151',
        }}
        multiline
        value={editedNote}
        onChangeText={setEditedNote}
      />

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
<TouchableOpacity
  style={{
    backgroundColor: '#F87171',  // Red for Delete
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  }}
  onPress={() => {
    if (selectedNote) {
        if (userId !== null) {
            deleteNote(selectedNote._id);  // Call deleteNote with selectedNote's ID and userId
          } else {
            console.error("User ID is null, cannot delete note.");
          }
                setIsModalVisible(false);  // Close the modal after deletion
    }
  }}
>
  <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
</TouchableOpacity>


        <TouchableOpacity
          style={{
            backgroundColor: '#34D399',  // Green for Save
            padding: 12,
            borderRadius: 8,
            flex: 1,
          }}
        onPress={saveNote}  // Save the edited note
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>Save</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          marginTop: 16,
          alignItems: 'center',
        }}
        onPress={() => setIsModalVisible(false)}
      >
        <Text style={{ color: '#6366F1' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </View>
  );
};

export default NotesSection;
