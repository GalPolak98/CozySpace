import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import { useLanguage } from '@/context/LanguageContext';
import ThemedText from '@/components/ThemedText';

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
  const { isRTL } = useLanguage();

  return (
    <View className="flex-1">
      <View 
        className="flex-row w-full h-2 mb-6"
        style={{
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }}
      >
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

      <View className="mb-6">
        <ThemedText 
          variant="default" 
          className="text-2xl font-pbold mb-2"
          isRTL={isRTL}
        >
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText 
            variant="secondary" 
            className="text-base font-pregular"
            isRTL={isRTL}
          >
            {subtitle}
          </ThemedText>
        )}
      </View>

      {children}
    </View>
  );
};