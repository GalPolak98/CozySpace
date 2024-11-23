import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

let expo = new Expo();

// Function to send a push notification to a client using Expo's push notification service
export const sendPushNotification = async (expoPushToken: string, title: string, message: string) => {
  const messages: ExpoPushMessage[] = [];

  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
    return;
  }

  messages.push({
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: message,
    data: { message: message},
  });

  try {
    // Send the notification
    const ticketChunk = await expo.sendPushNotificationsAsync(messages);
    console.log(ticketChunk);
  } catch (error) {
    console.error('Error sending notification', error);
  }
};
