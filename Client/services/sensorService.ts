// services/sensorService.ts
import { SensorConfig, SensorData, AnxietyAnalysis } from '@/types/sensorTypes';
import { websocketManager } from './websocketManager';

class SensorService {
  private readonly BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:3000';

  public async startSensorSimulation(userId: string, config: SensorConfig) {
    try {
      console.log('[SensorService] Starting simulation for user:', userId);
      
      const response = await fetch(`${this.BASE_URL}/api/sensors/sensor/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...config, userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await websocketManager.connect(userId);
      return await response.json();
    } catch (error) {
      console.error('[SensorService] Start error:', error);
      throw error;
    }
  }

  public async stopSensorSimulation(userId: string) {
    try {
      console.log('[SensorService] Stopping simulation for user:', userId);
      
      const response = await fetch(`${this.BASE_URL}/api/sensors/sensor/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[SensorService] Stop error:', error);
      throw error;
    }
  }

  public subscribeToSensorData(
    userId: string,
    callback: (data: { sensorData: SensorData; analysis: AnxietyAnalysis }) => void
  ): () => void {
    console.log('[SensorService] Adding sensor data listener for user:', userId);

    // Use the websocketManager for data subscription
    websocketManager.on('sensorData', (data) => {
      if (data.userId === userId || data.sensorData.userId === userId) {
        callback(data);
      }
    });

    // Return cleanup function
    return () => {
      console.log('[SensorService] Removing sensor data listener for user:', userId);
      websocketManager.removeAllListeners('sensorData');
    };
  }
}

export const sensorService = new SensorService();