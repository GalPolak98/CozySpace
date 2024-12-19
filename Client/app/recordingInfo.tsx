import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, FlatList, Text, View, Alert, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import useAuth from '@/hooks/useAuth';
import * as FileSystem from 'expo-file-system'; 
import { Audio } from 'expo-av'; 
import ThemedText from '../components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useLanguage } from '@/context/LanguageContext';

export default function RecordingsInfoScreen() {
  const { theme } = useTheme(); 
  const userId = useAuth();

  const [recordings, setRecordings] = useState<string[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null); 
  const { isRTL, t } = useLanguage();
  const [recordingsDirectory, setRecordingsDirectory] = useState<string | null>(null);

  // Set recordings directory once userId is available
  useEffect(() => {
    if (userId) {
      setRecordingsDirectory(`${FileSystem.documentDirectory}recordings/${userId}/`);
    }
  }, [userId]);

  // Fetch recordings from file system
  useEffect(() => {
    const loadRecordings = async () => {
      if (!recordingsDirectory) return;

      try {
        console.log('recording directory:', recordingsDirectory);
        const directoryInfo = await FileSystem.getInfoAsync(recordingsDirectory);
        if (!directoryInfo.exists) {
          console.log(`not exists`);
          await FileSystem.makeDirectoryAsync(recordingsDirectory, { intermediates: true });
        }

        console.log('exists');
        const files = await FileSystem.readDirectoryAsync(recordingsDirectory);
        const audioFiles = files.filter((file) => file.endsWith('.caf'));
        setRecordings(audioFiles);
      } catch (error) {
        Alert.alert(t.errors.error, t.errors.loadError);
        console.error(error);
      }
    };

    loadRecordings();
  }, [recordingsDirectory]);

  // Function to handle playing the recording
  const playRecording = async (fileName: string) => {
    if (!recordingsDirectory) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingsDirectory + fileName }, 
        { shouldPlay: true } 
      );
      setSound(sound); 
    } catch (error) {
      console.error('Error loading or playing sound', error);
      Alert.alert(t.errors.error, t.errors.playingRecording);
    }
  };

  const getDateAndTime = (fileName: string) => {
    const timestamp = fileName.replace('recording-', '').replace('.caf', '');
    const date = new Date(parseInt(timestamp));
    return {
      date: date.toLocaleDateString(), 
      time: date.toLocaleTimeString(), 
    };
  };
  
  const renderRecordingItem = ({ item }: { item: string }) => {
    const { date, time } = getDateAndTime(item); 
  
    return (
      <TouchableOpacity
        onPress={() => playRecording(item)}
        style={[
          styles.recordingCard,
          {
            backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5',
            flexDirection: isRTL ? 'row-reverse' : 'row', 
          },
        ]}
      >
        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={[styles.recordingTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>
            {t.recording.recordedOn}: {date}
          </Text>
          <Text style={[styles.recordingContent, { color: theme === 'dark' ? '#ddd' : '#555' }]}>
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
            textAlign: isRTL ? 'right' : 'left', 
          },
        ]}
      >
        {t.information.recordings}
      </ThemedText>

      {recordings.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={[styles.emptyStateText, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
            {t.recording.noRecordingsMessage}
            </Text>
          </View>
        ) : (
          <FlatList
            data={recordings}
            keyExtractor={(item) => item}
            renderItem={renderRecordingItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  recordingCard: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  recordingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recordingContent: {
    fontSize: 14,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
