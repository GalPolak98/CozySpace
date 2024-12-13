import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import MainHeader from "@/components/navigation/MainHeader";

const AuthLayout = () => {
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
      <Stack.Screen
        name="sign-in"
        options={{
          title: "Sign In",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "Sign Up",
        }}
      />
      <Stack.Screen
        name="initialUserSettings"
        options={{
          title: "Complete Profile",
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
