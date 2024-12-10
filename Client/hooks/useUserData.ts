import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '@/services/userService';

const STORAGE_KEYS = {
  USER_PROFILE: '@user_profile_'
};

interface UserData {
  gender: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;  
}

interface CachedProfile {
  gender: string | null;
  firstName: string | null;
  lastName: string | null;
  timestamp: number;
}

const formatFullName = (firstName: string | null, lastName: string | null): string => {
  if (!firstName && !lastName) return '';
  return [firstName, lastName].filter(Boolean).join(' ');
};

export const useUserData = (userId: string | null): UserData => {
  const [data, setData] = useState<Omit<UserData, 'refresh'>>({
    gender: null,
    firstName: null,
    lastName: null,
    fullName: '',
    isLoading: true,
    error: null
  });

  const fetchUserData = useCallback(async (skipCache: boolean = false) => {
    if (!userId) {
      setData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setData(prev => ({ ...prev, isLoading: true }));

      if (!skipCache) {
        const cachedProfileString = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE + userId);
        const cachedProfile: CachedProfile | null = cachedProfileString 
          ? JSON.parse(cachedProfileString)
          : null;

        const isCacheValid = cachedProfile && 
          (Date.now() - cachedProfile.timestamp < 24 * 60 * 60 * 1000);

        if (isCacheValid && cachedProfile.gender && (cachedProfile.firstName || cachedProfile.lastName)) {
          setData({
            gender: cachedProfile.gender,
            firstName: cachedProfile.firstName,
            lastName: cachedProfile.lastName,
            fullName: formatFullName(cachedProfile.firstName, cachedProfile.lastName),
            isLoading: false,
            error: null
          });
          return;
        }
      }

      const profile = await userService.getUserProfile(userId);
      
      if (profile && profile.personalInfo) {
        const { gender, firstName, lastName } = profile.personalInfo;
        
        const newData = {
          gender: gender || null,
          firstName: firstName || null,
          lastName: lastName || null,
          timestamp: Date.now()
        };

        if (newData.gender && (newData.firstName || newData.lastName)) {
          await AsyncStorage.setItem(
            STORAGE_KEYS.USER_PROFILE + userId,
            JSON.stringify(newData)
          );
        }

        setData({
          ...newData,
          fullName: formatFullName(newData.firstName, newData.lastName),
          isLoading: false,
          error: null
        });
      } else {
        throw new Error('Profile data is incomplete');
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    ...data,
    refresh: async () => fetchUserData(true) 
  };
};