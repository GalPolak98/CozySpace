import React from 'react';
import { ScrollView, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import RecordingsSection from '../recording';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/components/ThemeContext';

type RouteType = '/chat' | '/guidedNote' | '/directNote';

const HomePatient = () => {
  const router = useRouter();
  const { isRTL, t } = useLanguage();
  const { theme: currentTheme } = useTheme();

  const menuItems: Array<{
    title: string;
    icon: React.ReactNode;
    route: RouteType;
  }> = [
    {
      title: t.homePatient.talkToAI,
      icon: <MaterialIcons name="chat" size={24} color={currentTheme === 'light' ? '#000000' : '#FFFFFF'} />,
      route: '/chat',
    },
    {
      title: t.homePatient.guidedDocumenting,
      icon: <MaterialIcons name="description" size={24} color={currentTheme === 'light' ? '#000000' : '#FFFFFF'} />,
      route: '/guidedNote',
    },
    {
      title: t.homePatient.documentNow,
      icon: <MaterialIcons name="edit" size={24} color={currentTheme === 'light' ? '#000000' : '#FFFFFF'} />,
      route: '/directNote',
    },
  ];

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        <View className="items-center mb-8">
          {/* <Image 
            source={require('@/assets/logo.png')}
            className="w-24 h-24 mb-4"
          /> */}
          <ThemedText 
            className="font-psemibold text-2xl text-center mt-4"
            isRTL={isRTL}
          >
            {t.common.welcome}
          </ThemedText>
        </View>

        <View className="space-y-4 mt-4">
          {menuItems.map((item, index) => (
            <CustomButton
              key={index}
              title={item.title}
              handlePress={() => router.push(item.route)}
              containerStyles="px-6 mb-4"
              icon={item.icon}
              iconPosition={isRTL ? 'right' : 'left'}
              variant="primary"
              isLoading={false}
              isRTL={isRTL}
            />
          ))}
        </View>

        <View className="mt-8">
          <RecordingsSection />
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default HomePatient;