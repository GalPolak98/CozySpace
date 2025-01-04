import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import ThemedText from "@/components/ThemedText";
import NotebookInput from "../../components/notes/NoteInput";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { theme } from "@/styles/Theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { loadNotes } from "../../utils/notesUtils";
import { useUserData } from "@/hooks/useUserData";

const NotesSection: React.FC = () => {
  const [note, setNote] = useState<string>("");
  const [notes, setNotes] = useState<
    { _id: string; content: string; timestamp: string }[]
  >([]);
  const userId = useAuth();
  const { t, isRTL, getGenderedText } = useLanguage();
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const insets = useSafeAreaInsets();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { gender, fullName } = useUserData(userId);

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString();
  };

  useEffect(() => {
    const loadDraftNote = async () => {
      const savedDraft = await AsyncStorage.getItem("draftNote");
      if (savedDraft) {
        setNote(savedDraft);
      }
    };
    loadDraftNote();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("draftNote", note);
  }, [note]);

  const addNote = async () => {
    if (note.trim() === "") return;

    const newNote = {
      userId,
      content: note,
      timestamp: getCurrentDateTime(),
    };
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/addNotes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote),
        }
      );

      if (!response.ok) throw new Error("Failed to save note");

      const savedNote = await response.json();
      setNotes((prevNotes) => [savedNote, ...prevNotes]);
      setNote("");
      await AsyncStorage.removeItem("draftNote");
      const updatedNotes = await loadNotes(
        userId,
        isRTL,
        t as { common: { error: string }; note: { fetchError: string } }
      );

      setNotes(updatedNotes);
      Alert.alert(t.common.success, t.note.saveSuccess);
    } catch (error) {
      console.error("Failed to save note", error);
      Alert.alert(t.common.error, t.note.saveError);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme === "dark" ? "#333" : "#F9F9F9" },
      ]}
    >
      <KeyboardAwareScrollView
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        scrollToOverflowEnabled={true}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
      >
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: currentTheme === "dark" ? "#333" : "#F9F9F9",
              paddingBottom: isKeyboardVisible ? 10 : insets.bottom,
            },
          ]}
        >
          <View style={{ width: "100%" }}>
            <NotebookInput note={note} setNote={setNote} />
          </View>

          <View style={[styles.addNoteButton, { width: "100%" }]}>
            <TouchableOpacity
              onPress={addNote}
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 8,
                },
              ]}
            >
              <ThemedText style={[styles.buttonText]} isRTL={isRTL}>
                {getGenderedText(t.note.addNote, gender as string)}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
    position: "relative",
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NotesSection;
