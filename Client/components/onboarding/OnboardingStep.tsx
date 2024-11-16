import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

interface OnboardingStepProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  subtitle,
  children,
  currentStep,
  totalSteps,
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <View className="flex-1">
      {/* Progress Bar */}
      <View className="flex-row w-full h-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            className="flex-1 h-full mx-0.5 rounded-full"
            style={{
              backgroundColor: index < currentStep ? colors.primary : colors.border,
            }}
          />
        ))}
      </View>

      {/* Header */}
      <View className="mb-6">
        <Text style={{ color: colors.text }} className="text-2xl font-pbold mb-2">
          {title}
        </Text>
        {subtitle && (
          <Text style={{ color: colors.textSecondary }} className="text-base font-pregular">
            {subtitle}
          </Text>
        )}
      </View>

      {/* Content */}
      {children}
    </View>
  );
};