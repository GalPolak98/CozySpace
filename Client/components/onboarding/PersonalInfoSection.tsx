import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import CustomInput from '@/components/CustomInput';
import { PersonalInfoProps } from '@/types/onboarding';

export const PersonalInfoSection: React.FC<PersonalInfoProps> = ({
  firstName,
  lastName,
  setFirstName,
  setLastName,
}) => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = theme[currentTheme];

  return (
    <View className="space-y-4" style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
      <CustomInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder={t.personalInfo.firstName}
        autoCapitalize="words"
        isRTL={isRTL}
      />
      <CustomInput
        value={lastName}
        onChangeText={setLastName}
        placeholder={t.personalInfo.lastName}
        autoCapitalize="words"
        isRTL={isRTL}
      />
    </View>
  );
};