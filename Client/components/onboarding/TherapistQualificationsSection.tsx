import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import CustomInput from '@/components/CustomInput';
import { CustomDropdown } from '@/components/CustomDropdown';
import { TherapistQualificationsProps } from '@/types/onboarding';
import { EDUCATION_LEVELS, EXPERIENCE_LEVELS, SPECIALIZATIONS, getOptionsForLanguage } from '@/constants/onboarding';

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
  const { t, isRTL, currentLanguage } = useLanguage();
  const colors = theme[currentTheme];

  return (
    <ScrollView className="space-y-6">
      <CustomDropdown
        label={t.therapistQualifications.education}
        options={getOptionsForLanguage(EDUCATION_LEVELS, currentLanguage)}
        value={educationLevel}
        onChange={(value) => setEducationLevel(value)}
        placeholder={t.therapistQualifications.selectEducation}
        isRTL={isRTL}
      />

      <CustomDropdown
        label={t.therapistQualifications.experience}
        options={getOptionsForLanguage(EXPERIENCE_LEVELS, currentLanguage)}
        value={experienceLevel}
        onChange={(value) => setExperienceLevel(value)}
        placeholder={t.therapistQualifications.selectExperience}
        isRTL={isRTL}
      />

      <View className="mb-4">
        <Text 
          style={{ 
            color: colors.text,
            textAlign: isRTL ? 'right' : 'left'
          }} 
          className="font-pmedium mb-2"
        >
          {t.therapistQualifications.workplace}
        </Text>
        <CustomInput
          value={workplace}
          onChangeText={setWorkplace}
          placeholder={t.therapistQualifications.workplacePlaceholder}
          autoCapitalize="words"
          isRTL={isRTL}
        />
      </View>

      <CustomDropdown
        label={t.therapistQualifications.specialization}
        options={getOptionsForLanguage(SPECIALIZATIONS, currentLanguage)}
        value={specialization}
        onChange={(value) => setSpecialization(value)}
        placeholder={t.therapistQualifications.selectSpecialization}
        isRTL={isRTL}
      />

      <View>
        <Text 
          style={{ 
            color: colors.text,
            textAlign: isRTL ? 'right' : 'left'
          }} 
          className="font-pmedium mb-2"
        >
          {t.therapistQualifications.licenseNumber}
        </Text>
        <CustomInput
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          placeholder={t.therapistQualifications.licenseNumberPlaceholder}
          autoCapitalize="characters"
          isRTL={isRTL}
        />
      </View>
    </ScrollView>
  );
};

function getLocalizedEducationLevels(currentLanguage: any) {
  throw new Error('Function not implemented.');
}
function getLocalizedExperienceLevels(currentLanguage: any) {
  throw new Error('Function not implemented.');
}

function getLocalizedSpecializations(currentLanguage: any) {
  throw new Error('Function not implemented.');
}

