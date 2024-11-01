import { SplashScreen, Stack, Slot } from "expo-router";
import "../global.css";
import { useFonts } from "expo-font";
import { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import React from "react";
import { ThemeProvider, useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import ThemeToggle from '@/components/ThemeToggle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/Services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '@/components/Loader';

const InitialLayout = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const token = await user.getIdToken();
          await AsyncStorage.setItem('userToken', token);
        } else {
          await AsyncStorage.removeItem('userToken');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (isCheckingAuth) {
    return <Loader isLoading={true} />;
  }

  return (
    <>
      <StatusBar 
        barStyle={currentTheme === 'light' ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerLeft: () => <ThemeToggle />,
        }}
      >
        <Stack.Screen 
          name="(auth)" 
          options={{
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerTitle: "",
            headerLeft: () => null,
            headerShown: false,
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="index" 
          options={{
            headerTitle: "AnxiEase",
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              color: colors.text,
            },
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

  if (!fontsLoaded && !error) return null;

  return (
    <ThemeProvider>
      <InitialLayout />
    </ThemeProvider>
  );
}