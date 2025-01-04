import { EventEmitter } from 'events';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const WEBSOCKET_TASK = 'WEBSOCKET_BACKGROUND_TASK';
const BACKGROUND_CHECK_INTERVAL = 15 * 60; // 15 minutes in seconds
const CONNECTION_TIMEOUT = 10000; // 10 seconds
const MAX_BACKGROUND_RECONNECT_ATTEMPTS = 3;
const PING_INTERVAL = 30000; // 30 seconds
const PING_TIMEOUT = 5000; // 5 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

interface WebSocketState {
  ws: WebSocket | null;
  isConnecting: boolean;
  reconnectAttempts: number;
  backgroundReconnectAttempts: number;
  lastPingTime: number;
  lastPongTime: number;
  pingInterval?: NodeJS.Timeout;
  lastBackgroundEntryTime?: number;
  lastConnectionAttempt?: number;
  lastDisconnectTime?: number;
  isReconnecting: boolean;
  backgroundTaskId?: string;
}

interface WebSocketMessage {
  type: string;
  userId: string;
  data?: any;
}

interface ConnectionMetrics {
  lastReceivedTimestamp: number;
  messageCount: number;
  backgroundMessageIntervals: number[];
}

class WebSocketManager extends EventEmitter {
  private static instance: WebSocketManager;
  private wsStates: Map<string, WebSocketState>;
  private backgroundTasks: Map<string, NodeJS.Timeout>;
  private isNetworkAvailable: boolean;
  private appState: AppStateStatus;
  private connectionPromise: Promise<void> | null;
  private readonly wsUrl: string;
  private connectionMetrics: Map<string, ConnectionMetrics>;
  private backgroundTaskRegistered: boolean = false;

