// services/websocketManager.ts
import { EventEmitter } from 'events';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { AppState, AppStateStatus } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const WEBSOCKET_TASK = 'WEBSOCKET_BACKGROUND_TASK';
const RECONNECT_INTERVAL = 30000; // 30 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

interface WebSocketState {
  ws: WebSocket | null;
  isConnecting: boolean;
  reconnectAttempts: number;
  lastPingTime: number;
  lastConnectionAttempt?: number;
  lastDisconnectTime?: number;
  isReconnecting: boolean;
}

class WebSocketManager extends EventEmitter {
  private static instance: WebSocketManager;
  private wsStates: Map<string, WebSocketState>;
  private isNetworkAvailable: boolean;
  private backgroundTaskRegistered: boolean;
  private readonly wsUrl: string;

  private constructor() {
    super();
    this.wsStates = new Map();
    this.isNetworkAvailable = true;
    this.backgroundTaskRegistered = false;
    this.wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000';
    
    this.setupNetworkListener();
    this.setupAppStateListener();
  }

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private setupNetworkListener(): void {
    NetInfo.addEventListener(state => {
      this.isNetworkAvailable = !!state.isConnected && !!state.isInternetReachable;
      if (this.isNetworkAvailable) {
        this.reconnectAll();
      }
    });
  }

  private setupAppStateListener(): void {
    AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        this.reconnectAll();
      }
    });
  }

  public async setupBackgroundTask(): Promise<void> {
    if (this.backgroundTaskRegistered) return;

    try {
      TaskManager.defineTask(WEBSOCKET_TASK, async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (userId && !this.isConnected(userId)) {
            await this.connect(userId);
          }
          return BackgroundFetch.BackgroundFetchResult.NewData;
        } catch (error) {
          console.error('[WebSocketManager] Background task error:', error);
          return BackgroundFetch.BackgroundFetchResult.Failed;
        }
      });

      await BackgroundFetch.registerTaskAsync(WEBSOCKET_TASK, {
        minimumInterval: 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });

      this.backgroundTaskRegistered = true;
    } catch (error) {
      console.error('[WebSocketManager] Failed to register background task:', error);
      throw error;
    }
  }

  private getState(userId: string): WebSocketState {
    let state = this.wsStates.get(userId);
    if (!state) {
      state = {
        ws: null,
        isConnecting: false,
        reconnectAttempts: 0,
        lastPingTime: Date.now(),
        lastConnectionAttempt: undefined,
        lastDisconnectTime: undefined,
        isReconnecting: false
      };
      this.wsStates.set(userId, state);
    }
    return state;
  }

  public async connect(userId: string): Promise<void> {
    const state = this.getState(userId);

    if (state.isConnecting || state.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    if (state.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log(`[WebSocketManager] Max reconnection attempts reached for user: ${userId}`);
      this.emit('error', new Error('Max reconnection attempts reached'));
      return;
    }

    state.isConnecting = true;

    try {
      const ws = new WebSocket(this.wsUrl);

      ws.onopen = () => {
        console.log(`[WebSocketManager] Connected for user: ${userId}`);
        state.isConnecting = false;
        state.reconnectAttempts = 0;
        state.lastPingTime = Date.now();
        this.emit('connected');

        // Register user
        ws.send(JSON.stringify({
          type: 'register',
          userId
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data, userId);
        } catch (error) {
          console.error('[WebSocketManager] Message parsing error:', error);
        }
      };

      ws.onclose = (event) => {
        console.log(`[WebSocketManager] Disconnected for user: ${userId}`, event.code, event.reason);
        state.ws = null;
        state.isConnecting = false;
        state.lastDisconnectTime = Date.now();
        
        // Don't increment reconnect attempts for normal closures
        if (event.code !== 1000) {
          state.reconnectAttempts++;
        }
        
        this.emit('disconnected');
        
        // Start reconnection process if not a normal closure
        if (event.code !== 1000 && this.isNetworkAvailable && !state.isReconnecting) {
          state.isReconnecting = true;
          
          const reconnect = async () => {
            try {
              await this.connect(userId);
              state.isReconnecting = false;
            } catch (error) {
              console.error(`[WebSocketManager] Reconnection failed for user: ${userId}`, error);
              
              // Schedule next reconnection attempt
              if (this.isNetworkAvailable && !state.ws) {
                setTimeout(reconnect, RECONNECT_INTERVAL);
              } else {
                state.isReconnecting = false;
              }
            }
          };
          
          setTimeout(reconnect, RECONNECT_INTERVAL);
        }
      };

      ws.onerror = (error) => {
        console.error(`[WebSocketManager] Error for user: ${userId}:`, error);
        this.emit('error', error);
      };

      state.ws = ws;
      this.wsStates.set(userId, state);

    } catch (error) {
      state.isConnecting = false;
      state.reconnectAttempts++;
      console.error('[WebSocketManager] Connection error:', error);
      this.emit('error', error);
      
      if (this.isNetworkAvailable) {
        setTimeout(() => this.connect(userId), RECONNECT_INTERVAL);
      }
    }
  }

  private handleMessage(data: any, userId: string): void {
    switch (data.type) {
      case 'sensorUpdate':
        this.emit('sensorData', data.data);
        break;
      case 'simulationStatus':
        this.emit('simulationStatus', {
          userId: data.userId,
          isActive: data.isActive
        });
        break;
      default:
        console.log('[WebSocketManager] Unknown message type:', data.type);
    }
  }

  public isConnected(userId: string): boolean {
    const state = this.wsStates.get(userId);
    return state?.ws?.readyState === WebSocket.OPEN;
  }

  private async reconnectAll(): Promise<void> {
    for (const [userId, state] of this.wsStates.entries()) {
      if (!state.ws || state.ws.readyState !== WebSocket.OPEN) {
        await this.connect(userId);
      }
    }
  }

  public async disconnect(userId: string): Promise<void> {
    console.log(`[WebSocketManager] Disconnecting user: ${userId}`);
    const state = this.wsStates.get(userId);
    
    if (state) {
      if (state.ws?.readyState === WebSocket.OPEN) {
        state.ws.close(1000, 'User logout');
      }
      this.wsStates.delete(userId);
      
      // Remove specific listeners for this user
      this.removeAllListeners(`sensorData_${userId}`);
      this.removeAllListeners(`error_${userId}`);
      this.removeAllListeners(`connected_${userId}`);
      this.removeAllListeners(`disconnected_${userId}`);
    }
  }

  public async cleanup(isTemporary = false): Promise<void> {
    if (!isTemporary) {
      console.log('[WebSocketManager] Performing full cleanup');
      
      // Close all connections
      for (const [userId, state] of this.wsStates.entries()) {
        await this.disconnect(userId);
      }
      
      if (this.backgroundTaskRegistered) {
        try {
          await BackgroundFetch.unregisterTaskAsync(WEBSOCKET_TASK);
          this.backgroundTaskRegistered = false;
        } catch (error) {
          console.error('[WebSocketManager] Failed to unregister background task:', error);
        }
      }

      await AsyncStorage.removeItem('userId');
      this.removeAllListeners();
    }
  }
}

export const websocketManager = WebSocketManager.getInstance();