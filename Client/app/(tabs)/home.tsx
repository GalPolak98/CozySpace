import React, { useState } from 'react';
import { View } from 'react-native';
import { Audio } from 'expo-av';
import NotesSection from '../../components/Notes';
import RecordingsSection from '../../components/RecordingControls'

const HomeScreen = () => {
  const [note, setNote] = useState<string>('');
  const [notes, setNotes] = useState<{ text: string; timestamp: string }[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [recordings, setRecordings] = useState<{ uri: string; timestamp: string }[]>([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const addNote = () => {
    if (note.trim()) {
      const newNote = {
        text: note,
        timestamp: getCurrentDateTime(),
      };
      setNotes([...notes, newNote]);
      setNote('');
    }
  };

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      if (permissionResponse?.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(undefined);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      if (uri) {
        const newRecording = {
          uri: uri,
          timestamp: getCurrentDateTime(),
        };
        setRecordings([...recordings, newRecording]);
      }
    }
  };


  return (
    <View className='flex-1 p-6'>
      <NotesSection 
        note={note}
        setNote={setNote}
        notes={notes}
        addNote={addNote}
      />
      <RecordingsSection 
        recording={recording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        recordings={recordings}
      />
    </View>
  );
};

export default HomeScreen;
