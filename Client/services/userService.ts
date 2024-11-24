import { RegistrationData } from '@/types/onboarding';
import ENV from '@/env';

class UserService {
  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      
      // If response is not ok, throw error with more details
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const response = await this.fetchWithTimeout(
        `${ENV.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return data.user; // This will be null if user doesn't exist
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        // User not found - return null instead of throwing
        return null;
      }
      // For other errors, throw with more context
      throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async registerUser(userData: RegistrationData) {
    try {
      const response = await this.fetchWithTimeout(
        `${ENV.EXPO_PUBLIC_SERVER_URL}/api/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const userService = new UserService();