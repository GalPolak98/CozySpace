import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
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
  const colors = theme[currentTheme];

  return (
    <View className="space-y-4">
      <CustomInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
        autoCapitalize="words"
      />
      <CustomInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
        autoCapitalize="words"
      />
    </View>
  );
};