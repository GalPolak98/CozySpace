import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import CustomButton from "@/components/CustomButton";
import NotesLayout from "./_layout"; // Import the NotesLayout component

const NotesInfo = () => {
  // Temporarily disable context hooks for debugging
  // const { theme: currentTheme } = useTheme();
  // const { t } = useLanguage();

  const notesData = [
    { id: 1, title: "Meeting Notes", content: "Discussed project roadmap and deadlines." },
    { id: 2, title: "Personal Reminder", content: "Buy groceries after work." },
    { id: 3, title: "Code Review", content: "Reviewed pull request from John, needs changes." },
    { id: 4, title: "Study Plan", content: "Complete React Native tutorial by the end of the week." },
  ];

  return (
    <NotesLayout>
      <ScrollView>
        {notesData.map((note) => (
          <View key={note.id} style={styles.noteContainer}>
            <Text style={styles.noteTitle}>{note.title}</Text>
            <Text style={styles.noteContent}>{note.content}</Text>
          </View>
        ))}
      </ScrollView>
    </NotesLayout>
  );
};


const styles = StyleSheet.create({
  noteContainer: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noteContent: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default NotesInfo;
