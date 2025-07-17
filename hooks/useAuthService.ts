import { authService } from '@/services/auth/authService';
import { IAuthService, UserData } from '@/services/auth/types';
import { useCallback, useState } from 'react';
import { Toast } from 'toastify-react-native';

export function useAuthService(auth: IAuthService = authService) {
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  const setToken = useCallback(async (newToken: string | null) => {
    if (newToken) {
      await auth.setToken(newToken);
    } else {
      await auth.removeToken();
    }
    setTokenState(newToken);
  }, [auth]);

  const fetchUserData = useCallback(async () => {
    if (!token) return;
    if (isLoadingUserData) return; // Evita múltiplas chamadas simultâneas
    
    setIsLoadingUserData(true);
    try {
      const userData = await auth.fetchUserData();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Toast.error('Erro ao carregar dados do usuário');
    } finally {
      setIsLoadingUserData(false);
    }
  }, [auth, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = useCallback(async (newToken: string) => {
    try {
      await setToken(newToken);
      await fetchUserData();
    } catch (error) {
      console.error('Error storing auth data:', error);
      Toast.error('Falha ao salvar dados de autenticação');
      throw error;
    }
  }, [setToken, fetchUserData]);

  const signOut = useCallback(async () => {
    try {
      await auth.logout();
      await setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      Toast.error('Erro ao fazer logout');
    }
  }, [auth, setToken]);

  const initialize = useCallback(async () => {
    try {
      const storedToken = await auth.getStoredToken();
      if (storedToken && !token) { // Só atualiza se não houver token no state
        setTokenState(storedToken);
      }
    } catch (error) {
      console.error('Error loading storage data:', error);
    }
  }, [auth, token]);

  return {
    isLoadingUserData,
    user,
    token,
    signed: !!token,
    signIn,
    signOut,
    fetchUserData,
    initialize,
  };
}
