import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  View,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import ThemedText from "@/components/ThemedText";

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  containerStyles?: ViewStyle | string;
  textStyles?: TextStyle | string;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isRTL?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
  variant = "primary",
  icon,
  iconPosition = "left",
  isRTL = false,
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const getButtonStyles = () => {
    let baseStyles = {
      minHeight: 48,
      flexDirection: "row" as const,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      borderRadius: 12,
    };

    let variantStyles = {};
    switch (variant) {
      case "secondary":
        variantStyles = {
          backgroundColor:
            currentTheme === "dark" ? colors.surface : colors.background,
        };
        break;
      case "outline":
        variantStyles = {
          backgroundColor: "transparent",
          borderWidth: 2,
          borderColor: colors.primary,
        };
        break;
      default:
        variantStyles = {
          backgroundColor: colors.primary,
        };
        break;
    }

    return StyleSheet.flatten([
      baseStyles,
      variantStyles,
      typeof containerStyles === "string" ? {} : containerStyles,
    ]);
  };

  const getTextStyles = () => {
    const baseTextStyles = {
      fontFamily: "Poppins-SemiBold",
      fontSize: 16,
      color: getTextColor(),
    };

    return StyleSheet.flatten([
      baseTextStyles,
      typeof textStyles === "string" ? {} : textStyles,
    ]);
  };

  const getTextColor = () => {
    switch (variant) {
      case "outline":
        return colors.primary;
      case "secondary":
        return colors.text;
      default:
        return currentTheme === "light" ? "#000000" : "#FFFFFF";
    }
  };

  const getLoaderColor = () => {
    switch (variant) {
      case "outline":
        return colors.primary;
      case "secondary":
        return currentTheme === "dark" ? colors.text : colors.primary;
      default:
        return currentTheme === "light" ? "#000000" : "#FFFFFF";
    }
  };

  const renderContent = () => {
    const elements = [];

    if (icon && !isRTL) {
      elements.push(
        <View key="icon-left" style={{ marginRight: 8 }}>
          {icon}
        </View>
      );
    }

    elements.push(
      <ThemedText key="text" style={getTextStyles()} isRTL={isRTL}>
        {title}
      </ThemedText>
    );

    if (icon && isRTL) {
      elements.push(
        <View key="icon-right" style={{ marginLeft: 8 }}>
          {icon}
        </View>
      );
    }

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

    return <View style={styles.contentContainer}>{elements}</View>;
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[getButtonStyles(), isLoading && styles.loadingState]}
      disabled={isLoading}
    >
      {renderContent()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingState: {
    opacity: 0.5,
  },
});

export default CustomButton;
