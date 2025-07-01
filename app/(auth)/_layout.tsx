import { useAuth } from '@/contexts/AuthContext';
import { Slot, useRootNavigationState } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function AuthLayout() {
  const { isLoadingUserData } = useAuth();
  const rootNavigationState = useRootNavigationState();
  
  if (!rootNavigationState?.key || isLoadingUserData) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }} />
    );
  }

  return <Slot />;
}