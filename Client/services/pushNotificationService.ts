const notificationCooldown = 1 * 60 * 1000; 
const lastNotificationTime = new Map<string, number>(); 

export async function sendPushNotification(expoPushToken: string, userId: string) {
  const now = Date.now();

  // Check if the cooldown period has passed since the last notification
  const lastNotification = lastNotificationTime.get(userId);
  if (lastNotification && now - lastNotification < notificationCooldown) {
    console.log('Cooldown period still active, skipping notification.');
    return;
  }

  // Send notification
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Take a Deep Breath',
    body: 'We noticed signs of anxiety. Take a moment to relax.',
    data: { someData: 'goes here' },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send notification:', errorData);
    } else {
      console.log('Notification sent successfully!');
      // Update the last notification time
      lastNotificationTime.set(userId, now);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
