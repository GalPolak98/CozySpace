// hooks/useWebSocketConnection.ts
import { useState, useEffect } from 'react';
import { websocketManager } from '../services/websocketManager';

export function useWebSocketConnection(userId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleConnect = () => {
      if (isMounted) {
        setIsConnected(true);
        setError(null);
      }
    };

    const handleDisconnect = () => {
      if (isMounted) {
        setIsConnected(false);
      }
    };

    const handleError = (error: Error) => {
      if (isMounted) {
        setError(error);
      }
    };

    const initializeConnection = async () => {
      try {
        // Setup background task first
        await websocketManager.setupBackgroundTask();

        // Check current connection state
        if (!websocketManager.isConnected(userId)) {
          console.log('[useWebSocketConnection] Initializing connection for user:', userId);
          await websocketManager.connect(userId);
        } else {
          setIsConnected(true);
        }
      } catch (error) {
        console.error('[useWebSocketConnection] Initialization error:', error);
        handleError(error as Error);
      }
    };

    // Add event listeners
    websocketManager.on('connected', handleConnect);
    websocketManager.on('disconnected', handleDisconnect);
    websocketManager.on('error', handleError);

    // Initialize connection
    initializeConnection();

    // Cleanup
    return () => {
      isMounted = false;
      websocketManager.removeListener('connected', handleConnect);
      websocketManager.removeListener('disconnected', handleDisconnect);
      websocketManager.removeListener('error', handleError);
    };
  }, [userId]);

  return {
    isConnected,
    error
  };
}