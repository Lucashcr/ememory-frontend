import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DailyTriggerInput } from 'expo-notifications';
import { getNotificationTime } from '@/services/notificationTime';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  async function requestNotificationPermissions() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    return true;
  }

  const scheduleReviewNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const notificationTime = await getNotificationTime();
    const trigger: DailyTriggerInput = {
      ...notificationTime,
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hora de revisar! 📚',
        body: 'Opa, é hora de verificar as revisões de hoje! Não vamos perder o foco, hein...',
        data: { type: 'daily_review' },
      },
      trigger,
      identifier: 'daily-review-notification',
    });
  };

  return {
    requestNotificationPermissions,
    scheduleReviewNotification,
  };
}
