import { useState, useEffect, useRef } from 'react';
import { websocketManager } from '../services/websocketManager';

export function useWebSocketConnection(userId: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const connectionAttempted = useRef(false);

  useEffect(() => {
    let isMounted = true;
    
    // Only proceed if we have a valid userId
    if (!userId) {
      return;
    }

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
      // Prevent multiple connection attempts
      if (connectionAttempted.current) {
        return;
      }
      
      try {
        connectionAttempted.current = true;
        
        if (!websocketManager.isConnected(userId)) {
          console.log(`[useWebSocketConnection] Initializing connection for user: ${userId}`);
          await websocketManager.connect(userId);
        } else {
          setIsConnected(true);
        }
      } catch (error) {
        console.error('[useWebSocketConnection] Initialization error:', error);
        handleError(error as Error);
        connectionAttempted.current = false;
      }
    };

    // Add event listeners with namespaced events
    const eventNamespace = `user_${userId}`;
    websocketManager.on(`connected_${eventNamespace}`, handleConnect);
    websocketManager.on(`disconnected_${eventNamespace}`, handleDisconnect);
    websocketManager.on(`error_${eventNamespace}`, handleError);

    initializeConnection();

    return () => {
      isMounted = false;
      connectionAttempted.current = false;
      
      // Clean up event listeners
      websocketManager.removeListener(`connected_${eventNamespace}`, handleConnect);
      websocketManager.removeListener(`disconnected_${eventNamespace}`, handleDisconnect);
      websocketManager.removeListener(`error_${eventNamespace}`, handleError);
    };
  }, [userId]);

  return {
    isConnected,
    error
  };
}