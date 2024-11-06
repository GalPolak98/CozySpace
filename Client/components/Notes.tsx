import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useAuth from '../hooks/useAuth'; 
import config from '../env'; 

const NotesSection: React.FC = () => {
  const [note, setNote] = useState<string>('');
  const [notes, setNotes] = useState<{ text: string; timestamp: string }[]>([]);
  const userId = useAuth();
  const textInputRef = useRef<TextInput>(null);

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

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
        setNotes([...notes, savedNote]);
        setNote('');
        Alert.alert('Success', 'Note saved successfully!');

      } catch (error) {
        console.error('Failed to save note', error);
        Alert.alert('Error', 'Failed to save note. Please try again.');
      }
    }
  };

  const LINE_HEIGHT = 25; // Adjusted to match text line height
  const CONTAINER_HEIGHT = 600;
  const NUMBER_OF_LINES = Math.floor(CONTAINER_HEIGHT / LINE_HEIGHT);
  
  const NotebookLines = () => {
    return [...Array(NUMBER_OF_LINES)].map((_, i) => (
      i !== 0 && i !==1 && (
        <View 
          key={i} 
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: i * LINE_HEIGHT + i * 2,
            height: 1,
            backgroundColor: 'rgb(147, 197, 253)', 
            opacity: 0.4,
          }}
        />
      )
    ));
  };
  
  

  return (
    <View style={{ marginBottom: 40 }}>
      <View style={{ 
        position: 'relative',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
      }}>
        <View 
          style={{ 
            position: 'relative',
            backgroundColor: 'rgb(255, 253, 240)',
            borderRadius: 12,
            borderRightWidth: 12,
            borderRightColor: 'rgb(180, 83, 9)',
            borderBottomWidth: 3,
            borderBottomColor: 'rgb(180, 83, 9)',
            overflow: 'hidden',
            paddingHorizontal: 20,
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
                color: 'rgb(55, 65, 81)',
              }}
              placeholder="Feel free to write... ✍️"
              placeholderTextColor="rgb(156, 163, 175)"
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
          backgroundColor: 'rgb(79, 70, 229)',
          padding: 16,
          borderRadius: 12,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
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
    </View>
  );
};

export default NotesSection;
