import React from "react";
import { View, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { theme } from "@/styles/Theme";
import CustomButton from "@/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";

interface OnboardingContainerProps {
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
  currentStep: number;
  isRoleSelection: boolean;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  children,
  onNext,
  onBack,
  isLastStep,
  currentStep,
  isRoleSelection,
}) => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = theme[currentTheme];
  const insets = useSafeAreaInsets();
  const showBackButton = !isRoleSelection;
  const showContinueButton = !isRoleSelection;

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        className="px-4"
      >
        {children}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: insets.bottom,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingHorizontal: 16,
          paddingTop: 16,
        }}
      >
        <View
          className="space-x-4"
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            width: "100%",
          }}
        >
          {showBackButton && (
            <CustomButton
              title={t.common.back}
              handlePress={onBack}
              variant="secondary"
              containerStyles={{
                flex: 1,
                minWidth: 120,
                margin: 8,
              }}
            />
          )}
          {showContinueButton && (
            <CustomButton
              title={isLastStep ? t.common.complete : t.common.continue}
              handlePress={onNext}
              variant="primary"
              containerStyles={{
                flex: 1,
                minWidth: 120,
                margin: 8,
                ...(!showBackButton && { maxWidth: "80%" }),
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};
