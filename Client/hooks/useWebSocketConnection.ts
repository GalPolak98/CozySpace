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
    
    const currentCount = connectionSubscribers.get(userId) || 0;
    connectionSubscribers.set(userId, currentCount + 1);

    const handleConnect = () => {
      if (connectionSubscribers.get(userId) === 1) {
        console.log('[useWebSocketConnection] Connected:', userId);
      }
      setIsConnected(true);
      setError(null);
    };

    const handleDisconnect = () => {
      if (connectionSubscribers.get(userId) === 1) {
        console.log('[useWebSocketConnection] Disconnected:', userId);
      }
      setIsConnected(false);
    };

    websocketManager.on(`connected_${namespace}`, handleConnect);
    websocketManager.on(`disconnected_${namespace}`, handleDisconnect);

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
      websocketManager.removeListener(`connected_${namespace}`, handleConnect);
      websocketManager.removeListener(`disconnected_${namespace}`, handleDisconnect);
      
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