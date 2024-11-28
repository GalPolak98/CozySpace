import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

interface CompletionStepProps {
  userType: 'patient' | 'therapist';
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ userType }) => {
  const { theme: currentTheme } = useTheme();
  const { isRTL, t } = useLanguage();
  const colors = theme[currentTheme];

  const getContent = () => {
    if (userType === 'therapist') {
      return {
        features: [
          t.therapistFeatures.patientTracking,
          t.therapistFeatures.secureCommunication,
          t.therapistFeatures.dashboard,
          t.therapistFeatures.patientTools
        ]
      };
    }
    return {
      features: [
        t.patientFeatures.anxietyTracking,
        t.patientFeatures.smartJewelry,
        t.patientFeatures.musicTherapy,
        t.patientFeatures.professionalSupport
      ]
    };
  };

  const content = getContent();

  return (
    <View className="flex-1 items-center px-4">
      <View className="items-center space-y-8 w-full max-w-md">
        <View className="py-8">
          <Ionicons 
            name="checkmark-circle" 
            size={100} 
            color={colors.primary}
          />
        </View>
        
        <View className="space-y-6 w-full">
          <View className="space-y-4">
            <ThemedText 
              variant="primary"
              className="text-2xl font-pbold text-center"
            >
              {userType === 'therapist' ? t.completion.therapistTitle : t.completion.patientTitle}
            </ThemedText>
            
            <ThemedText 
              variant="secondary"
              className="text-base font-pregular px-4 text-center"
              isRTL={isRTL}
            >
              {userType === 'therapist' ? t.completion.therapistMessage : t.completion.patientMessage}
            </ThemedText>
          </View>

          <ThemedView 
            variant="surface"
            className="rounded-xl p-6 space-y-4"
            style={{
              shadowColor: colors.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <ThemedText 
              variant="primary"
              className="font-pbold text-lg mb-2"
              isRTL={isRTL}
            >
              {t.completion.availableFeatures}
            </ThemedText>
            
            <View className="space-y-4">
              {content.features.map((feature, index) => (
                <View 
                  key={index} 
                  className="flex-row items-center space-x-3"
                  style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
                >
                  <View 
                    className="rounded-full p-1"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Ionicons 
                      name="checkmark-circle" 
                      size={24} 
                      color={colors.primary}
                    />
                  </View>
                  <ThemedText 
                    variant="primary"
                    className="font-pmedium flex-1"
                    isRTL={isRTL}
                  >
                    {feature}
                  </ThemedText>
                </View>
              ))}
            </View>
          </ThemedView>
        </View>
      </View>
    </View>
  );
};