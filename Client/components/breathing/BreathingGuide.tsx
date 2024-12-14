import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ThemedText from "@/components/ThemedText";
import { CustomTheme } from "@/types/Theme";
import { BreathingPatternType, BREATHING_PATTERNS } from "@/types/breathing";

interface GuideModalProps {
  visible: boolean;
  onClose: () => void;
  colors: CustomTheme;
  isRTL: boolean;
  currentPattern: BreathingPatternType;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const PATTERN_GUIDES = {
  "4-4-4-4": {
    name: "Box Breathing",
    description:
      "Box breathing (4-4-4-4) is a powerful stress-management technique used by Navy SEALs, athletes, and anxiety specialists. It helps activate your body's natural relaxation response.",
    preparation: [
      "Find a quiet, comfortable place to sit or lie down",
      "Keep your back straight but relaxed",
      "Rest your hands gently on your lap or by your sides",
      "Close your eyes or maintain a soft, unfocused gaze",
      "Take a moment to notice your natural breathing",
    ],
    benefits: [
      "Reduces stress and anxiety levels",
      "Improves concentration and focus",
      "Helps regulate blood pressure",
      "Promotes better sleep quality",
      "Enhances emotional control",
      "Increases mindfulness",
    ],
    steps: [
      "Inhale deeply through your nose for 4 seconds",
      "Hold your breath for 4 seconds",
      "Exhale slowly through your mouth for 4 seconds",
      "Hold empty lungs for 4 seconds",
      "Repeat the cycle",
    ],
  },
  "4-7-8": {
    name: "Relaxing Breath",
    description:
      "The 4-7-8 breathing technique, also known as 'relaxing breath,' is a powerful tool for managing anxiety and sleep. Developed by Dr. Andrew Weil, it acts as a natural tranquilizer for the nervous system.",
    preparation: [
      "Find a quiet, comfortable place to sit or lie down",
      "Keep your back straight but relaxed",
      "Place the tip of your tongue against the ridge behind your upper front teeth",
      "Close your eyes or maintain a soft, unfocused gaze",
      "Take a moment to notice your natural breathing",
    ],
    benefits: [
      "Helps manage anxiety and panic attacks",
      "Improves sleep quality and helps with insomnia",
      "Reduces stress response",
      "Controls cravings and emotional reactions",
      "Lowers heart rate and blood pressure",
      "Enhances meditation practice",
    ],
    steps: [
      "Inhale quietly through your nose for 4 seconds",
      "Hold your breath for 7 seconds",
      "Exhale completely through your mouth making a whoosh sound for 8 seconds",
      "Start the next cycle immediately without pause",
    ],
    tips: [
      "Keep the tip of your tongue in position throughout the exercise",
      "Exhale through your mouth around your tongue",
      "Try to make the exhalation long and audible",
      "Start with 4 cycles and gradually increase",
    ],
  },
};

export const BreathingGuideModal: React.FC<GuideModalProps> = ({
  visible,
  onClose,
  colors,
  isRTL,
  currentPattern,
}) => {
  const guide = PATTERN_GUIDES[currentPattern];

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
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              {guide.name} Guide
            </ThemedText>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
            >
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <View style={styles.sectionHeader}>
                <MaterialIcons
                  name="info-outline"
                  size={24}
                  color={colors.primary}
                />
                <ThemedText
                  style={[styles.sectionTitle, { color: colors.text }]}
                >
                  About {guide.name}
                </ThemedText>
              </View>
              <ThemedText
                style={[styles.description, { color: colors.textSecondary }]}
              >
                {guide.description}
              </ThemedText>
            </View>

            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <View style={styles.sectionHeader}>
                <MaterialIcons
                  name="medical-services"
                  size={24}
                  color={colors.primary}
                />
                <ThemedText
                  style={[styles.sectionTitle, { color: colors.text }]}
                >
                  Benefits
                </ThemedText>
              </View>
              <View style={styles.benefitsList}>
                {guide.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={colors.primary}
                    />
                    <ThemedText
                      style={[
                        styles.benefitText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {benefit}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <View style={styles.sectionHeader}>
                <MaterialIcons
                  name="tips-and-updates"
                  size={24}
                  color={colors.primary}
                />
                <ThemedText
                  style={[styles.sectionTitle, { color: colors.text }]}
                >
                  How to Practice
                </ThemedText>
              </View>
              <View style={styles.stepsList}>
                {guide.steps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepNumber,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <ThemedText style={styles.stepNumberText}>
                        {index + 1}
                      </ThemedText>
                    </View>
                    <ThemedText
                      style={[styles.stepText, { color: colors.textSecondary }]}
                    >
                      {step}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <View style={styles.sectionHeader}>
                <MaterialIcons
                  name="accessibility-new"
                  size={24}
                  color={colors.primary}
                />
                <ThemedText
                  style={[styles.sectionTitle, { color: colors.text }]}
                >
                  Preparation
                </ThemedText>
              </View>
              <View style={styles.stepsList}>
                {guide.preparation.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepNumber,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <ThemedText style={styles.stepNumberText}>
                        {index + 1}
                      </ThemedText>
                    </View>
                    <ThemedText
                      style={[styles.stepText, { color: colors.textSecondary }]}
                    >
                      {step}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
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
  },
  modalContent: {
    width: "90%",
    maxHeight: SCREEN_HEIGHT * 0.8,
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
  },
  scrollView: {
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
  stepText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
});
