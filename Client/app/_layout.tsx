import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import { useFonts } from "expo-font";
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import React from "react";
import { ThemeProvider, useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import Loader from '@/components/Loader';
import { LanguageProvider } from "@/context/LanguageContext";
import { HeaderRight } from "@/components/navigation/HeaderButtons";

const InitialLayout = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <>
      <StatusBar 
        barStyle={currentTheme === 'light' ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.header,
          },
          headerTintColor: colors.text,
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="(auth)" 
          options={{
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="(patient)" 
          options={{ 
            headerTitle: "",
            headerLeft: () => null,
            gestureEnabled: false,
          }} 
        />

        <Stack.Screen 
          name="(therapist)" 
          options={{ 
            headerTitle: "",
            headerLeft: () => null,
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="index" 
          options={{
            headerTitle: "CozySpace",
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              color: colors.text,
            },
            headerShown: true,
            headerRight: HeaderRight,
          }}
        />
        <Stack.Screen 
          name="+not-found"
          options={{
            headerTitle: "Not Found",
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              color: colors.text,
            },
          }}
        />
      </Stack>
    </>
  );
};

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });
  
  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return <Loader isLoading={true} />;
  }

  return (
    <LanguageProvider>
    <ThemeProvider>
      <InitialLayout />
    </ThemeProvider>
    </LanguageProvider>
  );
}
