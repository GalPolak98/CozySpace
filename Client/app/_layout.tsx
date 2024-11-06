import { SplashScreen, Stack } from "expo-router";
import "../global.css";
import { useFonts } from "expo-font";
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import React from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
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

  if (!fontsLoaded && !error) return null;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerTitle: "Sign In" }} />
        <Stack.Screen name="(tabs)" options={{ headerTitle: "", headerLeft: () => null, headerShown: true, gestureEnabled: false }} />
        <Stack.Screen name="index" options={{ headerTitle: "AnxiEase" }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="notes" options={{ headerTitle: "Documenting" }} />
      </Stack>
    </>
  );
}

export default RootLayout;
