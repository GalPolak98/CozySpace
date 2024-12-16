import { useLanguage } from "@/context/LanguageContext";
import { PhaseType, BreathingPatternType } from "@/types/breathing";
import { CustomTheme } from "@/types/Theme";
import React from "react";
import { View, Animated } from "react-native";

interface ProgressPillsProps {
  currentPhase: PhaseType;
  colors: CustomTheme;
  pattern: BreathingPatternType;
}

export const ProgressPills: React.FC<ProgressPillsProps> = ({
  currentPhase,
  colors,
  pattern,
}) => {
  const { t, isRTL } = useLanguage();

  const basePhases: PhaseType[] =
    pattern === "4-7-8"
      ? ["inhale", "holdIn", "exhale"]
      : ["inhale", "holdIn", "exhale", "holdOut"];

  const displayPhases = isRTL ? [...basePhases].reverse() : basePhases;
  const phaseOrderMap = React.useMemo(() => {
    const map = new Map<PhaseType, PhaseType>();
    if (isRTL) {
      basePhases.forEach((phase, index) => {
        map.set(phase, displayPhases[index]);
      });
    }
    return map;
  }, [isRTL, pattern]);
  const isCurrentPhase = (phase: PhaseType) => {
    if (isRTL) {
      return phaseOrderMap.get(currentPhase) === phase;
    }
    return currentPhase === phase;
  };

  return (
    <View
      style={{
        flexDirection: isRTL ? "row-reverse" : "row",
        gap: 12,
        marginTop: 16,
        justifyContent:
          pattern === "4-7-8" ? "center" : isRTL ? "flex-end" : "flex-start",
      }}
    >
      {displayPhases.map((phase) => (
        <Animated.View
          key={phase}
          style={{
            height: 8,
            width: pattern === "4-7-8" ? 64 : 56,
            borderRadius: 4,
            backgroundColor: isCurrentPhase(phase)
              ? colors.primary
              : colors.surface,
            transform: [{ scale: isCurrentPhase(phase) ? 1.1 : 1 }],
            elevation: isCurrentPhase(phase) ? 2 : 0,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isCurrentPhase(phase) ? 0.3 : 0,
            shadowRadius: 4,
          }}
        />
      ))}
    </View>
  );
};
