import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { HeaderLeft, HeaderRight } from '@/components/navigation/HeaderButtons';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import { Platform, StyleSheet, I18nManager } from 'react-native';

export default function TabLayout() {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = theme[currentTheme];

  return (
    <Tabs
      screenOptions={{
        headerLeft: HeaderLeft,
        headerRight: HeaderRight,
        headerStyle: {
          backgroundColor: colors.header,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 17,
          color: colors.text,
          textAlign: isRTL ? 'right' : 'left',
        },
        tabBarStyle: {
          backgroundColor: colors.bottomBar,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -1,
              },
              shadowOpacity: 0.1,
              shadowRadius: 1,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
          textAlign: isRTL ? 'right' : 'left',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t.tabsPatient.home,
          headerTitle: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? 'home' : 'home-outline'} 
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabsPatient.profile,
          headerTitle: "",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon 
              name={focused ? 'code-slash' : 'code-slash-outline'} 
              color={color}
              size={24} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: Platform.OS === 'android' ? 8 : 0,
  },
});