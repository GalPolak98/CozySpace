import * as Localization from 'expo-localization';

const notificationCooldown = 1 * 60 * 1000; 
const lastNotificationTime = new Map<string, number>(); 

type Messages = {
  [key: string]: {
    title: string;
    body: string;
  };
};

function getLocalizedMessage(language: string) {
  const messages: Messages = {
    en: {
      title: 'Take a Deep Breath',
      body: 'We noticed signs of anxiety. Take a moment to relax.',
    },
    he: {
      title: 'קח נשימה עמוקה',
      body: 'שמנו לב לסימני חרדה. קח רגע להירגע.',
    },
  };

  // Default to English if the language is not supported
  return messages[language] || messages['en'];
}

export async function sendPushNotification(expoPushToken: string, userId: string) {
  const now = Date.now();
  console.log('Sending push notification...');
  // Check if the cooldown period has passed since the last notification
  const lastNotification = lastNotificationTime.get(userId);
  if (lastNotification && now - lastNotification < notificationCooldown) {
    console.log('Cooldown period still active, skipping notification.');
    return;
  }

  const locales = Localization.getLocales();
  const defaultLocale = locales[0]; // The first locale in the array is the default
  const deviceLanguage = defaultLocale.languageCode === 'iw' || defaultLocale.languageCode === 'he' ? 'he' : 'en';
  const localizedMessage = getLocalizedMessage(deviceLanguage);

  // Send notification
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: localizedMessage.title,
    body: localizedMessage.body,
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
