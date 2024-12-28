import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, TextInput, View, KeyboardTypeOptions } from "react-native";
import { useTheme } from "./ThemeContext";
import { theme } from "../styles/Theme";
import ThemedText from "./ThemedText";

interface CustomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  isRTL?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  value, 
  onChangeText, 
  placeholder, 
  isPassword = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  isRTL = false
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <View className="w-full mb-4">
      <ThemedText variant="default" className="w-full color font-pmedium mb-2 rtl text-sm" isRTL={isRTL}>
        {placeholder}
      </ThemedText>
      <View className="relative">
        <TextInput
          style={{
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border,
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr'
          }}
          className="h-12 rounded-xl px-4 font-pregular border"
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {isPassword && (
          <Pressable 
            onPress={() => setShowPassword(!showPassword)}
            className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-3`}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default CustomInput;