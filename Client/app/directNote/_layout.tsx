import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import NotesHeader from '@/components/notes/NotesHeader';
import { Stack } from 'expo-router';

// Header wrapper to handle dynamic data and theme toggling
const HeaderWrapper = () => {
  const { theme: currentTheme, toggleTheme } = useTheme();
  return <NotesHeader toggleTheme={toggleTheme} />;
};

// Layout with Stack to manage screen transition
const NotesLayoutInner = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <Stack
      screenOptions={{
        header: () => <HeaderWrapper />,
        headerStyle: {
          backgroundColor: colors.header,
        },
        headerTintColor: colors.text,
        animation: 'slide_from_right',
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          gestureEnabled: false,
        }}
        // component={NotesSection} // Pass NotesSection as the component
      />
    </Stack>
  );
};

export default NotesLayoutInner;
