// services/authRoutingService.ts
import { router } from 'expo-router';
import { auth } from '@/Services/firebaseConfig';
import { userService } from '@/Services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthRoutingService {
  static async handleAuthRouting() {
    try {
      // First check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.log('No authenticated user');
        await AsyncStorage.removeItem('userToken');
        router.replace('/(auth)/sign-in');
        return;
      }

      console.log('Fetching user data for:', currentUser.uid);
      
      try {
        // Get user data from database
        const userData = await userService.getUserById(currentUser.uid);
        console.log('User data from DB:', userData);
        
        // If user exists and has userType, route accordingly
        if (userData?.userType) {
          switch (userData.userType) {
            case 'patient':
              console.log('Routing patient to home');
              router.replace('/(tabs)/home');
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
          // User doesn't exist in DB or has no userType
          console.log('User not found in database or missing user type');
          router.replace('/(auth)/initialUserSettings');
        }
      } catch (error) {
        // If error contains "User does not exist", route to initial settings
        if (error instanceof Error && 
            (error.message.includes('User does not exist') || 
             error.message.includes('not found'))) {
          console.log('User exists in Firebase but not in DB, routing to initial settings');
          router.replace('/(auth)/initialUserSettings');
          return;
        }
        // For other errors, throw them to be handled by outer catch
        throw error;
      }

    } catch (error) {
      console.error('Error in auth routing:', error);
      // For general errors, sign out and redirect to sign in
      await auth.signOut();
      await AsyncStorage.removeItem('userToken');
      router.replace('/(auth)/sign-in');
    }
  }

  static async handleNewUserRouting(userId: string) {
    try {
      try {
        const userData = await userService.getUserById(userId);
        
        if (userData?.userType) {
          switch (userData.userType) {
            case 'patient':
              router.replace('/(tabs)/home');
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