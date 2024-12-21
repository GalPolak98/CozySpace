import { useState, useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { websocketService } from '../services/websocketService';
import NetInfo from '@react-native-community/netinfo';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(true);

  const handleReconnect = useCallback(async () => {
    // Only attempt to reconnect if network is available and not already reconnecting
    if (!websocketService.isConnected() && isNetworkAvailable && !isReconnecting) {
      try {
        setIsReconnecting(true);
        setError(null);
        
        // Add a 30-second delay before reconnecting
        await new Promise(resolve => setTimeout(resolve, 30000));
        
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          console.log('[useWebSocket] Attempting to reconnect after 30 seconds...');
          await websocketService.initialize(userId);
        }
      } catch (err) {
        console.error('[useWebSocket] Reconnection error:', err);
        setError(err instanceof Error ? err.message : 'Failed to reconnect');
      } finally {
        setIsReconnecting(false);
      }
    }
  }, [isNetworkAvailable, isReconnecting]);

  useEffect(() => {
    // Network connectivity check
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      const networkAvailable = !!state.isConnected && !!state.isInternetReachable;
      setIsNetworkAvailable(networkAvailable);

      if (networkAvailable) {
        // Attempt reconnection when network becomes available (after delay)
        handleReconnect();
      }
    });

    const handleConnect = () => {
      console.log('[useWebSocket] WebSocket connected');
      setIsConnected(true);
      setError(null);
    };

    const handleDisconnect = () => {
      console.log('[useWebSocket] WebSocket disconnected');
      setIsConnected(false);
      
      // Attempt to reconnect if network is available (after delay)
      if (isNetworkAvailable) {
        handleReconnect();
      }
    };

    const handleError = (err: Error) => {
      console.error('[useWebSocket] WebSocket error:', err);
      setError(err.message);
      
      // Attempt to reconnect if network is available (after delay)
      if (isNetworkAvailable) {
        handleReconnect();
      }
    };

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Check connection only when app becomes active (after delay)
        if (!websocketService.isConnected() && isNetworkAvailable) {
          await handleReconnect();
        }
      }
    };

    // Add event listeners
    websocketService.on('connected', handleConnect);
    websocketService.on('disconnected', handleDisconnect);
    websocketService.on('error', handleError);

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Check initial connection state
    setIsConnected(websocketService.isConnected());

    // Cleanup
    return () => {
      unsubscribeNetInfo();
      websocketService.removeListener('connected', handleConnect);
      websocketService.removeListener('disconnected', handleDisconnect);
      websocketService.removeListener('error', handleError);
      subscription.remove();
    };
  }, [handleReconnect, isNetworkAvailable]);

  return { 
    isConnected, 
    error, 
    isReconnecting,
    reconnect: handleReconnect 
  };
}