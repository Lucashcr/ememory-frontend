import React, { useEffect } from 'react';
import { Slot, router, useRootNavigationState } from 'expo-router';
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCheck() {
  const { signed, loading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key || loading) return;

    const init = async () => {
      if (!signed) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/(tabs)');
      }
    };

    init();
  }, [rootNavigationState?.key, signed, loading]);

  return <Slot />;
}