  private constructor() {
    super();
    this.setMaxListeners(20);
    this.wsStates = new Map();
    this.backgroundTasks = new Map();
    this.connectionMetrics = new Map();
    this.isNetworkAvailable = true;
    this.appState = AppState.currentState;
    this.connectionPromise = null;
    this.wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000';

    this.defineGlobalBackgroundTask();
    this.setupAppStateListener();
    this.setupNetworkListener();
  }

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  private defineGlobalBackgroundTask(): void {
    // Define a single global task instead of per-user tasks
    TaskManager.defineTask(WEBSOCKET_TASK, async () => {
      try {
        console.log('[WebSocketManager] Running background task');
        
        // Check all active connections
        for (const [userId, state] of this.wsStates.entries()) {
          const isHealthy = await this.checkConnection(userId);
          
          if (!isHealthy && state.backgroundReconnectAttempts < MAX_BACKGROUND_RECONNECT_ATTEMPTS) {
            state.backgroundReconnectAttempts++;
            await this.connect(userId);
          }
        }
        
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } catch (error) {
        console.error('[WebSocketManager] Background task error:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });
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
    AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      const previousState = this.appState;
      this.appState = nextAppState;

      console.log(`[WebSocketManager] App state changed: ${previousState} -> ${nextAppState}`);

      if (nextAppState === 'background') {
        await this.handleBackgroundTransition();
      } else if (nextAppState === 'active' && previousState === 'background') {
        await this.handleForegroundTransition();
      }
    });
  }

  private async handleBackgroundTransition(): Promise<void> {
    console.log('[WebSocketManager] Entering background state');
    
    // Start background monitoring if there are any active connections
    if (this.wsStates.size > 0) {
      for (const [userId, state] of this.wsStates.entries()) {
        state.lastBackgroundEntryTime = Date.now();
        state.backgroundReconnectAttempts = 0;
        
        if (state.pingInterval) {
          clearInterval(state.pingInterval);
        }
      }
      
      // Only start background monitoring if not already started
      if (!this.backgroundTaskRegistered) {
        await this.startBackgroundMonitoring(Array.from(this.wsStates.keys())[0]);
      }
    }
  }
  private async handleForegroundTransition(): Promise<void> {
    console.log('[WebSocketManager] Entering foreground state');
    
    this.backgroundTasks.forEach((taskId) => {
      clearTimeout(taskId);
    });
    this.backgroundTasks.clear();

    for (const [userId, state] of this.wsStates.entries()) {
      state.backgroundReconnectAttempts = 0;
      
      if (!this.isConnected(userId)) {
        await this.connect(userId);
      } else {
        this.setupPingPong(userId, state);
      }
    }
  }

  private async startBackgroundMonitoring(userId: string): Promise<void> {
    const state = this.getState(userId);
    
    try {
      // Register the global background task if not already registered
      if (!this.backgroundTaskRegistered) {
        await BackgroundFetch.registerTaskAsync(WEBSOCKET_TASK, {
          minimumInterval: BACKGROUND_CHECK_INTERVAL,
          stopOnTerminate: false,
          startOnBoot: true
        });
        this.backgroundTaskRegistered = true;
      }
      
      console.log(`[WebSocketManager] Background monitoring started for user: ${userId}`);
    } catch (error) {
      console.error('[WebSocketManager] Failed to setup background monitoring:', error);
    }
  }

  private async checkConnection(userId: string): Promise<boolean> {
    const state = this.getState(userId);
    
    if (!state.ws || state.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    const now = Date.now();
    if (now - state.lastPongTime > PING_TIMEOUT) {
      return false;
    }

    return true;
  }

  private getState(userId: string): WebSocketState {
    let state = this.wsStates.get(userId);
    if (!state) {
      state = {
        ws: null,
        isConnecting: false,
        reconnectAttempts: 0,
        backgroundReconnectAttempts: 0,
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
    try {
      const namespace = `user_${userId}`;
      const namespaceEvent = `${event}_${namespace}`;
      console.log(`[WebSocketManager] Emitting event: ${namespaceEvent}`, data);
      
      this.emit(namespaceEvent, data);
      this.emit(event, data);
    } catch (error) {
      console.error('[WebSocketManager] Error in emitWithNamespace:', error);
    }
  }

  public async connect(userId: string): Promise<void> {
    if (!userId) {
      console.error('[WebSocketManager] Cannot connect with null userId');
      return;
    }

    if (this.connectionPromise) {
      console.log('[WebSocketManager] Connection already in progress, waiting...');
      return this.connectionPromise;
    }

    const state = this.getState(userId);

    if (state.ws?.readyState === WebSocket.OPEN) {
      console.log(`[WebSocketManager] Already connected for user: ${userId}`);
      this.emitWithNamespace(userId, 'connected');
      return;
    }

    this.connectionPromise = new Promise<void>((resolve, reject) => {
      try {
        if (state.isConnecting) {
          console.log(`[WebSocketManager] Connection already in progress for user: ${userId}`);
          resolve();
          return;
        }

        state.isConnecting = true;
        state.lastConnectionAttempt = Date.now();

        console.log(`[WebSocketManager] Attempting to connect for user: ${userId}`);
        
        const ws = new WebSocket(this.wsUrl);
        const timeoutId = setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            ws.close();
            reject(new Error('Connection timeout'));
          }
        }, CONNECTION_TIMEOUT);

        ws.onopen = () => {
          clearTimeout(timeoutId);
          console.log(`[WebSocketManager] WebSocket opened for user: ${userId}`);
          state.isConnecting = false;
          state.reconnectAttempts = 0;
          state.lastPingTime = Date.now();
          state.lastPongTime = Date.now();

          this.setupPingPong(userId, state);
          this.emitWithNamespace(userId, 'connected');

          try {
            ws.send(JSON.stringify({
              type: 'register',
              userId
            }));
          } catch (error) {
            console.error(`[WebSocketManager] Error sending register message: ${error}`);
          }

          resolve();
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
          clearTimeout(timeoutId);
          console.log(`[WebSocketManager] WebSocket closed for user: ${userId}. Code: ${event.code}, Reason: ${event.reason}`);
          
          if (state.pingInterval) {
            clearInterval(state.pingInterval);
          }
          
          state.ws = null;
          state.isConnecting = false;
          state.lastDisconnectTime = Date.now();
          this.connectionPromise = null;
          
          if (event.code !== 1000) {
            state.reconnectAttempts++;
          }
          
          this.emitWithNamespace(userId, 'disconnected');
          
          if (event.code !== 1000 && 
              this.isNetworkAvailable && 
              !state.isReconnecting &&
              this.appState === 'active' &&
              state.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            this.scheduleReconnect(userId);
          }

          resolve();
        };

        ws.onerror = (error) => {
          clearTimeout(timeoutId);
          console.error(`[WebSocketManager] WebSocket error for user: ${userId}:`, error);
          this.emitWithNamespace(userId, 'error', error);
          
          if (ws.readyState !== WebSocket.OPEN) {
            reject(error);
          }
        };

        state.ws = ws;
        this.wsStates.set(userId, state);

      } catch (error) {
        console.error('[WebSocketManager] Connection error:', error);
        state.isConnecting = false;
        state.reconnectAttempts++;
        this.connectionPromise = null;
        this.emitWithNamespace(userId, 'error', error);
        
        if (this.isNetworkAvailable && 
            this.appState === 'active' &&
            state.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          this.scheduleReconnect(userId);
        }
        
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  private async scheduleReconnect(userId: string): Promise<void> {
    const state = this.getState(userId);
    if (state.isReconnecting) return;
    
    state.isReconnecting = true;
    
    const jitter = Math.random() * 1000;
    const baseDelay = 1000;
    const backoffTime = Math.min(
      baseDelay * Math.pow(1.5, state.reconnectAttempts) + jitter,
      30000
    );
  
    console.log(`[WebSocketManager] Scheduling reconnection for ${userId} in ${backoffTime}ms`);
  
    return new Promise((resolve) => {
      const timeoutId = setTimeout(async () => {
        try {
          if (!this.isNetworkAvailable) {
            console.log('[WebSocketManager] Network unavailable, skipping reconnection attempt');
            return;
          }
  
          if (state.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            console.log('[WebSocketManager] Max reconnection attempts reached');
            this.emitWithNamespace(userId, 'maxRetriesReached');
            return;
          }
  
          await this.connect(userId);
          state.reconnectAttempts = 0;
          
        } catch (error) {
          console.error(`[WebSocketManager] Reconnection attempt failed:`, error);
          state.reconnectAttempts++;
          if (state.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            await this.scheduleReconnect(userId);
          }
        } finally {
          state.isReconnecting = false;
          resolve();
        }
      }, backoffTime);
  
      this.backgroundTasks.set(userId, timeoutId);
    });
  }

  private handleMessage(data: WebSocketMessage, userId: string): void {
    try {
      console.log('[WebSocketManager] Received message:', { type: data.type, userId, data });
      
      switch (data.type) {
        case 'pong':
          const state = this.getState(userId);
          state.lastPongTime = Date.now();
          break;
        case 'sensorUpdate':
          this.emitWithNamespace(userId, 'sensorData', data);
          this.emit('sensorData', data);
          break;
        default:
          this.emitWithNamespace(userId, data.type, data);
          this.emit(data.type, data);
      }
    } catch (error) {
      console.error('[WebSocketManager] Error handling message:', error);
    }
  }

  public getConnectionMetrics(userId: string) {
    const metrics = this.connectionMetrics.get(userId);
    if (!metrics) return null;

    return {
      messageCount: metrics.messageCount,
      lastMessageTime: metrics.lastReceivedTimestamp,
      averageBackgroundInterval: metrics.backgroundMessageIntervals.length > 0
        ? metrics.backgroundMessageIntervals.reduce((a, b) => a + b, 0) / metrics.backgroundMessageIntervals.length
        : null,
      backgroundMessageIntervals: [...metrics.backgroundMessageIntervals]
    };
  }

  public isConnected(userId: string): boolean {
    const state = this.wsStates.get(userId);
    return state?.ws?.readyState === WebSocket.OPEN;
  }

  private async reconnectAll(): Promise<void> {
    for (const userId of this.wsStates.keys()) {
      console.log(`[WebSocketManager] Reconnecting user: ${userId}`);
      await this.connect(userId);
    }
  }

  public async disconnect(userId: string): Promise<void> {
    console.log(`[WebSocketManager] Disconnecting user: ${userId}`);
    
    this.connectionPromise = null;
    
    const state = this.wsStates.get(userId);
    if (state) {
      if (state.pingInterval) {
        clearInterval(state.pingInterval);
      }
      
      if (state.backgroundTaskId) {
        try {
          await BackgroundFetch.unregisterTaskAsync(state.backgroundTaskId);
        } catch (error) {
          console.error('[WebSocketManager] Failed to unregister background task:', error);
        }
      }
      
      if (state.ws?.readyState === WebSocket.OPEN) {
        state.ws.close(1000, 'User logout');
      }
      
      this.wsStates.delete(userId);
      this.connectionMetrics.delete(userId);
      
      this.removeAllUserListeners(userId);
    }
  }

  private removeAllUserListeners(userId: string): void {
    const namespace = `user_${userId}`;
    const events = [
      `connected_${namespace}`,
      `disconnected_${namespace}`,
      `error_${namespace}`,
      `serverMessage_${namespace}`,
      `update_${namespace}`,
      `notification_${namespace}`
    ];
    
    events.forEach(event => {
      this.removeAllListeners(event);
    });
  }

  public async cleanup(isTemporary = false): Promise<void> {
    if (!isTemporary) {
      console.log('[WebSocketManager] Performing full cleanup');
      
      // Disconnect all users
      const disconnectPromises = Array.from(this.wsStates.keys()).map(userId => 
        this.disconnect(userId)
      );
      
      await Promise.all(disconnectPromises);
      
      // Unregister background task if registered
      if (this.backgroundTaskRegistered) {
        try {
          await BackgroundFetch.unregisterTaskAsync(WEBSOCKET_TASK);
          this.backgroundTaskRegistered = false;
        } catch (error) {
          console.error('[WebSocketManager] Failed to unregister background task:', error);
        }
      }
      
      // Clear all background tasks
      this.backgroundTasks.forEach((taskId) => {
        clearTimeout(taskId);
      });
      this.backgroundTasks.clear();
      
      // Clear all other state
      this.connectionMetrics.clear();
      this.wsStates.clear();
      this.connectionPromise = null;
      this.removeAllListeners();
    }
  }

  public getConnectionStatus(userId: string) {
    const state = this.wsStates.get(userId);
    if (!state) return 'disconnected';

    if (state.isConnecting) return 'connecting';
    if (state.isReconnecting) return 'reconnecting';
    if (state.ws?.readyState === WebSocket.OPEN) return 'connected';
    return 'disconnected';
  }

  public getDebugInfo(userId: string) {
    const state = this.wsStates.get(userId);
    const metrics = this.connectionMetrics.get(userId);
    
    return {
      connectionState: this.getConnectionStatus(userId),
      reconnectAttempts: state?.reconnectAttempts || 0,
      backgroundReconnectAttempts: state?.backgroundReconnectAttempts || 0,
      lastPingTime: state?.lastPingTime,
      lastPongTime: state?.lastPongTime,
      lastConnectionAttempt: state?.lastConnectionAttempt,
      lastDisconnectTime: state?.lastDisconnectTime,
      messageMetrics: metrics ? {
        totalMessages: metrics.messageCount,
        lastMessageTime: metrics.lastReceivedTimestamp,
        averageBackgroundInterval: metrics.backgroundMessageIntervals.length > 0
          ? metrics.backgroundMessageIntervals.reduce((a, b) => a + b, 0) / metrics.backgroundMessageIntervals.length
          : null
      } : null,
      networkAvailable: this.isNetworkAvailable,
      appState: this.appState
    };
  }
}

export const websocketManager = WebSocketManager.getInstance();