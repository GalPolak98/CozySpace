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
import { BreathingPatternType } from "@/types/breathing";
import { useLanguage } from "@/context/LanguageContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface GenderedText {
  male: string;
  female: string;
  default: string;
}

interface BreathingPattern {
  name: string;
  description: GenderedText;
  preparation: GenderedText[];
  benefits: string[];
  steps: GenderedText[];
  tips?: GenderedText[];
}

interface GuideModalProps {
  visible: boolean;
  onClose: () => void;
  colors: CustomTheme;
  currentPattern: BreathingPatternType;
  gender?: string;
}

export const BreathingGuideModal: React.FC<GuideModalProps> = ({
  visible,
  onClose,
  colors,
  currentPattern,
  gender,
}) => {
  const { t, getGenderedText, isRTL } = useLanguage();
  const guide = t.breathing.breathingGuide.patterns[currentPattern];

  const renderStep = (step: GenderedText, index: number) => (
    <View
      key={index}
      style={[
        styles.stepItem,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
    >
      <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
        <ThemedText style={[styles.stepNumberText]} isRTL={isRTL}>
          {index + 1}
        </ThemedText>
      </View>
      <ThemedText
        style={[
          styles.stepText,
          {
            color: colors.textSecondary,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
        isRTL={isRTL}
      >
        {getGenderedText(step, gender)}
      </ThemedText>
    </View>
  );

  const renderBenefit = (benefit: string, index: number) => (
    <View
      key={index}
      style={[
        styles.benefitItem,
        { flexDirection: isRTL ? "row-reverse" : "row" },
      ]}
    >
      <MaterialIcons name="check-circle" size={20} color={colors.primary} />
      <ThemedText
        style={[
          styles.benefitText,
          {
            color: colors.textSecondary,
            textAlign: isRTL ? "right" : "left",
          },
        ]}
        isRTL={isRTL}
      >
        {benefit}
      </ThemedText>
    </View>
  );

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
          <View
            style={[
              styles.header,
              {
                borderBottomColor: colors.border,
                flexDirection: isRTL ? "row-reverse" : "row",
              },
            ]}
          >
            <ThemedText
              style={[
                styles.title,
                {
                  color: colors.text,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
              isRTL={isRTL}
            >
              {`${t.breathing.breathingGuide.guide} - ${guide.name} `}
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
            {/* About Section */}
            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <View
                style={[
                  styles.sectionHeader,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <MaterialIcons
                  name="info-outline"
                  size={24}
                  color={colors.primary}
                />
                <ThemedText
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      marginLeft: isRTL ? 0 : 8,
                      marginRight: isRTL ? 8 : 0,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                  isRTL={isRTL}
                >
                  {`${t.breathing.breathingGuide.about} ${guide.name}`}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.description,
                  {
                    color: colors.textSecondary,
                    textAlign: isRTL ? "right" : "left",
                  },
                ]}
                isRTL={isRTL}
              >
                {getGenderedText(guide.description, gender)}
              </ThemedText>
            </View>

            {/* Benefits Section */}
            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <View
                style={[
                  styles.sectionHeader,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <MaterialIcons
                  name="medical-services"
                  size={24}
                  color={colors.primary}
                />
                <ThemedText
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      marginLeft: isRTL ? 0 : 8,
                      marginRight: isRTL ? 8 : 0,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                  isRTL={isRTL}
                >
                  {t.breathing.breathingGuide.benefits}
                </ThemedText>
              </View>
              <View style={styles.benefitsList}>
                {guide.benefits.map(renderBenefit)}
              </View>
            </View>

            {/* Steps Section */}
            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <View
                style={[
                  styles.sectionHeader,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <MaterialIcons
                  name="tips-and-updates"
                  size={24}
                  color={colors.primary}
                />
                <ThemedText
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      marginLeft: isRTL ? 0 : 8,
                      marginRight: isRTL ? 8 : 0,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                  isRTL={isRTL}
                >
                  {t.breathing.breathingGuide.howToPractice}
                </ThemedText>
              </View>
              <View style={styles.stepsList}>
                {guide.steps.map(renderStep)}
              </View>
            </View>

            {/* Preparation Section */}
            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <View
                style={[
                  styles.sectionHeader,
                  { flexDirection: isRTL ? "row-reverse" : "row" },
                ]}
              >
                <MaterialIcons
                  name="accessibility-new"
                  size={24}
                  color={colors.primary}
                />
                <ThemedText
                  style={[
                    styles.sectionTitle,
                    {
                      color: colors.text,
                      marginLeft: isRTL ? 0 : 8,
                      marginRight: isRTL ? 8 : 0,
                      textAlign: isRTL ? "right" : "left",
                    },
                  ]}
                  isRTL={isRTL}
                >
                  {t.breathing.breathingGuide.preparation}
                </ThemedText>
              </View>
              <View style={styles.stepsList}>
                {guide.preparation.map(renderStep)}
              </View>
            </View>

            {/* Tips Section */}
            {guide.tips && (
              <View
                style={[styles.section, { backgroundColor: colors.surface }]}
              >
                <View
                  style={[
                    styles.sectionHeader,
                    { flexDirection: isRTL ? "row-reverse" : "row" },
                  ]}
                >
                  <MaterialIcons
                    name="lightbulb"
                    size={24}
                    color={colors.primary}
                  />
                  <ThemedText
                    style={[
                      styles.sectionTitle,
                      {
                        color: colors.text,
                        marginLeft: isRTL ? 0 : 8,
                        marginRight: isRTL ? 8 : 0,
                        textAlign: isRTL ? "right" : "left",
                      },
                    ]}
                    isRTL={isRTL}
                  >
                    {t.breathing.breathingGuide.tips}
                  </ThemedText>
                </View>
                <View style={styles.stepsList}>
                  {guide.tips.map(renderStep)}
                </View>
              </View>
            )}
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

export default BreathingGuideModal;
