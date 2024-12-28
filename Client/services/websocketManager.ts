import { EventEmitter } from 'events';
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
  private connectionPromise: Promise<void> | null = null;
  private backgroundDataReceived: Map<string, { 
    lastReceivedTimestamp: number, 
    dataCount: number,
    backgroundDataIntervals: number[] 
  }> = new Map();

  private constructor() {
    super();
    this.setMaxListeners(20); 
    this.wsStates = new Map();
    this.isNetworkAvailable = true;
    this.backgroundTaskRegistered = false;
    this.appState = AppState.currentState;
    this.wsUrl = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000';
    
    this.defineBackgroundTask();
    this.setupNetworkListener();
    this.setupAppStateListener();
  }

  private defineBackgroundTask(): void {
    TaskManager.defineTask(WEBSOCKET_TASK, async () => {
      try {
        await this.checkConnections();
        
        this.wsStates.forEach((state, userId) => {
          this.logBackgroundDataDetails(userId);
        });
        
        return BackgroundFetch.BackgroundFetchResult.NewData;
      } catch (error) {
        console.error('[WebSocketManager] Background task error:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });
  }

  private logBackgroundDataDetails(userId: string): void {
    const tracker = this.backgroundDataReceived.get(userId);
    if (tracker) {
      console.log(`[WebSocketManager] Detailed Background Data Status for ${userId}:`, {
        totalDataCount: tracker.dataCount,
        lastReceivedTimestamp: tracker.lastReceivedTimestamp,
        backgroundDataIntervals: tracker.backgroundDataIntervals
      });
    }
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
    AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      const previousState = this.appState;
      this.appState = nextAppState;
  
      console.log(`[WebSocketManager] App state changed: ${previousState} -> ${nextAppState}`);
  
      if (nextAppState === 'background') {
        console.log('[CRITICAL] Entering background - forcing connection check');
        for (const userId of this.wsStates.keys()) {
          try {
            if (!this.isConnected(userId)) {
              await this.connect(userId);
              console.log(`[CRITICAL] Forced reconnection for ${userId}`);
            }
          } catch (error) {
            console.error(`Background connection failed for ${userId}`, error);
          }
        }
      } else if (nextAppState === 'active') {
        this.wsStates.forEach((state, userId) => {
          if (state.ws?.readyState === WebSocket.OPEN) {
            if (state.pingInterval) {
              clearInterval(state.pingInterval);
            }
  
            this.setupPingPong(userId, state);
          }
        });
      }
    });
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
      await BackgroundFetch.registerTaskAsync(WEBSOCKET_TASK, {
        minimumInterval: 15 * 60, 
        stopOnTerminate: false,
        startOnBoot: true
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
  
        ws.onopen = () => {
          console.log(`[WebSocketManager] WebSocket opened for user: ${userId}`);
          state.isConnecting = false;
          state.reconnectAttempts = 0;
          state.lastPingTime = Date.now();
          state.lastPongTime = Date.now();
  
          if (state.pingInterval) {
            clearInterval(state.pingInterval);
          }
  
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
          
          // Only attempt reconnect if:
          // 1. Not a normal closure (code 1000)
          // 2. Network is available
          // 3. Not already in reconnecting state
          // 4. App is in active state
          if (event.code !== 1000 && 
              this.isNetworkAvailable && 
              !state.isReconnecting &&
              this.appState === 'active') {
            this.scheduleReconnect(userId);
          }
        };
  
        ws.onerror = (error) => {
          console.error(`[WebSocketManager] WebSocket error for user: ${userId}:`, error);
          this.emitWithNamespace(userId, 'error', error);
          
          if (!ws.OPEN) {
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
        
        if (this.isNetworkAvailable && this.appState === 'active') {
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
    const backoffTime = Math.min(30000 * Math.pow(1.5, state.reconnectAttempts), 300000); // Max 5 minutes
  
    setTimeout(async () => {
      try {
        await this.connect(userId);
      } catch (error) {
        console.error(`[WebSocketManager] Reconnection failed for user: ${userId}`, error);
      } finally {
        state.isReconnecting = false;
      }
    }, backoffTime);
  }
  
  private handleMessage(data: WebSocketMessage, userId: string): void {
    try {
      console.log('[WebSocketManager] Received message:', { type: data.type, userId });
      
      switch (data.type) {
        case 'pong':
          const state = this.getState(userId);
          state.lastPongTime = Date.now();
          console.log(`[WebSocketManager] Pong received for user: ${userId}`);
          break;
        case 'sensorUpdate':
          this.emitWithNamespace(userId, 'sensorData', {
            data: data.data,
            type: data.type,
            userId: data.userId
          });
          break;
        case 'simulationStatus':
          this.emitWithNamespace(userId, 'simulationStatus', {
            userId: data.userId,
            isActive: data.data?.isActive
          });
          break;
        case 'connection':
          this.emitWithNamespace(userId, 'connectionStatus', data.data);
          break;
        default:
          console.log(`[WebSocketManager] Handling message type: ${data.type}`, data);
          this.emitWithNamespace(userId, data.type, data);
          this.emit(data.type, data);
      }
    } catch (error) {
      console.error('[WebSocketManager] Error handling message:', error);
    }

    const tracker = this.backgroundDataReceived.get(userId) || {
      lastReceivedTimestamp: Date.now(),
      dataCount: 0,
      backgroundDataIntervals: []
    };
    
    if (this.appState === 'background') {
      const now = Date.now();
      if (tracker.lastReceivedTimestamp) {
        const interval = now - tracker.lastReceivedTimestamp;
        tracker.backgroundDataIntervals.push(interval);
        
        if (tracker.backgroundDataIntervals.length > 5) {
          tracker.backgroundDataIntervals.shift();
        }
      }
    }
    
    tracker.lastReceivedTimestamp = Date.now();
    tracker.dataCount++;
    
    this.backgroundDataReceived.set(userId, tracker);
  }

  public getBackgroundDataStatus(userId: string) {
    const tracker = this.backgroundDataReceived.get(userId);
    if (!tracker) return { 
      hasReceivedData: false, 
      timeSinceLastData: null 
    };

    return {
      hasReceivedData: true,
      timeSinceLastData: Date.now() - tracker.lastReceivedTimestamp,
      dataCount: tracker.dataCount
    };
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
    
    this.connectionPromise = null;
    
    const state = this.wsStates.get(userId);
    if (state) {
      if (state.pingInterval) {
        clearInterval(state.pingInterval);
      }
      
      if (state.ws?.readyState === WebSocket.OPEN) {
        state.ws.close(1000, 'User logout');
      }
      
      this.wsStates.delete(userId);
      state.isConnecting = false;
      state.isReconnecting = false;
      
      this.removeAllUserListeners(userId);
    }
  }

  
  public removeAllUserListeners(userId: string): void {
    const namespace = `user_${userId}`;
    const events = [
      `connected_${namespace}`,
      `disconnected_${namespace}`,
      `error_${namespace}`,
      `sensorData_${namespace}`,
      'sensorData',
      'sensorUpdate'
    ];
    
    events.forEach(event => {
      this.removeAllListeners(event);
    });
  }
  
  public async cleanup(isTemporary = false): Promise<void> {
    if (!isTemporary) {
      console.log('[WebSocketManager] Performing full cleanup');
      
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
  
      this.wsStates.clear();
      this.removeAllListeners();
    }
  }
}

export const websocketManager = WebSocketManager.getInstance();