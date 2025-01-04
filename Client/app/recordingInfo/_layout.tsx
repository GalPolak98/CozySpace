import React from "react";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { Stack } from "expo-router";
import RecordingsInfoHeader from "@/components/information/recordingsInfoHeader";

const HeaderWrapper = () => {
  const { theme: currentTheme, toggleTheme } = useTheme();
  return <RecordingsInfoHeader toggleTheme={toggleTheme} />;
};

const RecordingsInfoLayoutInner = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <>
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
    </>
  );
};

export default RecordingsInfoLayoutInner;
