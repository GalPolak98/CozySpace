// NoteModal.tsx
import React from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';

const NoteModal: React.FC<{
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  editedNote: string;
  setEditedNote: (text: string) => void;
  saveNote: () => void;
  deleteNote: (noteId: string) => void;
  selectedNote: { _id: string; text: string; timestamp: string } | null;
}> = ({
  isModalVisible,
  setIsModalVisible,
  editedNote,
  setEditedNote,
  saveNote,
  deleteNote,
  selectedNote,
}) => {
  return (
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
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 10,
          width: '80%',
          padding: 20,
        }}>
          <TextInput
            value={editedNote}
            onChangeText={setEditedNote}
            style={{
              borderBottomWidth: 1,
              borderColor: '#ccc',
              fontSize: 16,
              marginBottom: 10,
              padding: 10,
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveNote}>
              <Text>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              if (selectedNote) deleteNote(selectedNote._id);
              setIsModalVisible(false);
            }}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NoteModal;
