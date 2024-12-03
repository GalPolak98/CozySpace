import React, { useState, useRef } from 'react';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import useAudioRecordingPermission from '../../hooks/useRecordingPermission';
import useAuth from '../../hooks/useAuth';
import RecordingButton from '../../components/RecordButton';
import { useLanguage } from '@/context/LanguageContext';
import ENV from '../../env';

const RecordingsSection: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<{ uri: string; timestamp: string }[]>([]);
  const { permissionResponse, requestPermission } = useAudioRecordingPermission();
  const userId = useAuth();
  const recordingInstance = useRef<Audio.Recording | null>(null);
  const { t, isRTL } = useLanguage();

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString(isRTL ? 'he-IL' : 'en-US');
  };

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      if (permissionResponse?.status === 'granted') {
        if (recordingInstance.current) {
          Alert.alert(t.common.error, t.recording.alreadyInProgress);
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recordingInstance.current = recording;
        setRecording(true);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert(t.common.error, t.recording.startError);
    }
  };

  const stopRecording = async () => {
    if (recordingInstance.current) {
      try {
        await recordingInstance.current.stopAndUnloadAsync();
        const uri = recordingInstance.current.getURI();
        setRecording(false);

        recordingInstance.current = null;

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });

        if (uri) {
          const base64String = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const newRecording = {
            userId,
            uri: base64String,
            timestamp: getCurrentDateTime(),
          };

          const response = await fetch(`${ENV.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/saveRecording`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRecording),
          });

          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || t.recording.saveError);
          }

          const savedRecording = await response.json();
          setRecordings((prevRecordings) => [...prevRecordings, savedRecording]);

          Alert.alert(t.common.success, t.recording.saveSuccess);
        }
      } catch (error) {
        console.error('Failed to save recording', error);
        Alert.alert(t.common.error, t.recording.saveError);
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