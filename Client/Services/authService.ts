// services/authService.ts
import { auth } from '@/Services/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
  static async getCurrentUserId(): Promise<string> {
    try {
      // First try to get current user from Firebase
      if (auth.currentUser) {
        return auth.currentUser.uid;
      }

      // If no current user, check AsyncStorage for token
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No authenticated user');
      }

      // If we have a token but no current user, we need to wait for Firebase to initialize
      return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe(); // Stop listening after first response
          if (user) {
            resolve(user.uid);
          } else {
            reject(new Error('No authenticated user'));
          }
        });
      });
    } catch (error) {
      console.error('Error getting user ID:', error);
      throw error;
    }
  }

  static async getAuthToken(): Promise<string> {
    try {
      // First try to get token from Firebase
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken();
      }

      // If no current user, check AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('No auth token available');
      }

      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw error;
    }
  }
}