import LoadingSkeleton from '@/components/layout/loading-skeleton';
import CustomRefreshControl from '@/components/layout/refresh-control';
import TimePickerModal from '@/components/modals/time-picker';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { useSubjects } from '@/contexts/SubjectsContext';
import { useNotifications } from '@/hooks/useNotifications';
import { api } from '@/services/api';
import {
    getNotificationTime,
    setNotificationTime,
} from '@/services/notificationTime';
import { router } from 'expo-router';
import {
    AlertCircle,
    LogOut,
    Mail,
    User as UserIcon,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Toast } from 'toastify-react-native';

export default function Profile() {
  const { signOut, user, fetchUserData, isLoadingUserData } = useAuth();
  const { setSubjects } = useSubjects();
  const { setReviews } = useReviews();
  const { requestNotificationPermissions, scheduleReviewNotification } =
    useNotifications();

  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [notificationTime, setNotificationTimeState] = useState({
    hour: 8,
    minute: 0,
  });

  const loadNotificationTime = useCallback(async () => {
    const time = await getNotificationTime();
    setNotificationTimeState(time);
  }, []);

  useEffect(() => {
    fetchUserData();
    loadNotificationTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/token/logout');
      setSubjects([]);
      setReviews([]);
      await signOut();
      Toast.success('Logout realizado com sucesso!');
      router.replace('/(auth)/login');
    } catch {
      Toast.error('Não foi possível fazer logout! Tente novamente!');
    }
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;
  };

  const handleSaveTime = async (hour: number, minute: number) => {
    try {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        Toast.error(
          'O aplicativo não possui permissão para enviar notificações ao dispositivo. Habilite as notificações nas configurações do dispositivo para poder configurar o horário das notificações.'
        );
        return;
      }

      const parsedTime = {
        hour: parseInt(hour.toString(), 10),
        minute: parseInt(minute.toString(), 10),
      }
      await setNotificationTime(parsedTime.hour, parsedTime.minute);
      setNotificationTimeState(parsedTime);
      await scheduleReviewNotification();

      Toast.success('Horário das notificações atualizado com sucesso!');
    } catch {
      Toast.error(
        'Não conseguimos salvar o horário das notificações. Tente novamente!'
      );
    }
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={CustomRefreshControl({ fetchUserData })}
    >
      {isLoadingUserData ? <LoadingSkeleton mode="review" /> : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados do Usuário</Text>

            <View style={[styles.infoRow, styles.firstInfoRow]}>
              <View style={styles.iconContainer}>
                <UserIcon size={20} color="#64748b" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nome</Text>
                <Text style={styles.infoText}>
                  {user.first_name} {user.last_name}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Mail size={20} color="#64748b" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações</Text>

            <TouchableOpacity onPress={() => setTimePickerVisible(true)}>
              <View style={[styles.infoRow, styles.firstInfoRow]}>
                <View style={styles.iconContainer}>
                  <AlertCircle size={20} color="#64748b" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Notificações</Text>
                  <Text style={styles.infoText}>
                    Notificações diárias às{' '}
                    {formatTime(notificationTime.hour, notificationTime.minute)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conta</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#ef4444" />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TimePickerModal
        visible={timePickerVisible}
        onClose={() => setTimePickerVisible(false)}
        onSave={handleSaveTime}
        currentTime={notificationTime}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  firstInfoRow: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#1e293b',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
  },
});
