import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import RecordingsSection from '../recording';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/components/ThemeContext';
import * as Location from 'expo-location';
import useAuth from '@/hooks/useAuth';
import { useUserFullName } from '@/hooks/useUserFullName';
import { userService } from '@/services/userService';
import Loader from '@/components/Loader';

type RouteType = '/chat' | '/guidedNote' | '/directNote';

const HomePatient = () => {
  const router = useRouter();
  const { isRTL, t, getGenderedText } = useLanguage();
  const { theme: currentTheme } = useTheme();
  const [locationPermission, setLocationPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userGender, setUserGender] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const userId = useAuth();
  const { fullName, loading: nameLoading } = useUserFullName(userId);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await requestLocationPermission();
        if (userId) {
          const gender = await userService.getUserGender(userId as string);
          setUserGender(gender as string);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        Alert.alert(t.errors.error, t.errors.unexpected);
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeData();
  }, [userId]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert(t.errors.error, t.location.errorMessage);
    }
  };

  const handleNavigation = async (route: RouteType) => {
    if (!userGender) {
      Alert.alert(t.errors.error, t.errors.unexpected);
      return;
    }

    setIsLoading(true);
    try {
      switch (route) {
        case '/chat':
          router.push({ pathname: '/chat', params: { gender: userGender } });
          break;
        case '/guidedNote':
          router.push({ pathname: '/guidedNote', params: { gender: userGender } });
          break;
        case '/directNote':
          router.push({ pathname: '/directNote', params: { gender: userGender } });
          break;
      }
    } catch (error) {
      Alert.alert(t.errors.error, t.errors.unexpected);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      title: t.homePatient.talkToAI,
      icon: <MaterialIcons name="chat" size={24} color={currentTheme === 'light' ? '#000000' : '#FFFFFF'} />,
      route: '/chat' as RouteType,
    },
    {
      title: t.homePatient.guidedDocumenting,
      icon: <MaterialIcons name="description" size={24} color={currentTheme === 'light' ? '#000000' : '#FFFFFF'} />,
      route: '/guidedNote' as RouteType,
    },
    {
      title: t.homePatient.documentNow,
      icon: <MaterialIcons name="edit" size={24} color={currentTheme === 'light' ? '#000000' : '#FFFFFF'} />,
      route: '/directNote' as RouteType,
    },
  ];

  if (isInitialLoading || nameLoading || !userGender) {
    return <Loader isLoading={true} />;
  }

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        <View className="items-center mb-8">
          <ThemedText className="font-psemibold text-2xl text-center mt-4" isRTL={isRTL}>
            {getGenderedText(t.common.welcome, userGender)}, {fullName}
          </ThemedText>
        </View>

        <View className="space-y-4 mt-4">
          {menuItems.map((item, index) => (
            <CustomButton
              key={index}
              title={item.title}
              handlePress={() => handleNavigation(item.route)}
              containerStyles="px-6 mb-4"
              icon={item.icon}
              iconPosition={isRTL ? 'right' : 'left'}
              variant="primary"
              isLoading={isLoading}
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