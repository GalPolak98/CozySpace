import React, { useState } from "react";
import { Stack } from "expo-router";
import NotesHeader from "@/components/notes/NotesHeader";
import AnxietySlider from "@/components/notes/AnxietySlider";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";

const HeaderWrapper = () => {
  const { theme: currentTheme, toggleTheme } = useTheme();
  return <NotesHeader toggleTheme={toggleTheme} />;
};

const NotesScreen = () => {
  const [inputValue, setInputValue] = useState("");
  const [anxietyRating, setAnxietyRating] = useState<number>(0);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleAnxietyChange = (newRating: number) => {
    setAnxietyRating(newRating);
  };

  return (
    <>
      <AnxietySlider
        anxietyRating={anxietyRating}
        setAnxietyRating={handleAnxietyChange}
      />
    </>
  );
};

function NotesLayoutInner() {
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
        // component={NotesScreen} // Pass NotesScreen as the component
      />
    </Stack>
  );
}

export default NotesLayoutInner;
