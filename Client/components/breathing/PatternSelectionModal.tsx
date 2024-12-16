import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ThemedText from "@/components/ThemedText";
import { CustomTheme } from "@/types/Theme";
import { BreathingPatternType, BREATHING_PATTERNS } from "@/types/breathing";
import { useLanguage } from "@/context/LanguageContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PatternSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (pattern: BreathingPatternType) => void;
  currentPattern: BreathingPatternType;
  colors: CustomTheme;
  gender?: string;
}

export const PatternSelectionModal: React.FC<PatternSelectionModalProps> = ({
  visible,
  onClose,
  onSelect,
  currentPattern,
  colors,
  gender,
}) => {
  const { t, getGenderedText, isRTL, currentLanguage } = useLanguage();

  const getPatternName = (pattern: any) => {
    const localizedName = pattern.name[currentLanguage as "en" | "he"];
    return `${localizedName} (${pattern.type})`;
  };

  const formatTiming = (pattern: any) => {
    const timing = t.breathing.patternSelection.timing;
    return `${timing.inhale}: ${pattern.inhale / 1000} ${timing.seconds}, ${
      timing.hold
    }: ${pattern.holdIn / 1000} ${timing.seconds}, ${timing.exhale}: ${
      pattern.exhale / 1000
    } ${timing.seconds}${
      pattern.holdOut
        ? `, ${timing.hold}: ${pattern.holdOut / 1000} ${timing.seconds}`
        : ""
    }`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          {/* Header */}
          <View
            style={[
              styles.modalHeader,
              { borderBottomColor: colors.border },
              isRTL && styles.modalHeaderRTL,
            ]}
          >
            <ThemedText
              style={[
                styles.modalTitle,
                { textAlign: isRTL ? "right" : "left" },
              ]}
              isRTL={isRTL}
            >
              {getGenderedText(t.breathing.patternSelection.title, gender)}
            </ThemedText>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Pattern Options */}
          {(
            Object.entries(BREATHING_PATTERNS) as [BreathingPatternType, any][]
          ).map(([key, pattern]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.patternOption,
                {
                  backgroundColor:
                    currentPattern === key ? colors.primary : colors.surface,
                },
              ]}
              onPress={() => {
                onSelect(key);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[
                  styles.patternName,
                  {
                    color:
                      currentPattern === key ? colors.background : colors.text,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
                isRTL={isRTL}
              >
                {getPatternName(pattern)}
              </ThemedText>
              <ThemedText
                style={[
                  styles.patternDescription,
                  {
                    color:
                      currentPattern === key
                        ? colors.background
                        : colors.textSecondary,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
                isRTL={isRTL}
              >
                {formatTiming(pattern)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: Math.min(SCREEN_WIDTH - 32, 400),
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalHeaderRTL: {
    flexDirection: "row-reverse",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
  },
  patternOption: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  patternName: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
});
