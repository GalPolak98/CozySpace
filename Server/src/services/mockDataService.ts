
interface MockDataState {
  lastReading: string | null;
  isInAnxietyPattern: boolean;
  anxietyDuration: number;
  normalDuration: number;
  lastAnxietyEndTime: number;     
  anxietyStartTime: number | null; 
  exitingAnxiety: boolean;
}

class MockDataService {
  private mockStates: Map<string, MockDataState> = new Map();

  // Realistic physiological ranges
  private readonly HRV = {
    MIN: 20,   // Absolute minimum allowed
    MAX: 70,   // Absolute maximum allowed
    NORMAL: {
      MIN: 45,
      MAX: 65
    },
    ANXIETY: {
      MIN: 20, // Severe anxiety
      MAX: 30  // Mild anxiety
    }
  };

  private readonly EDA = {
    MIN: 1.0,
    MAX: 20.0,
    NORMAL: {
      MIN: 2.0,
      MAX: 8.0
    },
    ANXIETY: {
      MIN: 12.0,
      MAX: 18.0
    }
  };

  // Fixed timing constants (all in milliseconds for precise control)
  private readonly TIMING = {
    ANXIETY_INTERVAL: 120 * 1000,  // 2 minutes between start of anxiety episodes
    ANXIETY_DURATION: 30 * 1000,   // 30 seconds of anxiety
    TRANSITION_IN: 5 * 1000,       // 5 seconds to transition into anxiety
    TRANSITION_OUT: 5 * 1000,      // 5 seconds to transition out of anxiety
    SAMPLING_RATE: 5 * 1000        // 5 seconds between readings
  };

  private getOrCreateMockState(userId: string): MockDataState {
    let state = this.mockStates.get(userId);
    if (!state) {
      state = {
        lastReading: null,
        isInAnxietyPattern: false,
        anxietyDuration: 0,
        normalDuration: 0,
        lastAnxietyEndTime: Date.now(),
        anxietyStartTime: null,
        exitingAnxiety: false
      };
      this.mockStates.set(userId, state);
    }
    return state;
  }

  private shouldTriggerAnxiety(mockState: MockDataState): boolean {
    const currentTime = Date.now();

    if (mockState.exitingAnxiety) {
      return false;
    }

    // If currently in anxiety, check if we should continue
    if (mockState.isInAnxietyPattern) {
      if (!mockState.anxietyStartTime) {
        mockState.anxietyStartTime = currentTime;
        return true;
      }

      const anxietyDuration = currentTime - mockState.anxietyStartTime;
      if (anxietyDuration >= this.TIMING.ANXIETY_DURATION) {
        mockState.exitingAnxiety = true;
        console.log('[MockDataService] Ending anxiety after', 
          (anxietyDuration / 1000).toFixed(1), 'seconds');
        return false;
      }
      return true;
    }

    // Check if it's time for next anxiety episode
    const timeSinceLastAnxiety = currentTime - mockState.lastAnxietyEndTime;
    if (timeSinceLastAnxiety >= this.TIMING.ANXIETY_INTERVAL) {
      console.log('[MockDataService] Starting anxiety after', 
        (timeSinceLastAnxiety / 1000).toFixed(1), 'seconds of normal state');
      return true;
    }

    return false;
  }

