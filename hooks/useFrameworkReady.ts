import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();


export function useFrameworkReady() {
  useEffect(() => {
    window.frameworkReady?.();
    SplashScreen.hide()
  });
}
