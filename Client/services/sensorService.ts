// services/sensorService.ts (client)
import { SensorData, AnxietyAnalysis, SensorConfig } from '@/types/sensorTypes';

class SensorService {
  private ws: WebSocket | null = null;
  private dataListeners: ((data: { sensorData: SensorData; analysis: AnxietyAnalysis }) => void)[] = [];
  private shouldReconnect: boolean = false;
  private readonly BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:3000';
  private readonly WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000';

  private connectWebSocket(userId: string) {
    if (!this.shouldReconnect) {
      console.log('[SensorService] Skipping WebSocket connection - monitoring stopped');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[SensorService] WebSocket already connected');
      return;
    }

    console.log('[SensorService] Connecting to WebSocket:', this.WS_URL);
    this.ws = new WebSocket(this.WS_URL);

    this.ws.onopen = () => {
      console.log('[SensorService] WebSocket connected, registering user:', userId);
      this.ws?.send(JSON.stringify({ type: 'register', userId }));
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connection') {
          console.log('[SensorService] Connection acknowledged:', data);
        } else if (data.type === 'sensorUpdate') {
          this.dataListeners.forEach(listener => listener(data.data));
        } else {
          console.log('[SensorService] Received unknown message type:', data.type);
        }
      } catch (error) {
        console.error('[SensorService] Error processing message:', error);
        console.log('[SensorService] Raw message:', event.data);
      }
    };

    this.ws.onclose = (event) => {
      console.log('[SensorService] WebSocket closed:', event.code, event.reason);
      this.ws = null;
    };

    this.ws.onerror = (error) => {
      console.error('[SensorService] WebSocket error:', error);
    };
  }

  public async startSensorSimulation(userId: string, config: SensorConfig) {
    try {
      console.log('[SensorService] Starting simulation for user:', userId);
      console.log('[SensorService] Server URL:', this.BASE_URL);
      
      const response = await fetch(`${this.BASE_URL}/api/sensors/sensor/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...config, userId }),
      });

      console.log('[SensorService] Start response status:', response.status);
      const data = await response.json();
      console.log('[SensorService] Start response data:', data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.shouldReconnect = true;
      this.connectWebSocket(userId);

      return data;
    } catch (error) {
      console.error('[SensorService] Start error:', error);
      throw error;
    }
  }

  public async stopSensorSimulation(userId: string) {
    try {
      console.log('[SensorService] Stopping simulation for user:', userId);
      
      this.shouldReconnect = false;
      
      if (this.ws) {
        console.log('[SensorService] Closing WebSocket');
        this.ws.close();
        this.ws = null;
      }

      const response = await fetch(`${this.BASE_URL}/api/sensors/sensor/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      console.log('[SensorService] Stop response status:', response.status);
      const data = await response.json();
      console.log('[SensorService] Stop response data:', data);

      this.dataListeners = [];

      return data;
    } catch (error) {
      console.error('[SensorService] Stop error:', error);
      throw error;
    }
  }

  public subscribeToSensorData(callback: (data: { sensorData: SensorData; analysis: AnxietyAnalysis }) => void) {
    console.log('[SensorService] Adding new data listener');
    this.dataListeners.push(callback);

    return () => {
      console.log('[SensorService] Removing data listener');
      this.dataListeners = this.dataListeners.filter(listener => listener !== callback);
    };
  }
}

export const sensorService = new SensorService();