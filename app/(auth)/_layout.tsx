import React from 'react';
import { Slot, Redirect, useRootNavigationState } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View } from 'react-native';

export default function AuthLayout() {
  const { signed, loading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key || loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }} />
    );
  }

  if (signed) {
    return <Redirect href="/(tabs)" />;
  }

  return <Slot />;
}