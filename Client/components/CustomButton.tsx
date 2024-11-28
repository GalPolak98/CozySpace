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
  isRTL?: boolean;
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
  isRTL = false,
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  // Adjust icon position based on RTL
  const effectiveIconPosition = isRTL ? 
    (iconPosition === 'left' ? 'right' : 'left') : 
    iconPosition;

  const getButtonStyles = () => {
    let baseStyles = "rounded-xl min-h-[48px] flex flex-row justify-center items-center ";
    
    switch (variant) {
      case 'secondary':
        return baseStyles + `bg-${currentTheme === 'dark' ? 'black-200' : 'white-100'} ${containerStyles}`;
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
        return colors.text;
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

  const renderContent = () => {
    const elements = [];

    // Add icon based on effective position
    if (icon && !isRTL) {
      elements.push(
        <View key="icon-left" style={{ marginRight: 8 }}>
          {icon}
        </View>
      );
    }

    // Add text
    elements.push(
      <ThemedText
        key="text"
        style={{ color: getTextColor() }}
        className={`font-psemibold text-base ${textStyles}`}
        isRTL={isRTL}
      >
        {title}
      </ThemedText>
    );

    // Add icon based on effective position
    if (icon && isRTL) {
      elements.push(
        <View key="icon-right" style={{ marginLeft: 8 }}>
          {icon}
        </View>
      );
    }

    // Add loader if loading
    if (isLoading) {
      elements.push(
        <ActivityIndicator
          key="loader"
          animating={isLoading}
          color={getLoaderColor()}
          size="small"
          style={{ marginLeft: 8 }}
        />
      );
    }

    return (
      <View 
        className="flex-row items-center justify-center"      >
        {elements}
      </View>
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`${getButtonStyles()} ${isLoading ? "opacity-50" : ""}`}
      disabled={isLoading}
    >
      {renderContent()}
    </Pressable>
  );
};

export default CustomButton;