import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import CustomInput from '@/components/CustomInput';
import { PersonalInfoProps } from '@/types/onboarding';
import { CustomDropdown } from '@/components/CustomDropdown';

export const PersonalInfoSection: React.FC<PersonalInfoProps> = ({
  firstName,
  lastName,
  gender,
  setFirstName,
  setLastName,
  setGender,
}) => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = theme[currentTheme];

  const genderOptions = [
    { id: 'male', label: t.personalInfo.male },
    { id: 'female', label: t.personalInfo.female },
  ];

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
      <View style={[{ width: '100%' , marginTop: 12}]}>
        <CustomDropdown
          options={genderOptions}
          value={gender}
          onChange={setGender}
          placeholder={t.personalInfo.selectGender}
          isRTL={isRTL}
        />
      </View>
    </View>
  );
};