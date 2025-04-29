import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextData {
  signed: boolean;
  token: string | null;
  loading: boolean;
  user: UserData | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/users/me/');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem('@EMem:token');
        
        if (storedToken) {
          setToken(storedToken);
          await fetchUserData();
        }
      } catch (error) {
        console.error('Error loading storage data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  const signIn = async (newToken: string) => {
    try {
      await AsyncStorage.setItem('@EMem:token', newToken);
      setToken(newToken);
      await fetchUserData();
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Falha ao salvar dados de autenticação');
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@EMem:token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ signed: !!token, token, loading, user, signIn, signOut, fetchUserData }}
    >
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