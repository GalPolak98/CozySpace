import React from "react";
import { Animated, StyleSheet } from "react-native";
import ThemedText from "@/components/ThemedText";
import { useTheme } from "../ThemeContext";
import { theme } from "@/styles/Theme";
import { useLanguage } from "@/context/LanguageContext";

interface BreathingCircleProps {
  scale: Animated.Value;
  opacity: Animated.Value;
  size: number;
  phaseText: string;
  timeLeft?: number;
  isActive: boolean;
  gender?: string;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  scale,
  opacity,
  size,
  phaseText,
  timeLeft,
  isActive,
  gender,
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const { t, getGenderedText, isRTL } = useLanguage();

  return (
    <Animated.View
      className="my-8 rounded-full items-center justify-center"
      style={[
        {
          width: size,
          height: size,
          backgroundColor: colors.background,
          borderWidth: 8,
          borderColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      {!isActive ? (
        <ThemedText
          style={{
            fontSize: 24,
            fontFamily: "Poppins-SemiBold",
            color: colors.text,
            textAlign: "center",
          }}
          isRTL={isRTL}
        >
          {getGenderedText(t.breathing.circle.ready, gender)}
        </ThemedText>
      ) : (
        <>
          <ThemedText
            style={{
              fontSize: 24,
              fontFamily: "Poppins-SemiBold",
              color: colors.text,
              textAlign: "center",
              marginBottom: 8,
            }}
            isRTL={isRTL}
          >
            {phaseText}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 36,
              fontFamily: "Poppins-Bold",
              color: colors.text,
            }}
            isRTL={isRTL}
          >
            {timeLeft}
          </ThemedText>
        </>
      )}
    </Animated.View>
  );
};
