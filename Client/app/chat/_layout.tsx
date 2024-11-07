// app/chat/layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import ChatHeader from '@/components/chat/ChatHeader';
import { ChatContextProvider, useChatContext } from '@/context/ChatContext';

// Create a wrapper component for the header to access chat context
const HeaderWrapper = () => {
  const { isTyping } = useChatContext();
  const { toggleTheme } = useTheme();
  
  return <ChatHeader isTyping={isTyping} toggleTheme={toggleTheme} />;
};

const ChatLayoutInner = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <Stack
      screenOptions={{
        header: () => <HeaderWrapper />,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShadowVisible: false
        }}
      />
    </Stack>
  );
};

// Wrap the layout with context provider
export default function ChatLayout() {
  return (
    <ChatContextProvider>
      <ChatLayoutInner />
    </ChatContextProvider>
  );
}