// services/mockDataService.ts
import { SensorData } from '../models/sensorTypes';

interface MockDataState {
  lastReading: SensorData | null;
  isInAnxietyPattern: boolean;
  anxietyDuration: number;  // How long the current anxiety pattern has lasted
  normalDuration: number;   // How long the normal pattern has lasted
}

class MockDataService {
  private mockStates: Map<string, MockDataState> = new Map();

  // Constants for realistic data ranges
  private readonly HRV_MIN = 20;  // ms
  private readonly HRV_MAX = 70;  // ms
  private readonly HRV_NORMAL = 45; // ms
  private readonly HRV_ANXIETY = 30; // ms

  private readonly EDA_MIN = 1.0;  // µS
  private readonly EDA_MAX = 20.0; // µS
  private readonly EDA_NORMAL = 5.0; // µS
  private readonly EDA_ANXIETY = 12.0; // µS

  // Anxiety pattern settings
  private readonly ANXIETY_START_PROBABILITY = 0.4;  // 40% chance to start anxiety
  private readonly ANXIETY_CONTINUE_PROBABILITY = 0.9; // 90% chance to continue anxiety
  private readonly MAX_NORMAL_DURATION = 20;  // Switch to anxiety after 20 normal readings
  private readonly MAX_ANXIETY_DURATION = 15; // Max duration of anxiety pattern

  private getOrCreateMockState(userId: string): MockDataState {
    let state = this.mockStates.get(userId);
    if (!state) {
      state = {
        lastReading: null,
        isInAnxietyPattern: false,
        anxietyDuration: 0,
        normalDuration: 0
      };
      this.mockStates.set(userId, state);
    }
    return state;
  }

  private moveTowards(current: number, target: number, maxChange: number): number {
    const difference = target - current;
    const change = Math.min(Math.abs(difference), maxChange) * Math.sign(difference);
    return current + change;
  }

  private generateQuality(): number {
    const baseQuality = 90;
    const qualityVariation = Math.random() * 10;
    return baseQuality + qualityVariation;
  }

  private shouldTriggerAnxiety(mockState: MockDataState): boolean {
    // Force anxiety after too many normal readings
    if (mockState.normalDuration >= this.MAX_NORMAL_DURATION) {
      return true;
    }

    // Check if we should continue or start anxiety
    if (mockState.isInAnxietyPattern) {
      // End anxiety if it has lasted too long
      if (mockState.anxietyDuration >= this.MAX_ANXIETY_DURATION) {
        return false;
      }
      return Math.random() < this.ANXIETY_CONTINUE_PROBABILITY;
    }

    return Math.random() < this.ANXIETY_START_PROBABILITY;
  }

  public generateSensorData(userId: string): SensorData {
    const mockState = this.getOrCreateMockState(userId);
    
    // Initialize first reading if needed
    if (!mockState.lastReading) {
      mockState.lastReading = {
        timestamp: Date.now(),
        userId,
        deviceId: `SMART_JEWELRY_${userId}`,
        hrvData: {
          value: this.HRV_NORMAL,
          quality: this.generateQuality()
        },
        edaData: {
          value: this.EDA_NORMAL,
          quality: this.generateQuality()
        }
      };
    }

    // Determine anxiety pattern
    const wasAnxious = mockState.isInAnxietyPattern;
    mockState.isInAnxietyPattern = this.shouldTriggerAnxiety(mockState);

    // Update durations
    if (mockState.isInAnxietyPattern) {
      mockState.anxietyDuration++;
      mockState.normalDuration = 0;
    } else {
      mockState.anxietyDuration = 0;
      mockState.normalDuration++;
    }

    // Generate new values
    let newHRV: number;
    let newEDA: number;

    if (mockState.isInAnxietyPattern) {
      // More severe anxiety values based on duration
      const anxietySeverity = Math.min(mockState.anxietyDuration / 5, 1); // Increases over time
      const targetHRV = this.HRV_ANXIETY - (anxietySeverity * 5); // Gets lower with severity
      const targetEDA = this.EDA_ANXIETY + (anxietySeverity * 4); // Gets higher with severity
      
      newHRV = this.moveTowards(mockState.lastReading.hrvData.value, targetHRV, 3);
      newEDA = this.moveTowards(mockState.lastReading.edaData.value, targetEDA, 0.8);
    } else {
      // Normal pattern values
      const targetHRV = 45 + Math.random() * 15;
      const targetEDA = 5 + Math.random() * 3;
      
      newHRV = this.moveTowards(mockState.lastReading.hrvData.value, targetHRV, 2);
      newEDA = this.moveTowards(mockState.lastReading.edaData.value, targetEDA, 0.3);
    }

    // Add small random variations
    newHRV += (Math.random() - 0.5) * 2;
    newEDA += (Math.random() - 0.5) * 0.2;

    // Ensure values stay within realistic bounds
    newHRV = Math.max(this.HRV_MIN, Math.min(this.HRV_MAX, newHRV));
    newEDA = Math.max(this.EDA_MIN, Math.min(this.EDA_MAX, newEDA));

    const sensorData: SensorData = {
      timestamp: Date.now(),
      userId,
      deviceId: `SMART_JEWELRY_${userId}`,
      hrvData: {
        value: newHRV,
        quality: this.generateQuality()
      },
      edaData: {
        value: newEDA,
        quality: this.generateQuality()
      }
    };

    // Store as last reading
    mockState.lastReading = sensorData;
    this.mockStates.set(userId, mockState);

    // Log generated data with additional info
    this.logGeneratedData(sensorData, mockState);

    return sensorData;
  }

  public cleanup(): void {
    this.mockStates.clear();
  }

  private logGeneratedData(data: SensorData, mockState: MockDataState): void {
    console.log(`[MockDataService] Generated sensor data for ${data.userId}:`, {
      hrv: {
        value: `${data.hrvData.value.toFixed(1)}ms`,
        quality: `${data.hrvData.quality.toFixed(1)}%`,
        status: data.hrvData.value < this.HRV_ANXIETY ? 'LOW (Anxiety)' : 'Normal'
      },
      eda: {
        value: `${data.edaData.value.toFixed(2)}µS`,
        quality: `${data.edaData.quality.toFixed(1)}%`,
        status: data.edaData.value > this.EDA_ANXIETY ? 'HIGH (Anxiety)' : 'Normal'
      },
      pattern: {
        type: mockState.isInAnxietyPattern ? 'Anxiety' : 'Normal',
        duration: mockState.isInAnxietyPattern ? 
          `Anxiety duration: ${mockState.anxietyDuration}` : 
          `Normal duration: ${mockState.normalDuration}`
      }
    });
  }
}

export const mockDataService = new MockDataService();