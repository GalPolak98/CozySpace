import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import useAudioRecordingPermission from '../hooks/useRecordingPermission';
import useAuth from '../hooks/useAuth'; 
import config from '../env'; 

const RecordingsSection: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | undefined>(undefined);
  const [recordings, setRecordings] = useState<{ uri: string; timestamp: string }[]>([]);
  const { permissionResponse, requestPermission } = useAudioRecordingPermission();
  const userId = useAuth(); 

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
        try {
          const base64String = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const newRecording = {
            userId,
            uri: base64String,
            timestamp: getCurrentDateTime(),
          };

          const response = await fetch(`${config.API_URL}/recordings`, {
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
          setRecordings([...recordings, savedRecording]);
          Alert.alert('Success', 'Recording saved successfully!');

        } catch (error) {
          console.error('Failed to save recording', error);
          Alert.alert('Error', 'Failed to save recording. Please try again.');

        }
      }
    }
  };

  return (
    <View className="items-center">
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full justify-center items-center shadow-md mb-2 ${
          recording ? 'bg-red-500' : 'bg-green-500'
        }`}
      >
        <Ionicons name={recording ? "stop" : "mic"} size={30} color="white" />
      </TouchableOpacity>

      <Text className="text-black font-semibold">
        {recording ? 'Stop Recording' : 'Start Recording'}
      </Text>
    </View>
  );
};

export default RecordingsSection;
