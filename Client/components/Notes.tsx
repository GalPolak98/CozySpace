import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface NotesSectionProps {
  note: string;
  setNote: (note: string) => void;
  notes: { text: string; timestamp: string }[];
  addNote: () => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ note, setNote, notes, addNote}) => {
  return (
    <View className='mb-6'>
      {/* Input for writing the note */}
      <TextInput
        className='w-full p-4 bg-white border border-gray-300 rounded-lg shadow-sm mb-4'
        placeholder='Feel free to write...'
        value={note}
        onChangeText={setNote}
        multiline={true}
        numberOfLines={6}
        style={{ height: 370, textAlignVertical: 'top' }} 
      />

      {/* Button to save the note */}
      <TouchableOpacity
        onPress={addNote}
        className='bg-blue-500 p-4 rounded-lg flex-row justify-center items-center mb-4 shadow-md'
      >
        <Ionicons name="add" size={20} color="white" />
        <Text className='text-white font-semibold ml-2'>Add Note</Text>
      </TouchableOpacity>

    </View>
  );
};

export default NotesSection;
