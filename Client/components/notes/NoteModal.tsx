import React, { useEffect, useState } from 'react';
import { Keyboard, Modal, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { t, isRTL } = useLanguage();
  const colors = currentTheme === 'dark' ? theme.dark : theme.light;
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);
  
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          paddingBottom: isKeyboardVisible ? insets.bottom + 10 : insets.bottom,
        }}
      >
        <ThemedView
          style={{
            borderRadius: 15,
            width: '85%',
            padding: 25,
            backgroundColor: colors.surface,
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            marginBottom: isKeyboardVisible ? 30 : 0 
          }}
        >
          <ThemedText 
            style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              marginBottom: 10,
              textAlign: isRTL ? 'right' : 'left'
            }}
          >
            {t.note.editNote}
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
              textAlign: isRTL ? 'right' : 'left',
              writingDirection: isRTL ? 'rtl' : 'ltr',
            }}
            placeholder={t.note.placeholder}
            placeholderTextColor={colors.textSecondary}
            multiline={true}
          />

          <View style={{ 
            flexDirection: isRTL ? 'row-reverse' : 'row', 
            justifyContent: 'space-between', 
            marginTop: 20 
          }}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                padding: 10,
                borderRadius: 8,
                backgroundColor: colors.background,
                shadowOpacity: 0.1,
              }}
            >
              <Icon name="close" size={20} color={colors.text} style={{ marginHorizontal: 5 }} />
              <ThemedText>{t.common.cancel}</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={saveNote}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#4CAF50',
              }}
            >
              <Icon name="save" size={20} color="#FFFFFF" style={{ marginHorizontal: 5 }} />
              <ThemedText style={{ color: '#FFFFFF' }}>{t.common.save}</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (selectedNote) deleteNote(selectedNote._id);
                setIsModalVisible(false);
              }}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                padding: 10,
                borderRadius: 8,
                backgroundColor: '#FF6347',
              }}
            >
              <Icon name="delete" size={20} color="#FFFFFF" style={{ marginHorizontal: 5 }} />
              <ThemedText style={{ color: '#FFFFFF' }}>{t.common.delete}</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
};

export default NoteModal;