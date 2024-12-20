import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { SensorConfig, UserState } from '../models/sensorTypes';
import { anxietyDetector } from './anxietyDetectorLogic';
import { mockDataService } from './mockDataService';

class SensorService extends EventEmitter {
  private static instance: SensorService;
  private simulationIntervals: Map<string, NodeJS.Timeout>;
  private userStates: Map<string, UserState>;
  private autoStopTimers: Map<string, NodeJS.Timeout>;
  private readonly AUTO_STOP_DURATION = 15 * 60 * 1000; // 15 minutes

  private constructor() {
    super();
    this.simulationIntervals = new Map();
    this.userStates = new Map();
    this.autoStopTimers = new Map();
  }

  public static getInstance(): SensorService {
    if (!SensorService.instance) {
      SensorService.instance = new SensorService();
    }
    return SensorService.instance;
  }

  private getUserState(userId: string): UserState {
    let state = this.userStates.get(userId);
    if (!state) {
      state = {
        userId,
        isActive: false,
        baselineHRV: 50,
        baselineEDA: 2,
        consecutiveAnxiousReadings: 0
      };
      this.userStates.set(userId, state);
    }
    return state;
  }

  public registerWebSocket(userId: string, ws: WebSocket): void {
    console.log(`[SensorService] Registering WebSocket for user: ${userId}`);
    
    // Clean up any existing WebSocket
    const existingState = this.userStates.get(userId);
    if (existingState?.webSocket) {
      try {
        existingState.webSocket.close();
      } catch (error) {
        console.error(`[SensorService] Error closing existing WebSocket for user ${userId}:`, error);
      }
    }

    const userState = this.getUserState(userId);
    userState.webSocket = ws;
    this.userStates.set(userId, userState);

    ws.on('close', () => {
      console.log(`[SensorService] WebSocket closed for user: ${userId}`);
      const state = this.userStates.get(userId);
      if (state) {
        state.webSocket = undefined;
        state.isActive = false;
        this.userStates.set(userId, state);
        this.stopSimulation(userId);
      }
    });

    ws.on('error', (error) => {
      console.error(`[SensorService] WebSocket error for user ${userId}:`, error);
    });

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ 
        type: 'connection', 
        status: 'connected',
        userId 
      }));
    }
  }

  public startSimulation(config: SensorConfig): void {
    const userId = config.userId;
    console.log(`[SensorService] Starting simulation for user: ${userId}`);
    
    this.stopSimulation(userId);

    const userState = this.getUserState(userId);
    userState.isActive = true;
    this.userStates.set(userId, userState);

    // Set auto-stop timer
    const autoStopTimer = setTimeout(() => {
      console.log(`[SensorService] Auto-stopping simulation for user: ${userId} after 15 minutes`);
      this.stopSimulation(userId);
    }, this.AUTO_STOP_DURATION);

    this.autoStopTimers.set(userId, autoStopTimer);

    const interval = setInterval(() => {
      const currentState = this.userStates.get(userId);
      if (!currentState?.isActive || !currentState.webSocket || currentState.webSocket.readyState !== WebSocket.OPEN) {
        console.log(`[SensorService] Stopping inactive simulation for user: ${userId}`);
        this.stopSimulation(userId);
        return;
      }

      try {
        // Get sensor data from mock service (this can be replaced with real sensor data later)
        const sensorData = mockDataService.generateSensorData(userId);
        const analysis = anxietyDetector.analyzeAnxiety(sensorData, currentState);

        currentState.consecutiveAnxiousReadings = analysis.isAnxious ? 
          currentState.consecutiveAnxiousReadings + 1 : 0;
        this.userStates.set(userId, currentState);

        currentState.webSocket.send(JSON.stringify({
          type: 'sensorUpdate',
          data: { sensorData, analysis }
        }));
      } catch (error) {
        console.error(`[SensorService] Error in simulation interval for user ${userId}:`, error);
        this.stopSimulation(userId);
      }
    }, config.samplingRate || 1000);

    this.simulationIntervals.set(userId, interval);
  }

  public stopSimulation(userId: string): void {
    console.log(`[SensorService] Stopping simulation for user: ${userId}`);
    
    // Clear timers
    const autoStopTimer = this.autoStopTimers.get(userId);
    if (autoStopTimer) {
      clearTimeout(autoStopTimer);
      this.autoStopTimers.delete(userId);
    }

    const interval = this.simulationIntervals.get(userId);
    if (interval) {
      clearInterval(interval);
      this.simulationIntervals.delete(userId);
    }

    // Update user state
    const userState = this.userStates.get(userId);
    if (userState) {
      userState.isActive = false;
      userState.consecutiveAnxiousReadings = 0;
      
      if (userState.webSocket?.readyState === WebSocket.OPEN) {
        try {
          userState.webSocket.send(JSON.stringify({
            type: 'simulationStopped',
            userId
          }));
        } catch (error) {
          console.error(`[SensorService] Error sending stop notification to user ${userId}:`, error);
        }
      }

      this.userStates.set(userId, userState);
    }
  }

  public cleanup(): void {
    console.log('[SensorService] Starting cleanup');
    
    [...this.autoStopTimers.entries()].forEach(([userId, timer]) => {
      clearTimeout(timer);
      this.autoStopTimers.delete(userId);
    });

    [...this.simulationIntervals.entries()].forEach(([userId, interval]) => {
      clearInterval(interval);
      this.simulationIntervals.delete(userId);
    });

    [...this.userStates.entries()].forEach(([userId, state]) => {
      if (state.webSocket?.readyState === WebSocket.OPEN) {
        try {
          state.webSocket.send(JSON.stringify({
            type: 'serverShutdown',
            userId
          }));
          state.webSocket.close();
        } catch (error) {
          console.error(`[SensorService] Error closing WebSocket for user ${userId}:`, error);
        }
      }
      state.isActive = false;
      state.webSocket = undefined;
    });

    this.userStates.clear();
    mockDataService.cleanup();
    
    console.log('[SensorService] Cleanup completed');
  }
}

const sensorService = SensorService.getInstance();

export default sensorService;