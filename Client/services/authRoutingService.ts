// services/authRoutingService.ts
import { router } from 'expo-router';
import { auth } from '@/services/firebaseConfig';
import { userService } from '@/services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authManager } from './authManager';

export class AuthRoutingService {
  static async handleAuthRouting() {
    const lockAcquired = await authManager.acquireNavigationLock();
    if (!lockAcquired) {
      console.log('Navigation already in progress, skipping');
      return;
    }

    try {
      const navigationPromise = (async () => {
        try {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            console.log('No authenticated user');
            await AsyncStorage.removeItem('userToken');
            router.replace('/(auth)/sign-in');
            return;
          }

          console.log('Fetching user data for:', currentUser.uid);
          
          try {
            const userData = await userService.getUserById(currentUser.uid);
            console.log('User data from DB:', userData);
            
            if (userData?.userType) {
              switch (userData.userType) {
                case 'patient':
                  console.log('Routing patient to home');
                  router.replace('/(patient)/home');
                  break;
                case 'therapist':
                  console.log('Routing therapist to home');
                  router.replace('/(therapist)/home');
                  break;
                default:
                  console.log('Invalid user type, routing to initial settings');
                  router.replace('/(auth)/initialUserSettings');
              }
            } else {
              console.log('User not found in database or missing user type');
              router.replace('/(auth)/initialUserSettings');
            }
          } catch (error) {
            if (error instanceof Error && 
                (error.message.includes('User does not exist') || 
                 error.message.includes('not found'))) {
              console.log('User exists in Firebase but not in DB, routing to initial settings');
              router.replace('/(auth)/initialUserSettings');
              return;
            }
            throw error;
          }
        } finally {
          authManager.releaseNavigationLock();
        }
      })();

      // Set the active navigation promise
      authManager.setActiveNavigation(navigationPromise);
      await navigationPromise;

    } catch (error) {
      console.error('Error in auth routing:', error);
      await auth.signOut();
      await AsyncStorage.removeItem('userToken');
      router.replace('/(auth)/sign-in');
      authManager.releaseNavigationLock();
    }
  }

  static async handleNewUserRouting(userId: string) {
    try {
      try {
        const userData = await userService.getUserById(userId);
        
        if (userData?.userType) {
          switch (userData.userType) {
            case 'patient':
              router.replace('/(patient)/home');
              break;
            case 'therapist':
              router.replace('/(therapist)/home');
              break;
            default:
              router.replace('/(auth)/initialUserSettings');
          }
        } else {
          console.log('New user or missing user type, routing to initial settings');
          router.replace('/(auth)/initialUserSettings');
        }
      } catch (error) {
        if (error instanceof Error && 
            (error.message.includes('User does not exist') || 
             error.message.includes('not found'))) {
          console.log('New user not in DB, routing to initial settings');
          router.replace('/(auth)/initialUserSettings');
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error in new user routing:', error);
      router.replace('/(auth)/initialUserSettings');
    }
  }
}