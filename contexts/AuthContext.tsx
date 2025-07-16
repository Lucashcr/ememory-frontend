import { useAuthService } from '@/hooks/useAuthService';
import { UserData } from '@/services/auth/types';
import React, { createContext, useContext, useEffect } from 'react';

interface AuthContextData {
  signed: boolean;
  token: string | null;
  isLoadingUserData: boolean;
  user: UserData | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthService();

  useEffect(() => {
    async function initializeAuth() {
      await auth.initialize();
      if (auth.token) {
        await auth.fetchUserData();
      }
    }
    
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}