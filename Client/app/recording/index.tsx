import React, { useState, useRef } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import useAudioRecordingPermission from '../../hooks/useRecordingPermission';
import useAuth from '../../hooks/useAuth';
import config from '../../env';
import RecordingButton from '../../components/RecordButton';

const RecordingsSection: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<{ uri: string; timestamp: string }[]>([]);
  const { permissionResponse, requestPermission } = useAudioRecordingPermission();
  const userId = useAuth();
  const recordingInstance = useRef<Audio.Recording | null>(null); // Ref to store recording instance

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      if (permissionResponse?.status === 'granted') {
        // Check if a recording is already in progress
        if (recordingInstance.current) {
          Alert.alert('Error', 'A recording is already in progress.');
          return;
        }

        // Set audio mode for recording
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        // Create a new recording session
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recordingInstance.current = recording; // Store the recording instance
        setRecording(true);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const stopRecording = async () => {
    if (recordingInstance.current) {
      try {
        // Stop and unload the recording
        await recordingInstance.current.stopAndUnloadAsync();
        const uri = recordingInstance.current.getURI();
        setRecording(false);  // Stop recording

        // Reset the recording instance
        recordingInstance.current = null;

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });

        if (uri) {
          // Convert URI to base64
          const base64String = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const newRecording = {
            userId,
            uri: base64String,
            timestamp: getCurrentDateTime(),
          };

          // Save the recording to the server
          const response = await fetch(`${config.API_URL}/users/${userId}/saveRecording`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecording),
          });

          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || 'Failed to save recording');
          }

          const savedRecording = await response.json();
          setRecordings((prevRecordings) => [...prevRecordings, savedRecording]);

          Alert.alert('Success', 'Recording saved successfully!');
        }
      } catch (error) {
        console.error('Failed to save recording', error);
        Alert.alert('Error', 'Failed to save recording. Please try again.');
      }
    }
  };

  return (
    <RecordingButton
      recording={recording}
      startRecording={startRecording}
      stopRecording={stopRecording}
    />
  );
};

export default RecordingsSection;
