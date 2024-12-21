import React from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { theme } from "@/styles/Theme";
import ThemeToggle from "@/components/ThemeToggle";
import { auth } from "@/services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authManager } from "@/services/authManager";
import LanguageToggle from "./LanguageToggle";
import { websocketService } from "@/services/websocketService";
import { sensorService } from "@/services/sensorService";

export const HeaderRight = () => (
  <View className="flex-row">
    <LanguageToggle />
    <ThemeToggle />
  </View>
);

export const HeaderLeft = () => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = theme[currentTheme];

  const cleanupServices = async () => {
    try {
      // Get current user ID before cleanup
      const userId = auth.currentUser?.uid;

      // Stop any active monitoring/simulation
      if (userId) {
        await sensorService.stopSensorSimulation(userId);
      }

      await websocketService.cleanup();

      await authManager.cleanup();
      const keysToRemove = ["userToken", "userId", "userRole", "lastLoginTime"];

      await Promise.all(
        keysToRemove.map((key) => AsyncStorage.removeItem(key))
      );
    } catch (error) {
      console.error("Service cleanup error:", error);
      throw error;
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      t.common.logout,
      t.common.logoutConfirm,
      [
        {
          text: t.common.cancel,
          style: "cancel",
        },
        {
          text: t.common.logout,
          style: "destructive",
          onPress: async () => {
            try {
              await cleanupServices();
              await auth.signOut();
              await AsyncStorage.removeItem("userToken");
              router.replace("/(auth)/sign-in");
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert(t.common.error, t.common.logoutError);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-row items-center">
      <TouchableOpacity
        onPress={handleLogout}
        className={`${isRTL ? "mr-2 ml-4" : "ml-2 mr-4"} p-2`}
      >
        <Ionicons
          name="log-out-outline"
          size={24}
          color={colors.primary}
          style={{ transform: [{ scaleX: -1 }] }}
        />
      </TouchableOpacity>
    </View>
  );
};
