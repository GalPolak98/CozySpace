import { RegistrationData } from '@/types/onboarding';

class UserService {
  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 30000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      
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
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return data.user; 
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        
        return null;
      }
      throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async registerUser(userData: RegistrationData) {
    try {
      const response = await this.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/register`,
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

  async getUserGender(userId: string): Promise<string | null> {
    try {
      const response = await this.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return data.profile?.personalInfo?.gender || null;
    } catch (error) {
      console.error('Error fetching user gender:', error);
      throw new Error(`Failed to fetch user gender: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserProfile(userId: string) {
    try {
      const response = await this.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return data.profile || null;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateUserPreferences(userId: string, preferences: {
    therapistInfo: {
      selectedTherapistId: string | null;
      dataSharing: {
        anxietyTracking: boolean;
        personalDocumentation: boolean;
      };
    };
    toolsPreferences: {
      smartJewelry: {
        enabled: boolean;
        vibrationAlerts: boolean;
      };
      musicTherapy: {
        enabled: boolean;
        selectedTrackId: string | null;
      };
    };
  }) {
    try {
      const response = await this.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/preferences`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferences),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update preferences');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update preferences: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async saveBreathingSession(userId: string, sessionData: {
    timestamp: string;
    durationSec: number;
    patternType: string;
    completed: boolean;
  }) {
    try {
      const response = await this.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/breathingSessions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionData),
        }
      );
  
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to save breathing session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getBreathingSession(userId: string) {
    try {
      const response = await this.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/breathingSessions`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response && response.json) {
        const data = await response.json();

  
        const fetchedBreathingSessions = Array.isArray(data.sessions) ? data.sessions : [];
  
  
        return fetchedBreathingSessions;
      } else {
        console.error('Response does not have json method:', response);
        throw new Error('Invalid response format: missing json method');
      }
  
    } catch (error) {
      throw new Error(`Failed to get breathing sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  async saveDassResponse(userId: string, responseData: {
    timestamp: string;
    answers: Array<{ questionId: number; score: number }>;
    totalScore: number;
   }) {
    try {
      const response = await this.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/dass`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(responseData),
        }
      );
   
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to save DASS response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
   }
   
   async getDassResponses(userId: string) {
    try {
      const response = await this.fetchWithTimeout(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/dass`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const data = await response.json();
      console.log('DASS Response data:', data); 
      return data; 
    } catch (error) {
      console.error('Failed to get DASS responses:', error);
      throw error;
    }
  }
}

export const userService = new UserService();