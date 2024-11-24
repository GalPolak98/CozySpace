import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';

export default function SettingsScreen() {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 p-4">
      <Text style={{ color: colors.text }} className="text-xl font-pbold">
        Settings Screen
      </Text>
    </View>
  );
}