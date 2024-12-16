import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import ThemedText from "@/components/ThemedText";
import { CustomTheme } from "@/types/Theme";
import { BreathingPatternType } from "@/types/breathing";
import { useLanguage } from "@/context/LanguageContext";

interface StatsProps {
  sessionDuration: number;
  colors: CustomTheme;
  isGuided: boolean;
  onGuidePress: () => void;
  currentPattern: BreathingPatternType;
  onPatternPress: () => void;
  gender?: string;
}

export const Stats: React.FC<StatsProps> = ({
  sessionDuration,
  colors,
  isGuided,
  onGuidePress,
  currentPattern,
  onPatternPress,
  gender,
}) => {
  const { t, isRTL, getGenderedText } = useLanguage();

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <View
      style={[
        styles.container,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
    >
      <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
        <MaterialIcons name="timer" size={24} color={colors.primary} />
        <ThemedText
          style={[
            styles.statText,
            { color: colors.textSecondary, textAlign: "center" },
          ]}
          isRTL={isRTL}
        >
          {formatDuration(sessionDuration)}
        </ThemedText>
      </View>
      <TouchableOpacity
        style={[styles.statCard, { backgroundColor: colors.surface }]}
        onPress={onPatternPress}
        activeOpacity={0.7}
      >
        <Feather name="wind" size={24} color={colors.primary} />
        <ThemedText
          style={[
            styles.statText,
            { color: colors.textSecondary, textAlign: "center" },
          ]}
          isRTL={isRTL}
        >
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
            {
              color: isGuided ? colors.primary : colors.textSecondary,
              textAlign: "center",
            },
          ]}
          isRTL={isRTL}
        >
          {getGenderedText(t.breathing.stats.guidance, gender)}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

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
