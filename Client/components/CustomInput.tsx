import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, TextInput, View, Text, KeyboardTypeOptions } from "react-native";
import { useTheme } from "./ThemeContext";
import { theme } from "../styles/Theme";

interface CustomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const CustomInput: React.FC<CustomInputProps> = ({ 
  value, 
  onChangeText, 
  placeholder, 
  isPassword = false,
  keyboardType = 'default',
  autoCapitalize = 'none'
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <View className="w-full mb-4">
      <Text style={{ color: colors.text }} className="font-pmedium mb-2 text-sm">
        {placeholder}
      </Text>
      <View className="relative">
        <TextInput
          style={{
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border,
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
            className="absolute right-4 top-3"
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