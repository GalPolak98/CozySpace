// hooks/useAnxietyMonitor.ts
import { useState, useEffect, useCallback } from 'react';
import { websocketManager } from '@/services/websocketManager';
import type { AnxietyAnalysis, SensorData } from '@/types/sensorTypes';
import { useWebSocketConnection } from './useWebSocketConnection';

interface AnxietyState {
  isAnxious: boolean;
  severity: string;
  confidence: number;
  lastUpdate: Date | null;
  analysis: AnxietyAnalysis | null;
  sensorData: SensorData | null;
}

export const useAnxietyMonitor = (userId: string) => {
  const [anxietyState, setAnxietyState] = useState<AnxietyState>({
    isAnxious: false,
    severity: 'mild',
    confidence: 0,
    lastUpdate: null,
    analysis: null,
    sensorData: null
  });

  const { isConnected } = useWebSocketConnection(userId);

  const handleSensorData = useCallback((data: any) => {
    console.log('[useAnxietyMonitor] Received raw data:', data);

    try {
      // Handle different data structures that might come from the server
      let sensorData, analysis;
      
      if (data.data) {
        // If data comes in {data: {sensorData, analysis}} format
        sensorData = data.data.sensorData;
        analysis = data.data.analysis;
      } else if (data.sensorData && data.analysis) {
        // If data comes in {sensorData, analysis} format
        sensorData = data.sensorData;
        analysis = data.analysis;
      } else {
        // If data comes in a different format, try to parse it
        sensorData = data.sensorData || data;
        analysis = data.analysis || data;
      }

      const receivedUserId = sensorData?.userId || data.userId;

      if (receivedUserId === userId) {
        console.log('[useAnxietyMonitor] Processing data for user:', userId, {
          sensorData,
          analysis
        });

        setAnxietyState({
          isAnxious: analysis.isAnxious,
          severity: analysis.severity,
          confidence: analysis.confidence,
          lastUpdate: new Date(),
          analysis,
          sensorData
        });
      }
    } catch (error) {
      console.error('[useAnxietyMonitor] Error processing sensor data:', error, data);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      console.warn('[useAnxietyMonitor] No userId provided');
      return;
    }

    if (isConnected) {
      console.log('[useAnxietyMonitor] Setting up event listeners for user:', userId);
      
      // Listen for both general and user-specific events
      websocketManager.on('sensorData', handleSensorData);
      websocketManager.on('sensorUpdate', handleSensorData);
      
      return () => {
        console.log('[useAnxietyMonitor] Cleaning up event listeners for user:', userId);
        websocketManager.removeListener('sensorData', handleSensorData);
        websocketManager.removeListener('sensorUpdate', handleSensorData);
      };
    }
  }, [userId, handleSensorData, isConnected]);

  return {
    ...anxietyState,
    isConnected
  };
};