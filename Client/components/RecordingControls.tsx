import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';

interface RecordingsSectionProps {
  recording: Audio.Recording | undefined;
  startRecording: () => void;
  stopRecording: () => void;
  recordings: { uri: string; timestamp: string }[];
}

const RecordingsSection: React.FC<RecordingsSectionProps> = ({
  recording,
  startRecording,
  stopRecording,
}) => {
  return (
    <View className="items-center">
      {/* Recording Controls */}
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
