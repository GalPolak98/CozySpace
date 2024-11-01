import { Tabs, router } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '@/Services/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Separate component for the header right buttons
const HeaderRight = () => {
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

export default function TabLayout() {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <Tabs
      screenOptions={{
        headerLeft: () => <ThemeToggle />,
        headerRight:() => <HeaderRight />,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}