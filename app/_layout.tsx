import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useNotifications } from '@/hooks/useNotifications';
import { ReviewsProvider } from '@/contexts/ReviewsContext';
import { SubjectsProvider } from '@/contexts/SubjectsContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <SubjectsProvider>
      <ReviewsProvider>
        <NotificationsHandler />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ReviewsProvider>
    </SubjectsProvider>
  );
}

function NotificationsHandler() {
  useNotifications();
  return null;
}
