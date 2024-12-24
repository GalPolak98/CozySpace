class FeaturesService {
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
  
    async getFeatures() {
      try {
        const response = await this.fetchWithTimeout(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/features`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        return await response.json();
      } catch (error) {
        throw new Error(`Failed to fetch features: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    async updateFeatures(features: Partial<{
      chat: boolean;
      guidedNote: boolean;
      directNote: boolean;
      breathingExercises: boolean;
      anxietyDataViewer: boolean;
    }>) {
      try {
        const response = await this.fetchWithTimeout(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/api/features`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(features),
          }
        );
  
        return await response.json();
      } catch (error) {
        throw new Error(`Failed to update features: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  export const featuresService = new FeaturesService();