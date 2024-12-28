import React from "react";
import { TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import ThemedText from "./ThemedText";
import { useUserData } from "@/hooks/useUserData";
import useAuth from "@/hooks/useAuth";

type RecordButtonProps = {
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
};

const RecordingButton: React.FC<RecordButtonProps> = ({
  recording,
  startRecording,
  stopRecording,
}) => {
  const { theme } = useTheme();
  const { isRTL, t, getGenderedText } = useLanguage();
  const userId = useAuth();
  const { gender } = useUserData(userId);

  const textColor = theme === "light" ? "black" : "white";

  return (
    <View className="items-center">
      <TouchableOpacity
        onPress={recording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full justify-center items-center shadow-md mb-2 ${
          recording ? "bg-red-500" : "bg-green-500"
        }`}
      >
        <Ionicons name={recording ? "stop" : "mic"} size={30} color="white" />
      </TouchableOpacity>

      <ThemedText
        className="font-semibold"
        style={{ color: textColor }}
        isRTL={isRTL}
      >
        {recording
          ? getGenderedText(t.recording.stopRecording, gender as string)
          : getGenderedText(t.recording.startRecording, gender as string)}
      </ThemedText>
    </View>
  );
};

export default RecordingButton;
