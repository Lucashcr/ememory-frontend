import React from 'react';
import { Slot, Redirect, useRootNavigationState } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View } from 'react-native';

export default function AuthLayout() {
  const { signed, isLoadingUserData } = useAuth();
  const rootNavigationState = useRootNavigationState();
  
  if (!rootNavigationState?.key || isLoadingUserData) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }} />
    );
  }

  if (signed) {
    return <Redirect href="/(tabs)" />;
  }

  return <Slot />;
}