import React from "react";
import { View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { MaterialIcons } from "@expo/vector-icons";

interface ControlButtonProps {
  isActive: boolean;
  onPress: () => void;
  buttonText: string;
  currentTheme: string;
  isRTL: boolean;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  isActive,
  onPress,
  buttonText,
  currentTheme,
  isRTL,
}) => (
  <View className="mt-8 w-full items-center">
    <CustomButton
      title={buttonText}
      handlePress={onPress}
      containerStyles="px-12 py-4 rounded-full shadow-lg"
      textStyles="text-lg font-pbold"
      icon={
        <MaterialIcons
          name={isActive ? "stop" : "play-arrow"}
          size={28}
          color={currentTheme === "light" ? "#FFFFFF" : "#000000"}
        />
      }
      iconPosition={isRTL ? "right" : "left"}
      variant={isActive ? "secondary" : "primary"}
      isRTL={isRTL}
    />
  </View>
);
