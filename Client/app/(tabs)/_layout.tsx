import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { HeaderLeft, HeaderRight } from '@/components/navigation/HeaderButtons';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

export default function TabLayout() {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <Tabs
      screenOptions={{
        headerLeft: HeaderLeft,
        headerRight: HeaderRight,
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