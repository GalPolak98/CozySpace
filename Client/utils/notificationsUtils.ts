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

    // Check if 'notifications' is present and is an array
    const fetchedNotifications = Array.isArray(data.notifications) ? data.notifications : [];

    console.log('Fetched Notifications:', fetchedNotifications);

    // Return the notifications or an empty array if there are no notifications
    return fetchedNotifications;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    Alert.alert(t.common.error, 'There was an issue fetching notifications.');
    return [];
  }
};
