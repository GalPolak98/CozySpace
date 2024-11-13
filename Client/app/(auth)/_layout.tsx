// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

const AuthLayout = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <Stack
      screenOptions={{
        headerRight: () => <ThemeToggle />,
        headerStyle: {
          backgroundColor: colors.header,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
        headerBackVisible:false,
        headerTitle:"AnxiEase"
      }}
    >
      <Stack.Screen
        name="sign-in"
        options={{
          title: "Sign In",
          headerBackVisible: false, 
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Sign Up",
        }}
      />
    </Stack>
  );
};

export default AuthLayout;