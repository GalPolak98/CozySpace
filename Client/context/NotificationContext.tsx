import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { EventSubscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import saveNotificationToServer, {
  updateNotificationTapStatus,
} from "@/app/notifications/notificationService";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<EventSubscription>();
  const responseListener = useRef<EventSubscription>();
  const savedNotifications = useRef<Set<string>>(new Set()); // Track saved notification IDs

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );
    // Listener for received notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notification Received: ", notification);
        setNotification(notification);

        const notificationId = notification.request.identifier;

        if (!savedNotifications.current.has(notificationId)) {
          savedNotifications.current.add(notificationId);
          saveNotificationToServer(notification, false).catch((err) => {
            console.error("Error saving received notification:", err);
            savedNotifications.current.delete(notificationId);
          });
        }
      });

    // Listener for notification responses
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("🔔 Notification Tapped: ", response);

        const notification = response.notification;
        const notificationId = notification.request.identifier;
        if (savedNotifications.current.has(notificationId)) {
          updateNotificationTapStatus(notificationId, true).catch((err) => {
            console.error(
              "Error updating tapped status for notification:",
              err
            );
          });
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
