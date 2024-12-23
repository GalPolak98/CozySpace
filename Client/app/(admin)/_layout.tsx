import React from "react";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { Stack } from "expo-router";
import { HeaderLeft, HeaderRight } from "@/components/navigation/HeaderButtons";

export default function AdminLayout() {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <Stack
      screenOptions={{
        headerLeft: HeaderLeft,
        headerStyle: {
          backgroundColor: colors.header,
        },
        headerTintColor: colors.text,
        animation: "slide_from_right",
        headerTitleStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 17,
          color: colors.text,
        },
      }}
    >
      <Stack.Screen
        name="home"
        options={{
          headerTitle: "Dashboard",
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
