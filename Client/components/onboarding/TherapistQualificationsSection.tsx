import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import CustomInput from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropdown';
import { TherapistQualificationsProps } from '@/types/onboarding';
import { EDUCATION_LEVELS, EXPERIENCE_LEVELS, SPECIALIZATIONS } from '@/constants/onboarding';

export const TherapistQualificationsSection: React.FC<TherapistQualificationsProps> = ({
    educationLevel,
    setEducationLevel,
    experienceLevel,
    setExperienceLevel,
    workplace,
    setWorkplace,
    specialization,
    setSpecialization,
    licenseNumber,
    setLicenseNumber
  }) => {
    const { theme: currentTheme } = useTheme();
    const colors = theme[currentTheme];
  
    return (
      <ScrollView className="space-y-6">
        <CustomDropdown
          label="Educational Background"
          options={EDUCATION_LEVELS}
          value={educationLevel}
          onChange={(value) => setEducationLevel(value)}
          placeholder="Select your education level"
        />
  
        <CustomDropdown
          label="Years of Experience"
          options={EXPERIENCE_LEVELS}
          value={experienceLevel}
          onChange={(value) => setExperienceLevel(value)}
          placeholder="Select your experience level"
        />
  
        <View className="mb-4">
          <Text style={{ color: colors.text }} className="font-pmedium mb-2">
            Current Workplace
          </Text>
          <CustomInput
            value={workplace}
            onChangeText={setWorkplace}
            placeholder="e.g., Private Practice, Hospital Name"
            autoCapitalize="words"
          />
        </View>
  
        <CustomDropdown
          label="Primary Specialization"
          options={SPECIALIZATIONS}
          value={specialization}
          onChange={(value) => setSpecialization(value)}
          placeholder="Select your specialization"
        />
  
        <View>
          <Text style={{ color: colors.text }} className="font-pmedium mb-2">
            Professional License Number
          </Text>
          <CustomInput
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="Enter your license number"
            autoCapitalize="characters"
          />
        </View>
      </ScrollView>
    );
  };