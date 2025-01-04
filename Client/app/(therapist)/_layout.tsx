import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import { HeaderLeft, HeaderRight } from '@/components/navigation/HeaderButtons';
import { useLanguage } from '@/context/LanguageContext';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TherapistLayout() {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const { t, isRTL } = useLanguage();

  interface Tab {
    name: string;
    title: string;
    iconName: 'home'; 
   }
   
   const tabs: Tab[] = [
    {
      name: 'home',
      title: t.tabsPatient.home,
      iconName: 'home',
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