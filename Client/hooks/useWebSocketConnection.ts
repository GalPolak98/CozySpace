import { useState, useEffect, useRef } from 'react';
import { websocketManager } from '../services/websocketManager';

const connectionSubscribers = new Map<string, number>();

export function useWebSocketConnection(userId: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const setupCompleteRef = useRef(false);

  useEffect(() => {
    if (!userId || setupCompleteRef.current) return;

    const namespace = `user_${userId}`;
    
    // Increment subscriber count
    const currentCount = connectionSubscribers.get(userId) || 0;
    connectionSubscribers.set(userId, currentCount + 1);

    const handleConnect = () => {
      // Only log for the first subscriber
      if (connectionSubscribers.get(userId) === 1) {
        console.log('[useWebSocketConnection] Connected:', userId);
      }
      setIsConnected(true);
      setError(null);
    };

    const handleDisconnect = () => {
      // Only log for the first subscriber
      if (connectionSubscribers.get(userId) === 1) {
        console.log('[useWebSocketConnection] Disconnected:', userId);
      }
      setIsConnected(false);
    };

    websocketManager.on(`connected_${namespace}`, handleConnect);
    websocketManager.on(`disconnected_${namespace}`, handleDisconnect);

    // Only attempt connection if this is the first subscriber
    if (currentCount === 0 && !websocketManager.isConnected(userId)) {
      console.log('[useWebSocketConnection] Initiating connection for:', userId);
      websocketManager.connect(userId).catch(err => {
        console.error('[useWebSocketConnection] Connection error:', err);
        setError(err);
      });
    } else if (websocketManager.isConnected(userId)) {
      setIsConnected(true);
    }

    setupCompleteRef.current = true;

    return () => {
      // Cleanup event listeners
      websocketManager.removeListener(`connected_${namespace}`, handleConnect);
      websocketManager.removeListener(`disconnected_${namespace}`, handleDisconnect);
      
      // Decrement subscriber count
      const count = connectionSubscribers.get(userId) || 0;
      if (count > 0) {
        connectionSubscribers.set(userId, count - 1);
      }
      if (count <= 1) {
        connectionSubscribers.delete(userId);
      }
    };
  }, [userId]);

  return { isConnected, error };
}