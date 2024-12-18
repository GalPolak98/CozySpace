import React from "react";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { Stack } from "expo-router";
import BreathingHeader from "@/components/breathing/BreathingHeader";

const HeaderWrapper = () => {
  const { theme: currentTheme, toggleTheme } = useTheme();
  return <BreathingHeader toggleTheme={toggleTheme} />;
};

const BreathingLayoutInner = () => {
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
        animation: "slide_from_right",
        headerTitleStyle: {
          fontFamily: "Poppins-SemiBold",
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
  );
};

export default BreathingLayoutInner;
