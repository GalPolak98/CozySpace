import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import NotesHeader from '@/components/notes/NotesHeader';
import { Stack } from 'expo-router';

const HeaderWrapper = () => {
  const { theme: currentTheme, toggleTheme } = useTheme();
  return <NotesHeader toggleTheme={toggleTheme} />;
};

const NotesLayoutInner = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <>
      <StatusBar
        backgroundColor={colors.header}
        barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'}
      />
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
        />
      </Stack>
    </>
  );
};

export default NotesLayoutInner;