import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import ThemedText from "@/components/ThemedText";
import { CustomTheme } from "@/types/Theme";
import { BreathingPatternType, BREATHING_PATTERNS } from "@/types/breathing";

interface StatsProps {
  sessionCount: number;
  colors: CustomTheme;
  isGuided: boolean;
  onGuidePress: () => void;
  currentPattern: BreathingPatternType;
  onPatternPress: () => void;
}

export const Stats: React.FC<StatsProps> = ({
  sessionCount,
  colors,
  isGuided,
  onGuidePress,
  currentPattern,
  onPatternPress,
}) => (
  <View style={styles.container}>
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <MaterialIcons name="timer" size={24} color={colors.primary} />
      <ThemedText style={[styles.statText, { color: colors.textSecondary }]}>
        {sessionCount} sessions
      </ThemedText>
    </View>
    <TouchableOpacity
      style={[styles.statCard, { backgroundColor: colors.surface }]}
      onPress={onPatternPress}
      activeOpacity={0.7}
    >
      <Feather name="wind" size={24} color={colors.primary} />
      <ThemedText style={[styles.statText, { color: colors.textSecondary }]}>
        {currentPattern}
      </ThemedText>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.statCard,
        {
          backgroundColor: colors.surface,
          borderColor: isGuided ? colors.primary : "transparent",
          borderWidth: isGuided ? 2 : 0,
        },
      ]}
      onPress={onGuidePress}
      activeOpacity={0.7}
    >
      <MaterialIcons
        name={isGuided ? "lightbulb" : "lightbulb-outline"}
        size={24}
        color={colors.primary}
      />
      <ThemedText
        style={[
          styles.statText,
          { color: isGuided ? colors.primary : colors.textSecondary },
        ]}
      >
        {isGuided ? "Guidance" : "Guidance"}
      </ThemedText>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 32,
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statText: {
    fontSize: 13,
    fontFamily: "Poppins-Medium",
    marginTop: 4,
    textAlign: "center",
  },
});
