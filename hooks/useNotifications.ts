import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DailyTriggerInput } from 'expo-notifications';
import { useReviews } from '@/contexts/ReviewsContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const { getDailyReviews } = useReviews();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  async function scheduleReviewNotification() {
    const permission = await requestNotificationPermissions();
    if (!permission) return;

    // Cancela notificações existentes
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Agenda nova notificação para às 9h da manhã
    const trigger: DailyTriggerInput = {
      hour: 8,
      minute: 0,
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hora de revisar! 📚",
        body: "Opa, parece que você tem revisões para hoje! Não se esqueça de realizá-las!",
        data: { type: 'daily_review' },
      },
      trigger,
      identifier: 'daily-review-notification',
    });
  }

  async function checkAndScheduleNotification() {
    const today = new Date();
    const todayReviews = getDailyReviews(today);

    if (todayReviews.length > 0) {
      await scheduleReviewNotification();
    } else {
      await Notifications.cancelScheduledNotificationAsync('daily-review-notification');
    }
  }

  async function requestNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
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

  useEffect(() => {
    checkAndScheduleNotification();

    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notificação recebida:', notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Resposta da notificação:', response);
        // Aqui você pode adicionar lógica para navegar para a tela de revisões
        // quando o usuário tocar na notificação
      }
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
}