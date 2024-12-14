import { PhaseType } from "@/types/breathing";
import { CustomTheme } from "@/types/Theme";
import React from "react";
import { View, Animated } from "react-native";

interface ProgressPillsProps {
  currentPhase: PhaseType;
  colors: CustomTheme;
}

export const ProgressPills: React.FC<ProgressPillsProps> = ({
  currentPhase,
  colors,
}) => (
  <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
    {["inhale", "holdIn", "exhale", "holdOut"].map((phase) => (
      <Animated.View
        key={phase}
        style={{
          height: 8,
          width: 56,
          borderRadius: 4,
          backgroundColor:
            currentPhase === phase ? colors.primary : colors.surface,
          transform: [{ scale: currentPhase === phase ? 1.1 : 1 }],
          elevation: currentPhase === phase ? 2 : 0,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: currentPhase === phase ? 0.3 : 0,
          shadowRadius: 4,
        }}
      />
    ))}
  </View>
);
