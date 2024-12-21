// sensorService.ts
import { SensorData, AnxietyAnalysis, SensorConfig } from '@/types/sensorTypes';

interface Connection {
  ws: WebSocket | null;  // Allow null for WebSocket
  dataListeners: ((data: { sensorData: SensorData; analysis: AnxietyAnalysis }) => void)[];
  shouldReconnect: boolean;
  onSimulationStop?: () => void;
}

class SensorService {
  private connections: Map<string, Connection> = new Map();
  private readonly BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:3000';
  private readonly WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000';

  private connectWebSocket(userId: string) {
    const connection = this.connections.get(userId);
    
    if (!connection) {
      console.log('[SensorService] No connection found for user:', userId);
      return;
    }

    if (!connection.shouldReconnect) {
      console.log('[SensorService] Skipping WebSocket connection - monitoring stopped for user:', userId);
      return;
    }

    if (connection.ws?.readyState === WebSocket.OPEN) {
      console.log('[SensorService] WebSocket already connected for user:', userId);
      return;
    }

    console.log('[SensorService] Connecting to WebSocket for user:', userId);
    const ws = new WebSocket(this.WS_URL);

    ws.onopen = () => {
      console.log('[SensorService] WebSocket connected, registering user:', userId);
      ws.send(JSON.stringify({ type: 'register', userId }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connection') {
          console.log('[SensorService] Connection acknowledged for user:', userId, data);
        } else if (data.type === 'sensorUpdate') {
          // Only notify listeners for this specific user
          const currentConnection = this.connections.get(userId);
          currentConnection?.dataListeners.forEach(listener => listener(data.data));
        } else {
          console.log('[SensorService] Received unknown message type:', data.type);
        }
      } catch (error) {
        console.error('[SensorService] Error processing message:', error);
        console.log('[SensorService] Raw message:', event.data);
      }
    };

    ws.onclose = (event) => {
      console.log('[SensorService] WebSocket closed for user:', userId, event.code, event.reason);
      const currentConnection = this.connections.get(userId);
      if (currentConnection) {
        currentConnection.ws = null;
        if (currentConnection.shouldReconnect) {
          setTimeout(() => this.connectWebSocket(userId), 5000);
        }
      }
    };

    ws.onerror = (error) => {
      console.error('[SensorService] WebSocket error for user:', userId, error);
    };

    // Update the connection with the new WebSocket
    this.connections.set(userId, {
      ...connection,
      ws
    });
  }

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

      const data = await response.json();
      return data;
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[SensorService] Stop error:', error);
    throw error;
  }
}

  public subscribeToSensorData(
    userId: string,
    callback: (data: { sensorData: SensorData; analysis: AnxietyAnalysis }) => void
  ) {
    console.log('[SensorService] Adding new data listener for user:', userId);
    
    let connection = this.connections.get(userId);
    if (!connection) {
      connection = {
        ws: null,
        dataListeners: [],
        shouldReconnect: false
      };
      this.connections.set(userId, connection);
    }

    connection.dataListeners.push(callback);

    return () => {
      console.log('[SensorService] Removing data listener for user:', userId);
      const currentConnection = this.connections.get(userId);
      if (currentConnection) {
        currentConnection.dataListeners = currentConnection.dataListeners.filter(
          listener => listener !== callback
        );
      }
    };
  }
}

export const sensorService = new SensorService();