import React from 'react';
import { View, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import CustomButton from '@/components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

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
            position: 'absolute',
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
          <View className="flex-row space-x-4">
            {showBackButton && (
              <CustomButton
                title="Back"
                handlePress={onBack}
                variant="secondary"
                containerStyles="flex-1"
                icon={<Ionicons name="arrow-back" size={24} color={colors.text} />}
                iconPosition="left"
              />
            )}
            {showContinueButton && (
            <CustomButton
              title={isLastStep ? "Complete" : "Continue"}
              handlePress={onNext}
              variant="primary"
              containerStyles={!showBackButton ? "w-full" : "flex-1"}
              icon={isLastStep ? 
                <Ionicons name="checkmark" size={24} color="white" /> :
                <Ionicons name="arrow-forward" size={24} color="white" />
              }
              iconPosition="right"
            />
            )}

          </View>
        </View>
      </View>
    );
  };