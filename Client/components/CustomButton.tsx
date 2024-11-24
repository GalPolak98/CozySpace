import React, { ReactNode } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import ThemedText from '@/components/ThemedText';

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
  variant = 'primary',
  icon,
  iconPosition = 'left',
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
        return currentTheme === 'light' ? '#000000' : '#FFFFFF';
    }
  };

  const getLoaderColor = () => {
    switch (variant) {
      case 'outline':
        return colors.primary;
      case 'secondary':
        return currentTheme === 'dark' ? colors.text : colors.primary;
      default:
        return currentTheme === 'light' ? '#000000' : '#FFFFFF';
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`${getButtonStyles()} ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
      <View className="flex-row items-center justify-center space-x-2">
        {icon && iconPosition === 'left' && icon}
        <ThemedText
          style={{ color: getTextColor() }}
          className={`font-psemibold text-base ${textStyles}`}
        >
          {title}
        </ThemedText>
        {icon && iconPosition === 'right' && icon}
        {isLoading && (
          <ActivityIndicator
            animating={isLoading}
            color={getLoaderColor()}
            size="small"
          />
        )}
      </View>
    </Pressable>
  );
};

export default CustomButton;