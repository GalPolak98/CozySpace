import { useEffect, useState } from 'react';
import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';

export const useAnxietyNotifications = (userId: string) => {
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    const setupPushNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        setPushToken(token);
      } catch (error) {
        console.error('[useAnxietyNotifications] Failed to register for push notifications:', error);
      }
    };

    setupPushNotifications();
  }, [userId]);

  return {
    pushToken,
  };
};
