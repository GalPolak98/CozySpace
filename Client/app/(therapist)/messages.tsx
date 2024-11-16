import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

export default function MessagesScreen() {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1 p-4">
      <Text style={{ color: colors.text }} className="text-xl font-pbold">
        Messages Screen
      </Text>
    </View>
  );
}