  public generateSensorData(userId: string): string {
    const mockState = this.getOrCreateMockState(userId);
    const currentTime = Date.now();
    
    mockState.isInAnxietyPattern = this.shouldTriggerAnxiety(mockState);

    if (mockState.isInAnxietyPattern) {
      mockState.anxietyDuration++;
      mockState.normalDuration = 0;
    } else if (mockState.exitingAnxiety) {
      const exitDuration = currentTime - (mockState.anxietyStartTime! + this.TIMING.ANXIETY_DURATION);
      if (exitDuration >= this.TIMING.TRANSITION_OUT) {
        mockState.exitingAnxiety = false;
        mockState.anxietyStartTime = null;
        mockState.lastAnxietyEndTime = currentTime;
        mockState.anxietyDuration = 0;
        console.log('[MockDataService] Completed anxiety episode');
      }
    } else {
      mockState.anxietyDuration = 0;
      mockState.normalDuration++;
    }

    // Generate target values
    let targetHRV: number;
    let targetEDA: number;

    if (mockState.isInAnxietyPattern || mockState.exitingAnxiety) {
      let progress: number;
      
      if (mockState.exitingAnxiety) {
        // Exit transition (anxiety -> normal)
        progress = Math.min((currentTime - (mockState.anxietyStartTime! + this.TIMING.ANXIETY_DURATION)) / 
                          this.TIMING.TRANSITION_OUT, 1);
        targetHRV = this.HRV.ANXIETY.MIN + (progress * (this.HRV.NORMAL.MIN - this.HRV.ANXIETY.MIN));
        targetEDA = this.EDA.ANXIETY.MAX - (progress * (this.EDA.ANXIETY.MAX - this.EDA.NORMAL.MAX));
      } else {
        // Entry transition or full anxiety
        progress = Math.min((currentTime - mockState.anxietyStartTime!) / 
                          this.TIMING.TRANSITION_IN, 1);
        targetHRV = this.HRV.NORMAL.MIN - (progress * (this.HRV.NORMAL.MIN - this.HRV.ANXIETY.MIN));
        targetEDA = this.EDA.NORMAL.MAX + (progress * (this.EDA.ANXIETY.MAX - this.EDA.NORMAL.MAX));
      }
    } else {
      // Normal state with natural variations
      targetHRV = this.HRV.NORMAL.MIN + Math.random() * (this.HRV.NORMAL.MAX - this.HRV.NORMAL.MIN);
      targetEDA = this.EDA.NORMAL.MIN + Math.random() * (this.EDA.NORMAL.MAX - this.EDA.NORMAL.MIN);
    }

    // Add small natural variations
    targetHRV += (Math.random() - 0.5) * 2;
    targetEDA += (Math.random() - 0.5) * 0.3;

    // Ensure values stay within physiological limits
    targetHRV = Math.max(this.HRV.MIN, Math.min(this.HRV.MAX, targetHRV));
    targetEDA = Math.max(this.EDA.MIN, Math.min(this.EDA.MAX, targetEDA));

    // Get current values and move towards targets
    const currentValues = mockState.lastReading ? 
      JSON.parse(mockState.lastReading) : 
      { hrvData: { value: this.HRV.NORMAL.MIN }, edaData: { value: this.EDA.NORMAL.MIN } };

    const newHRV = this.moveTowards(
      currentValues.hrvData.value,
      targetHRV,
      mockState.isInAnxietyPattern || mockState.exitingAnxiety ? 4 : 1
    );

    const newEDA = this.moveTowards(
      currentValues.edaData.value,
      targetEDA,
      mockState.isInAnxietyPattern || mockState.exitingAnxiety ? 1.2 : 0.3
    );

    // Create sensor data
    const sensorData = {
      timestamp: currentTime,
      userId,
      deviceId: `SMART_JEWELRY_${userId}`,
      hrvData: {
        value: newHRV,
        quality: 85 + Math.random() * 15
      },
      edaData: {
        value: newEDA,
        quality: 85 + Math.random() * 15
      }
    };

    // Enhanced debug logging
    console.log('[MockDataService] State:', {
      phase: mockState.exitingAnxiety ? 'EXITING_ANXIETY' : 
             mockState.isInAnxietyPattern ? 'ANXIETY' : 'NORMAL',
      timing: {
        timeSinceLastAnxiety: ((currentTime - mockState.lastAnxietyEndTime) / 1000).toFixed(1) + 's',
        anxietyDuration: mockState.anxietyStartTime ? 
          ((currentTime - mockState.anxietyStartTime) / 1000).toFixed(1) + 's' : 'N/A',
        nextAnxietyIn: mockState.isInAnxietyPattern ? 'In Progress' :
          ((this.TIMING.ANXIETY_INTERVAL - (currentTime - mockState.lastAnxietyEndTime)) / 1000).toFixed(1) + 's'
      },
      values: {
        hrv: `${newHRV.toFixed(1)}ms (target: ${targetHRV.toFixed(1)}ms)`,
        eda: `${newEDA.toFixed(2)}µS (target: ${targetEDA.toFixed(2)}µS)`
      }
    });

    const sensorDataJson = JSON.stringify(sensorData);
    mockState.lastReading = sensorDataJson;
    this.mockStates.set(userId, mockState);

    return sensorDataJson;
  }

  private moveTowards(current: number, target: number, maxChange: number): number {
    const difference = target - current;
    const change = Math.min(Math.abs(difference), maxChange) * Math.sign(difference);
    return current + change;
  }

  public cleanup(): void {
    this.mockStates.clear();
  }
}

export const mockDataService = new MockDataService();