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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface PatternSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (pattern: BreathingPatternType) => void;
  currentPattern: BreathingPatternType;
  colors: CustomTheme;
  isRTL?: boolean;
}

export const PatternSelectionModal: React.FC<PatternSelectionModalProps> = ({
  visible,
  onClose,
  onSelect,
  currentPattern,
  colors,
  isRTL = false,
}) => {
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
            <ThemedText style={styles.modalTitle} isRTL={isRTL}>
              Select Breathing Pattern
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
                  },
                ]}
                isRTL={isRTL}
              >
                {pattern.name} ({key})
              </ThemedText>
              <ThemedText
                style={[
                  styles.patternDescription,
                  {
                    color:
                      currentPattern === key
                        ? colors.background
                        : colors.textSecondary,
                  },
                ]}
                isRTL={isRTL}
              >
                {`Inhale: ${pattern.inhale / 1000}s, Hold: ${
                  pattern.holdIn / 1000
                }s, Exhale: ${pattern.exhale / 1000}s${
                  pattern.holdOut ? `, Hold: ${pattern.holdOut / 1000}s` : ""
                }`}
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
