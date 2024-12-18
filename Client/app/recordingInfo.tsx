import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, FlatList, Text, View, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import useAuth from '@/hooks/useAuth';
import * as FileSystem from 'expo-file-system'; // Import FileSystem
import { Audio } from 'expo-av'; // Import Audio from expo-av
import ThemedText from '../components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useLanguage } from '@/context/LanguageContext';

export default function RecordingsInfoScreen() {
  const { theme } = useTheme(); // Get the theme (dark or light)
  const userId = useAuth();

  const [recordings, setRecordings] = useState<string[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null); // State to manage the audio sound
  const recordingsDirectory = FileSystem.documentDirectory + 'recordings/'; // Path to the recordings directory
  const { isRTL, t } = useLanguage();

  // Fetch recordings from file system
  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const files = await FileSystem.readDirectoryAsync(recordingsDirectory);
        const audioFiles = files.filter((file) => file.endsWith('.caf'));
        setRecordings(audioFiles);
      } catch (error) {
        Alert.alert(t.errors.error, t.errors.loadError);
        console.error(error);
      }
    };

    loadRecordings();
  }, []);

  // Function to handle playing the recording
  const playRecording = async (fileName: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingsDirectory + fileName }, // Full URI of the file
        { shouldPlay: true } // Automatically play the audio
      );
      setSound(sound); // Set the sound object in the state
    } catch (error) {
      console.error('Error loading or playing sound', error);
      Alert.alert(t.errors.error, t.errors.playingRecording);

    }
  };


  const getDateAndTime = (fileName: string) => {
    const timestamp = fileName.replace('recording-', '').replace('.caf', '');
    const date = new Date(parseInt(timestamp));
    return {
      date: date.toLocaleDateString(), // Format as local date
      time: date.toLocaleTimeString(), // Format as local time
    };
  };
  
  // Render function for the recording item
  const renderRecordingItem = ({ item }: { item: string }) => {
    const { date, time } = getDateAndTime(item); // Get date and time separately
  
    return (
      <TouchableOpacity
        onPress={() => playRecording(item)}
        style={[
          styles.noteCard,
          {
            backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
            flexDirection: isRTL ? 'row-reverse' : 'row', // Adjust layout for RTL
          },
        ]}
      >
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={[styles.noteTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>
            {t.recording.recordedOn}: {date}
          </Text>
          <Text style={[styles.noteContent, { color: theme === 'dark' ? '#ddd' : '#555' }]}>
            {t.recording.at}: {time}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <>
      <Stack.Screen />
      <ThemedView style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#fff' }]}>
      <ThemedText
        style={[
          styles.header,
          {
            color: theme === 'dark' ? '#fff' : '#000',
            textAlign: isRTL ? 'right' : 'left', // Adjust alignment for header text
          },
        ]}
      >
        {t.information.recordings}
      </ThemedText>

        <FlatList
          data={recordings}
          keyExtractor={(item) => item}
          renderItem={renderRecordingItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  noteCard: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noteContent: {
    fontSize: 14,
  },
});
