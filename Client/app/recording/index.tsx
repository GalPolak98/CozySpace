import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import useAuth from '@/hooks/useAuth';

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'stopped'>('idle');
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const userId = useAuth();

  useEffect(() => {
    async function getPermission() {
      try {
        const permission = await Audio.requestPermissionsAsync();
        console.log('Permission Granted: ' + permission.granted);
        setAudioPermission(permission.granted);
      } catch (error) {
        console.error(error);
      }
    }

    getPermission();

    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, [recording]);

  async function startRecording() {
    try {
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      const newRecording = new Audio.Recording();
      console.log('Starting Recording');
      await newRecording.prepareToRecordAsync();
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus('recording');
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  async function stopRecording() {
    try {
      if (recordingStatus === 'recording' && recording) {
        console.log('Stopping Recording');
        await recording.stopAndUnloadAsync();
        const recordingUri = recording.getURI();
  
        if (recordingUri) {
          // Create a file name for the recording
          const fileName = `recording-${Date.now()}.caf`;
          const userDirectory = FileSystem.documentDirectory + `recordings/${userId}/`;

          // Move the recording to the new directory with the new file name
          await FileSystem.makeDirectoryAsync(userDirectory, { intermediates: true });
          const destinationUri = userDirectory + fileName;

          await FileSystem.moveAsync({
            from: recordingUri,
            to: destinationUri,
          });
          console.log('Recording saved to:', destinationUri);

        }
  
        // Reset states to record again
        setRecording(null);
        setRecordingStatus('stopped');
      } else {
        console.warn('Recording is not active or already stopped.');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Recording has already been unloaded.');
      } else {
        console.error('Failed to stop recording', error);
      }
    }
  }
  
  

  async function handleRecordButtonPress() {
    if (recording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleRecordButtonPress}>
        <FontAwesome name={recording ? 'stop-circle' : 'circle'} size={40} color="white" />
      </TouchableOpacity>
      <Text style={[styles.recordingStatusText, { color: currentTheme === 'light' ? 'black' : 'white' }]}>

      {t.recording.statusRecording[recordingStatus]}

      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 64,
    backgroundColor: 'red',
  },
  recordingStatusText: {
    marginTop: 16,
    fontSize: 16,
  },
});
