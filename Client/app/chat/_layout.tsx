import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

export default function ChatLayout() {
  const { theme: currentTheme, toggleTheme } = useTheme();
  const router = useRouter();
  const colors = theme[currentTheme];

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
        headerLeft: () => (
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="px-2 py-1"
            >
              <Ionicons 
                name="chevron-back" 
                size={28} 
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={toggleTheme}
            className="px-4 py-2"
          >
            <Ionicons
              name={currentTheme === 'light' ? 'moon-outline' : 'sunny-outline'}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'AI Therapy Chat',
          headerShadowVisible: false
        }}
      />
    </Stack>
  );
}