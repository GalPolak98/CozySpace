import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import CustomButton from "@/components/CustomButton";

// Fake data for recordings
const fakeRecordings = [
  {
    id: 1,
    title: "Recording 1",
    description: "This is the first recording. Listen to the details.",
    date: "2024-12-17",
    length: "3:15", // length in minutes:seconds
  },
  {
    id: 2,
    title: "Recording 2",
    description: "A second sample recording. Contains useful information.",
    date: "2024-12-16",
    length: "2:45",
  },
  {
    id: 3,
    title: "Recording 3",
    description: "Important updates regarding the project.",
    date: "2024-12-15",
    length: "4:05",
  },
];

const RecordingsInfo = () => {
  const { theme: currentTheme } = useTheme();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleRecordingPress = (recording: any) => {
    Alert.alert(recording.title, `${recording.description}\nDuration: ${recording.length}`);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme === "light" ? "#fff" : "#333" },
      ]}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.recordingsList}>
          {fakeRecordings.map((recording) => (
            <CustomButton
              key={recording.id}
              title={recording.title}
              handlePress={() => handleRecordingPress(recording)}
              icon={
                <MaterialIcons
                  name="audiotrack"
                  size={24}
                  color={currentTheme === "light" ? "#000" : "#fff"}
                />
              }
              iconPosition="left"
              variant="primary"
              isLoading={isLoading}
              containerStyles={{
                paddingVertical: 12,
                marginVertical: 10,
                backgroundColor: currentTheme === "light" ? "#f7f7f7" : "#444",
                borderRadius: 8,
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  recordingsList: {
    marginTop: 20,
  },
});

export default RecordingsInfo;
