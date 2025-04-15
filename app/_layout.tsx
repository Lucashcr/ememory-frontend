import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ReviewsProvider } from '@/contexts/ReviewsContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ReviewsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ReviewsProvider>
  );
}
