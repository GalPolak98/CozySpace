import * as Notifications from "expo-notifications";
import { AuthService } from '../../services/authService';  // Import your AuthService

// Save notification initially with tapped as false
export async function saveNotificationToServer(notification: Notifications.Notification, tapped: boolean = false) {
  try {
    const userId = await AuthService.getCurrentUserId();
    const userToken = await AuthService.getAuthToken();

    if (!userId || !userToken) {
      console.error("User ID or token not available");
      return;
    }

    const { title, body, data } = notification.request.content;

    const notificationData = {
      userId,
      expoNotificationId: notification.request.identifier, // Save the Expo notification ID
      notificationTimestamp: new Date(),
      tapped, // Whether the user tapped on the notification
      anxietyDuration: data?.anxietyDuration || 0,
      favoriteRelaxationMethod: data?.favoriteRelaxationMethod || '',
    };

    // Send the notification data to the backend API to save it in the database
    const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/users/${userId}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}` // Add the auth token in the request headers
      },
      body: JSON.stringify(notificationData),
    });

    const responseBody = await response.text();
    if (!response.ok) {
      throw new Error(`Failed to save notification to the server: ${responseBody}`);
    }
    console.log("Notification saved successfully");

  } catch (error) {
    console.error("Error saving notification:", error);
  }
}

// Update the "tapped" status of a notification
// Update the "tapped" status of a notification
export async function updateNotificationTapStatus(notificationId: string, tapped: boolean) {
  try {
    const userId = await AuthService.getCurrentUserId();
    const userToken = await AuthService.getAuthToken();

    if (!userId || !userToken) {
      console.error("User ID or token not available");
      return;
    }

    const encodedNotificationId = encodeURIComponent(notificationId); 

    const updateData = { tapped };
    const url = `${process.env.EXPO_PUBLIC_SERVER_URL}/users/${userId}/notifications/${encodedNotificationId}`;
    

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`,
      },
      body: JSON.stringify(updateData),
    });

    const responseBody = await response.text();

    if (!response.ok) {
      throw new Error(`Failed to update notification status: ${responseBody}`);
    }

    console.log("Notification status updated successfully");

  } catch (error) {
    console.error("Error updating notification status:", error);
    throw error;
  }
}

