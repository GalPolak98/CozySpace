import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import ThemeToggle from '@/components/ThemeToggle';
import { auth } from '@/services/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authManager } from '@/services/authManager';

export const HeaderRight = () => <ThemeToggle />;

export const HeaderLeft = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              authManager.cleanup();
              await auth.signOut();
              await AsyncStorage.removeItem('userToken');
              router.replace('/(auth)/sign-in');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-row items-center">
      <TouchableOpacity
        onPress={handleLogout}
        className="ml-2 mr-4 p-2"
      >
        <Ionicons
          name="log-out-outline"
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};