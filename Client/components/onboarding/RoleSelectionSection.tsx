import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { RoleSelectionProps } from '@/types/onboarding';
import { Ionicons } from '@expo/vector-icons';

export const RoleSelectionSection: React.FC<RoleSelectionProps> = ({
  userType,
  setUserType,
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const windowWidth = Dimensions.get('window').width;

  return (
    <View className="space-y-8">
      <Text style={{ color: colors.text }} className="text-xl font-pbold">
        How would you like to use AnxiEase?
      </Text>

      {/* Patient Option */}
      <TouchableOpacity
        onPress={() => setUserType('patient')}
        className={`p-6 mb-4 mt-4 rounded-xl border-2 ${userType === 'patient' ? 'border-primary' : 'border-border'}`}
        style={{
          backgroundColor: colors.surface,
          borderColor: userType === 'patient' ? colors.primary : colors.border,
        }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons 
              name="person" 
              size={24} 
              color={userType === 'patient' ? colors.primary : colors.text} 
            />
            <Text 
              style={{ color: userType === 'patient' ? colors.primary : colors.text }}
              className="text-lg font-pbold ml-3"
            >
              I'm Seeking Help
            </Text>
          </View>
          {userType === 'patient' && (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          )}
        </View>
        <Text style={{ color: colors.textSecondary }} className="font-pregular">
          Get personalized support, track your anxiety levels, and connect with professional therapists
        </Text>
      </TouchableOpacity>

      {/* Therapist Option */}
      <TouchableOpacity
        onPress={() => setUserType('therapist')}
        className={`p-6 rounded-xl border-2`}
        style={{
          backgroundColor: colors.surface,
          borderColor: userType === 'therapist' ? colors.primary : colors.border,
        }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons 
              name="medical" 
              size={24} 
              color={userType === 'therapist' ? colors.primary : colors.text} 
            />
            <Text 
              style={{ color: userType === 'therapist' ? colors.primary : colors.text }}
              className="text-lg font-pbold ml-3"
            >
              I'm a Therapist
            </Text>
          </View>
          {userType === 'therapist' && (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          )}
        </View>
        <Text style={{ color: colors.textSecondary }} className="font-pregular">
          Help patients manage anxiety, monitor their progress, and provide professional support
        </Text>
      </TouchableOpacity>
    </View>
  );
};