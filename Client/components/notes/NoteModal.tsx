import React from 'react';
import { Modal, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

interface NoteModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  editedNote: string;
  setEditedNote: (content: string) => void;
  saveNote: () => void;
  deleteNote: (noteId: string) => void;
  selectedNote: { _id: string; content: string; timestamp: string } | null;
}

const NoteModal: React.FC<NoteModalProps> = ({
  isModalVisible,
  setIsModalVisible,
  editedNote,
  setEditedNote,
  saveNote,
  deleteNote,
  selectedNote,
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = currentTheme === 'dark' ? theme.dark : theme.light;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setIsModalVisible(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
        }}
      >
        <ThemedView
          style={{
            borderRadius: 15,
            width: '85%',
            padding: 25,
            backgroundColor: colors.surface,
            elevation: 5, // Shadow for Android
            shadowColor: '#000', // Shadow for iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
        >
          <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Edit Note
          </ThemedText>

          <TextInput
            value={editedNote}
            onChangeText={setEditedNote}
            style={{
              height: 100,
              borderWidth: 1,
              borderColor: colors.textSecondary,
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: colors.text,
              backgroundColor: colors.background,
              textAlignVertical: 'top',
            }}
            placeholder="Write your note here..."
            placeholderTextColor={colors.textSecondary}
            multiline={true}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                borderRadius: 8,
                backgroundColor: colors.background,
                shadowOpacity: 0.1,
              }}
            >
              <Icon name="close" size={20} color={colors.text} style={{ marginRight: 5 }} />
              <ThemedText>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={saveNote}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#4CAF50',
              }}
            >
              <Icon name="save" size={20} color="#FFFFFF" style={{ marginRight: 5 }} />
              <ThemedText style={{ color: '#FFFFFF' }}>Save</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (selectedNote) deleteNote(selectedNote._id);
                setIsModalVisible(false);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#FF6347',
              }}
            >
              <Icon name="delete" size={20} color="#FFFFFF" style={{ marginRight: 5 }} />
              <ThemedText style={{ color: '#FFFFFF' }}>Delete</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

export default NoteModal;
