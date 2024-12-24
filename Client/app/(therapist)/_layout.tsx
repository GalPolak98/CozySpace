import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import { Ionicons } from '@expo/vector-icons';
import { HeaderLeft, HeaderRight } from '@/components/navigation/HeaderButtons';
import { Stack } from "expo-router";
import MainHeader from "@/components/navigation/MainHeader";

export default function TherapistLayout() {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  
  return (
    <Stack
    screenOptions={{
      header: () => <MainHeader />,
      headerStyle: {
        backgroundColor: colors.header,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        fontFamily: "Poppins-SemiBold",
      },
      headerBackVisible: false,
      headerTitle: "CozySpace",
    }}
  >
  </Stack>
  );
}