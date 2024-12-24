import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { HeaderLeft, HeaderRight } from "@/components/navigation/HeaderButtons";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { theme } from "@/styles/Theme";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

export default function AdminLayout() {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  interface Tab {
    name: string;
    title: string;
    iconName: IconName;
  }

  const tabs: Tab[] = [
    {
      name: "patients",
      title: "Patients",
      iconName: "people",
    },
    {
      name: "features",
      title: "Features",
      iconName: "grid",
    },
  ];

  const orderedTabs = tabs;

  return (
    <Tabs
      screenOptions={{
        headerLeft: HeaderLeft,
        headerStyle: {
          backgroundColor: colors.header,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 17,
          color: colors.text,
        },
        tabBarStyle: {
          backgroundColor: colors.bottomBar,
          borderTopColor: colors.border,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
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
          fontFamily: "Poppins-Medium",
          fontSize: 12,
        },
      }}
    >
      {orderedTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerTitle: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={
                  focused
                    ? tab.iconName
                    : (`${tab.iconName}-outline` as IconName)
                }
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
