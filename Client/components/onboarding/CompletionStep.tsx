import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { Ionicons } from '@expo/vector-icons';

interface CompletionStepProps {
  userType: 'patient' | 'therapist';
}

export const CompletionStep: React.FC<CompletionStepProps> = ({ userType }) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const getContent = () => {
    if (userType === 'therapist') {
      return {
        title: "Welcome to AnxiEase Professional",
        message: "Your professional profile has been set up successfully. You can now start helping patients manage their anxiety effectively.",
        features: [
          "Access to patient anxiety tracking",
          "Secure communication platform",
          "Professional dashboard",
          "Patient management tools"
        ]
      };
    }
    return {
      title: "Welcome to AnxiEase",
      message: "Your profile has been set up successfully. You're ready to start managing your anxiety with professional support.",
      features: [
        "Real-time anxiety tracking",
        "Smart jewelry integration",
        "Music therapy tools",
        "Professional support"
      ]
    };
  };

  const content = getContent();

  return (
    <View className="flex-1 items-center px-4">
      <View className="items-center space-y-8 w-full max-w-md">
        {/* Icon Section */}
        <View className="py-8">
          <Ionicons 
            name="checkmark-circle" 
            size={100} 
            color={colors.primary}
          />
        </View>
        
        {/* Content Section */}
        <View className="space-y-6 w-full">
          <View className="space-y-4">
            <Text 
              style={{ color: colors.text }} 
              className="text-2xl font-pbold text-center"
            >
              {content.title}
            </Text>
            
            <Text 
              style={{ color: colors.textSecondary, marginTop:4 }} 
              className="text-base font-pregular px-4"
            >
              {content.message}
            </Text>
          </View>

          {/* Features Card */}
          <View 
            className="bg-surface rounded-xl p-6 space-y-4"
            style={{
              shadowColor: colors.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Text 
              style={{ color: colors.text }} 
              className="font-pbold text-lg mb-2"
            >
              Available Features
            </Text>
            
            <View className="space-y-4">
              {content.features.map((feature, index) => (
                <View 
                  key={index} 
                  className="flex-row items-center space-x-3"
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
                  <Text 
                    style={{ color: colors.text }} 
                    className="font-pmedium flex-1"
                  >
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};