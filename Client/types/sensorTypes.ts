
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

export type AnxietySeverity = 'mild' | 'moderate' | 'severe';

export interface MetricAnalysis {
  value: number;
  score: number;
  status: 'ALERT' | 'normal';
}

export interface RateOfChange {
  hrv: number;
  eda: number;
}

export interface AnxietyAnalysis {
  userId: string;
  isAnxious: boolean;
  confidence: number;
  timestamp: number;
  triggers?: string[];
  severity: AnxietySeverity;
  anxietyScore: number;
  consecutiveReadings: number;
  metrics: {
    hrv: MetricAnalysis;
    eda: MetricAnalysis;
    rateOfChange?: RateOfChange;
  };
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