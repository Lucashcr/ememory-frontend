import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ReviewsProvider } from '@/contexts/ReviewsContext';
import { SubjectsProvider } from '@/contexts/SubjectsContext';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthCheck from '@/components/layout/auth-check';
import NotificationsHandler from '@/components/layout/notifications-handler';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <SubjectsProvider>
        <ReviewsProvider>
          <NotificationsHandler />
          <StatusBar style="auto" />
          <AuthCheck />
        </ReviewsProvider>
      </SubjectsProvider>
    </AuthProvider>
  );
}

