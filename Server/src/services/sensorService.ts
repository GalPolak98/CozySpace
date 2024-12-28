import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { SensorConfig, UserState, SensorData } from '../models/sensorTypes';
import { anxietyDetector } from './anxietyDetectorLogic';
import { mockDataService } from './mockDataService';

class SensorService extends EventEmitter {
  private static instance: SensorService;
  private simulationIntervals: Map<string, NodeJS.Timeout>;
  private userStates: Map<string, UserState>;
  private autoStopTimers: Map<string, NodeJS.Timeout>;
  private webSocketConnections: Map<string, WebSocket>;
  private readonly AUTO_STOP_DURATION = 15 * 60 * 1000;
  private readonly DEFAULT_SAMPLING_RATE = 5000;

  private constructor() {
    super();
    this.simulationIntervals = new Map();
    this.userStates = new Map();
    this.autoStopTimers = new Map();
    this.webSocketConnections = new Map();
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

  public isUserConnected(userId: string): boolean {
    const ws = this.webSocketConnections.get(userId);
    return ws?.readyState === WebSocket.OPEN;
  }

  private sendToUser(userId: string, data: any): void {
    const ws = this.webSocketConnections.get(userId);
    if (ws?.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(data));
      } catch (error) {
        console.error(`[SensorService] Error sending data to user ${userId}:`, error);
      }
    }
  }

  public registerWebSocket(userId: string, ws: WebSocket): void {
    console.log(`[SensorService] Registering WebSocket for user: ${userId}`);
    
    const existingWs = this.webSocketConnections.get(userId);
    if (existingWs && existingWs.readyState === WebSocket.OPEN) {
        console.log(`[SensorService] Existing connection found for user: ${userId}, skipping registration`);
        return;
    }

    this.webSocketConnections.set(userId, ws);

    ws.on('close', () => {
        console.log(`[SensorService] WebSocket closed for user: ${userId}`);
        this.webSocketConnections.delete(userId);
        this.pauseSimulation(userId);
    });

    ws.on('error', (error) => {
        console.error(`[SensorService] WebSocket error for user ${userId}:`, error);
    });

    if (ws.readyState === WebSocket.OPEN) {
        const userState = this.getUserState(userId);
        ws.send(JSON.stringify({ 
            type: 'connection', 
            status: 'connected',
            userId,
            simulationActive: userState.isActive
        }));
    }
  }

  public startSimulation(config: SensorConfig): void {
    const userId = config.userId;
    
    console.log(`[SensorService] Starting simulation for user: ${userId}`);

    const userState = this.getUserState(userId);
    userState.isActive = true;
    userState.consecutiveAnxiousReadings = 0;
    this.userStates.set(userId, userState);

    this.sendToUser(userId, {
        type: 'simulationStatus',
        userId,
        isActive: true
    });

    if (this.simulationIntervals.has(userId)) {
        console.log(`[SensorService] Simulation already running for user: ${userId}`);
        return;
    }

    const autoStopTimer = setTimeout(() => {
        console.log(`[SensorService] Auto-stopping simulation for user: ${userId} after 15 minutes`);
        this.stopSimulation(userId);
        this.autoStopTimers.delete(userId);
    }, this.AUTO_STOP_DURATION);

    this.autoStopTimers.set(userId, autoStopTimer);

    const interval = setInterval(() => {
        const currentState = this.userStates.get(userId);
        if (!currentState?.isActive) {
            console.log(`[SensorService] Simulation inactive for user: ${userId}`);
            this.stopSimulation(userId);
            return;
        }

        try {
            const sensorDataJson = mockDataService.generateSensorData(userId);
            const sensorData: SensorData = JSON.parse(sensorDataJson);
            const analysis = anxietyDetector.analyzeAnxiety(sensorData, currentState);

            this.sendToUser(userId, {
                type: 'sensorUpdate',
                userId,
                rawData: sensorDataJson,
                data: {
                    sensorData,
                    analysis
                }
            });
        } catch (error) {
            console.error(`[SensorService] Error in simulation interval for user ${userId}:`, error);
        }
    }, config.samplingRate || this.DEFAULT_SAMPLING_RATE);

    this.simulationIntervals.set(userId, interval);
}

  private pauseSimulation(userId: string): void {
    const interval = this.simulationIntervals.get(userId);
    if (interval) {
      clearInterval(interval);
      this.simulationIntervals.delete(userId);
    }
  }

  public stopSimulation(userId: string): void {
    console.log(`[SensorService] Stopping simulation for user: ${userId}`);
    
    const interval = this.simulationIntervals.get(userId);
    if (interval) {
      clearInterval(interval);
      this.simulationIntervals.delete(userId);
    }

    const autoStopTimer = this.autoStopTimers.get(userId);
    if (autoStopTimer) {
        clearTimeout(autoStopTimer);
        this.autoStopTimers.delete(userId);
    }
  
    const userState = this.userStates.get(userId);
    if (userState) {
      userState.isActive = false;
      userState.consecutiveAnxiousReadings = 0;
      this.userStates.set(userId, userState);
      
      const ws = this.webSocketConnections.get(userId);
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'simulationStatus',
          userId,
          isActive: false
        }));
      }
    }
  }

  public cleanup(): void {
    console.log('[SensorService] Starting cleanup');
    
    [...this.autoStopTimers.entries()].forEach(([userId, timer]) => {
      clearTimeout(timer);
    });
    this.autoStopTimers.clear();

    [...this.simulationIntervals.entries()].forEach(([userId, interval]) => {
      clearInterval(interval);
    });
    this.simulationIntervals.clear();

    [...this.webSocketConnections.entries()].forEach(([userId, ws]) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({
            type: 'serverShutdown',
            userId
          }));
          ws.close();
        } catch (error) {
          console.error(`[SensorService] Error closing WebSocket for user ${userId}:`, error);
        }
      }
    });
    this.webSocketConnections.clear();

    this.userStates.clear();
    mockDataService.cleanup();
    
    console.log('[SensorService] Cleanup completed');
  }
}

const sensorService = SensorService.getInstance();

export default sensorService;