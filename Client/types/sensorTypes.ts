
export interface SensorData {
  timestamp: number;
  userId: string;
  deviceId: string;
  hrvData: {
    value: number;    // Heart Rate Variability in ms
    quality: number;  // Signal quality (0-100)
  };
  edaData: {
    value: number;    // Electrodermal Activity in microSiemens
    quality: number;  // Signal quality (0-100)
  };
}

export interface AnxietyAnalysis {
  userId: string;
  isAnxious: boolean;
  confidence: number;
  timestamp: number;
  triggers?: string[];
}

export interface SensorConfig {
  userId: string;
  isActive: boolean;
  samplingRate: number;
  simulationDuration?: number;
}

export interface UserState {
  userId: string;
  isActive: boolean;
  baselineHRV: number;
  baselineEDA: number;
  lastReading?: SensorData;
  consecutiveAnxiousReadings: number;
  webSocket?: WebSocket;
}