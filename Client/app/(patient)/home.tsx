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

type RouteType = '/chat' | '/guidedNote' | '/directNote';

const HomePatient = () => {
 const router = useRouter();
 const { isRTL, t } = useLanguage();
 const { theme: currentTheme } = useTheme();
 const [locationPermission, setLocationPermission] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const userId = useAuth();
 const { fullName, loading: nameLoading } = useUserFullName(userId);

 useEffect(() => {
   requestLocationPermission();
 }, []);

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
   if (route === '/chat') {
     setIsLoading(true);
     try {
       const gender = await userService.getUserGender(userId as string);
       router.push({ pathname: '/chat', params: { gender } });
     } catch (error) {
       Alert.alert(t.errors.error, t.errors.error);
     } finally {
       setIsLoading(false);
     }
   } else {
     router.push(route);
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

 return (
   <ThemedView className="flex-1">
     <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
       <View className="items-center mb-8">
         {nameLoading ? (
           <ActivityIndicator size="small" color={currentTheme === 'light' ? '#000000' : '#FFFFFF'} />
         ) : (
           <ThemedText className="font-psemibold text-2xl text-center mt-4" isRTL={isRTL}>
             {t.common.welcome}, {fullName}
           </ThemedText>
         )}
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
             isLoading={item.route === '/chat' && isLoading}
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