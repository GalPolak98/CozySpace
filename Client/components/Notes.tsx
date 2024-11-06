import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
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

  const LINE_HEIGHT = 30; // Line height in pixels
  const CONTAINER_HEIGHT = 600; // Container height in pixels

  // Dynamically calculate the number of lines
  const NUMBER_OF_LINES = Math.max(Math.floor(CONTAINER_HEIGHT / LINE_HEIGHT), 1);

  // Generate notebook lines with proper spacing
  const NotebookLines = () => {
    return [...Array(NUMBER_OF_LINES)].map((_, i) => (
      <View 
        key={i} 
        style={{
          position: 'relative',
          height: LINE_HEIGHT,
          width: '100%',
        }}
      >
        {/* Main line */}
        <View 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgb(147, 197, 253)', // blue-300
            opacity: 0.4,
          }}
        />
      </View>
    ));
  };

  // Scrollable area to ensure text input grows dynamically
  const calculateTextInputHeight = () => {
    const numberOfLines = note.split('\n').length;
    return Math.max(numberOfLines * LINE_HEIGHT, CONTAINER_HEIGHT);
  };

  return (
    <View style={{ marginBottom: 40 }}>
      {/* Diary-style container */}
      <View style={{ 
        position: 'relative',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
      }}>
        {/* Main text input container */}
        <View 
          style={{ 
            position: 'relative',
            backgroundColor: 'rgb(255, 253, 240)',
            borderRadius: 12,
            borderRightWidth: 12,
            borderRightColor: 'rgb(180, 83, 9)',
            borderBottomWidth: 2,
            borderBottomColor: 'rgb(180, 83, 9)',
            overflow: 'hidden', // Prevents lines from flowing outside
          }}
        >
          {/* Red margin line */}
          <View 
            style={{
              position: 'absolute',
              left: 72,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: 'rgb(239, 68, 68)',
              opacity: 0.5
            }} 
          />
          
          {/* Enhanced paper holes */}
          <View 
            style={{
              position: 'absolute',
              left: 28,
              top: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              paddingVertical: 20,
            }}
          >
            {[...Array(3)].map((_, i) => (
              <View 
                key={i}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 9999,
                  backgroundColor: 'rgb(243, 244, 246)',
                  borderWidth: 1,
                  borderColor: 'rgb(229, 231, 235)',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2,
                }} 
              />
            ))}
          </View>

          {/* Text input container with lines */}
          <View style={{ 
            position: 'relative', 
            marginLeft: 104, 
            marginRight: 40,
            height: calculateTextInputHeight(),
          }}>
            {/* Lines container */}
            <View style={{ 
              position: 'absolute', 
              top: 0,
              left: 0,
              right: 0,
              height: calculateTextInputHeight(),
              paddingTop: LINE_HEIGHT, // Offset for first line
            }}>
              <NotebookLines />
            </View>

            {/* Text input */}
            <TextInput
              ref={textInputRef}
              style={{ 
                width: '100%',
                height: calculateTextInputHeight(),
                paddingTop: LINE_HEIGHT, // Match first line offset
                paddingHorizontal: 10,
                backgroundColor: 'transparent',
                textAlignVertical: 'top',
                lineHeight: LINE_HEIGHT,
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

      {/* Save button */}
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
          shadowOffset: {
            width: 0,
            height: 2,
          },
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
