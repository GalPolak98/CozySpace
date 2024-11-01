import React from "react";
import { ActivityIndicator, Pressable } from "react-native";
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import ThemedText from '@/components/ThemedText';

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
  variant = 'primary',
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const getButtonStyles = () => {
    let baseStyles = "rounded-xl min-h-[48px] flex flex-row justify-center items-center ";
    
    switch (variant) {
      case 'secondary':
        return baseStyles + `bg-${currentTheme === 'dark' ? 'black-200' : 'gray-100'} ${containerStyles}`;
      case 'outline':
        return baseStyles + `bg-transparent border-2 border-secondary ${containerStyles}`;
      default: // primary
        return baseStyles + `bg-secondary ${containerStyles}`;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
        return colors.primary;
      case 'secondary':
        return currentTheme === 'dark' ? colors.text : colors.primary;
      default: // primary
        // Use black text in light mode, white text in dark mode
        return currentTheme === 'light' ? '#000000' : '#FFFFFF';
    }
  };

  const getLoaderColor = () => {
    switch (variant) {
      case 'outline':
        return colors.primary;
      case 'secondary':
        return currentTheme === 'dark' ? colors.text : colors.primary;
      default: // primary
        // Match loader color with text color
        return currentTheme === 'light' ? '#000000' : '#FFFFFF';
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`${getButtonStyles()} ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
      <ThemedText
        style={{ color: getTextColor() }}
        className={`font-psemibold text-base ${textStyles}`}
      >
        {title}
      </ThemedText>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color={getLoaderColor()}
          size="small"
          className="ml-2"
        />
      )}
    </Pressable>
  );
};

export default CustomButton;