// services/websocketService.ts
import { EventEmitter } from 'events';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const WEBSOCKET_TASK = 'WEBSOCKET_BACKGROUND_TASK';

class WebSocketService extends EventEmitter {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private userId: string | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private isConnecting = false;
  private backgroundTaskRegistered = false;

  private constructor() {
    super();
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public async setupBackgroundTask(): Promise<void> {
    if (this.backgroundTaskRegistered) {
      console.log('[WebSocketService] Background task already registered');
      return;
    }

    try {
      // Define the background task
      TaskManager.defineTask(WEBSOCKET_TASK, async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (userId && !this.isConnected()) {
            await this.connect();
          }
          return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (error) {
          console.error('[WebSocketService] Background task error:', error);
          return BackgroundFetch.BackgroundFetchResult.Failed;
        }
      });

      await BackgroundFetch.registerTaskAsync(WEBSOCKET_TASK, {
        minimumInterval: 60, // Minimum 60 second interval
        stopOnTerminate: false,
        startOnBoot: true,
      });

      this.backgroundTaskRegistered = true;
      console.log('[WebSocketService] Background task registered successfully');
    } catch (error) {
      console.error('[WebSocketService] Failed to register background task:', error);
      throw error;
    }
  }

  public async initialize(userId: string): Promise<void> {
    console.log('[WebSocketService] Initializing for user:', userId);
    this.userId = userId;
    await AsyncStorage.setItem('userId', userId);
    await this.connect();
    
    try {
      await this.setupBackgroundTask();
    } catch (error) {
      console.error('[WebSocketService] Background task setup failed:', error);
      // Continue even if background task setup fails
    }
  }

  private async connect(): Promise<void> {
    if (this.isConnecting || (this.ws?.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    console.log('[WebSocketService] Connecting...');

    try {
      this.ws = new WebSocket(process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000');

      this.ws.onopen = () => {
        console.log('[WebSocketService] Connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected');

        if (this.userId) {
          console.log('[WebSocketService] Registering user:', this.userId);
          this.ws?.send(JSON.stringify({
            type: 'register',
            userId: this.userId
          }));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[WebSocketService] Received message:', data);
          switch (data.type) {
            case 'connection':
              console.log('[WebSocketService] Connection acknowledged');
              break;
            case 'sensorUpdate':
              this.emit('sensorData', {
                sensorData: data.data.sensorData,
                analysis: data.data.analysis,
                userId: data.data.userId
              });
              break;
            case 'simulationStatus':
              this.emit('simulationStatus', {
                userId: data.userId,
                isActive: data.isActive
              });
              break;
            default:
              console.log('[WebSocketService] Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('[WebSocketService] Error processing message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('[WebSocketService] Connection closed:', event.code, event.reason);
        this.isConnecting = false;
        this.ws = null;
        this.emit('disconnected');
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocketService] Connection error:', error);
        this.emit('error', error);
      };

    } catch (error) {
      console.error('[WebSocketService] Setup error:', error);
      this.isConnecting = false;
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    console.log(`[WebSocketService] Scheduling reconnect in ${delay}ms`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public async cleanup(): Promise<void> {
    console.log('[WebSocketService] Cleaning up');
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close(1000, 'Client cleanup');
      }
      this.ws = null;
    }

    this.userId = null;
    this.reconnectAttempts = 0;
    this.isConnecting = false;

    try {
      if (this.backgroundTaskRegistered) {
        await BackgroundFetch.unregisterTaskAsync(WEBSOCKET_TASK);
        this.backgroundTaskRegistered = false;
      }
    } catch (error) {
      console.error('[WebSocketService] Failed to unregister background task:', error);
    }

    await AsyncStorage.removeItem('userId');
    this.removeAllListeners();
  }
}

export const websocketService = WebSocketService.getInstance();