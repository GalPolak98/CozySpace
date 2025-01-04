import { useState, useEffect, useRef } from 'react';
import { websocketManager } from '@/services/websocketManager';
import type { AnxietyAnalysis, SensorData } from '@/types/sensorTypes';
import { useWebSocketConnection } from './useWebSocketConnection';
import { sendPushNotification  } from '@/services/pushNotificationService'; 
import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';

interface AnxietyState {
  isAnxious: boolean;
  severity: string;
  confidence: number;
  lastUpdate: Date | null;
  analysis: AnxietyAnalysis | null;
  sensorData: SensorData | null;
}

export interface ListenerInfo {
  handler: (data: any) => void;
  refCount: number;
}

export const activeListeners = new Map<string, ListenerInfo>();

// Static variable to store the latest state
export const latestState = new Map<string, AnxietyState>();

const anxietyMonitorSubscribers = new Map<string, number>();


export const useAnxietyMonitor = (userId: string) => {
  const [anxietyState, setAnxietyState] = useState<AnxietyState>(() => 
    latestState.get(userId) || {
      isAnxious: false,
      severity: 'mild',
      confidence: 0,
      lastUpdate: null,
      analysis: null,
      sensorData: null
    }
  );

  const { isConnected } = useWebSocketConnection(userId);
  const stateUpdateRef = useRef(setAnxietyState);
  const [pushToken, setPushToken] = useState<string | null>(null);

  // Keep the state updater function reference current
  useEffect(() => {
    stateUpdateRef.current = setAnxietyState;
  });

  useEffect(() => {
    const fetchPushToken = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        setPushToken(token);
      } catch (error) {
        console.error('[useAnxietyMonitor] Failed to fetch push token:', error);
      }
    };

    fetchPushToken();
  }, []);
  
  useEffect(() => {
    if (!userId || !isConnected) return;
    const namespace = `user_${userId}`;
    const eventName = `sensorData_${namespace}`;

    // Create or get the handler
    const createHandler = () => (data: any) => {
      try {
        if (!data.data?.sensorData || !data.data?.analysis) return;
        const { sensorData, analysis } = data.data;
        if (sensorData.userId !== userId) return;

        const newState = {
          isAnxious: analysis.isAnxious,
          severity: analysis.severity,
          confidence: analysis.confidence,
          lastUpdate: new Date(sensorData.timestamp),
          analysis,
          sensorData,
        };
        console.log(newState, "new state");
        // Use the ref to ensure we're using the latest setState function
        stateUpdateRef.current(newState);
        latestState.set(userId, newState);

        if (analysis.isAnxious) {
          if (pushToken) {
            console.log("sending push notification!!", pushToken);
            sendPushNotification(pushToken, userId);
          }
        }
      } catch (error) {
        console.error('[useAnxietyMonitor] Error processing sensor data:', error);
      }
    };

    // Increment subscriber count
    const currentCount = anxietyMonitorSubscribers.get(userId) || 0;
    anxietyMonitorSubscribers.set(userId, currentCount + 1);

    let listenerInfo = activeListeners.get(userId);

    if (!listenerInfo) {
      // Only log for the first subscriber
      if (currentCount === 0) {
        activeListeners.delete(userId);
        latestState.delete(userId);
        console.log(`[useAnxietyMonitor] Setting up new event listener for user: ${userId}`);
      }

      listenerInfo = {
        handler: createHandler(),
        refCount: 0
      };
      
      activeListeners.set(userId, listenerInfo);
      websocketManager.on(eventName, listenerInfo.handler);
    } else {
      if (currentCount === 0) {
        console.log(`[useAnxietyMonitor] Reusing existing listener for user: ${userId}`);
      }

      // Update the handler to use the current setState
      websocketManager.removeListener(eventName, listenerInfo.handler);
      listenerInfo.handler = createHandler();
      websocketManager.on(eventName, listenerInfo.handler);
    }

    listenerInfo.refCount++;

    return () => {
      // Decrement subscriber count
      const count = anxietyMonitorSubscribers.get(userId) || 0;
      if (count > 0) {
        anxietyMonitorSubscribers.set(userId, count - 1);
      }
      if (count <= 1) {
        anxietyMonitorSubscribers.delete(userId);
        // Only clean up listener if this is the last subscriber
        if (listenerInfo) {
          console.log(`[useAnxietyMonitor] Removing listener for user: ${userId}`);
          websocketManager.removeListener(eventName, listenerInfo.handler);
          activeListeners.delete(userId);
        }
      }
    };
  }, [userId, isConnected]);

  return {
    ...anxietyState,
    isConnected
  };
};