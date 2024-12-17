import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { HeaderLeft, HeaderRight } from '@/components/navigation/HeaderButtons';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = theme[currentTheme];

  interface Tab {
    name: string;
    title: string;
    iconName: 'home' | 'code-slash' | 'analytics' | 'information'; // Only include valid icon names
   }
   
   const tabs: Tab[] = [
    {
      name: 'home',
      title: t.tabsPatient.home,
      iconName: 'home',
    },
    {
      name: 'profile', 
      title: t.tabsPatient.profile,
      iconName: 'code-slash',
    },
    {
      name: 'reports', 
      title: t.tabsPatient.reports,  
      iconName: 'analytics', 
    },
    {
      name: 'information', 
      title: t.tabsPatient.information,  
      iconName: 'information', 
    }
   ];

  const orderedTabs = isRTL ? [...tabs].reverse() : tabs;

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
              shadowOffset: { width: 0, height: -1 },
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
      {orderedTabs.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerTitle: "",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon 
              name={focused ? tab.iconName : `${tab.iconName}-outline`}
              color={color}
                size={24}
              />
            ),
          }}
        />
      ))}
    </Tabs>
    
  );
}