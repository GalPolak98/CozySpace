// services/websocketManager.ts
import { EventEmitter } from 'events';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { AppState, AppStateStatus } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const WEBSOCKET_TASK = 'WEBSOCKET_BACKGROUND_TASK';
const RECONNECT_INTERVAL = 30000; // 30 seconds
// const MAX_RECONNECT_ATTEMPTS = 20;
const PING_INTERVAL = 30000; // 30 seconds
const PING_TIMEOUT = 5000; // 5 seconds

interface WebSocketState {
  ws: WebSocket | null;
  isConnecting: boolean;
  reconnectAttempts: number;
  lastPingTime: number;
  lastPongTime: number;
  pingInterval?: NodeJS.Timeout;
  lastConnectionAttempt?: number;
  lastDisconnectTime?: number;
  isReconnecting: boolean;
}

interface WebSocketMessage {
  type: string;
  userId: string;
  data?: any;
}

class WebSocketManager extends EventEmitter {
  private static instance: WebSocketManager;
  private wsStates: Map<string, WebSocketState>;
  private isNetworkAvailable: boolean;
  private backgroundTaskRegistered: boolean;
  private readonly wsUrl: string;
  private appState: AppStateStatus;

  private constructor() {
    super();
    this.wsStates = new Map();
    this.isNetworkAvailable = true;
    this.backgroundTaskRegistered = false;
    this.appState = AppState.currentState;
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
      const wasOffline = !this.isNetworkAvailable;
      this.isNetworkAvailable = !!state.isConnected && !!state.isInternetReachable;
      
      if (wasOffline && this.isNetworkAvailable) {
        console.log('[WebSocketManager] Network restored, attempting reconnection');
        this.reconnectAll();
      }
    });
  }

  private setupAppStateListener(): void {
    AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      const wasActive = this.appState === 'active';
      this.appState = nextAppState;
  
      if (wasActive && nextAppState !== 'active') {
        console.log('[WebSocketManager] App moved to background, pausing connections');
        this.disconnectAll();
      } else if (nextAppState === 'active') {
        console.log('[WebSocketManager] App became active, reconnecting');
        this.reconnectAll();
      }
    });
  }
  
  private async disconnectAll(): Promise<void> {
    for (const [userId, state] of this.wsStates.entries()) {
      if (state.ws) {
        state.ws.close();
      }
    }
  }
  

  private async checkConnections(): Promise<void> {
    for (const [userId, state] of this.wsStates.entries()) {
      if (!this.isConnectionHealthy(state)) {
        console.log(`[WebSocketManager] Unhealthy connection detected for user: ${userId}`);
        await this.reconnect(userId);
      }
    }
  }

  private isConnectionHealthy(state: WebSocketState): boolean {
    if (!state.ws || state.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    const now = Date.now();
    const pingTimeout = now - state.lastPongTime > PING_TIMEOUT;
    return !pingTimeout;
  }

  public async setupBackgroundTask(): Promise<void> {
    if (this.backgroundTaskRegistered) return;

    try {
      TaskManager.defineTask(WEBSOCKET_TASK, async () => {
        try {
          await this.checkConnections();
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
        lastPongTime: Date.now(),
        lastConnectionAttempt: undefined,
        lastDisconnectTime: undefined,
        isReconnecting: false
      };
      this.wsStates.set(userId, state);
    }
    return state;
  }

  private setupPingPong(userId: string, state: WebSocketState): void {
    if (state.pingInterval) {
      clearInterval(state.pingInterval);
    }

    state.pingInterval = setInterval(() => {
      if (state.ws?.readyState === WebSocket.OPEN) {
        state.lastPingTime = Date.now();
        state.ws.send(JSON.stringify({ type: 'ping', userId }));
      }
    }, PING_INTERVAL);
  }

  private emitWithNamespace(userId: string, event: string, data?: any): void {
    const namespace = `user_${userId}`;
    this.emit(`${event}_${namespace}`, data);
    this.emit(event, data);  // For backward compatibility
  }

  public async connect(userId: string): Promise<void> {
    if (!userId) {
      console.error('[WebSocketManager] Cannot connect with null userId');
      return;
    }

    const state = this.getState(userId);

    if (state.isConnecting || state.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    // if (state.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    //   console.log(`[WebSocketManager] Max reconnection attempts reached for user: ${userId}`);
    //   this.emitWithNamespace(userId, 'error', new Error('Max reconnection attempts reached'));
    //   return;
    // }

    state.isConnecting = true;
    state.lastConnectionAttempt = Date.now();

    try {
      const ws = new WebSocket(this.wsUrl);

      ws.onopen = () => {
        console.log(`[WebSocketManager] WebSocket opened for user: ${userId}`);
        state.isConnecting = false;
        state.reconnectAttempts = 0;
        state.lastPingTime = Date.now();
        state.lastPongTime = Date.now();
        this.emitWithNamespace(userId, 'connected');

        // Setup ping/pong
        this.setupPingPong(userId, state);

        // Register user
        ws.send(JSON.stringify({
          type: 'register',
          userId
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          if (data.type === 'pong') {
            state.lastPongTime = Date.now();
            return;
          }
          
          this.handleMessage(data, userId);
        } catch (error) {
          console.error('[WebSocketManager] Message parsing error:', error);
        }
      };

      ws.onclose = (event) => {
        console.log(`[WebSocketManager] WebSocket closed for user: ${userId}. Code: ${event.code}, Reason: ${event.reason}`);
        
        if (state.pingInterval) {
          clearInterval(state.pingInterval);
        }
        
        state.ws = null;
        state.isConnecting = false;
        state.lastDisconnectTime = Date.now();
        
        if (event.code !== 1000) {
          state.reconnectAttempts++;
        }
        
        this.emitWithNamespace(userId, 'disconnected');
        
        if (event.code !== 1000 && this.isNetworkAvailable && !state.isReconnecting) {
          this.scheduleReconnect(userId);
        }
      };

      ws.onerror = (error) => {
        console.error(`[WebSocketManager] Error for user: ${userId}:`, error);
        this.emitWithNamespace(userId, 'error', error);
      };

      state.ws = ws;
      this.wsStates.set(userId, state);

    } catch (error) {
      state.isConnecting = false;
      state.reconnectAttempts++;
      console.error('[WebSocketManager] Connection error:', error);
      this.emitWithNamespace(userId, 'error', error);
      
      if (this.isNetworkAvailable) {
        this.scheduleReconnect(userId);
      }
    }
  }

  private scheduleReconnect(userId: string): void {
    const state = this.getState(userId);
    if (state.isReconnecting) return; // Avoid duplicate reconnect attempts
    state.isReconnecting = true;
  
    setTimeout(async () => {
      try {
        await this.connect(userId);
      } catch (error) {
        console.error(`[WebSocketManager] Reconnection failed for user: ${userId}`, error);
      } finally {
        state.isReconnecting = false; // Ensure it resets
      }
    }, RECONNECT_INTERVAL);
  }
  
  
  private handleMessage(data: WebSocketMessage, userId: string): void {
    switch (data.type) {
      case 'sensorUpdate':
        this.emitWithNamespace(userId, 'sensorData', data.data);
        break;
      case 'simulationStatus':
        this.emitWithNamespace(userId, 'simulationStatus', {
          userId: data.userId,
          isActive: data.data?.isActive
        });
        break;
      default:
        console.log('[WebSocketManager] Unknown message type:', data.type);
    }
  }

  private async reconnect(userId: string): Promise<void> {
    const state = this.getState(userId);
    
    if (state.ws?.readyState === WebSocket.OPEN) {
      state.ws.close();
    }
    
    await this.connect(userId);
  }

  private async reconnectAll(): Promise<void> {
    for (const userId of this.wsStates.keys()) {
      console.log(`[WebSocketManager] Reconnecting user: ${userId}`);
      await this.connect(userId);
    }
  }
  

  public isConnected(userId: string): boolean {
    const state = this.wsStates.get(userId);
    return state?.ws?.readyState === WebSocket.OPEN;
  }

  public async disconnect(userId: string): Promise<void> {
    console.log(`[WebSocketManager] Disconnecting user: ${userId}`);
    const state = this.wsStates.get(userId);
    
    if (state) {
      if (state.pingInterval) {
        clearInterval(state.pingInterval);
      }
      
      if (state.ws?.readyState === WebSocket.OPEN) {
        state.ws.close(1000, 'User logout');
      }
      
      this.wsStates.delete(userId);
      
      // Remove user-specific event listeners
      const namespace = `user_${userId}`;
      this.removeAllListeners(`connected_${namespace}`);
      this.removeAllListeners(`disconnected_${namespace}`);
      this.removeAllListeners(`error_${namespace}`);
      this.removeAllListeners(`sensorData_${namespace}`);
    }
  }

  public async cleanup(isTemporary = false): Promise<void> {
    if (!isTemporary) {
      console.log('[WebSocketManager] Performing full cleanup');
      
      // Close all connections
      const disconnectPromises = Array.from(this.wsStates.keys()).map(userId => 
        this.disconnect(userId)
      );
      
      await Promise.all(disconnectPromises);
      
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