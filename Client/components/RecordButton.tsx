import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import ThemedText from './ThemedText';

type RecordButtonProps = {
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
};

const RecordingButton: React.FC<RecordButtonProps> = ({ recording, startRecording, stopRecording }) => {
  const { theme } = useTheme();
  const { isRTL, t } = useLanguage();

  // Dynamically setting the text color based on the theme
  const textColor = theme === 'light' ? 'black' : 'white';

  return (
    <View className="items-center">
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full justify-center items-center shadow-md mb-2 ${
          recording ? 'bg-red-500' : 'bg-green-500'
        }`}
      >
        <Ionicons 
          name={recording ? 'stop' : 'mic'} 
          size={30} 
          color="white" 
        />
      </TouchableOpacity>

      <ThemedText
        className="font-semibold"
        style={{ color: textColor }}
        isRTL={isRTL}
      >
        {recording ? t.recording.stopRecording : t.recording.startRecording}
      </ThemedText>
    </View>
  );
};

export default RecordingButton;