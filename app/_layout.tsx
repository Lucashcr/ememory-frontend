import AuthCheck from '@/components/layout/auth-check';
import NotificationsHandler from '@/components/layout/notifications-handler';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReviewsProvider } from '@/contexts/ReviewsContext';
import { SubjectsProvider } from '@/contexts/SubjectsContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import ToastProvider from 'toastify-react-native';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <SubjectsProvider>
        <ReviewsProvider>
          <NotificationsHandler />
          <StatusBar style='dark' />
          <AuthCheck />
          <ToastProvider
            style={{
              boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.5)',
            }}
          />
        </ReviewsProvider>
      </SubjectsProvider>
    </AuthProvider>
  );
}
