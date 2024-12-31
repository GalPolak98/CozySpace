import { Alert } from 'react-native';

interface Notification {
  _id: string;
  expoNotificationId: string;
  notificationTimestamp: string;
  tapped: boolean;
  anxietyDuration: number;
  favoriteRelaxationMethod: string;
}

export const loadNotifications = async (
  userId: string | null,
  isRTL: boolean,
  t: { common: { error: string } }
): Promise<Notification[]> => {
  if (!userId) return [];

  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/notifications`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to fetch notifications');

    const data = await response.json();

    return data.notification;
  } catch (error) {
    // console.error('Failed to fetch notifications:', error);
    Alert.alert(t.common.error, 'There was an issue fetching notifications.');
    return [];
  }
};
