import React from "react";
import { Animated, StyleSheet } from "react-native";
import ThemedText from "@/components/ThemedText";
import { CustomTheme } from "@/types/Theme";

// components/breathing/BreathingCircle.tsx
interface BreathingCircleProps {
  scale: Animated.Value;
  opacity: Animated.Value;
  size: number;
  colors: CustomTheme;
  phaseText: string;
  timeLeft?: number;
  isActive: boolean;
  isRTL: boolean;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  scale,
  opacity,
  size,
  colors,
  phaseText,
  timeLeft,
  isActive,
  isRTL,
}) => (
  <Animated.View
    className="my-8 rounded-full items-center justify-center"
    style={[
      {
        width: size,
        height: size,
        backgroundColor: colors.surface,
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
        Ready?
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

const styles = StyleSheet.create({
  circle: {
    marginVertical: 32,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  phaseText: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginBottom: 8,
  },
  timeText: {
    fontSize: 36,
    fontFamily: "Poppins-Bold",
  },
});
