import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import ChatHeader from '@/components/chat/ChatHeader';
import { ChatContextProvider, useChatContext } from '@/context/ChatContext';

const HeaderWrapper = () => {
  const { isTyping } = useChatContext();
  const { theme: currentTheme, toggleTheme } = useTheme();
  return <ChatHeader isTyping={isTyping} toggleTheme={toggleTheme} />;
};

function ChatLayoutInner() {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <Stack
      screenOptions={{
        header: () => <HeaderWrapper />,
        headerStyle: {
          backgroundColor: colors.header,
        },
        headerTintColor: colors.text,
        animation: 'slide_from_right',
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      />
    </Stack>
  );
}

export default function ChatLayout() {
  return (
    <ChatContextProvider>
      <ChatLayoutInner />
    </ChatContextProvider>
  );
}